import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  CircleDollarSign,
  Clock,
  FileText,
  HardDrive,
  Hammer,
  Pencil,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import AssignPermissionTypeModal, { PERM_COLORS, EMPTY_PERM_FORM } from '../components/settings/AssignPermissionTypeModal'

// ── Helper text ───────────────────────────────────────────────────────────────
function Helper({ text }) {
  return <p className="mt-1.5 text-xs text-slate-400">{text}</p>
}

// ── Shared icon-left + optional right badge field ─────────────────────────────
function IconField({ icon: Icon, badge, children }) {
  return (
    <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
        <Icon size={20} className="shrink-0 text-emerald-500" />
        {children}
      </div>
      {badge && (
        <div className="border-l border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">{badge}</span>
        </div>
      )}
    </div>
  )
}

// ── Limit type label helper ───────────────────────────────────────────────────
function limitLabel(limitType) {
  if (limitType === 'per_day')   return 'per day'
  if (limitType === 'per_month') return 'per month'
  if (limitType === 'per_year')  return 'per year'
  return limitType ?? '—'
}

function durationControlLabel(control) {
  if (control === 'single_day') return 'Single Day'
  if (control === 'multiple_day') return 'Multiple Day'
  if (control === 'hours') return 'Hours'
  return 'Any Duration'
}


// ── Main page ─────────────────────────────────────────────────────────────────
function assignmentLabel(item) {
  const employeeCount = (item.employeeIds ?? item.employee_ids ?? []).length
  const scheduleCount = (item.scheduleIds ?? item.schedule_ids ?? []).length
  if (!employeeCount && !scheduleCount) return 'Assigned to everyone'
  return [
    scheduleCount ? `${scheduleCount} schedule${scheduleCount === 1 ? '' : 's'}` : null,
    employeeCount ? `${employeeCount} employee${employeeCount === 1 ? '' : 's'}` : null,
  ].filter(Boolean).join(' + ')
}

export default function PermissionTypesPage() {
  const [types, setTypes]       = useState([])
  const [assignmentOptions, setAssignmentOptions] = useState({ employees: [], workSchedules: [] })
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [notice, setNotice]     = useState({ text: '', ok: true })

  const notify = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3000)
  }

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/permission-types'),
      api.get('/permission-types/options').catch(() => ({ data: { employees: [], work_schedules: [] } })),
    ])
      .then(([typesRes, optionsRes]) => {
        setTypes(typesRes.data?.data ?? typesRes.data ?? [])
        setAssignmentOptions({
          employees: optionsRes.data?.employees ?? [],
          workSchedules: optionsRes.data?.work_schedules ?? optionsRes.data?.workSchedules ?? [],
        })
      })
      .catch(() => notify('Could not load permission types.', false))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async (form) => {
    if (!editing) return
    await api.put(`/permission-types/${editing.id}`, form)
    notify('Permission type settings updated.')
    load()
  }

  const handleSaveAndClose = async (form) => {
    await handleSave(form)
    setShowForm(false)
    setEditing(null)
  }

  const openEdit   = (item) => { setEditing(item); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditing(null) }

  return (
    <div>
      {/* ── Notice toast ───────────────────────────────────────────────────── */}
      {notice.text && (
        <div className={clsx(
          'fixed left-1/2 top-20 z-[100] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg',
          notice.ok ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white',
        )}>
          {notice.text}
        </div>
      )}

      {/* ══════════════ DESKTOP ══════════════════════════════════════════════ */}
      <div className="hidden lg:block space-y-5">

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Permission Types</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Request types are fixed. Edit only their rules, colors, and descriptions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={load}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="py-16 text-center text-sm text-slate-400">Loading…</div>
          )}

          {!loading && types.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-20 dark:border-slate-700 dark:bg-slate-900">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Hammer size={28} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Core request types are missing</p>
                <p className="mt-1 text-sm text-slate-400">Run migrations/seeders to restore the fixed request types.</p>
              </div>
            </div>
          )}

          {!loading && types.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-[minmax(260px,1.4fr)_130px_150px_170px_130px_120px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-black uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500">
                <span>Request Type</span>
                <span>Status</span>
                <span>Allowed</span>
                <span>Duration Rule</span>
                <span>Deduction</span>
                <span className="text-right">Action</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {types.map((item) => (
                  <PermissionTypeListRow
                    key={item.id}
                    item={item}
                    onEdit={() => openEdit(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ MOBILE ═══════════════════════════════════════════════ */}
      <div className="lg:hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Permission Types</h2>
          <button type="button" onClick={load} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <RefreshCw size={18} />
          </button>
        </div>

        {loading && <p className="py-10 text-center text-sm text-slate-400">Loading…</p>}

        {!loading && types.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-14 dark:border-slate-700 dark:bg-slate-900">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Hammer size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Core request types are missing</p>
          </div>
        )}

        {!loading && types.length > 0 && (
          <div className="space-y-3">
            {types.map((item) => (
              <MobilePermissionTypeRow
                key={item.id}
                item={item}
                onEdit={() => openEdit(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile-only form overlay ────────────────────────────────────────── */}
      {showForm && (
        <div>
          <AssignPermissionTypeModal
            initialData={editing}
            employees={assignmentOptions.employees}
            workSchedules={assignmentOptions.workSchedules}
            onClose={closeForm}
            onSave={handleSaveAndClose}
          />
        </div>
      )}
    </div>
  )
}

// ── Desktop card ──────────────────────────────────────────────────────────────
function PermissionTypeListRow({ item, onEdit }) {
  const allowed = item.allowedTimes ?? item.allowed_times ?? 0
  const limit = item.limitType ?? item.limit_type ?? 'per_month'
  const control = item.durationControl ?? item.duration_control ?? 'any'
  const maxHours = item.maxHours ?? item.max_hours ?? null
  const deduct = item.deductionAmount ?? item.deduction_amount ?? 0
  const isActive = item.isActive ?? item.is_active ?? true

  return (
    <div className="grid min-h-[88px] grid-cols-[minmax(260px,1.4fr)_130px_150px_170px_130px_120px] items-center gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="h-11 w-11 shrink-0 rounded-lg shadow-sm" style={{ backgroundColor: item.color || '#9ca3af' }} />
        <span className="min-w-0">
          <span className="block truncate font-black text-slate-900 dark:text-white">{item.name}</span>
          <span className="mt-1 block truncate text-xs font-medium text-slate-400">{item.description || 'Fixed request type'}</span>
          <span className="mt-1 block truncate text-xs font-bold text-emerald-600 dark:text-emerald-400">{assignmentLabel(item)}</span>
        </span>
      </div>

      <div>
        <span className={clsx(
          'inline-flex rounded-lg px-3 py-1.5 text-xs font-black',
          isActive
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        )}>
          {isActive ? 'On' : 'Off'}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
        <Clock size={15} className="text-emerald-500" />
        {allowed}x {limitLabel(limit)}
      </div>

      <div>
        <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {durationControlLabel(control)}
          {control === 'hours' && maxHours ? `, max ${Number(maxHours).toFixed(2)}h` : ''}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
        <CircleDollarSign size={15} className="text-emerald-500" />
        ${Number(deduct).toFixed(2)}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>
    </div>
  )
}

function PermissionTypeCard({ item, onEdit }) {
  const allowed = item.allowedTimes ?? item.allowed_times ?? 0
  const limit   = item.limitType   ?? item.limit_type   ?? 'per_month'
  const control = item.durationControl ?? item.duration_control ?? 'any'
  const maxHours = item.maxHours ?? item.max_hours ?? null
  const deduct  = item.deductionAmount ?? item.deduction_amount ?? 0
  const isActive = item.isActive ?? item.is_active ?? true

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Color bar */}
      <div className="h-2 w-full rounded-t-2xl" style={{ backgroundColor: item.color || '#9ca3af' }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Color circle + name */}
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 shrink-0 rounded-full shadow-sm"
            style={{ backgroundColor: item.color || '#9ca3af' }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-900 dark:text-white">{item.name}</p>
            {item.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{item.description}</p>
            )}
            <span className={clsx(
              'mt-2 inline-flex rounded-lg px-2.5 py-1 text-xs font-black',
              isActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
            )}>
              {isActive ? 'On' : 'Off'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 dark:bg-slate-950">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Clock size={13} className="text-emerald-500" />
            {allowed}× {limitLabel(limit)}
          </span>
          <span className="text-slate-200 dark:text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CircleDollarSign size={13} className="text-emerald-500" />
            Deduct: ${Number(deduct).toFixed(2)}
          </span>
        </div>
        <div className="rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {durationControlLabel(control)}
          {control === 'hours' && maxHours ? `, max ${Number(maxHours).toFixed(2)} hour(s)` : ''}
        </div>
        <div className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          Approval Required
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Pencil size={14} /> Edit Settings
          </button>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
            <HardDrive size={14} /> Fixed
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Mobile row ────────────────────────────────────────────────────────────────
function MobilePermissionTypeRow({ item, onEdit }) {
  const allowed = item.allowedTimes ?? item.allowed_times ?? 0
  const limit   = item.limitType   ?? item.limit_type   ?? 'per_month'
  const control = item.durationControl ?? item.duration_control ?? 'any'
  const maxHours = item.maxHours ?? item.max_hours ?? null
  const deduct  = item.deductionAmount ?? item.deduction_amount ?? 0
  const isActive = item.isActive ?? item.is_active ?? true

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Color circle */}
      <div
        className="h-11 w-11 shrink-0 rounded-full shadow-sm"
        style={{ backgroundColor: item.color || '#9ca3af' }}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-slate-900 dark:text-white">{item.name}</p>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {allowed}× {limitLabel(limit)}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <CircleDollarSign size={11} /> ${Number(deduct).toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {durationControlLabel(control)}{control === 'hours' && maxHours ? `, max ${Number(maxHours).toFixed(2)}h` : ''}
        </p>
        <p className="text-xs font-semibold text-slate-400">{assignmentLabel(item)}</p>
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Approval Required</p>
        <span className={clsx(
          'mt-1 inline-flex w-fit rounded-lg px-2.5 py-1 text-xs font-black',
          isActive
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        )}>
          {isActive ? 'On' : 'Off'}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Pencil size={15} />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
          <HardDrive size={15} />
        </div>
      </div>
    </div>
  )
}

// ── Desktop inline form ───────────────────────────────────────────────────────
function DesktopPermissionTypeForm({ initialData, onClose, onSave }) {
  const isFixedType = Boolean(initialData)
  const [form, setForm] = useState(
    initialData ? {
      name:            initialData.name            || '',
      allowedTimes:    initialData.allowedTimes    ?? initialData.allowed_times    ?? 1,
      limitType:       initialData.limitType       ?? initialData.limit_type       ?? 'per_month',
      durationControl: initialData.durationControl ?? initialData.duration_control ?? 'any',
      maxHours:        initialData.maxHours        ?? initialData.max_hours        ?? '',
      deductionAmount: initialData.deductionAmount ?? initialData.deduction_amount ?? 0,
      color:           initialData.color           || '#f59e0b',
      description:     initialData.description     || '',
    } : { ...EMPTY_PERM_FORM },
  )
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Hammer size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Edit Request Type Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">The request type name is fixed. Update only rules and display details.</p>
          </div>
        </div>
      </div>

      {/* 2-column layout: fields left, preview right */}
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">

        {/* ── Left: fields ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Permission Type Name <span className="text-rose-500">*</span>
            </label>
            <div className={clsx(
              'flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition',
              errors.name
                ? 'border-rose-400 bg-rose-50/40 dark:border-rose-700 dark:bg-rose-950/20'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950',
            )}>
              <FileText size={20} className="shrink-0 text-emerald-500" />
                <input
                  type="text"
                  placeholder="e.g. Late Check In"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  readOnly={isFixedType}
                  className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 read-only:cursor-not-allowed read-only:text-slate-500 dark:text-white dark:read-only:text-slate-400"
                />
              {errors.name && <AlertCircle size={18} className="shrink-0 text-rose-500" />}
            </div>
            {errors.name
              ? <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.name}</p>
                : <Helper text="This is a fixed request type. Users cannot add, delete, or rename request types." />
            }
          </div>

          {/* Allowed Times */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Allowed Times <span className="text-rose-500">*</span>
            </label>
            <IconField icon={Clock} badge="Time(s)">
              <input
                type="number"
                min="0"
                value={form.allowedTimes}
                onChange={(e) => set('allowedTimes', Number(e.target.value))}
                className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none dark:text-white"
              />
            </IconField>
            <Helper text="How many times employees can use this permission before deduction applies." />
          </div>

          {/* Limit Type */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Limit Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'per_day',   label: 'Per Day'   },
                { id: 'per_month', label: 'Per Month' },
                { id: 'per_year',  label: 'Per Year'  },
              ].map((opt) => {
                const sel = form.limitType === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => set('limitType', opt.id)}
                    className={clsx(
                      'flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition',
                      sel
                        ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950',
                    )}
                  >
                    <CalendarDays size={20} className={sel ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                    <span className={clsx('flex-1 text-sm font-bold',
                      sel ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300')}>
                      {opt.label}
                    </span>
                    <span className={clsx(
                      'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition',
                      sel ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600',
                    )}>
                      {sel && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </button>
                )
              })}
            </div>
            <Helper text="Choose whether the allowed times limit resets daily or monthly." />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Request Duration Control
            </label>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                { id: 'any', label: 'Any' },
                { id: 'single_day', label: 'Single Day' },
                { id: 'multiple_day', label: 'Multiple Day' },
                { id: 'hours', label: 'Hours' },
              ].map((opt) => {
                const sel = form.durationControl === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => set('durationControl', opt.id)}
                    className={clsx(
                      'rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-bold transition',
                      sel
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300',
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <Helper text="For Late Check In, choose Hours so employees must submit a start and end time." />
          </div>

          {form.durationControl === 'hours' && (
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
                Max Hours
              </label>
              <IconField icon={Clock} badge="Hour(s)">
                <input
                  type="number"
                  min="0.25"
                  max="24"
                  step="0.25"
                  value={form.maxHours}
                  onChange={(e) => set('maxHours', e.target.value)}
                  className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none dark:text-white"
                  placeholder="e.g. 2"
                />
              </IconField>
              <Helper text="Example: set 2 to block late requests longer than 2 hours." />
            </div>
          )}

          {/* Deduction Amount */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Deduction Amount <span className="text-rose-500">*</span>
            </label>
            <IconField icon={CircleDollarSign} badge="$">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.deductionAmount}
                onChange={(e) => set('deductionAmount', Number(e.target.value))}
                className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none dark:text-white"
              />
            </IconField>
            <Helper text="Amount deducted from salary when usage exceeds the allowed limit." />
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Color <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PERM_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set('color', c.hex)}
                  className={clsx(
                    'grid h-14 w-14 place-items-center rounded-2xl border-2 transition active:scale-95',
                    form.color === c.hex
                      ? 'border-emerald-500 dark:border-emerald-400'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                  )}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full"
                    style={{ backgroundColor: c.hex }}
                  >
                    {form.color === c.hex && (
                      <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <Helper text="Choose a color to represent this permission type." />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">Description</label>
            <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-slate-950">
              <FileText size={20} className="mt-0.5 shrink-0 text-emerald-500" />
              <textarea
                placeholder="Describe how this permission type works..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                maxLength={500}
                rows={4}
                className="flex-1 resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>
            <div className="mt-1.5 flex items-start justify-between gap-2">
              <Helper text="Provide a short description of this permission type and how it works." />
              <span className="shrink-0 text-xs text-slate-400">{(form.description || '').length}/500</span>
            </div>
          </div>
        </div>

        {/* ── Right: preview + actions ── */}
        <div className="flex flex-col gap-4">
          {/* Preview card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {/* Color bar */}
            <div className="h-2 w-full" style={{ backgroundColor: form.color || '#9ca3af' }} />
            <div className="p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Preview</p>
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 shrink-0 rounded-full shadow-sm"
                  style={{ backgroundColor: form.color || '#9ca3af' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900 dark:text-white">
                    {form.name.trim() || 'Permission Type Name'}
                  </p>
                  {form.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{form.description}</p>
                  )}
                </div>
              </div>

              {/* Stats preview */}
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 dark:bg-slate-950">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Clock size={13} className="text-emerald-500" />
                  {form.allowedTimes}× {limitLabel(form.limitType)}
                </span>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <CircleDollarSign size={13} className="text-emerald-500" />
                  ${Number(form.deductionAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                {durationControlLabel(form.durationControl)}
                {form.durationControl === 'hours' && form.maxHours ? `, max ${Number(form.maxHours).toFixed(2)} hour(s)` : ''}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Action buttons */}
          <div className="grid grid-cols-[1fr_1.7fr] gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-rose-300 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/20"
            >
              <XCircle size={18} /> Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <HardDrive size={18} />
              {saving ? 'Saving…' : 'Save Permission Type'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
