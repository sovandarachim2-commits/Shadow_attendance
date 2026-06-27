import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell, CalendarDays, Check, ChevronDown, ChevronRight, Clock, Download,
  FileText, Paperclip, Pencil, Plus, RefreshCw, Search,
  Send, SlidersHorizontal, Trash2, UploadCloud, UserRound, X, XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import { newRequestForm, REQUEST_CATEGORIES, PERMISSION_REQUEST_TYPES, requestTypeMeta } from '../constants/permissionRequestTypes'
import { api, permissionRequestService } from '../services/api'
import { apiError, canAccess, employeeFullName, titleCase } from '../utils/format'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso || iso === '-') return '-'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtDateRange(start, end) {
  if (!start) return '-'
  const a = fmtDate(start)
  const b = end ? fmtDate(end) : a
  return a === b ? a : `${a} – ${b}`
}

function fmtDuration(start, end) {
  if (!start) return '-'
  const a = new Date(start), b = end ? new Date(end) : new Date(start)
  const days = Math.round((b - a) / 86400000) + 1
  return days === 1 ? '1 Day' : `${days} Days`
}

function fmtRequestDuration(row) {
  if (row.duration_type === 'hours' && isSingleTimeRequest(row.type)) {
    return row.request_time || row.start_time || '-'
  }

  if (row.duration_type === 'hours') {
    const from = row.start_time || row.request_time || '-'
    const to = row.end_time || '-'
    return `${from} - ${to}`
  }

  return fmtDuration(row.request_date, row.request_date_end)
}

function calcDays(start, end) {
  if (!start || !end) return 1
  const a = new Date(`${start}T00:00:00`)
  const b = new Date(`${end}T00:00:00`)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return 1
  return Math.round((b - a) / 86400000) + 1
}

function calcHours(start, end) {
  if (!start || !end || end <= start) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.round((((eh * 60 + em) - (sh * 60 + sm)) / 60) * 100) / 100
}

function durationControlOf(type) {
  return type?.durationControl ?? type?.duration_control ?? 'any'
}

function maxHoursOf(type) {
  const value = type?.maxHours ?? type?.max_hours
  return value === null || value === undefined || value === '' ? null : Number(value)
}

function isSingleTimeRequest(type) {
  return ['Late Check In', 'Early Check Out'].includes(type)
}

function durationControlLabel(control) {
  if (control === 'single_day') return 'Single Day'
  if (control === 'multiple_day') return 'Multiple Day'
  if (control === 'hours') return 'Hours'
  return 'Any Duration'
}

const CORE_PERMISSION_TYPES = PERMISSION_REQUEST_TYPES.map((type, index) => ({
  id: type.id,
  name: type.id,
  color: {
    'Late Check In': '#0ea5e9',
    'Early Check Out': '#f59e0b',
    'Day Off': '#8b5cf6',
    'Missing Check In': '#8b5cf6',
    'Missing Check Out': '#d946ef',
    'Personal Request': '#f97316',
  }[type.id] || '#10b981',
  description: type.desc,
  duration_control: type.id === 'Late Check In' || type.id === 'Early Check Out' || type.id === 'Missing Check In' || type.id === 'Missing Check Out'
    ? 'hours'
    : 'any',
  max_hours: type.id === 'Late Check In' || type.id === 'Early Check Out' ? 2 : null,
  is_active: true,
  sort_order: index,
}))

function normalizePermissionTypes(rows = []) {
  const byName = new Map(CORE_PERMISSION_TYPES.map((type) => [type.name, type]))

  rows.forEach((row) => {
    if (!row?.name) return
    const existing = byName.get(row.name)
    byName.set(row.name, {
      ...existing,
      ...row,
      id: row.id ?? existing?.id ?? row.name,
      name: row.name,
      description: row.description || existing?.description || '',
      duration_control: row.duration_control ?? existing?.duration_control ?? 'any',
      max_hours: row.max_hours ?? existing?.max_hours ?? null,
      color: row.color || existing?.color || '#10b981',
      is_active: row.is_active ?? existing?.is_active ?? true,
      sort_order: existing?.sort_order ?? rows.length,
    })
  })

  return Array.from(byName.values())
    .filter((type) => type.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
}

function fmtSubmittedAt(iso) {
  if (!iso) return { date: '-', time: '-' }
  const dt = new Date(iso)
  return {
    date: dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

function isoDay(v) { return v?.slice?.(0, 10) || v || '' }

function mapApiRequest(row) {
  const s = fmtSubmittedAt(row.created_at)
  return {
    dbId: row.id,
    id: row.request_code,
    employeeId: row.employee_id,
    employeeName: employeeFullName(row.employee),
    replacementEmployeeId: row.replacement_employee_id || '',
    replacementName: row.replacement_employee ? employeeFullName(row.replacement_employee) : 'None',
    department: row.employee?.department?.name || '-',
    type: row.type,
    date: row.request_date,
    dateEnd: row.request_date_end || row.request_date,
    dateRange: fmtDateRange(row.request_date, row.request_date_end),
    duration: fmtRequestDuration(row),
    time: row.request_time || null,
    startTime: row.start_time || row.request_time || null,
    endTime: row.end_time || null,
    durationType: row.duration_type || 'single_day',
    dayPart: row.day_part || null,
    totalHours: row.total_hours || null,
    totalDays: row.total_days || null,
    reason: row.reason,
    note: row.note || null,
    attachmentPath: row.attachment_path || null,
    attachmentName: row.attachment_name || null,
    status: titleCase(row.status),
    submittedAt: s.date,
    submittedTime: s.time,
    createdAt: row.created_at,
    approvedBy: row.reviewer?.name || (row.status === 'pending' ? null : 'Admin'),
    reviewedAt: row.reviewed_at,
    notes: row.admin_notes || null,
    emergency: Boolean(row.is_emergency),
  }
}

function groupByMonth(requests) {
  const groups = {}
  requests.forEach((r) => {
    const key = r.date
      ? new Date(r.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Unknown'
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  })
  return Object.entries(groups)
}

const TYPE_COLORS = {
  'Late Check In':      { bg: 'bg-sky-100 dark:bg-sky-950/40',         text: 'text-sky-600 dark:text-sky-400',         dot: 'bg-sky-500' },
  'Early Check Out':    { bg: 'bg-amber-100 dark:bg-amber-950/40',     text: 'text-amber-600 dark:text-amber-400',     dot: 'bg-amber-500' },
  'Day Off':            { bg: 'bg-violet-100 dark:bg-violet-950/40',   text: 'text-violet-600 dark:text-violet-400',   dot: 'bg-violet-500' },
  'Missing Check In':   { bg: 'bg-violet-100 dark:bg-violet-950/40',   text: 'text-violet-600 dark:text-violet-400',   dot: 'bg-violet-500' },
  'Personal Request':   { bg: 'bg-orange-100 dark:bg-orange-950/40',   text: 'text-orange-600 dark:text-orange-400',   dot: 'bg-orange-500' },
}

function typeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS['Personal Request']
}

const STATUS_STYLES = {
  Pending:  'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/60',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/60',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/60',
}

const REASON_OPTIONS = [
  'Personal matter',
  'Family matter',
  'Sick / health reason',
  'Traffic issue',
  'Customer visit',
  'Company task',
  'Emergency',
  'Other',
]

function StatusBadge({ status }) {
  return (
    <span className={clsx('inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1', STATUS_STYLES[status] || STATUS_STYLES.Pending)}>
      {status}
    </span>
  )
}

function StatusChoice({ value, onChange }) {
  const options = [
    { status: 'Pending', Icon: Clock, tone: 'amber', desc: 'Waiting for review' },
    { status: 'Approved', Icon: Check, tone: 'emerald', desc: 'Request is allowed' },
    { status: 'Rejected', Icon: XCircle, tone: 'rose', desc: 'Request is declined' },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map(({ status, Icon, tone, desc }) => {
        const selected = value === status
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={clsx(
              'group flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition',
              selected && tone === 'emerald' && 'border-emerald-400 bg-emerald-50 shadow-sm shadow-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:shadow-none',
              selected && tone === 'rose' && 'border-rose-400 bg-rose-50 shadow-sm shadow-rose-100 dark:border-rose-700 dark:bg-rose-950/30 dark:shadow-none',
              selected && tone === 'amber' && 'border-amber-400 bg-amber-50 shadow-sm shadow-amber-100 dark:border-amber-700 dark:bg-amber-950/30 dark:shadow-none',
              !selected && 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900',
            )}
          >
            <span className={clsx(
              'grid h-11 w-11 shrink-0 place-items-center rounded-xl transition',
              tone === 'emerald' && (selected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'),
              tone === 'rose' && (selected ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'),
              tone === 'amber' && (selected ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300'),
            )}>
              <Icon size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={clsx(
                'block text-sm font-black',
                selected && tone === 'emerald' && 'text-emerald-800 dark:text-emerald-200',
                selected && tone === 'rose' && 'text-rose-800 dark:text-rose-200',
                selected && tone === 'amber' && 'text-amber-800 dark:text-amber-200',
                !selected && 'text-slate-700 dark:text-slate-200',
              )}>
                {status}
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-slate-400 dark:text-slate-500">{desc}</span>
            </span>
            <span className={clsx(
              'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition',
              selected && tone === 'emerald' && 'border-emerald-600 bg-emerald-600 text-white',
              selected && tone === 'rose' && 'border-rose-600 bg-rose-600 text-white',
              selected && tone === 'amber' && 'border-amber-500 bg-amber-500 text-white',
              !selected && 'border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-900',
            )}>
              <Check size={12} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

export default function PermissionRequestsPage({ user, pendingRequestType, onClearPendingRequest }) {
  const employeeId = user?.employee?.id ?? null
  const canViewAll = canAccess(user, ['requests.view_all'])
  const canApprove = canAccess(user, ['requests.approve'])
  const canSubmit  = canAccess(user, ['requests.create'])

  const [requests, setRequests]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null)
  const [notice, setNotice]           = useState({ text: '', ok: true })
  const [statusTab, setStatusTab]     = useState('All')
  const [typeFilter, setTypeFilter]   = useState('')
  const [deptFilter, setDeptFilter]   = useState('')
  const [search, setSearch]           = useState('')
  const [dateFrom, setDateFrom]       = useState('')
  const [dateTo, setDateTo]           = useState('')
  const [showTypePicker, setShowTypePicker] = useState(false)
  const [showForm, setShowForm]             = useState(false)
  const [editingId, setEditingId]           = useState(null)
  const [submitting, setSubmitting]         = useState(false)
  const [statusConfirm, setStatusConfirm]   = useState(null)
  const [statusReason, setStatusReason]     = useState('')
  const [statusSubmitting, setStatusSubmitting] = useState(false)
  const [form, setForm]               = useState(() => newRequestForm('Late Check In'))
  const [replacementOptions, setReplacementOptions] = useState([])
  const [permissionTypes, setPermissionTypes]       = useState(() => normalizePermissionTypes())
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  const notify = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const rows = await permissionRequestService.list()
      setRequests(rows.map(mapApiRequest))
    } catch (err) {
      notify(apiError(err), false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    api.get('/permission-types')
      .then((res) => setPermissionTypes(normalizePermissionTypes(res.data?.data ?? res.data ?? [])))
      .catch(() => setPermissionTypes(normalizePermissionTypes()))
  }, [])

  useEffect(() => {
    if (!canSubmit) return
    permissionRequestService.replacements()
      .then(setReplacementOptions)
      .catch(() => setReplacementOptions([]))
  }, [canSubmit])

  useEffect(() => {
    if (!pendingRequestType) return
    setForm(newRequestForm(pendingRequestType))
    setEditingId(null)
    setShowForm(true)
    onClearPendingRequest?.()
  }, [pendingRequestType]) // eslint-disable-line

  // ── derived ──────────────────────────────────────────────────────────────

  const departments = useMemo(() => {
    const set = new Set(requests.map((r) => r.department).filter((d) => d && d !== '-'))
    return [...set].sort()
  }, [requests])

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusTab !== 'All' && r.status !== statusTab) return false
      if (typeFilter && r.type !== typeFilter) return false
      if (deptFilter && r.department !== deptFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!r.employeeName?.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q) && !r.id?.toLowerCase().includes(q)) return false
      }
      if (dateFrom && isoDay(r.dateEnd) < dateFrom) return false
      if (dateTo && isoDay(r.date) > dateTo) return false
      return true
    })
  }, [requests, statusTab, typeFilter, deptFilter, search, dateFrom, dateTo])

  const stats = useMemo(() => {
    const total = requests.length
    const totalPending = requests.filter((r) => r.status === 'Pending').length
    const cats = Object.entries(REQUEST_CATEGORIES).map(([label, types]) => ({
      label,
      count: requests.filter((r) => types.includes(r.type)).length,
      pending: requests.filter((r) => types.includes(r.type) && r.status === 'Pending').length,
    }))
    return { cats, total, totalPending }
  }, [requests])


  // ── actions ──────────────────────────────────────────────────────────────

  const defaultType = () => permissionTypes[0]?.name || 'Late Check In'

  const openForm = (type) => {
    setForm(newRequestForm(type || defaultType()))
    setEditingId(null)
    setShowTypePicker(false)
    setShowForm(true)
  }

  const openEdit = (req) => {
    setForm({
      type: req.type,
      replacementEmployeeId: req.replacementEmployeeId || '',
      reasonType: REASON_OPTIONS.includes(req.reason) ? req.reason : 'Other',
      durationType: req.durationType || 'single_day',
      date: isoDay(req.date),
      dateEnd: isoDay(req.dateEnd || req.date),
      time: req.startTime || req.time || '',
      timeTo: req.endTime || '',
      dayPart: req.dayPart || 'Full Day',
      totalDays: req.totalDays || calcDays(isoDay(req.date), isoDay(req.dateEnd || req.date)),
      totalHours: req.totalHours || calcHours(req.startTime || req.time, req.endTime),
      reason: req.reason,
      note: req.note || '',
      status: req.status || 'Pending',
      attachment: null,
      gps: '',
      emergency: req.emergency,
    })
    setEditingId(req.dbId)
    setShowForm(true)
  }

  const submitRequest = async (e) => {
    e.preventDefault()
    if (submitting) return
    const reason = form.reason || form.reasonType
    const startDate = form.date
    const endDate = form.durationType === 'multiple_day' ? (form.dateEnd || form.date) : form.date
    const totalDays = form.durationType === 'multiple_day' ? calcDays(startDate, endDate) : 1
    const singleTimeRequest = isSingleTimeRequest(form.type)
    const totalHours = form.durationType === 'hours' && !singleTimeRequest ? calcHours(form.time, form.timeTo) : null

    if (!form.type || !reason || !startDate) {
      notify('Please complete all required fields.', false)
      return
    }
    if (form.durationType === 'hours' && singleTimeRequest && !form.time) {
      notify('Please select a request time.', false)
      return
    }
    if (form.durationType === 'hours' && !singleTimeRequest && (!form.time || !form.timeTo || totalHours <= 0)) {
      notify('Please select a valid start and end time.', false)
      return
    }
    const selectedType = permissionTypes.find((pt) => pt.name === form.type)
    const durationControl = durationControlOf(selectedType)
    const maxHours = maxHoursOf(selectedType)
    if (durationControl !== 'any' && form.durationType !== durationControl) {
      notify(`${form.type} must use ${durationControl.replace('_', ' ')} duration.`, false)
      return
    }
    if (durationControl === 'hours' && !singleTimeRequest && maxHours && totalHours > maxHours) {
      notify(`${form.type} cannot be more than ${maxHours} hour(s).`, false)
      return
    }

    const payload = new FormData()
    payload.append('type', form.type)
    payload.append('replacement_employee_id', '')
    payload.append('request_date', startDate)
    payload.append('request_date_end', endDate)
    payload.append('duration_type', form.durationType)
    payload.append('reason', reason)
    payload.append('note', form.note || '')
    payload.append('is_emergency', form.emergency ? '1' : '0')
    if (editingId && canApprove && form.status) {
      payload.append('status', form.status.toLowerCase())
    }

    if (form.durationType === 'hours') {
      payload.append('request_time', form.time)
      payload.append('start_time', form.time)
      payload.append('end_time', singleTimeRequest ? '' : form.timeTo)
      payload.append('total_hours', singleTimeRequest ? '' : String(totalHours))
    } else if (form.durationType === 'multiple_day') {
      payload.append('total_days', String(totalDays))
    } else {
      payload.append('day_part', form.dayPart || 'Full Day')
      payload.append('total_days', '1')
    }

    if (form.attachment) {
      payload.append('attachment', form.attachment)
    }
    setSubmitting(true)
    try {
      if (editingId) {
        await permissionRequestService.update(editingId, payload)
        notify('Request updated.')
      } else {
        await permissionRequestService.create(payload)
        notify(`${form.type} submitted successfully.`)
      }
      setShowForm(false)
      setEditingId(null)
      await load()
    } catch (err) {
      notify(apiError(err), false)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteRequest = async (req) => {
    if (!window.confirm(`Cancel request ${req.id}?`)) return
    try {
      await permissionRequestService.remove(req.dbId)
      if (selected?.dbId === req.dbId) { setSelected(null); setShowMobileDetail(false) }
      notify('Request cancelled.')
      await load()
    } catch (err) {
      notify(apiError(err), false)
    }
  }

  const requestStatusChange = (req, status) => {
    setStatusConfirm({ req, status })
    setStatusReason('')
  }

  const updateStatus = async (req, status) => {
    if (statusSubmitting) return
    const adminNotes = statusReason.trim()
    if (!adminNotes) {
      notify(`Please enter the reason why HR ${status === 'Approved' ? 'approves' : 'rejects'} this request.`, false)
      return
    }
    setStatusSubmitting(true)
    try {
      const updated = await permissionRequestService.updateStatus(req.dbId, { status: status.toLowerCase(), admin_notes: adminNotes })
      const mapped = mapApiRequest(updated)
      setSelected(mapped)
      notify(`Request ${status.toLowerCase()}.`)
      setStatusConfirm(null)
      setStatusReason('')
      await load()
    } catch (err) {
      notify(apiError(err), false)
    } finally {
      setStatusSubmitting(false)
    }
  }

  const selectRow = (req) => {
    setSelected(req)
    setShowMobileDetail(true)
  }

  const resetFilters = () => {
    setTypeFilter(''); setDeptFilter(''); setDateFrom(''); setDateTo(''); setSearch('')
  }

  const applyFilters = () => {} // filters are reactive, nothing to do
  const statusConfirmIsApproval = statusConfirm?.status === 'Approved'
  const statusConfirmAction = statusConfirmIsApproval ? 'approve' : 'reject'
  const statusConfirmEmployee = statusConfirm?.req?.employeeName || 'this employee'

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Notice ───────────────────────────────────────────────────────── */}
      {notice.text && (
        <div className={clsx(
          'fixed left-1/2 top-20 z-[100] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg',
          notice.ok
            ? 'bg-emerald-600 text-white'
            : 'bg-rose-600 text-white',
        )}>
          {notice.text}
        </div>
      )}

      {/* ══════════════ DESKTOP ══════════════════════════════════════════════ */}
      <div className="hidden lg:block space-y-5">
        {/* ── Desktop inline form (replaces list when showForm=true) ───────── */}
        {/* ── List view (hidden while form is open) ───────────────────────── */}
        <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Requests Overview</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and track all employee requests in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            {canSubmit && (
              <button
                type="button"
                onClick={() => openForm(defaultType())}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <Plus size={16} />
                New Request
              </button>
            )}
            <button type="button" onClick={load} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-4">
          {stats.cats.map(({ label, count, pending }) => (
            <DesktopStatCard key={label} label={label} count={count} pending={pending} />
          ))}
          <DesktopStatCard label="Total Requests" count={stats.total} pending={stats.totalPending} total />
        </div>

        {/* Main content: table + detail panel */}
        <div className={clsx('flex gap-5 transition-all', selected ? '' : '')}>
          {/* Table section */}
          <div className={clsx('min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', selected ? 'max-w-[calc(100%-340px)]' : '')}>
            {/* Tab bar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
              <div className="flex gap-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusTab(tab)}
                    className={clsx(
                      'h-12 px-4 text-sm font-semibold transition border-b-2',
                      statusTab === tab
                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
                    )}
                  >
                    {tab} Requests
                  </button>
                ))}
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 px-5 py-3 dark:border-slate-800">
              <FilterSelect label="Request Type" value={typeFilter} onChange={setTypeFilter}>
                <option value="">All Types</option>
                {PERMISSION_REQUEST_TYPES.map((t) => <option key={t.id} value={t.id}>{t.id}</option>)}
              </FilterSelect>
              {canViewAll && (
                <FilterSelect label="Department" value={deptFilter} onChange={setDeptFilter}>
                  <option value="">All Departments</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </FilterSelect>
              )}
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">Date Range</p>
                <div className="flex items-center gap-1.5">
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={filterInputCls} />
                  <span className="text-xs text-slate-400">–</span>
                  <input type="date" value={dateTo} min={dateFrom} onChange={(e) => setDateTo(e.target.value)} className={filterInputCls} />
                </div>
              </div>
              <button type="button" onClick={applyFilters} className="h-9 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700">
                Apply Filter
              </button>
              <button type="button" onClick={resetFilters} className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Reset
              </button>
              <div className="ml-auto flex items-end">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-400 dark:bg-slate-950 dark:text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Request</th>
                    {canViewAll && <th className="px-5 py-3">Employee</th>}
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Duration / Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Requested On</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading && (
                    <tr><td colSpan={canViewAll ? 7 : 6} className="px-5 py-10 text-center text-sm text-slate-400">Loading…</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={canViewAll ? 7 : 6} className="px-5 py-12 text-center text-sm text-slate-400">No requests found.</td></tr>
                  )}
                  {filtered.map((req) => {
                    const tc = typeColor(req.type)
                    const meta = requestTypeMeta(req.type)
                    const Icon = meta.icon
                    const isOwn = req.employeeId === employeeId
                    const canEdit = canViewAll || (canSubmit && isOwn && req.status === 'Pending')
                    const canCancel = canSubmit && isOwn && req.status === 'Pending'
                    const isActive = selected?.dbId === req.dbId
                    return (
                      <tr
                        key={req.dbId}
                        className={clsx('cursor-pointer transition', isActive ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-950/50')}
                        onClick={() => setSelected(isActive ? null : req)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={clsx('grid h-9 w-9 shrink-0 place-items-center rounded-lg', tc.bg, tc.text)}>
                              <Icon size={15} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{req.type}</p>
                              <p className="text-[11px] text-slate-400">{req.id}</p>
                            </div>
                          </div>
                        </td>
                        {canViewAll && (
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-700 dark:text-slate-200">{req.employeeName}</p>
                            <p className="text-[11px] text-slate-400">{req.department}</p>
                          </td>
                        )}
                        <td className="px-5 py-4">
                          <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold', tc.bg, tc.text)}>{req.type}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{req.dateRange}</p>
                          <p className="text-[11px] text-slate-400">{req.duration}</p>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={req.status} /></td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700 dark:text-slate-200">{req.submittedAt}</p>
                          <p className="text-[11px] text-slate-400">{req.submittedTime}</p>
                        </td>
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <ActionBtn label="View" onClick={() => setSelected(isActive ? null : req)}>
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              View
                            </ActionBtn>
                            {canEdit && (
                              <ActionBtn label="Edit" success onClick={() => openEdit(req)}>
                                <Pencil size={13} />
                                Edit
                              </ActionBtn>
                            )}
                            {canCancel && (
                                <ActionBtn label="Delete" danger onClick={() => deleteRequest(req)}>
                                  <Trash2 size={13} />
                                </ActionBtn>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400 dark:border-slate-800">
              Showing {filtered.length} of {requests.length} requests
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <DesktopDetailPanel
              req={selected}
              canApprove={canApprove}
              canViewAll={canViewAll}
              canSubmit={canSubmit}
              employeeId={employeeId}
              onClose={() => setSelected(null)}
              onStatus={requestStatusChange}
              onEdit={openEdit}
              onDelete={deleteRequest}
            />
          )}
        </div>
        </div> {/* end list-view wrapper */}
      </div>   {/* end hidden lg:block */}

      {/* ══════════════ MOBILE ═══════════════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/50 p-6 backdrop-blur-sm lg:flex">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950">
            <DesktopFormView
              form={form}
              setForm={setForm}
              replacementOptions={replacementOptions}
              permissionTypes={permissionTypes}
              isEdit={Boolean(editingId)}
              canManageStatus={canApprove}
              submitting={submitting}
              onClose={() => { setShowForm(false); setEditingId(null) }}
              onSubmit={submitRequest}
            />
          </div>
        </div>
      )}

      <div className="lg:hidden">
        {/* Mobile detail overlay */}
        {showMobileDetail && selected && (
          <MobileDetailSheet
            req={selected}
            canApprove={canApprove}
            canViewAll={canViewAll}
            canSubmit={canSubmit}
            employeeId={employeeId}
            onClose={() => setShowMobileDetail(false)}
            onStatus={requestStatusChange}
            onEdit={openEdit}
            onDelete={deleteRequest}
          />
        )}

        {/* Type picker sheet */}
        {false && showTypePicker && (
          <TypePickerSheet onClose={() => setShowTypePicker(false)} onPick={openForm} />
        )}

        {/* Mobile header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Requests</h2>
          <button type="button" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={20} />
            {stats.totalPending > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </button>
        </div>

        {/* My Requests — shown directly, no tab switching */}
        <div className="space-y-4">
          {/* Status filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusTab(s)}
                className={clsx(
                  'shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition',
                  statusTab === s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Grouped list */}
          {loading && <p className="py-8 text-center text-sm text-slate-400">Loading…</p>}
          {!loading && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">No requests found.</p>
          )}
          {groupByMonth(filtered).map(([month, reqs]) => (
            <div key={month}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{month}</p>
              <div className="space-y-2">
                {reqs.map((req) => (
                  <MobileRequestRow key={req.dbId} req={req} showEmployee={canViewAll} onPress={() => selectRow(req)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile FAB */}
        {canSubmit && (
          <button
            type="button"
            onClick={() => openForm(defaultType())}
            className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/25 transition active:scale-95"
            aria-label="New request"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* ── Mobile-only form overlay ─────────────────────────────────────── */}
      {showForm && (
        <div className="lg:hidden">
          <RequestPermissionFormModal
            form={form}
            setForm={setForm}
            replacementOptions={replacementOptions}
            permissionTypes={permissionTypes}
            isEdit={Boolean(editingId)}
            canManageStatus={canApprove}
            submitting={submitting}
            onClose={() => { setShowForm(false); setEditingId(null) }}
            onSubmit={submitRequest}
          />
        </div>
      )}

      {statusConfirm && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/45 px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className={clsx(
              'mx-auto grid h-12 w-12 place-items-center rounded-full',
              statusConfirm.status === 'Approved'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300',
            )}>
              {statusConfirm.status === 'Approved' ? <Check size={22} /> : <XCircle size={22} />}
            </div>
            <h4 className="mt-4 text-center text-lg font-black text-slate-950 dark:text-white">
              {statusConfirmIsApproval ? 'Confirm approval?' : 'Confirm rejection?'}
            </h4>
            <p className="mt-2 text-center text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to {statusConfirmAction} this {statusConfirm.req.type} request for {statusConfirmEmployee}?
            </p>
            <div className="mt-4 text-left">
              <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                HR Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={statusReason}
                onChange={(event) => setStatusReason(event.target.value)}
                placeholder={statusConfirmIsApproval ? 'Why is this request approved?' : 'Why is this request rejected?'}
                maxLength={500}
                className="min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                disabled={statusSubmitting}
                autoFocus
              />
              <p className="mt-1 text-right text-xs font-semibold text-slate-400">{statusReason.length}/500</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setStatusConfirm(null); setStatusReason('') }}
                className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                disabled={statusSubmitting}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => updateStatus(statusConfirm.req, statusConfirm.status)}
                className={clsx(
                  'h-12 rounded-xl text-sm font-black text-white shadow-lg transition disabled:opacity-60',
                  statusConfirm.status === 'Approved'
                    ? 'bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-700'
                    : 'bg-rose-600 shadow-rose-600/25 hover:bg-rose-700',
                )}
                disabled={statusSubmitting || !statusReason.trim()}
              >
                {statusSubmitting ? 'Confirming...' : (statusConfirmIsApproval ? 'Approve' : 'Reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Desktop: inline form view ───────────────────────────────────────────────

function DesktopFormView({ form, setForm, replacementOptions, permissionTypes = [], isEdit, canManageStatus, submitting, onClose, onSubmit }) {
  const totalDays = calcDays(form.date, form.dateEnd)
  const totalHours = calcHours(form.time, form.timeTo)
  const singleTimeRequest = isSingleTimeRequest(form.type)

  const setType = (type) => {
    const next = newRequestForm(type)
    const selectedType = permissionTypes.find((pt) => pt.name === type)
    const control = durationControlOf(selectedType)
    const singleTime = isSingleTimeRequest(type)
    setForm({
      ...next,
      replacementEmployeeId: '',
      reasonType: form.reasonType,
      reason: form.reason,
      note: form.note,
      status: form.status,
      date: form.date,
      dateEnd: form.dateEnd,
      durationType: control === 'any' ? form.durationType : control,
      dayPart: form.dayPart,
      time: control === 'hours' ? (form.time || defaultTime()) : next.time,
      timeTo: control === 'hours' && !singleTime ? (form.timeTo || defaultTime(60)) : '',
      attachment: form.attachment,
    })
  }

  const setDurationType = (durationType) => {
    setForm((f) => ({ ...f, durationType, dateEnd: durationType === 'multiple_day' ? f.dateEnd : f.date, time: durationType === 'hours' ? (f.time || defaultTime()) : '', timeTo: durationType === 'hours' ? (f.timeTo || defaultTime(60)) : '', dayPart: durationType === 'single_day' ? (f.dayPart || 'Full Day') : 'Full Day' }))
  }

  const selectedType = permissionTypes.find((pt) => pt.name === form.type)
  const durationControl = durationControlOf(selectedType)
  const maxHours = maxHoursOf(selectedType)

  return (
    <div className="space-y-5">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{isEdit ? 'Edit Request' : 'New Request'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isEdit ? 'Update request details and status.' : 'Choose what you need, when you need it, then submit for approval.'}</p>
        </div>
      </div>

      {/* ── 2-column layout ──────────────────────────────────────────── */}
      <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">

        {/* ── Left: form card ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-6">

            {/* Request Type */}
            <PermissionTypePicker
              permissionTypes={permissionTypes}
              value={form.type}
              onChange={setType}
            />

            {false && (<>
            {/* Covered By */}
            <div>
              <FieldLabel text="Cover Person" optional />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, replacementEmployeeId: '' }))}
                className={clsx(
                  'mb-3 flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition',
                  !form.replacementEmployeeId
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600',
                )}
              >
                <span className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed transition', !form.replacementEmployeeId ? 'border-emerald-500 bg-emerald-100 text-emerald-600 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-400' : 'border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-900')}>
                  <UserRound size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={clsx('text-sm font-bold', !form.replacementEmployeeId ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400')}>No Cover</p>
                  <p className="text-xs text-slate-400">Skip this if nobody needs to cover your work</p>
                </div>
                <span className={clsx('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition', !form.replacementEmployeeId ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600')}>
                  {!form.replacementEmployeeId && <Check size={11} className="text-white" />}
                </span>
              </button>
              <div className={clsx('rounded-xl border-2 p-3 transition', form.replacementEmployeeId ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950')}>
                <p className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">Choose a cover person only if needed</p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400"><UserRound size={17} /></span>
                  <select className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.replacementEmployeeId || ''} onChange={(e) => setForm((f) => ({ ...f, replacementEmployeeId: e.target.value }))}>
                    <option value="">Choose a cover person…</option>
                    {replacementOptions.map((e) => <option key={e.id} value={e.id}>{employeeFullName(e)}</option>)}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                {form.replacementEmployeeId && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, replacementEmployeeId: '' }))} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 dark:text-rose-400">
                    <X size={12} /> Clear selection
                  </button>
                )}
              </div>
            </div>

            </>)}

            {/* Duration Type */}
            <div>
              <FieldLabel text="Duration Type" required />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'single_day', label: 'Single Day', icon: CalendarDays },
                  { id: 'multiple_day', label: 'Multiple Day', icon: CalendarDays },
                  { id: 'hours', label: 'Hours', icon: Clock },
                ].filter((item) => durationControl === 'any' || item.id === durationControl).map((item) => {
                  const DIcon = item.icon
                  const sel = form.durationType === item.id
                  return (
                    <button key={item.id} type="button" onClick={() => setDurationType(item.id)} className={clsx('flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition', sel ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:border-emerald-600 dark:bg-emerald-950/30' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950')}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"><DIcon size={17} /></span>
                      <span className="flex-1 text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                      <span className={clsx('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', sel ? 'border-emerald-600' : 'border-slate-300 dark:border-slate-600')}>{sel && <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date / Time section */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              {form.durationType === 'single_day' && (
                <div className="space-y-4">
                  <FormField label="Date *"><input type="date" className={mobileDateCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: e.target.value }))} required /></FormField>
                  <div className="grid grid-cols-2 gap-3">
                    {['Full Day', 'Half Day'].map((part) => (
                      <button key={part} type="button" onClick={() => setForm((f) => ({ ...f, dayPart: part }))} className={clsx('h-12 rounded-xl border text-sm font-bold transition', form.dayPart === part ? 'border-emerald-500 bg-white text-emerald-700 shadow-sm' : 'border-slate-200 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300')}>{part}</button>
                    ))}
                  </div>
                </div>
              )}
              {form.durationType === 'multiple_day' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Start Date *"><input type="date" className={mobileDateCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: f.dateEnd < e.target.value ? e.target.value : f.dateEnd }))} required /></FormField>
                    <FormField label="End Date *"><input type="date" className={mobileDateCls} value={form.dateEnd} min={form.date} onChange={(e) => setForm((f) => ({ ...f, dateEnd: e.target.value }))} required /></FormField>
                  </div>
                  <ReadOnlyTotal label="Total Days" value={totalDays} suffix="Day(s)" />
                </div>
              )}
              {form.durationType === 'hours' && (
                <div className="space-y-4">
                  <FormField label="Date *"><input type="date" className={mobileDateCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: e.target.value }))} required /></FormField>
                  {singleTimeRequest ? (
                    <FormField label={`${form.type === 'Late Check In' ? 'Approved Check In' : 'Approved Check Out'} Time *`}>
                      <input type="time" className={mobileDateCls} value={form.time || ''} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value, timeTo: '' }))} required />
                    </FormField>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Start Time *"><input type="time" className={mobileDateCls} value={form.time || ''} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} required /></FormField>
                        <FormField label="End Time *"><input type="time" className={mobileDateCls} value={form.timeTo || ''} onChange={(e) => setForm((f) => ({ ...f, timeTo: e.target.value }))} required /></FormField>
                      </div>
                      <ReadOnlyTotal label="Total Hours" value={totalHours} suffix="Hour(s)" invalid={form.time && form.timeTo && totalHours <= 0} />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Reason */}
            <FormField label="Reason *">
              <textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="Write reason..." value={form.reason || ''} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} maxLength={500} required />
              <p className="mt-1 text-right text-xs font-medium text-slate-500">{(form.reason || '').length}/500</p>
            </FormField>

            {isEdit && canManageStatus && (
              <FormField label="Request Status *">
                <StatusChoice value={form.status || 'Pending'} onChange={(status) => setForm((f) => ({ ...f, status }))} />
              </FormField>
            )}
          </div>
        </div>

        {/* ── Right: summary + actions ────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Summary card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Request Summary</p>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Type',     value: form.type },
                ...(isEdit && canManageStatus ? [{ label: 'Status', value: form.status || 'Pending' }] : []),
                { label: singleTimeRequest ? 'Time' : 'Duration', value: form.durationType === 'hours' ? (singleTimeRequest ? (form.time || '—') : `${totalHours} hour(s)`) : form.durationType === 'multiple_day' ? `${totalDays} day(s)` : `1 day (${form.dayPart})` },
                { label: 'Date',     value: form.date ? fmtDate(form.date) : '—' },
                ...(form.durationType === 'multiple_day' ? [{ label: 'End', value: form.dateEnd ? fmtDate(form.dateEnd) : '—' }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="shrink-0 text-slate-400">{label}</span>
                  <span className="text-right font-semibold text-slate-700 dark:text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer pushes buttons to bottom on tall screens */}
          <div className="flex-1" />

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} disabled={submitting} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white text-sm font-black text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900 dark:bg-slate-950 dark:hover:bg-rose-950/20">
              <XCircle size={18} /> Cancel
            </button>
            <button type="submit" disabled={submitting} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60">
              <Send size={18} />
              {submitting ? (isEdit ? 'Saving...' : 'Requesting...') : (isEdit ? 'Save Changes' : 'Request')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Desktop: stat card ──────────────────────────────────────────────────────

function DesktopStatCard({ label, count, pending, total }) {
  const ICONS = {
    'Attendance Requests': { icon: FileText,     bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-600 dark:text-sky-400' },
    'Day Off':             { icon: CalendarDays, bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400' },
    'Personal Requests':   { icon: XCircle,      bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400' },
    'Total Requests':      { icon: Check,        bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400' },
  }
  const cfg = ICONS[label] || ICONS['Total Requests']
  const Icon = cfg.icon

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className={clsx('grid h-12 w-12 shrink-0 place-items-center rounded-xl', cfg.bg, cfg.text)}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-slate-950 dark:text-white">{count}</p>
        </div>
      </div>
      {pending > 0 && (
        <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">Pending {pending}</p>
      )}
    </div>
  )
}

// ─── Desktop: detail panel ───────────────────────────────────────────────────

function DesktopDetailPanel({ req, canApprove, canViewAll, canSubmit, employeeId, onClose, onStatus, onEdit, onDelete }) {
  const tc = typeColor(req.type)
  const meta = requestTypeMeta(req.type)
  const Icon = meta.icon
  const isOwn = req.employeeId === employeeId
  const canEdit = canViewAll || (canSubmit && isOwn && req.status === 'Pending')
  const canCancel = canSubmit && isOwn && req.status === 'Pending'

  return (
    <div className="w-80 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
        <p className="font-bold text-slate-900 dark:text-white">Request Details</p>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* Type + status */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2.5">
            <div className={clsx('grid h-10 w-10 place-items-center rounded-xl', tc.bg, tc.text)}>
              <Icon size={18} />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">{req.type}</p>
          </div>
          <StatusBadge status={req.status} />
        </div>

        <div className="space-y-4 px-4 py-4">
          {/* IDs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-semibold text-slate-400">Request ID</p>
              <p className="mt-0.5 font-bold text-slate-700 dark:text-slate-200">{req.id}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400">Requested on</p>
              <p className="mt-0.5 font-bold text-slate-700 dark:text-slate-200">{req.submittedAt}</p>
              <p className="text-slate-400">{req.submittedTime}</p>
            </div>
          </div>

          {/* Date & Duration */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="mb-2 text-xs font-bold text-slate-500">Date &amp; Duration</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400"><CalendarDays size={12} /> From</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{fmtDate(req.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400"><CalendarDays size={12} /> To</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{fmtDate(req.dateEnd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400"><Clock size={12} /> Duration</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{req.duration}</span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="mb-1.5 text-xs font-bold text-slate-500">Reason</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{req.reason}</p>
          </div>

          {req.notes && req.status !== 'Pending' && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <p className="mb-1.5 text-xs font-bold text-slate-500">HR Reason</p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{req.notes}</p>
            </div>
          )}

          {/* Approval flow */}
          {req.status !== 'Pending' && (
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">Approval Flow</p>
              <div className="space-y-2">
                <ApprovalStep step={1} label="Manager Approval" reviewer={req.approvedBy} status={req.status} />
                <ApprovalStep step={2} label="HR Approval" reviewer={req.approvedBy} status={req.status} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800 space-y-2">
        {canApprove && req.status === 'Pending' && (
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onStatus(req, 'Approved')} className="h-10 rounded-lg bg-emerald-600 text-xs font-bold text-white transition hover:bg-emerald-700">
              <Check size={13} className="inline mr-1" /> Approve
            </button>
            <button type="button" onClick={() => onStatus(req, 'Rejected')} className="h-10 rounded-lg bg-rose-600 text-xs font-bold text-white transition hover:bg-rose-700">
              <XCircle size={13} className="inline mr-1" /> Reject
            </button>
          </div>
        )}
        {canEdit && (
          <button type="button" onClick={() => onEdit(req)} className="w-full h-10 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/20">
            <Pencil size={13} className="inline mr-1" /> Edit Request
          </button>
        )}
        {canCancel && (
          <button type="button" onClick={() => onDelete(req)} className="w-full h-10 rounded-lg border border-rose-200 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/20">
            Cancel Request
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Mobile: stat card ───────────────────────────────────────────────────────

function MobileStatCard({ label, count, pending, wide }) {
  const short = label.replace(' Requests', '').replace(' Request', '')
  return (
    <div className={clsx('rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900', wide && 'col-span-2')}>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{wide ? label : short}</p>
      <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{count}</p>
      {pending > 0 && (
        <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">Pending {pending}</p>
      )}
    </div>
  )
}

// ─── Mobile: request row ─────────────────────────────────────────────────────

function MobileRequestRow({ req, showEmployee, onPress }) {
  const tc = typeColor(req.type)
  const meta = requestTypeMeta(req.type)
  const Icon = meta.icon

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900"
    >
      <div className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', tc.bg, tc.text)}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{req.type}</p>
          <StatusBadge status={req.status} />
        </div>
        {showEmployee && <p className="truncate text-xs font-medium text-slate-500">{req.employeeName}</p>}
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
          <span>{req.dateRange}</span>
          <span>·</span>
          <span>{req.duration}</span>
        </div>
      </div>
      <ChevronRight size={14} className="shrink-0 text-slate-300 dark:text-slate-600" />
    </button>
  )
}

// ─── Mobile: type picker sheet ───────────────────────────────────────────────

const PICKER_TYPES = [
  { id: 'Late Check In',       label: 'Late Check In',       desc: 'Request approval for late arrival.' },
  { id: 'Early Check Out',     label: 'Early Check Out',     desc: 'Request approval to leave early.' },
  { id: 'Day Off',             label: 'Day Off',             desc: 'Request approval for a day off.' },
  { id: 'Missing Check In',    label: 'Missing Check In',    desc: 'Request approval for a missing check-in.' },
  { id: 'Personal Request',    label: 'Personal Request',    desc: 'Request approval for personal matters.' },
]

function TypePickerSheet({ onClose, onPick }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
      <div className="rounded-t-2xl bg-white px-5 pb-8 pt-5 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Request</h3>
            <p className="text-sm text-slate-500">Select Request Type</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
        </div>
        <div className="space-y-2">
          {PICKER_TYPES.map((t) => {
            const meta = requestTypeMeta(t.id)
            const Icon = meta.icon
            const tc = typeColor(t.id)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onPick(t.id)}
                className="flex w-full items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-left transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
              >
                <div className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', tc.bg, tc.text)}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{t.label}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{t.desc}</p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-slate-300" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile: detail sheet ────────────────────────────────────────────────────

function MobileDetailSheet({ req, canApprove, canViewAll, canSubmit, employeeId, onClose, onStatus, onEdit, onDelete }) {
  const tc = typeColor(req.type)
  const meta = requestTypeMeta(req.type)
  const Icon = meta.icon
  const isOwn = req.employeeId === employeeId
  const canEdit = canViewAll || (canSubmit && isOwn && req.status === 'Pending')
  const canCancel = canSubmit && isOwn && req.status === 'Pending'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800">
        <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="font-bold text-slate-900 dark:text-white">Request Details</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Type + status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx('grid h-11 w-11 place-items-center rounded-xl', tc.bg, tc.text)}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{req.type}</p>
              <p className="text-xs text-slate-400">{req.id}</p>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="font-semibold text-slate-400">Requested on</p>
            <p className="mt-0.5 font-bold text-slate-700 dark:text-slate-200">{req.submittedAt}</p>
            <p className="text-slate-400">{req.submittedTime}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="font-semibold text-slate-400">Duration</p>
            <p className="mt-0.5 font-bold text-slate-700 dark:text-slate-200">{req.duration}</p>
          </div>
        </div>

        {/* Date range */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="mb-2 text-xs font-bold text-slate-500">Date &amp; Duration</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-400"><CalendarDays size={14} /> From</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{fmtDate(req.date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-400"><CalendarDays size={14} /> To</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{fmtDate(req.dateEnd)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-400"><Clock size={14} /> Duration</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{req.duration}</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div>
          <p className="mb-1.5 text-xs font-bold text-slate-500">Reason</p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{req.reason}</p>
        </div>

        {req.notes && req.status !== 'Pending' && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="mb-1.5 text-xs font-bold text-slate-500">HR Reason</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{req.notes}</p>
          </div>
        )}

        {/* Approval flow */}
        {req.status !== 'Pending' && (
          <div>
            <p className="mb-2 text-xs font-bold text-slate-500">Approval Flow</p>
            <div className="space-y-2">
              <ApprovalStep step={1} label="Manager Approval" reviewer={req.approvedBy} status={req.status} />
              <ApprovalStep step={2} label="HR Approval" reviewer={req.approvedBy} status={req.status} />
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800 space-y-2">
        {canApprove && req.status === 'Pending' && (
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => onStatus(req, 'Approved')} className="h-12 rounded-xl bg-emerald-600 text-sm font-bold text-white">Approve</button>
            <button type="button" onClick={() => onStatus(req, 'Rejected')} className="h-12 rounded-xl bg-rose-600 text-sm font-bold text-white">Reject</button>
          </div>
        )}
        {canEdit && (
          <button type="button" onClick={() => { onEdit(req); onClose() }} className="w-full h-12 rounded-xl border-2 border-emerald-200 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:text-emerald-300">
            Edit Request
          </button>
        )}
        {canCancel && (
          <button type="button" onClick={() => { onDelete(req); onClose() }} className="w-full h-12 rounded-xl border-2 border-rose-200 text-sm font-bold text-rose-600 dark:border-rose-900">
            Cancel Request
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Approval step ───────────────────────────────────────────────────────────

function ApprovalStep({ step, label, reviewer, status }) {
  const isApproved = status === 'Approved'
  const isRejected = status === 'Rejected'
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
      <div className={clsx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold', isApproved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : isRejected ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400')}>
        {step}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        {reviewer && <p className="text-[11px] text-slate-400">{reviewer}</p>}
      </div>
      <span className={clsx('text-[11px] font-bold', isApproved ? 'text-emerald-600 dark:text-emerald-400' : isRejected ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400')}>
        {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
      </span>
    </div>
  )
}

// ─── Request form modal ──────────────────────────────────────────────────────

function RequestPermissionFormModal({ form, setForm, replacementOptions, permissionTypes = [], isEdit, canManageStatus, submitting, onClose, onSubmit }) {
  const totalDays = calcDays(form.date, form.dateEnd)
  const totalHours = calcHours(form.time, form.timeTo)
  const singleTimeRequest = isSingleTimeRequest(form.type)
  const attachmentPreview = form.attachment ? URL.createObjectURL(form.attachment) : null
  const selectedType = permissionTypes.find((pt) => pt.name === form.type)
  const durationControl = durationControlOf(selectedType)
  const maxHours = maxHoursOf(selectedType)
  const [showConfirm, setShowConfirm] = useState(false)

  const setType = (type) => {
    const next = newRequestForm(type)
    const selectedType = permissionTypes.find((pt) => pt.name === type)
    const control = durationControlOf(selectedType)
    const singleTime = isSingleTimeRequest(type)
    setForm({
      ...next,
      replacementEmployeeId: '',
      reasonType: form.reasonType,
      reason: form.reason,
      note: form.note,
      status: form.status,
      date: form.date,
      dateEnd: form.dateEnd,
      durationType: control === 'any' ? form.durationType : control,
      dayPart: form.dayPart,
      time: control === 'hours' ? (form.time || defaultTime()) : next.time,
      timeTo: control === 'hours' && !singleTime ? (form.timeTo || defaultTime(60)) : '',
      attachment: form.attachment,
    })
  }

  const setDurationType = (durationType) => {
    setForm((f) => ({ ...f, durationType, dateEnd: durationType === 'multiple_day' ? f.dateEnd : f.date, time: durationType === 'hours' ? (f.time || defaultTime()) : '', timeTo: durationType === 'hours' ? (f.timeTo || defaultTime(60)) : '', dayPart: durationType === 'single_day' ? (f.dayPart || 'Full Day') : 'Full Day' }))
  }

  const confirmSubmit = (event) => {
    event.preventDefault()
    setShowConfirm(true)
  }

  const submitConfirmed = () => {
    setShowConfirm(false)
    onSubmit({ preventDefault: () => {} })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <form className="mx-auto flex min-h-full w-full max-w-3xl flex-col" onSubmit={confirmSubmit}>
        <div className="sticky top-0 z-20 bg-white/95 px-4 py-3 shadow-sm backdrop-blur dark:bg-slate-950/95 sm:px-8">
          <div className="grid grid-cols-[36px_1fr_36px] items-center">
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
              <ChevronRight size={22} className="rotate-180" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{isEdit ? 'Edit Request' : 'New Request'}</h3>
            </div>
            <span />
          </div>
        </div>

        <div className="flex-1 space-y-5 px-4 py-5 pb-28 sm:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
            <div className="space-y-5">
              <PermissionTypePicker
                permissionTypes={permissionTypes}
                value={form.type}
                onChange={setType}
              />

              {/* ── Covered By ───────────────────────────────────────────── */}
              {false && (
              <div>
                <FieldLabel text="Cover Person" optional />

                {/* No Cover card */}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, replacementEmployeeId: '' }))}
                  className={clsx(
                    'mb-3 flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition',
                    !form.replacementEmployeeId
                      ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600',
                  )}
                >
                  <span className={clsx(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed transition',
                    !form.replacementEmployeeId
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-600 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-900',
                  )}>
                    <UserRound size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={clsx('text-sm font-bold', !form.replacementEmployeeId ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400')}>
                      No Cover
                    </p>
                    <p className="text-xs text-slate-400">Skip this if nobody needs to cover your work</p>
                  </div>
                  <span className={clsx(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition',
                    !form.replacementEmployeeId
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-slate-300 dark:border-slate-600',
                  )}>
                    {!form.replacementEmployeeId && <Check size={11} className="text-white" />}
                  </span>
                </button>

                {/* Assign replacement dropdown */}
                <div className={clsx(
                  'rounded-xl border-2 p-3 transition',
                  form.replacementEmployeeId
                    ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950',
                )}>
                  <p className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">Choose a cover person only if needed</p>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400">
                      <UserRound size={17} />
                    </span>
                    <select
                      className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      value={form.replacementEmployeeId || ''}
                      onChange={(e) => setForm((f) => ({ ...f, replacementEmployeeId: e.target.value }))}
                    >
                      <option value="">Choose a cover person…</option>
                      {replacementOptions.map((employee) => (
                        <option key={employee.id} value={employee.id}>{employeeFullName(employee)}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {form.replacementEmployeeId && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, replacementEmployeeId: '' }))}
                      className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 dark:text-rose-400"
                    >
                      <X size={12} /> Clear selection
                    </button>
                  )}
                </div>
              </div>
              )}

              <div>
                <FieldLabel text="Duration Type" required />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { id: 'single_day', label: 'Single Day', icon: CalendarDays },
                    { id: 'multiple_day', label: 'Multiple Day', icon: CalendarDays },
                    { id: 'hours', label: 'Hours', icon: Clock },
                  ].filter((item) => durationControl === 'any' || item.id === durationControl).map((item) => {
                    const DIcon = item.icon
                    const selected = form.durationType === item.id
                    return (
                      <button key={item.id} type="button" onClick={() => setDurationType(item.id)} className={clsx('flex min-h-16 items-center gap-3 rounded-xl border px-4 text-left transition duration-200', selected ? 'border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100 dark:border-emerald-600 dark:bg-emerald-950/30 dark:shadow-none' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950')}>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"><DIcon size={19} /></span>
                        <span className="min-w-0 flex-1 text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                        <span className={clsx('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2', selected ? 'border-emerald-600' : 'border-slate-300 dark:border-slate-600')}>{selected && <span className="h-3 w-3 rounded-full bg-emerald-600" />}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                {form.durationType === 'single_day' && (
                  <div className="space-y-4">
                    <FormField label="Date *"><input type="date" className={mobileDateCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: e.target.value }))} required /></FormField>
                    <div className="grid grid-cols-2 gap-3">
                      {['Full Day', 'Half Day'].map((part) => (
                        <button key={part} type="button" onClick={() => setForm((f) => ({ ...f, dayPart: part }))} className={clsx('h-12 rounded-xl border text-sm font-bold transition', form.dayPart === part ? 'border-emerald-500 bg-white text-emerald-700 shadow-sm' : 'border-slate-200 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300')}>{part}</button>
                      ))}
                    </div>
                  </div>
                )}

                {form.durationType === 'multiple_day' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormField label="Start Date *"><input type="date" className={mobileDateCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: f.dateEnd < e.target.value ? e.target.value : f.dateEnd }))} required /></FormField>
                      <FormField label="End Date *"><input type="date" className={mobileDateCls} value={form.dateEnd} min={form.date} onChange={(e) => setForm((f) => ({ ...f, dateEnd: e.target.value }))} required /></FormField>
                    </div>
                    <ReadOnlyTotal label="Total Days" value={totalDays} suffix="Day(s)" />
                  </div>
                )}

                {form.durationType === 'hours' && (
                  <div className="space-y-4">
                    <FormField label="Date *"><input type="date" className={mobileDateCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: e.target.value }))} required /></FormField>
                    {singleTimeRequest ? (
                      <FormField label={`${form.type === 'Late Check In' ? 'Approved Check In' : 'Approved Check Out'} Time *`}>
                        <input type="time" className={mobileDateCls} value={form.time || ''} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value, timeTo: '' }))} required />
                      </FormField>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <FormField label="Start Time *"><input type="time" className={mobileDateCls} value={form.time || ''} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} required /></FormField>
                          <FormField label="End Time *"><input type="time" className={mobileDateCls} value={form.timeTo || ''} onChange={(e) => setForm((f) => ({ ...f, timeTo: e.target.value }))} required /></FormField>
                        </div>
                        <ReadOnlyTotal label="Total Hours" value={totalHours} suffix="Hour(s)" invalid={form.time && form.timeTo && totalHours <= 0} />
                      </>
                    )}
                  </div>
                )}
              </div>

              <FormField label="Reason *">
                <textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="Write reason..." value={form.reason || ''} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} maxLength={500} required />
                <p className="mt-1 text-right text-xs font-medium text-slate-500">{(form.reason || '').length}/500</p>
              </FormField>

              {isEdit && canManageStatus && (
                <FormField label="Request Status *">
                  <StatusChoice value={form.status || 'Pending'} onChange={(status) => setForm((f) => ({ ...f, status }))} />
                </FormField>
              )}

              {false && (
              <div>
                <FieldLabel text="Attachment" optional />
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-800">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-emerald-600 shadow-sm dark:bg-slate-900"><UploadCloud size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800 dark:text-white">{form.attachment?.name || 'Upload image or PDF'}</span><span className="text-xs font-medium text-slate-500">JPG, PNG, WEBP or PDF up to 5 MB</span></span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setForm((f) => ({ ...f, attachment: e.target.files?.[0] || null }))} />
                </label>
                {form.attachment && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                    {form.attachment.type?.startsWith('image/') ? <img src={attachmentPreview} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-lg bg-rose-50 text-rose-600"><FileText size={22} /></span>}
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800 dark:text-white">{form.attachment.name}</p><p className="text-xs text-slate-500">{Math.ceil(form.attachment.size / 1024)} KB</p></div>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, attachment: null }))} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-12px_28px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto max-w-3xl">
            <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60" disabled={submitting}><Send size={19} />{submitting ? (isEdit ? 'Saving...' : 'Requesting...') : (isEdit ? 'Save Changes' : 'Request')}</button>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Send size={22} />
              </div>
              <h4 className="mt-4 text-center text-lg font-black text-slate-950 dark:text-white">
                {isEdit ? 'Save request?' : 'Submit request?'}
              </h4>
              <p className="mt-2 text-center text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                {isEdit ? 'Your changes will be saved.' : `${form.type} will be sent for approval.`}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  disabled={submitting}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitConfirmed}
                  className="h-12 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
                  disabled={submitting}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

// ─── Permission Type picker (dropdown) ───────────────────────────────────────

function PermissionTypePicker({ permissionTypes, value, onChange }) {
  const selected = permissionTypes.find((pt) => pt.name === value)
  const color = selected?.color || '#9ca3af'
  const control = durationControlOf(selected)
  const maxHours = maxHoursOf(selected)

  return (
    <div>
      <FieldLabel text="Request Type" required />
      <div className="hidden">
        {permissionTypes.map((pt) => {
          const meta = requestTypeMeta(pt.name)
          const Icon = meta.icon || FileText
          const checked = pt.name === value
          const ptControl = durationControlOf(pt)
          const ptMaxHours = maxHoursOf(pt)

          return (
            <button
              key={pt.id ?? pt.name}
              type="button"
              onClick={() => onChange(pt.name)}
              className={clsx(
                'flex min-h-[112px] w-full items-start gap-3 rounded-xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-500/15',
                checked
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-900',
              )}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white shadow-sm" style={{ backgroundColor: pt.color || color }}>
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-slate-900 dark:text-white">{pt.name}</span>
                <span className="mt-1 block text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{pt.description || meta.desc}</span>
                <span className="mt-2 block text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
                  {durationControlLabel(ptControl)}{ptControl === 'hours' && ptMaxHours ? `, max ${ptMaxHours}h` : ''}
                </span>
              </span>
              <span className={clsx('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition', checked ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600')}>
                {checked && <Check size={13} className="text-white" />}
              </span>
            </button>
          )
        })}
      </div>
      {permissionTypes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-sm text-slate-400 dark:border-slate-700">
          No request types set up yet. Go to{' '}
          <span className="font-semibold text-emerald-600">Permission Management → Permission Types</span>{' '}
          to add some.
        </div>
      ) : (
        <div className="relative">
          {/* colored circle on the left */}
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <span
              className="block h-5 w-5 rounded-full shadow-sm"
              style={{ backgroundColor: color }}
            />
          </span>

          <select
            className="h-14 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-10 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/40"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
          >
            <option value="" disabled>Select request type...</option>
            {permissionTypes.map((pt) => (
              <option key={pt.id} value={pt.name}>
                {pt.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
        </div>
      )}
    </div>
  )
}

function defaultTime(addMinutes = 0) {
  const date = new Date(Date.now() + addMinutes * 60000)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function FieldLabel({ text, required, optional }) {
  return <label className="mb-2 block text-sm font-black text-slate-950 dark:text-white">{text}{required && <span className="ml-1 text-rose-500">*</span>}{optional && <span className="ml-1 font-semibold text-slate-400">(Optional)</span>}</label>
}

function FormSelect({ label, required, icon: Icon, value, onChange, placeholder, children }) {
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"><Icon size={21} /></span>
        <select className="h-16 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-20 pr-12 text-base font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={value} onChange={(e) => onChange(e.target.value)} required={required}>
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown size={21} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  )
}

function IconInput({ icon: Icon, children }) {
  return <div className="relative"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-300"><Icon size={20} /></span>{children}</div>
}

function ReadOnlyTotal({ label, value, suffix, invalid }) {
  return (
    <div>
      <FieldLabel text={label} required />
      <div className={clsx('flex h-14 overflow-hidden rounded-xl border bg-white dark:bg-slate-950', invalid ? 'border-rose-300' : 'border-slate-200 dark:border-slate-700')}>
        <div className="flex flex-1 items-center px-4 text-lg font-black text-slate-900 dark:text-white">{value || 0}</div>
        <div className="flex min-w-28 items-center justify-center border-l border-emerald-200 bg-emerald-50 px-4 text-base font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">{suffix}</div>
      </div>
      {invalid && <p className="mt-1 text-xs font-semibold text-rose-600">End time must be after start time.</p>}
    </div>
  )
}

function RequestFormModal({ form, setForm, isEdit, submitting, onClose, onSubmit }) {
  const meta = requestTypeMeta(form.type)
  const tc = typeColor(form.type)
  const Icon = meta.icon

  const setType = (type) => {
    const next = newRequestForm(type)
    setForm({ ...next, reason: form.reason, date: form.date, dateEnd: form.dateEnd })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-2xl"
        onSubmit={onSubmit}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className={clsx('grid h-10 w-10 place-items-center rounded-xl', tc.bg, tc.text)}>
              <Icon size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Request' : 'New Request'}</h3>
              <p className="text-xs text-slate-500">{meta.desc}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>

        <div className="space-y-4 p-5">
          {/* Type selector */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Request Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PERMISSION_REQUEST_TYPES.slice(0, 6).map((t) => {
                const TIcon = t.icon
                const ttc = typeColor(t.id)
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={clsx(
                      'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition',
                      form.type === t.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300',
                    )}
                  >
                    <TIcon size={14} className={form.type === t.id ? '' : ttc.text} />
                    {t.shortLabel}
                  </button>
                )
              })}
            </div>
            <select
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={form.type}
              onChange={(e) => setType(e.target.value)}
            >
              {PERMISSION_REQUEST_TYPES.map((t) => <option key={t.id} value={t.id}>{t.id}</option>)}
            </select>
          </div>

          {/* Date fields */}
          {meta.showDateRange ? (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="From">
                <input type="date" className={fieldCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: f.dateEnd < e.target.value ? e.target.value : f.dateEnd }))} required />
              </FormField>
              <FormField label="To">
                <input type="date" className={fieldCls} value={form.dateEnd} min={form.date} onChange={(e) => setForm((f) => ({ ...f, dateEnd: e.target.value }))} required />
              </FormField>
            </div>
          ) : (
            <FormField label="Date">
              <input type="date" className={fieldCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateEnd: e.target.value }))} required />
            </FormField>
          )}

          {/* Time */}
          {meta.showTime && (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="From Time">
                <input type="time" className={fieldCls} value={form.time || ''} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
              </FormField>
              <FormField label="To Time">
                <input type="time" className={fieldCls} value={form.timeTo || ''} onChange={(e) => setForm((f) => ({ ...f, timeTo: e.target.value }))} />
              </FormField>
            </div>
          )}

          {/* Reason */}
          <FormField label="Reason">
            <textarea
              className={clsx(fieldCls, 'min-h-24 py-3')}
              placeholder={meta.reasonPlaceholder}
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              maxLength={200}
              required
            />
            <p className="mt-1 text-right text-[11px] text-slate-400">{(form.reason || '').length}/200</p>
          </FormField>

          {/* Attachments placeholder */}
          <div className="rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 dark:border-slate-700">
            <div className="flex items-center gap-3 text-slate-400">
              <Paperclip size={16} />
              <span className="text-xs font-semibold">Attachments (Optional)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200" disabled={submitting}>Cancel</button>
          <button type="submit" className="flex-1 h-12 rounded-xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60" disabled={submitting}>
            {submitting ? (isEdit ? 'Saving…' : 'Submitting…') : (isEdit ? 'Save Changes' : '+ Submit Request')}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function ActionBtn({ label, onClick, danger, success, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={clsx(
        'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition',
        danger && 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30',
        success && 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/30',
        !danger && !success && 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
      )}
    >
      {children}
    </button>
  )
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      <select
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      {children}
    </div>
  )
}

const filterInputCls = 'h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const fieldCls = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const mobileInputCls = 'h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const mobileDateCls = 'h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
