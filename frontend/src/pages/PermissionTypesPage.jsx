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
  Plus,
  RefreshCw,
  Trash2,
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
  return limitType ?? '—'
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PermissionTypesPage() {
  const [types, setTypes]       = useState([])
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
    api.get('/permission-types')
      .then((res) => setTypes(res.data?.data ?? res.data ?? []))
      .catch(() => notify('Could not load permission types.', false))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async (form) => {
    if (editing) {
      await api.put(`/permission-types/${editing.id}`, form)
      notify('Permission type updated.')
    } else {
      await api.post('/permission-types', form)
      notify('Permission type created.')
    }
    load()
  }

  const handleSaveAndClose = async (form) => {
    await handleSave(form)
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this permission type?')) return
    try {
      await api.delete(`/permission-types/${id}`)
      notify('Deleted successfully.')
      load()
    } catch {
      notify('Could not delete.', false)
    }
  }

  const openCreate = () => { setEditing(null); setShowForm(true) }
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

        {/* Inline form */}
        {showForm && (
          <DesktopPermissionTypeForm
            initialData={editing}
            onClose={closeForm}
            onSave={handleSaveAndClose}
          />
        )}

        {/* List view */}
        <div className={showForm ? 'hidden' : 'space-y-5'}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Permission Types</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Define and manage custom permission types for employee requests.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <Plus size={16} /> New Type
              </button>
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
                <p className="font-semibold text-slate-700 dark:text-slate-200">No permission types yet</p>
                <p className="mt-1 text-sm text-slate-400">Create your first custom permission type.</p>
              </div>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <Plus size={16} /> Create First Type
              </button>
            </div>
          )}

          {!loading && types.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {types.map((item) => (
                <PermissionTypeCard
                  key={item.id}
                  item={item}
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}

              {/* Add new card */}
              <button
                type="button"
                onClick={openCreate}
                className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-slate-400 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
              >
                <Plus size={24} />
                <span className="text-sm font-semibold">Add New Type</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ MOBILE ═══════════════════════════════════════════════ */}
      <div className="lg:hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Permission Types</h2>
          <button
            type="button"
            onClick={openCreate}
            className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 transition active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>

        {loading && <p className="py-10 text-center text-sm text-slate-400">Loading…</p>}

        {!loading && types.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-14 dark:border-slate-700 dark:bg-slate-900">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Hammer size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No permission types yet</p>
            <button type="button" onClick={openCreate} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700">
              <Plus size={15} /> Create First
            </button>
          </div>
        )}

        {!loading && types.length > 0 && (
          <div className="space-y-3">
            {types.map((item) => (
              <MobilePermissionTypeRow
                key={item.id}
                item={item}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}

        {/* Mobile FAB */}
        <button
          type="button"
          onClick={openCreate}
          className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/25 transition active:scale-95"
          aria-label="New permission type"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* ── Mobile-only form overlay ────────────────────────────────────────── */}
      {showForm && (
        <div className="lg:hidden">
          <AssignPermissionTypeModal
            initialData={editing}
            onClose={closeForm}
            onSave={handleSaveAndClose}
          />
        </div>
      )}
    </div>
  )
}

// ── Desktop card ──────────────────────────────────────────────────────────────
function PermissionTypeCard({ item, onEdit, onDelete }) {
  const allowed = item.allowedTimes ?? item.allowed_times ?? 0
  const limit   = item.limitType   ?? item.limit_type   ?? 'per_month'
  const deduct  = item.deductionAmount ?? item.deduction_amount ?? 0

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

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Mobile row ────────────────────────────────────────────────────────────────
function MobilePermissionTypeRow({ item, onEdit, onDelete }) {
  const allowed = item.allowedTimes ?? item.allowed_times ?? 0
  const limit   = item.limitType   ?? item.limit_type   ?? 'per_month'
  const deduct  = item.deductionAmount ?? item.deduction_amount ?? 0

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
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="grid h-9 w-9 place-items-center rounded-xl border border-rose-200 text-rose-500 transition hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Desktop inline form ───────────────────────────────────────────────────────
function DesktopPermissionTypeForm({ initialData, onClose, onSave }) {
  const [form, setForm] = useState(
    initialData ? {
      name:            initialData.name            || '',
      allowedTimes:    initialData.allowedTimes    ?? initialData.allowed_times    ?? 1,
      limitType:       initialData.limitType       ?? initialData.limit_type       ?? 'per_month',
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
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              {initialData ? 'Edit Permission Type' : 'Add Permission Type'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {initialData ? 'Update this permission type.' : 'Create a new permission type for attendance and salary rules.'}
            </p>
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
                className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
              />
              {errors.name && <AlertCircle size={18} className="shrink-0 text-rose-500" />}
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
