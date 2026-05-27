import { useState } from 'react'
import {
  CalendarDays,
  CircleDollarSign,
  Clock,
  FileText,
  HardDrive,
  Hammer,
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
  deductionAmount: 0,
  color: '#f59e0b',
  description: '',
}

// ── Shared field: icon-left + optional right badge ────────────────────────────
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

// ── Helper text ───────────────────────────────────────────────────────────────
function Helper({ text }) {
  return <p className="mt-1.5 text-xs text-slate-400">{text}</p>
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function AssignPermissionTypeModal({ onClose, onSave, initialData = null }) {
  const [form, setForm] = useState(
    initialData ? {
      name:             initialData.name             || '',
      allowedTimes:     initialData.allowedTimes     ?? initialData.allowed_times     ?? 1,
      limitType:        initialData.limitType        ?? initialData.limit_type        ?? 'per_month',
      deductionAmount:  initialData.deductionAmount  ?? initialData.deduction_amount  ?? 0,
      color:            initialData.color            || '#f59e0b',
      description:      initialData.description      || '',
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
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try { await onSave?.(form); onClose?.() }
    catch { /* parent handles */ }
    finally { setSaving(false) }
  }

  return (
    /* backdrop (desktop) / full-screen (mobile) */
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900
                    sm:items-center sm:justify-center sm:bg-slate-950/50 sm:p-4 sm:backdrop-blur-sm">
      <div className="flex w-full flex-col overflow-hidden
                      sm:max-w-lg sm:rounded-3xl sm:bg-white sm:shadow-2xl sm:dark:bg-slate-900">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-5">
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

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Hammer size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Permission Type' : 'Add Permission Type'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a new permission type for attendance and salary rules.
            </p>
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-6 px-5 pb-6">

            {/* Permission Type Name */}
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
                  className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
              {errors.name
                ? <p className="mt-1.5 text-xs font-semibold text-rose-500">{errors.name}</p>
                : <Helper text="Enter a clear name for this permission type." />
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
                ].map((opt) => {
                  const sel = form.limitType === opt.id
                  return (
                    <button key={opt.id} type="button" onClick={() => set('limitType', opt.id)}
                      className={clsx(
                        'flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition',
                        sel
                          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950',
                      )}>
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
              <Helper text="Amount that will be deducted from salary when usage exceeds the allowed limit." />
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
                Color <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PERM_COLORS.map((c) => (
                  <button key={c.id} type="button" onClick={() => set('color', c.hex)}
                    className={clsx(
                      'grid h-14 w-14 place-items-center rounded-2xl border-2 transition active:scale-95',
                      form.color === c.hex
                        ? 'border-emerald-500 dark:border-emerald-400'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                    )}>
                    <span className="grid h-9 w-9 place-items-center rounded-full" style={{ backgroundColor: c.hex }}>
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
              <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
                Description
              </label>
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

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
            <div className="grid grid-cols-[1fr_1.7fr] gap-3">
              <button type="button" onClick={onClose} disabled={saving}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-rose-300
                           text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60
                           dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/20">
                <XCircle size={18} /> Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600
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
