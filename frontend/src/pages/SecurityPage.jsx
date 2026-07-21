import { useEffect, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Cloud,
  Download,
  FileClock,
  FileText,
  Hammer,
  HardDrive,
  Mail,
  Map,
  MapPin,
  Pencil,
  Plus,
  QrCode,
  RefreshCcw,
  Gift,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Trash2,
  Wallet,
  Upload,
  Wifi,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { EmptyState } from '../components/shared/UI'
import AttendanceRulesSettings from '../components/settings/AttendanceRulesSettings'
import WorkScheduleSettings from '../components/settings/WorkScheduleSettings'
import TelegramNotificationSettings from '../components/settings/TelegramNotificationSettings'
import LateRulesSettings from '../components/settings/LateRulesSettings'
import BonusRulesSettings from '../components/settings/BonusRulesSettings'
import AssignPermissionTypeModal, { PERM_COLORS, EMPTY_PERM_FORM } from '../components/settings/AssignPermissionTypeModal'
import PermissionTypesPage from './PermissionTypesPage'

const settingsSections = [
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'attendance', label: 'Attendance Rules', icon: FileClock },
  { id: 'late-rules', label: 'Late Deduction Rules', icon: AlertTriangle },
  { id: 'bonus-rules', label: 'Bonus Rules', icon: Gift },
  { id: 'payroll', label: 'Payroll Settings', icon: Wallet },
  { id: 'schedule', label: 'Work Schedule', icon: CalendarDays },
  { id: 'permission-types', label: 'Permission Types', icon: Hammer },
  { id: 'locations', label: 'Office Locations', icon: MapPin },
  { id: 'gps', label: 'GPS & Tracking', icon: Wifi },
  { id: 'qr', label: 'QR Attendance', icon: QrCode },
  { id: 'telegram', label: 'Telegram Notifications', icon: Send },
  { id: 'email', label: 'Email Notifications', icon: Mail },
  { id: 'maps', label: 'Google Maps API', icon: Map },
  { id: 'r2', label: 'Cloudflare R2 Storage', icon: Cloud },
  { id: 'security', label: 'Security Settings', icon: ShieldCheck },
]

const SAVEABLE_SECTIONS = new Set(['general', 'gps', 'security'])
const STANDALONE_SECTIONS = new Set(['late-rules', 'bonus-rules', 'payroll', 'telegram', 'permission-types'])

export default function SecurityPage({ user, refresh }) {
  const [activeSection, setActiveSection] = useState('general')
  const [notice, setNotice] = useState({ text: '', ok: true })
  const [settings, setSettings] = useState({})
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [saving, setSaving] = useState(false)

  const active = settingsSections.find((section) => section.id === activeSection) || settingsSections[0]
  const filteredSections = settingsSections
  const isStandaloneSection = STANDALONE_SECTIONS.has(activeSection)

  const showNotice = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 2800)
  }

  useEffect(() => {
    api.get('/settings')
      .then((res) => setSettings(res.data || {}))
      .catch(() => showNotice('Could not load settings from server.', false))
      .finally(() => setLoadingSettings(false))
  }, [])

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  const saveSettings = async () => {
    if (!SAVEABLE_SECTIONS.has(activeSection)) {
      showNotice('This section saves automatically via its own controls.', true)
      return
    }
    setSaving(true)
    try {
      const res = await api.put('/settings', { settings })
      setSettings(res.data || settings)
      showNotice('Settings saved successfully.', true)
      refresh?.()
    } catch {
      showNotice('Failed to save settings. Check your connection.', false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Settings</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure attendance, tracking, integrations, permissions, and system security.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
            onClick={saveSettings}
            disabled={saving || loadingSettings}
            type="button"
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {notice.text && (
        <div className={clsx('rounded-lg border px-4 py-3 text-sm font-semibold',
          notice.ok
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
            : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200',
        )}>
          {notice.text}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Settings Menu</p>
          </div>
          <nav className="max-h-[calc(100vh-15rem)] overflow-y-auto p-2">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                className={clsx(
                  'flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition',
                  activeSection === section.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                )}
                onClick={() => setActiveSection(section.id)}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <section.icon size={18} />
                  {section.label}
                </span>
                <ChevronRight size={16} className={activeSection === section.id ? 'text-emerald-500' : 'text-slate-300'} />
              </button>
            ))}
            {filteredSections.length === 0 && (
              <p className="px-3 py-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">No settings found.</p>
            )}
          </nav>
        </aside>

        <section
          className={clsx(
            'min-w-0 overflow-hidden',
            isStandaloneSection
              ? 'bg-transparent'
              : 'rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
          )}
        >
          {!isStandaloneSection && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <active.icon size={21} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">{active.label}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage {active.label.toLowerCase()} for the attendance platform.</p>
                </div>
              </div>
            </div>
          )}

          <div className={clsx(isStandaloneSection ? '' : 'space-y-5 p-5')}>
            {loadingSettings && !isStandaloneSection
              ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading settings...</p>
              : renderSettingsContent(activeSection, showNotice, settings, updateSetting, refresh, user)}
          </div>
        </section>
      </div>
    </div>
  )
}

function renderSettingsContent(section, notify, settings, updateSetting, refresh, user) {
  const sp = { settings, onUpdate: updateSetting }
  switch (section) {
    case 'general':    return <GeneralSettings {...sp} onSettingsSaved={refresh} />
    case 'attendance': return <AttendanceRulesSettings />
    case 'late-rules': return <LateRulesSettings />
    case 'bonus-rules': return <BonusRulesSettings />
    case 'payroll': return <PayrollSettingsPanel user={user} notify={notify} />
    case 'schedule':   return <WorkScheduleSettings />
    case 'locations':  return <OfficeLocations notify={notify} />
    case 'gps':        return <GpsTracking {...sp} />
    case 'qr':         return <QrAttendance notify={notify} />
    case 'permission-types': return <PermissionTypesPage />
    case 'telegram':   return <TelegramNotificationSettings notify={notify} />
    case 'email':      return <EmailNotifications />
    case 'maps':       return <GoogleMapsSettings />
    case 'r2':         return <CloudflareR2Settings />
    case 'security':   return <SecuritySettings {...sp} />
    default:           return <GeneralSettings {...sp} />
  }
}

// ── Permission Types Settings ────────────────────────────────────────────────

function PermissionTypesSettings() {
  const [types, setTypes]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [notice, setNotice]   = useState({ text: '', ok: true })

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this permission type?')) return
    try {
      await api.delete(`/permission-types/${id}`)
      notify('Deleted.')
      load()
    } catch { notify('Could not delete.', false) }
  }

  const openCreate = () => { setEditing(null); setShowForm(true) }
  const openEdit   = (item) => { setEditing(item); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditing(null) }

  const handleSaveAndClose = async (form) => {
    await handleSave(form)
    closeForm()
  }

  return (
    <div className="space-y-4">

      {/* ── Desktop: inline form (replaces list) ─────────────────────────── */}
      {showForm && (
        <div className="hidden lg:block">
          <PermissionTypeFormInline
            initialData={editing}
            onClose={closeForm}
            onSave={handleSaveAndClose}
          />
        </div>
      )}

      {/* ── List view (hidden on desktop when form is open) ──────────────── */}
      <div className={clsx(showForm ? 'lg:hidden' : '', 'space-y-4')}>

        {/* Header */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Hammer size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Permission Types</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Define custom permission types for requests.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Type</span>
          </button>
        </div>

        {/* Notice */}
        {notice.text && (
          <div className={clsx(
            'rounded-lg border px-4 py-3 text-sm font-semibold',
            notice.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200',
          )}>{notice.text}</div>
        )}

        {/* Type list */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loading && <p className="py-10 text-center text-sm text-slate-400">Loading…</p>}
          {!loading && types.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-14">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Hammer size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No permission types yet.</p>
              <button type="button" onClick={openCreate} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700">
                <Plus size={15} /> Create First Type
              </button>
            </div>
          )}
          {!loading && types.length > 0 && (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {types.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-11 w-11 shrink-0 rounded-full shadow-sm" style={{ backgroundColor: item.color || '#9ca3af' }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {item.allowedTimes ?? item.allowed_times ?? 0}× {limitLabel(item.limitType ?? item.limit_type)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="flex items-center gap-1">
                        <CircleDollarSign size={11} /> ${Number(item.deductionAmount ?? item.deduction_amount ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => openEdit(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-500 transition hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/30" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Mobile-only: full-screen form overlay ────────────────────────── */}
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

// ── Desktop inline form for Permission Type ───────────────────────────────────

function PermissionTypeFormInline({ initialData, onClose, onSave }) {
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

  const limitLabel = (lt) => lt === 'per_day' ? 'per day' : lt === 'per_year' ? 'per year' : 'per month'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Hammer size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              {initialData ? 'Edit Permission Type' : 'Add Permission Type'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {initialData ? 'Update this permission type.' : 'Create a new permission type for attendance and salary rules.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_300px]">

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
              : <p className="mt-1.5 text-xs text-slate-400">Enter a clear name for this permission type.</p>
            }
          </div>

          {/* Allowed Times */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Allowed Times <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
              <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
                <Clock size={20} className="shrink-0 text-emerald-500" />
                <input
                  type="number"
                  min="0"
                  value={form.allowedTimes}
                  onChange={(e) => set('allowedTimes', Number(e.target.value))}
                  className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none dark:text-white"
                />
              </div>
              <div className="border-l border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-700 dark:bg-slate-800">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">Time(s)</span>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">How many times employees can use this permission before deduction applies.</p>
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
            <p className="mt-1.5 text-xs text-slate-400">Choose whether the allowed times limit resets daily or monthly.</p>
          </div>

          {/* Deduction Amount */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
              Deduction Amount <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
              <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
                <CircleDollarSign size={20} className="shrink-0 text-emerald-500" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.deductionAmount}
                  onChange={(e) => set('deductionAmount', Number(e.target.value))}
                  className="flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none dark:text-white"
                />
              </div>
              <div className="border-l border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-700 dark:bg-slate-800">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">$</span>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Amount deducted from salary when usage exceeds the allowed limit.</p>
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
            <p className="mt-1.5 text-xs text-slate-400">Choose a color to represent this permission type.</p>
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
              <p className="text-xs text-slate-400">Provide a short description of this permission type and how it works.</p>
              <span className="shrink-0 text-xs text-slate-400">{(form.description || '').length}/500</span>
            </div>
          </div>
        </div>

        {/* ── Right: preview + actions ── */}
        <div className="flex flex-col gap-4">
          {/* Preview card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="h-2 w-full" style={{ backgroundColor: form.color || '#9ca3af' }} />
            <div className="p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Preview</p>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-full shadow-sm" style={{ backgroundColor: form.color || '#9ca3af' }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900 dark:text-white">
                    {form.name.trim() || 'Permission Type Name'}
                  </p>
                  {form.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{form.description}</p>
                  )}
                </div>
              </div>
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
            <button type="button" onClick={onClose} disabled={saving}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-rose-300 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/20">
              <XCircle size={17} /> Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60">
              <HardDrive size={17} />
              {saving ? 'Saving…' : 'Save Permission Type'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function GeneralSettings({ settings, onUpdate, onSettingsSaved }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <SettingsCard title="Company Profile" description="Basic company identity and localization.">
        <Field label="Company Name" placeholder="Company name" settingKey="company_name" settings={settings} onUpdate={onUpdate} />
        <UploadField
          label="Company Logo"
          currentUrl={settings.company_logo_url || ''}
          onUploaded={(url) => {
            onUpdate('company_logo_url', url)
            onSettingsSaved?.()
          }}
        />
        <SelectField label="Timezone" options={['Asia/Bangkok', 'UTC', 'Asia/Phnom_Penh']} settingKey="timezone" settings={settings} onUpdate={onUpdate} />
        <SelectField label="Language" options={['English', 'Khmer', 'Thai']} settingKey="language" settings={settings} onUpdate={onUpdate} />
      </SettingsCard>
      <SettingsCard title="Display Preferences" description="Regional display and default interface behavior.">
        <SelectField label="Currency" options={['USD', 'KHR', 'THB']} settingKey="currency" settings={settings} onUpdate={onUpdate} />
        <SelectField label="Date Format" options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} settingKey="date_format" settings={settings} onUpdate={onUpdate} />
        <SelectField label="Theme Mode" options={['System', 'Light', 'Dark']} settingKey="theme_mode" settings={settings} onUpdate={onUpdate} />
      </SettingsCard>
    </div>
  )
}


function OfficeLocations({ notify }) {
  return (
    <SettingsCard title="Office Locations" description="Office branches used for GPS attendance validation.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Branch Name" placeholder="Branch name" />
        <Field label="Radius" suffix="meters" type="number" placeholder="100" />
        <Field label="Latitude" placeholder="Latitude" />
        <Field label="Longitude" placeholder="Longitude" />
      </div>
      <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-200 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/30" onClick={() => notify('Office location row is ready. Connect backend endpoint to create more branches.')} type="button">
        <MapPin size={16} />
        Add Office Location
      </button>
    </SettingsCard>
  )
}

function GpsTracking({ settings, onUpdate }) {
  return (
    <SettingsCard title="GPS & Tracking" description="Control location tracking and fake GPS protection.">
      <div className="grid gap-3 md:grid-cols-2">
        <ToggleRow title="Enable Current Location Tracking" description="Capture current location during attendance events." settingKey="gps_location_tracking" settings={settings} onUpdate={onUpdate} />
        <ToggleRow title="Fake GPS Detection" description="Flag suspicious GPS accuracy and movement." settingKey="gps_fake_detection" settings={settings} onUpdate={onUpdate} />
        <ToggleRow title="Background Tracking" description="Allow route points during outdoor sales visits." settingKey="gps_background_tracking" settings={settings} onUpdate={onUpdate} />
        <ToggleRow title="Live Location Tracking" description="Show latest employee location on dashboard map." settingKey="gps_live_tracking" settings={settings} onUpdate={onUpdate} />
      </div>
    </SettingsCard>
  )
}

function QrAttendance({ notify }) {
  const [qrSeed, setQrSeed] = useState(() => Date.now())

  const generateQr = () => {
    setQrSeed(Date.now())
    notify('New QR preview generated locally.')
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <SettingsCard title="QR Attendance" description="Configure rotating QR codes for office attendance.">
        <ToggleRow title="Enable QR Attendance" description="Require QR scan before office check-in." enabled />
        <Field label="QR Refresh Time" suffix="seconds" type="number" placeholder="60" />
        <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700" onClick={generateQr} type="button">
          <RefreshCcw size={16} />
          Generate QR
        </button>
      </SettingsCard>
      <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
        <div className="grid h-36 w-36 place-items-center rounded-lg bg-white shadow-sm dark:bg-slate-900">
          <QrCode className="text-slate-800 dark:text-slate-100" size={92} key={qrSeed} />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">QR Preview</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Code #{String(qrSeed).slice(-6)}</p>
      </div>
    </div>
  )
}

function EmailNotifications() {
  return (
    <SettingsCard title="Email Notifications" description="Configure email delivery for reports and important alerts.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SMTP Host" placeholder="smtp.your-domain.com" />
        <Field label="SMTP Port" placeholder="587" />
        <Field label="Sender Email" placeholder="noreply@your-domain.com" />
        <Field label="Sender Name" placeholder="Sender name" />
      </div>
      <ToggleRow title="Send Daily Attendance Summary" description="Email managers every evening." enabled />
    </SettingsCard>
  )
}

function GoogleMapsSettings() {
  return (
    <SettingsCard title="Google Maps API" description="Power live maps, route history, and GPS radius preview.">
      <Field label="Google Maps API Key" type="password" placeholder="API key" />
      <ToggleRow title="Route Tracking" description="Draw employee outdoor sales route history." enabled />
      <div className="grid min-h-44 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950">
        GPS Radius Preview
      </div>
    </SettingsCard>
  )
}

function CloudflareR2Settings() {
  return (
    <SettingsCard title="Cloudflare R2 Storage" description="Store attendance selfies and customer visit photos.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Access Key" type="password" placeholder="Access key" />
        <Field label="Secret Key" type="password" placeholder="Secret key" />
        <Field label="Bucket Name" placeholder="Bucket name" />
        <Field label="Public URL" placeholder="https://..." />
        <Field label="Upload Limit" suffix="MB" type="number" placeholder="4" />
      </div>
    </SettingsCard>
  )
}

function SecuritySettings({ settings, onUpdate }) {
  return (
    <SettingsCard title="Security Settings" description="Login protection, sessions, and device security.">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="JWT Expiration" suffix="minutes" type="number" placeholder="120" settingKey="jwt_expiration" settings={settings} onUpdate={onUpdate} />
        <Field label="Login Attempt Limit" type="number" placeholder="5" settingKey="login_attempt_limit" settings={settings} onUpdate={onUpdate} />
        <Field label="Session Timeout" suffix="minutes" type="number" placeholder="60" settingKey="session_timeout" settings={settings} onUpdate={onUpdate} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ToggleRow title="Device Restriction" description="Limit login to approved devices." settingKey="device_restriction" settings={settings} onUpdate={onUpdate} />
        <ToggleRow title="Two Factor Authentication" description="Require second-factor login for admins." settingKey="two_factor_auth" settings={settings} onUpdate={onUpdate} />
      </div>
    </SettingsCard>
  )
}

function RolesPermissions() {
  return (
    <SettingsCard title="Roles & Permissions" description="Manage roles and permissions for your organization.">
      <EmptyState text="Use the Users & Roles page to manage role permissions." />
    </SettingsCard>
  )
}

function BackupRestore({ notify }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <ActionCard icon={Download} title="Backup Database" description="Download the latest database backup." action="Backup Now" onAction={() => notify('Backup request is ready. Backend backup endpoint is needed to download a real file.')} />
      <ActionCard icon={Upload} title="Restore Database" description="Upload and restore a database backup." action="Restore" onAction={() => notify('Restore request is ready. Backend restore endpoint is needed before upload can run.')} />
      <SettingsCard title="Auto Backup Schedule" description="Automate recurring database backups.">
        <SelectField label="Schedule" placeholder="Select schedule" options={['Daily at midnight', 'Weekly', 'Monthly', 'Disabled']} />
      </SettingsCard>
    </div>
  )
}

function SystemLogs() {
  return (
    <SettingsCard title="System Logs" description="Monitor system activity, errors, and API usage.">
      <EmptyState text="No log entries yet. Logs will appear when the logging API is connected." />
    </SettingsCard>
  )
}

function AboutSystem() {
  return (
    <SettingsCard title="About System" description="Employee Attendance & Outdoor Sales Tracking System.">
      <div className="grid gap-4 md:grid-cols-3">
        <InfoTile label="Version" value="1.0.0" />
        <InfoTile label="Backend" value="Laravel API" />
        <InfoTile label="Frontend" value="React + Tailwind" />
      </div>
      <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
        <p className="font-semibold">System ready for attendance, GPS tracking, reports, notifications, and storage integrations.</p>
      </div>
    </SettingsCard>
  )
}

function SettingsCard({ title, description, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5">
        <h4 className="text-base font-bold text-slate-950 dark:text-white">{title}</h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, type = 'text', defaultValue = '', value, onChange, placeholder = '', suffix, settingKey, settings, onUpdate }) {
  const isControlledBySetting = settingKey !== undefined && settings !== undefined
  const inputProps = isControlledBySetting
    ? { value: settings[settingKey] ?? defaultValue, onChange: (e) => onUpdate(settingKey, e.target.value) }
    : value !== undefined ? { value, onChange } : { defaultValue }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950">
        <input className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none dark:text-white" type={type} placeholder={placeholder} {...inputProps} />
        {suffix && <span className="grid place-items-center border-l border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900">{suffix}</span>}
      </div>
    </label>
  )
}

function SelectField({ label, defaultValue = '', value, onChange, placeholder = 'Select…', options, values, settingKey, settings, onUpdate }) {
  const isControlledBySetting = settingKey !== undefined && settings !== undefined
  const selectProps = isControlledBySetting
    ? { value: settings[settingKey] ?? defaultValue, onChange: (e) => onUpdate(settingKey, e.target.value) }
    : value !== undefined ? { value, onChange } : { defaultValue }

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <select className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" {...selectProps}>
        <option value="">{placeholder}</option>
        {options.map((option, index) => <option key={values?.[index] || option} value={values?.[index] || option}>{option}</option>)}
      </select>
    </label>
  )
}

function UploadField({ label, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '')
  const [uploadError, setUploadError] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('logo', file)
      const res = await api.post('/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = res.data.logo_url
      setPreviewUrl(url)
      onUploaded?.(url)
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <label className="block cursor-pointer">
        <input className="sr-only" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-emerald-950/20">
          {uploading ? (
            <span className="flex items-center gap-2 text-emerald-600"><Upload size={18} className="animate-bounce" />Uploading...</span>
          ) : previewUrl ? (
            <>
              <img src={previewUrl} alt="Logo preview" className="h-14 w-auto max-w-[160px] rounded object-contain" />
              <span className="text-xs text-slate-400">Click to replace</span>
            </>
          ) : (
            <span className="flex items-center gap-2"><Upload size={18} />Upload logo</span>
          )}
        </div>
      </label>
      {uploadError && <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{uploadError}</p>}
    </div>
  )
}

function ToggleRow({ title, description, enabled = false, settingKey, settings, onUpdate }) {
  const isControlledBySetting = settingKey !== undefined && settings !== undefined
  const [localChecked, setLocalChecked] = useState(enabled)
  const checked = isControlledBySetting ? settings[settingKey] === '1' : localChecked
  const toggle = isControlledBySetting
    ? () => onUpdate(settingKey, checked ? '0' : '1')
    : () => setLocalChecked((v) => !v)

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button className={clsx('relative h-7 w-12 shrink-0 rounded-full transition', checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700')} onClick={toggle} type="button" aria-pressed={checked}>
        <span className={clsx('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition', checked ? 'left-6' : 'left-1')} />
      </button>
    </div>
  )
}

function ActionCard({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
        <Icon size={21} />
      </div>
      <h4 className="mt-4 font-bold text-slate-950 dark:text-white">{title}</h4>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <button className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700" onClick={onAction} type="button">
        <Check size={16} />
        {action}
      </button>
    </div>
  )
}

function PayrollSettingsPanel({ user, notify }) {
  const isSuperAdmin = user?.role?.slug === 'super_admin'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [security, setSecurity] = useState({ enabled: false, unlock_minutes: 15, has_pin: false })
  const [pin, setPin] = useState('')

  const loadSecurity = () => {
    setLoading(true)
    api.get('/employee-monthly-report/payroll-security')
      .then((res) => setSecurity(res.data || { enabled: false, unlock_minutes: 15, has_pin: false }))
      .catch((err) => notify?.(err.response?.data?.message || 'Could not load payroll security.', false))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSecurity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const savePayrollSecurity = async () => {
    if (!isSuperAdmin) {
      notify?.('Only Super Admin can change payroll security.', false)
      return
    }
    if (security.enabled && !security.has_pin && !pin) {
      notify?.('Set a Payroll PIN before enabling the lock.', false)
      return
    }
    setSaving(true)
    try {
      const payload = {
        enabled: Boolean(security.enabled),
        unlock_minutes: Number(security.unlock_minutes || 15),
      }
      if (pin) payload.pin = pin
      const res = await api.put('/employee-monthly-report/payroll-security', payload)
      setSecurity(res.data || security)
      setPin('')
      notify?.('Payroll security saved.', true)
    } catch (err) {
      notify?.(err.response?.data?.message || 'Failed to save payroll security.', false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Payroll Settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bonuses and deductions flow into payroll when enabled in Late Rules and Bonus Rules.
        </p>
      </div>
      <SettingsCard title="Payroll History Security" description="Require a Payroll PIN before any user can view Payroll History. Super Admin controls this lock.">
        {loading ? (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading payroll security...</p>
        ) : (
          <>
            {!isSuperAdmin && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                Payroll security can only be changed by Super Admin.
              </div>
            )}
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Require Payroll PIN</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Locks Payroll History for every user until they enter the PIN.</p>
                  </div>
                  <button
                    className={clsx('relative h-7 w-12 shrink-0 rounded-full transition', security.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700')}
                    onClick={() => setSecurity((current) => ({ ...current, enabled: !current.enabled }))}
                    type="button"
                    disabled={!isSuperAdmin || saving}
                    aria-pressed={Boolean(security.enabled)}
                  >
                    <span className={clsx('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition', security.enabled ? 'left-6' : 'left-1')} />
                  </button>
                </div>
              </div>
              <Field
                label="Auto-lock After"
                type="number"
                suffix="minutes"
                value={security.unlock_minutes || 15}
                onChange={(event) => setSecurity((current) => ({ ...current, unlock_minutes: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Field
                label={security.has_pin ? 'Change Payroll PIN' : 'Set Payroll PIN'}
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder={security.has_pin ? 'Leave blank to keep current PIN' : 'Minimum 4 characters'}
              />
              <button
                type="button"
                onClick={savePayrollSecurity}
                disabled={!isSuperAdmin || saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={17} />
                {saving ? 'Saving...' : 'Save Payroll Security'}
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Current status: {security.enabled ? 'Payroll History lock is ON' : 'Payroll History lock is OFF'}.
            </p>
          </>
        )}
      </SettingsCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Late deductions</p>
          <p className="mt-1 text-xs text-slate-500">Settings → Late Deduction Rules → Include in Payroll</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Employee bonuses</p>
          <p className="mt-1 text-xs text-slate-500">Settings → Bonus Rules → Include in Payroll</p>
        </div>
      </div>
      <p className="text-sm text-slate-500">Export payroll using approved bonuses and late deductions for the selected month.</p>
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}
