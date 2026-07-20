import { useState } from 'react'
import {
  CalendarDays,
  CircleDollarSign,
  Clock,
  FileText,
  HardDrive,
  Hammer,
  Users,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'

// ── Colour palette ────────────────────────────────────────────────────────────
export const PERM_COLORS = [
  { id: 'red',    hex: '#ef4444' },
  { id: 'blue',   hex: '#3b82f6' },
  { id: 'green',  hex: '#22c55e' },
  { id: 'amber',  hex: '#f59e0b' },
  { id: 'purple', hex: '#a855f7' },
  { id: 'teal',   hex: '#14b8a6' },
  { id: 'gray',   hex: '#9ca3af' },
]

export const EMPTY_PERM_FORM = {
  name: '',
  allowedTimes: 1,
  limitType: 'per_month',
  durationControl: 'any',
  maxHours: '',
  deductionAmount: 0,
  color: '#f59e0b',
  description: '',
  isActive: true,
  employeeIds: [],
  scheduleIds: [],
}

// ── Shared field: icon-left + optional right badge ────────────────────────────
function IconField({ icon: Icon, badge, children }) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2">
        <Icon size={16} className="shrink-0 text-emerald-500" />
        {children}
      </div>
      {badge && (
        <div className="shrink-0 border-l border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{badge}</span>
        </div>
      )}
    </div>
  )
}

// ── Helper text ───────────────────────────────────────────────────────────────
function Helper({ text }) {
  return <p className="mt-1.5 text-xs text-slate-400">{text}</p>
}

// ── Main modal ────────────────────────────────────────────────────────────────
function normalizeIds(value) {
  if (!Array.isArray(value)) return []
  return value.map((id) => Number(id)).filter(Boolean)
}

function isCheckInOutType(name) {
  return ['Late Check In', 'Early Check Out'].includes(name)
}

function AssignmentChecks({ title, icon: Icon, emptyText, options, selectedIds, onChange, labelFor }) {
  const selected = new Set(selectedIds)
  const toggle = (id) => {
    const numericId = Number(id)
    onChange(selected.has(numericId)
      ? selectedIds.filter((item) => Number(item) !== numericId)
      : [...selectedIds, numericId])
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-950/60">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className="text-emerald-500" />
        <span className="text-sm font-bold text-slate-900 dark:text-white">{title}</span>
      </div>
      <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
        {options.length === 0 && (
          <p className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-400 dark:bg-slate-900">
            No options found.
          </p>
        )}
        {options.map((item) => {
          const id = Number(item.id)
          const checked = selected.has(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={clsx(
                'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition',
                checked
                  ? 'border-emerald-500 bg-white text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'border-transparent bg-white text-slate-600 hover:border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700',
              )}
            >
              <span className={clsx(
                'grid h-4 w-4 shrink-0 place-items-center rounded border',
                checked ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600',
              )}>
                {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-bold">{labelFor(item)}</span>
            </button>
          )
        })}
      </div>
      {selectedIds.length === 0 && <Helper text={emptyText} />}
    </div>
  )
}

export default function AssignPermissionTypeModal({ onClose, onSave, initialData = null, employees = [], workSchedules = [] }) {
  const isFixedType = Boolean(initialData)
  const [form, setForm] = useState(
    initialData ? {
      name:             initialData.name             || '',
      allowedTimes:     initialData.allowedTimes     ?? initialData.allowed_times     ?? 1,
      limitType:        initialData.limitType        ?? initialData.limit_type        ?? 'per_month',
      durationControl:  initialData.durationControl  ?? initialData.duration_control  ?? 'any',
      maxHours:         initialData.maxHours         ?? initialData.max_hours         ?? '',
      deductionAmount:  initialData.deductionAmount  ?? initialData.deduction_amount  ?? 0,
      color:            initialData.color            || '#f59e0b',
      description:      initialData.description      || '',
      isActive:         initialData.isActive         ?? initialData.is_active         ?? true,
      employeeIds:      normalizeIds(initialData.employeeIds ?? initialData.employee_ids),
      scheduleIds:      normalizeIds(initialData.scheduleIds ?? initialData.schedule_ids),
    } : EMPTY_PERM_FORM,
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
    if (isCheckInOutType(form.name) && (!form.maxHours || Number(form.maxHours) <= 0)) {
      errs.maxHours = 'Max hours is required'
    }
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    const payload = isCheckInOutType(form.name)
      ? { ...form, durationControl: 'hours', maxHours: Number(form.maxHours) }
      : form
    try { await onSave?.(payload); onClose?.() }
    catch { /* parent handles */ }
    finally { setSaving(false) }
  }

  return (
    /* backdrop (desktop) / full-screen (mobile) */
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-white dark:bg-slate-900 sm:items-center sm:bg-slate-950/60 sm:p-4 sm:backdrop-blur-sm">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900 sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl sm:shadow-2xl">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
          {/* mobile back */}
          <button type="button" onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* desktop close */}
          <button type="button" onClick={onClose}
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 sm:grid">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Hammer size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Request Type Settings
            </h2>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Request type names are fixed. Edit only rules and display details.
            </p>
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="grid gap-4 lg:grid-cols-2">

            {/* Permission Type Name */}
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Permission Type Name <span className="text-rose-500">*</span>
              </label>
              <div className={clsx(
                'flex items-center gap-2.5 rounded-lg border px-3 py-2 transition',
                errors.name
                  ? 'border-rose-400 bg-rose-50/40 dark:border-rose-700 dark:bg-rose-950/20'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950',
              )}>
                <FileText size={16} className="shrink-0 text-emerald-500" />
                <input
                  type="text"
                  placeholder="e.g. Late Check In"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  readOnly={isFixedType}
                  className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 read-only:cursor-not-allowed read-only:text-slate-500 dark:text-white dark:read-only:text-slate-400"
                />
              </div>
              {errors.name
                ? <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.name}</p>
                : <Helper text="This is a fixed request type. Users cannot add, delete, or rename request types." />
              }
            </div>

            {/* Status */}
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Status
              </label>
              <button
                type="button"
                onClick={() => set('isActive', !form.isActive)}
                className={clsx(
                  'flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition',
                  form.isActive
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950',
                )}
              >
                <span>
                  <span className={clsx(
                    'block text-sm font-bold',
                    form.isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300',
                  )}>
                    {form.isActive ? 'On' : 'Off'}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {form.isActive ? 'Employees can submit this request type.' : 'Employees cannot submit this request type.'}
                  </span>
                </span>
                <span className={clsx(
                  'relative h-6 w-11 shrink-0 rounded-full transition',
                  form.isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700',
                )}>
                  <span className={clsx(
                    'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition',
                    form.isActive ? 'left-6' : 'left-1',
                  )} />
                </span>
              </button>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Assign To
              </label>
              <div className="grid gap-3 lg:grid-cols-2">
                <AssignmentChecks
                  title="Work Schedules"
                  icon={CalendarDays}
                  options={workSchedules}
                  selectedIds={form.scheduleIds || []}
                  onChange={(ids) => set('scheduleIds', ids)}
                  emptyText="No schedule selected means every schedule can use this type unless employees are selected."
                  labelFor={(item) => `${item.schedule_name || item.name || 'Schedule'}${item.is_default ? ' (Default)' : ''}`}
                />
                <AssignmentChecks
                  title="Employees"
                  icon={Users}
                  options={employees}
                  selectedIds={form.employeeIds || []}
                  onChange={(ids) => set('employeeIds', ids)}
                  emptyText="No employee selected means every employee can use this type unless schedules are selected."
                  labelFor={(item) => `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.employee_code || `Employee #${item.id}`}
                />
              </div>
              <Helper text="Leave both lists empty for everyone. If one list has selected items, the user can submit when their employee or schedule matches." />
            </div>

            {/* Allowed Times */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
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
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Limit Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'per_day',   label: 'Per Day'   },
                  { id: 'per_month', label: 'Per Month' },
                ].map((opt) => {
                  const sel = form.limitType === opt.id
                  return (
                    <button key={opt.id} type="button" onClick={() => set('limitType', opt.id)}
                      className={clsx(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition',
                        sel
                          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950',
                      )}>
                      <CalendarDays size={16} className={sel ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                      <span className={clsx('flex-1 text-sm font-bold',
                        sel ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300')}>
                        {opt.label}
                      </span>
                      <span className={clsx(
                        'grid h-4 w-4 shrink-0 place-items-center rounded-full border transition',
                        sel ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600',
                      )}>
                        {sel && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <Helper text="Choose whether the allowed times limit resets daily or monthly." />
            </div>

            {isCheckInOutType(form.name) && (
              <div className="lg:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                  Duration Rule <span className="text-rose-500">*</span>
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
                {errors.maxHours ? (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.maxHours}</p>
                ) : (
                  <Helper text={form.name === 'Late Check In' ? 'Maximum hours allowed after the scheduled check-in time.' : 'Maximum hours allowed before the scheduled check-out time.'} />
                )}
              </div>
            )}

            {false && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Request Duration Control
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'any', label: 'Any' },
                  { id: 'single_day', label: 'Single Day' },
                  { id: 'multiple_day', label: 'Multiple Day' },
                  { id: 'hours', label: 'Hours' },
                ].map((opt) => {
                  const sel = form.durationControl === opt.id
                  return (
                    <button key={opt.id} type="button" onClick={() => set('durationControl', opt.id)}
                      className={clsx(
                        'rounded-lg border px-3 py-2 text-left text-sm font-bold transition',
                        sel
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300',
                      )}>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <Helper text="For Late Check In, choose Hours so employees submit a time range." />
            </div>
            )}

            {false && form.durationControl === 'hours' && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
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
                <Helper text="Example: set 2 to block requests longer than 2 hours." />
              </div>
            )}

            {/* Deduction Amount */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
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
              <Helper text="Amount that will be deducted from salary when usage exceeds the allowed limit." />
            </div>

            {/* Color */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Color <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PERM_COLORS.map((c) => (
                  <button key={c.id} type="button" onClick={() => set('color', c.hex)}
                    className={clsx(
                      'grid h-11 w-11 place-items-center rounded-lg border transition active:scale-95',
                      form.color === c.hex
                        ? 'border-emerald-500 dark:border-emerald-400'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                    )}>
                    <span className="grid h-7 w-7 place-items-center rounded-full" style={{ backgroundColor: c.hex }}>
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
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-white">
                Description
              </label>
              <div className="flex gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
                <FileText size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                <textarea
                  placeholder="Describe how this permission type works..."
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="flex-1 resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
              <div className="mt-1.5 flex items-start justify-between gap-2">
                <Helper text="Provide a short description of this permission type and how it works." />
                <span className="shrink-0 text-xs text-slate-400">{(form.description || '').length}/500</span>
              </div>
            </div>
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="shrink-0 border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-5">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
              <button type="button" onClick={onClose} disabled={saving}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200
                           text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60
                           dark:border-slate-700 dark:text-rose-400 dark:hover:bg-rose-950/20">
                <XCircle size={18} /> Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5
                           text-sm font-bold text-white shadow-lg shadow-emerald-600/25
                           transition hover:bg-emerald-700 disabled:opacity-60">
                <HardDrive size={18} />
                {saving ? 'Saving…' : 'Save Permission Type'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
