import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell, CalendarDays, Check, ChevronRight, Clock, Download,
  FileText, Paperclip, Pencil, Plus, RefreshCw, Search,
  SlidersHorizontal, Trash2, X, XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import { newRequestForm, REQUEST_CATEGORIES, PERMISSION_REQUEST_TYPES, requestTypeMeta } from '../constants/permissionRequestTypes'
import { permissionRequestService } from '../services/api'
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
    department: row.employee?.department?.name || '-',
    type: row.type,
    date: row.request_date,
    dateEnd: row.request_date_end || row.request_date,
    dateRange: fmtDateRange(row.request_date, row.request_date_end),
    duration: fmtDuration(row.request_date, row.request_date_end),
    time: row.request_time || null,
    reason: row.reason,
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
  'Leave Request':      { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  'Sick Leave':         { bg: 'bg-rose-100 dark:bg-rose-950/40',       text: 'text-rose-600 dark:text-rose-400',       dot: 'bg-rose-500' },
  'Request Permission': { bg: 'bg-orange-100 dark:bg-orange-950/40',   text: 'text-orange-600 dark:text-orange-400',   dot: 'bg-orange-500' },
  'Outdoor Work':       { bg: 'bg-blue-100 dark:bg-blue-950/40',       text: 'text-blue-600 dark:text-blue-400',       dot: 'bg-blue-500' },
  'Early Leave':        { bg: 'bg-amber-100 dark:bg-amber-950/40',     text: 'text-amber-600 dark:text-amber-400',     dot: 'bg-amber-500' },
  'Attendance Edit':    { bg: 'bg-violet-100 dark:bg-violet-950/40',   text: 'text-violet-600 dark:text-violet-400',   dot: 'bg-violet-500' },
  'Manual Check In':    { bg: 'bg-sky-100 dark:bg-sky-950/40',         text: 'text-sky-600 dark:text-sky-400',         dot: 'bg-sky-500' },
  'Missing Check Out':  { bg: 'bg-amber-100 dark:bg-amber-950/40',     text: 'text-amber-600 dark:text-amber-400',     dot: 'bg-amber-500' },
  'Day Off':            { bg: 'bg-violet-100 dark:bg-violet-950/40',   text: 'text-violet-600 dark:text-violet-400',   dot: 'bg-violet-500' },
  'Custom Request':     { bg: 'bg-slate-100 dark:bg-slate-800',        text: 'text-slate-600 dark:text-slate-400',     dot: 'bg-slate-400' },
}

function typeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS['Custom Request']
}

const STATUS_STYLES = {
  Pending:  'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/60',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/60',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/60',
}

function StatusBadge({ status }) {
  return (
    <span className={clsx('inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1', STATUS_STYLES[status] || STATUS_STYLES.Pending)}>
      {status}
    </span>
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
  const [mobileTab, setMobileTab]     = useState('overview')
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
  const [form, setForm]               = useState(() => newRequestForm('Leave Request'))
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

  const recentRequests = useMemo(() => requests.slice(0, 5), [requests])
  const myRequests = useMemo(() => requests.filter((r) => r.employeeId === employeeId), [requests, employeeId])

  // ── actions ──────────────────────────────────────────────────────────────

  const openForm = (type) => {
    setForm(newRequestForm(type))
    setEditingId(null)
    setShowTypePicker(false)
    setShowForm(true)
  }

  const openEdit = (req) => {
    setForm({
      type: req.type,
      date: isoDay(req.date),
      dateEnd: isoDay(req.dateEnd || req.date),
      time: req.time || '',
      reason: req.reason,
      gps: '',
      emergency: req.emergency,
    })
    setEditingId(req.dbId)
    setShowForm(true)
  }

  const submitRequest = async (e) => {
    e.preventDefault()
    if (submitting) return
    const meta = requestTypeMeta(form.type)
    const payload = {
      type: form.type,
      request_date: form.date,
      request_date_end: meta.showDateRange ? (form.dateEnd || form.date) : form.date,
      request_time: meta.showTime && form.time ? form.time : null,
      reason: form.reason || 'No reason provided.',
      is_emergency: form.emergency,
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

  const updateStatus = async (req, status) => {
    try {
      const updated = await permissionRequestService.updateStatus(req.dbId, { status: status.toLowerCase() })
      const mapped = mapApiRequest(updated)
      setSelected(mapped)
      notify(`Request ${status.toLowerCase()}.`)
      await load()
    } catch (err) {
      notify(apiError(err), false)
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
                onClick={() => setShowTypePicker(true)}
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
                    const canEdit = canSubmit && isOwn && req.status === 'Pending'
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
              canSubmit={canSubmit}
              employeeId={employeeId}
              onClose={() => setSelected(null)}
              onStatus={updateStatus}
              onEdit={openEdit}
              onDelete={deleteRequest}
            />
          )}
        </div>
      </div>

      {/* ══════════════ MOBILE ═══════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Mobile detail overlay */}
        {showMobileDetail && selected && (
          <MobileDetailSheet
            req={selected}
            canApprove={canApprove}
            canSubmit={canSubmit}
            employeeId={employeeId}
            onClose={() => setShowMobileDetail(false)}
            onStatus={updateStatus}
            onEdit={openEdit}
            onDelete={deleteRequest}
          />
        )}

        {/* Type picker sheet */}
        {showTypePicker && (
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

        {/* Overview / My Requests tabs */}
        <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {['overview', 'my'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMobileTab(t)}
              className={clsx(
                'flex-1 rounded-lg py-2 text-sm font-semibold transition',
                mobileTab === t
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400',
              )}
            >
              {t === 'overview' ? 'Overview' : 'My Requests'}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {mobileTab === 'overview' && (
          <div className="space-y-4">
            {/* Summary cards 2×2 + total */}
            <div className="grid grid-cols-2 gap-3">
              {stats.cats.map(({ label, count, pending }) => (
                <MobileStatCard key={label} label={label} count={count} pending={pending} />
              ))}
              <MobileStatCard label="Total Requests" count={stats.total} pending={stats.totalPending} wide />
            </div>

            {/* New Request button */}
            {canSubmit && (
              <button
                type="button"
                onClick={() => setShowTypePicker(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition active:scale-[0.98]"
              >
                <Plus size={18} />
                New Request
              </button>
            )}

            {/* Recent Requests */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-slate-900 dark:text-white">Recent Requests</p>
                <button type="button" onClick={() => setMobileTab('my')} className="text-xs font-bold text-emerald-600">View All</button>
              </div>
              <div className="space-y-2">
                {loading && <p className="py-4 text-center text-sm text-slate-400">Loading…</p>}
                {recentRequests.map((req) => (
                  <MobileRequestRow key={req.dbId} req={req} onPress={() => selectRow(req)} />
                ))}
                {!loading && recentRequests.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">No requests yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Requests tab */}
        {mobileTab === 'my' && (
          <div className="space-y-4">
            {/* Status filter tabs */}
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
        )}

        {/* Mobile FAB */}
        {canSubmit && (
          <button
            type="button"
            onClick={() => setShowTypePicker(true)}
            className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/25 transition active:scale-95"
            aria-label="New request"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* ── Request form modal (shared) ─────────────────────────────────── */}
      {showForm && (
        <RequestFormModal
          form={form}
          setForm={setForm}
          isEdit={Boolean(editingId)}
          submitting={submitting}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSubmit={submitRequest}
        />
      )}
    </div>
  )
}

// ─── Desktop: stat card ──────────────────────────────────────────────────────

function DesktopStatCard({ label, count, pending, total }) {
  const ICONS = {
    'Leave Requests':      { icon: CalendarDays, bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400' },
    'Permission Requests': { icon: FileText,     bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400' },
    'Outdoor Work':        { icon: SlidersHorizontal, bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' },
    'Sick Leave':          { icon: XCircle,      bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400' },
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

function DesktopDetailPanel({ req, canApprove, canSubmit, employeeId, onClose, onStatus, onEdit, onDelete }) {
  const tc = typeColor(req.type)
  const meta = requestTypeMeta(req.type)
  const Icon = meta.icon
  const isOwn = req.employeeId === employeeId
  const canEdit = canSubmit && isOwn && req.status === 'Pending'

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
  { id: 'Leave Request',      label: 'Leave Request',      desc: 'Request time off for vacation, personal or other reasons.' },
  { id: 'Request Permission', label: 'Permission Request', desc: 'Request permission for personal work or other activities.' },
  { id: 'Outdoor Work',       label: 'Outdoor Work Request', desc: 'Request to work from outdoor location.' },
  { id: 'Sick Leave',         label: 'Sick Leave',         desc: 'Request sick leave due to illness.' },
  { id: 'Custom Request',     label: 'Custom Request',     desc: 'Request for other types that are not listed.' },
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

function MobileDetailSheet({ req, canApprove, canSubmit, employeeId, onClose, onStatus, onEdit, onDelete }) {
  const tc = typeColor(req.type)
  const meta = requestTypeMeta(req.type)
  const Icon = meta.icon
  const isOwn = req.employeeId === employeeId
  const canEdit = canSubmit && isOwn && req.status === 'Pending'

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

function ActionBtn({ label, onClick, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={clsx(
        'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition',
        danger
          ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
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
