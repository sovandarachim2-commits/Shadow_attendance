import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  ClipboardList,
  Eye,
  EyeOff,
  FileText,
  MapPinned,
  MessageSquareText,
  RefreshCcw,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'

const SAMPLE = {
  name: 'Sokha Chan',
  employee_id: 'EMP-1042',
  department: 'Outdoor Sales',
  date: '18 May 2026',
  time: '08:12 AM',
  check_in: '08:12 AM',
  check_out: '05:18 PM',
  working_hours: '9h 06m',
  status: 'Verified',
  location: 'Phnom Penh Office',
  late_minutes: '17',
  deduction_amount: '2.50',
  request_type: 'Manual Check In',
  reason: 'Traffic delay during customer visit.',
}

const FALLBACK_VARIABLES = [
  '{name}',
  '{employee_id}',
  '{department}',
  '{date}',
  '{time}',
  '{check_in}',
  '{check_out}',
  '{working_hours}',
  '{status}',
  '{location}',
  '{late_minutes}',
  '{deduction_amount}',
  '{request_type}',
  '{reason}',
]

const TEMPLATE_META = {
  check_in_success: { label: 'Check In Success', tone: 'emerald' },
  check_out_success: { label: 'Check Out Success', tone: 'sky' },
  late_attendance: { label: 'Late Attendance Alert', tone: 'amber' },
  permission_request: { label: 'Permission Request', tone: 'violet' },
}

const TOGGLE_GROUPS = [
  {
    id: 'attendance',
    title: 'Attendance Notifications',
    icon: Clock,
    description: 'Core employee attendance lifecycle alerts.',
    items: [
      ['telegram_alert_check_in_success', 'Check In Success'],
      ['telegram_alert_check_out_success', 'Check Out Success'],
      ['telegram_alert_late_check_in', 'Late Check In Alert'],
      ['telegram_alert_missing_check_out', 'Missing Check Out Alert'],
      ['telegram_alert_attendance_edited', 'Attendance Edited Alert'],
    ],
  },
  {
    id: 'permission',
    title: 'Permission Request Notifications',
    icon: ClipboardList,
    description: 'Request, approval, and correction workflow notifications.',
    items: [
      ['telegram_alert_permission_new', 'New Permission Request'],
      ['telegram_alert_permission_approved', 'Permission Approved'],
      ['telegram_alert_permission_rejected', 'Permission Rejected'],
      ['telegram_alert_manual_check_in', 'Manual Check In Request'],
      ['telegram_alert_missing_check_out_request', 'Missing Check Out Request'],
    ],
  },
  {
    id: 'outdoor',
    title: 'Outdoor Sales Notifications',
    icon: MapPinned,
    description: 'Field check-ins, customer visits, reports, and route alerts.',
    items: [
      ['telegram_alert_outdoor_check_in', 'Outdoor Check In'],
      ['telegram_alert_visit_started', 'Customer Visit Started'],
      ['telegram_alert_visit_completed', 'Customer Visit Completed'],
      ['telegram_alert_daily_report', 'Daily Report Submitted'],
      ['telegram_alert_route_tracking', 'Route Tracking Alert'],
    ],
  },
]

const LATE_ITEMS = [
  ['telegram_late_notify_admin_group', 'Notify Admin Group'],
  ['telegram_late_notify_employee', 'Notify Employee'],
  ['telegram_late_include_deduction_amount', 'Include Deduction Amount'],
  ['telegram_late_include_late_minutes', 'Include Late Minutes'],
]

function applyTemplate(template) {
  return String(template || '').replace(/\{[a-z_]+\}/g, (match) => SAMPLE[match.slice(1, -1)] ?? match)
}

function mapTemplates(rows = []) {
  return rows.reduce((acc, row) => {
    acc[row.type] = row
    return acc
  }, {})
}

export default function TelegramNotificationSettings({ notify }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [settings, setSettings] = useState({
    enabled: true,
    bot_token: '',
    chat_id: '',
    webhook_url: '',
    status: 'disconnected',
    last_notification_sent_at: null,
  })
  const [toggles, setToggles] = useState({})
  const [templates, setTemplates] = useState({})
  const [variables, setVariables] = useState(FALLBACK_VARIABLES)
  const [activeTemplate, setActiveTemplate] = useState('check_in_success')
  const [logs, setLogs] = useState([])

  const template = templates[activeTemplate]
  const preview = useMemo(() => applyTemplate(template?.message_template), [template?.message_template])
  const connected = settings.status === 'connected'

  const showNotice = (text, ok = true) => notify?.(text, ok)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/telegram-notifications')
      setSettings((current) => ({ ...current, ...(res.data.settings || {}) }))
      setToggles(res.data.toggles || {})
      setTemplates(mapTemplates(res.data.templates || []))
      setVariables(res.data.variables?.length ? res.data.variables : FALLBACK_VARIABLES)
      setLogs(res.data.logs || [])
    } catch {
      showNotice('Could not load Telegram notification settings.', false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const setSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value }))
  const toggle = (key) => setToggles((current) => ({ ...current, [key]: !current[key] }))
  const setTemplateField = (key, value) => {
    setTemplates((current) => ({
      ...current,
      [activeTemplate]: {
        ...current[activeTemplate],
        [key]: value,
      },
    }))
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      await api.put('/telegram-notifications/settings', {
        enabled: Boolean(settings.enabled),
        bot_token: settings.bot_token || '',
        chat_id: settings.chat_id || '',
        webhook_url: settings.webhook_url || '',
      })
      await api.put('/telegram-notifications/toggles', { toggles })
      if (template?.id) {
        const updated = await api.put(`/telegram-notifications/templates/${template.id}`, {
          message_template: template.message_template || '',
          is_active: Boolean(template.is_active),
        })
        setTemplates((current) => ({ ...current, [updated.data.type]: updated.data }))
      }
      await loadData()
      showNotice('Telegram notification settings saved.')
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Failed to save Telegram notification settings.', false)
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const res = await api.post('/telegram-notifications/test-connection')
      setSettings((current) => ({ ...current, ...(res.data.settings || {}), status: 'connected' }))
      showNotice(res.data.message || 'Telegram bot connection is active.')
    } catch (ex) {
      setSettings((current) => ({ ...current, status: 'disconnected' }))
      showNotice(ex.response?.data?.message || 'Telegram connection failed.', false)
    } finally {
      setTesting(false)
    }
  }

  const sendTest = async () => {
    if (!template?.message_template?.trim()) {
      showNotice('Template message is empty.', false)
      return
    }
    setTesting(true)
    try {
      const res = await api.post('/telegram-notifications/test', {
        type: activeTemplate,
        message: preview,
      })
      setSettings((current) => ({ ...current, ...(res.data.settings || {}) }))
      setLogs(res.data.logs || [])
      showNotice(res.data.message || 'Test notification sent successfully.')
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Could not send test notification.', false)
    } finally {
      setTesting(false)
    }
  }

  const insertVariable = (variable) => {
    setTemplateField('message_template', `${template?.message_template || ''}${variable}`)
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Loading Telegram notification system...
      </div>
    )
  }

  return (
    <div className="relative space-y-6">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 border-b border-slate-100 px-5 py-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Telegram Notifications</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure Telegram alerts and attendance notification templates.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill active={connected} label={connected ? 'Connected' : 'Disconnected'} />
                <StatusPill active={Boolean(settings.enabled)} label={settings.enabled ? 'Enabled' : 'Disabled'} />
              </div>
            </div>
          </div>
          <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400 sm:text-right">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Last notification sent</span>
            <span>{settings.last_notification_sent_at ? new Date(settings.last_notification_sent_at).toLocaleString() : 'No notification sent yet'}</span>
          </div>
        </div>

        <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className="space-y-6">
            <SettingsSection icon={Bot} title="Telegram Bot Connection">
              <ToggleCard
                title="Enable Telegram Notifications"
                description="Allow the system to send attendance, permission, and outdoor sales alerts to Telegram."
                checked={Boolean(settings.enabled)}
                onChange={() => setSetting('enabled', !settings.enabled)}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Bot Token">
                  <div className="relative">
                    <input
                      className={clsx(inputCls, 'pr-10 font-mono')}
                      type={showToken ? 'text' : 'password'}
                      value={settings.bot_token || ''}
                      onChange={(event) => setSetting('bot_token', event.target.value)}
                      placeholder="1234567890:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      type="button"
                      onClick={() => setShowToken((value) => !value)}
                      aria-label={showToken ? 'Hide bot token' : 'Show bot token'}
                    >
                      {showToken ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>
                <Field label="Chat ID / Group ID">
                  <input className={clsx(inputCls, 'font-mono')} value={settings.chat_id || ''} onChange={(event) => setSetting('chat_id', event.target.value)} placeholder="-1001234567890" />
                </Field>
                <Field label="Webhook URL" wide>
                  <input className={clsx(inputCls, 'font-mono text-xs')} value={settings.webhook_url || ''} onChange={(event) => setSetting('webhook_url', event.target.value)} placeholder="https://your-domain.com/api/telegram/webhook" />
                </Field>
              </div>
              <div className="flex flex-wrap gap-3">
                <SecondaryButton icon={Wifi} onClick={testConnection} loading={testing}>Test Connection</SecondaryButton>
                <PrimaryButton icon={Save} onClick={saveAll} loading={saving}>Save Settings</PrimaryButton>
              </div>
            </SettingsSection>

            {TOGGLE_GROUPS.map((group) => (
              <SettingsSection key={group.id} icon={group.icon} title={group.title} description={group.description}>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.items.map(([key, label]) => (
                    <ToggleCard
                      key={key}
                      title={label}
                      description="Telegram alert template is ready for this event."
                      checked={Boolean(toggles[key])}
                      onChange={() => toggle(key)}
                    />
                  ))}
                </div>
              </SettingsSection>
            ))}

            <SettingsSection icon={AlertTriangle} title="Late Attendance Alerts" description="Control who receives late alerts and which payroll details appear.">
              <div className="grid gap-3 md:grid-cols-2">
                {LATE_ITEMS.map(([key, label]) => (
                  <ToggleCard
                    key={key}
                    title={label}
                    description="Applies to late check-in Telegram messages."
                    checked={Boolean(toggles[key])}
                    onChange={() => toggle(key)}
                  />
                ))}
              </div>
            </SettingsSection>
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <SettingsSection icon={MessageSquareText} title="Message Template Editor" description="Create reusable Telegram message formats with live variables.">
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(templates).map(([type, row]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveTemplate(type)}
                    className={clsx(
                      'rounded-lg border px-3 py-2 text-left text-sm font-semibold transition',
                      activeTemplate === type
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300',
                    )}
                  >
                    {TEMPLATE_META[type]?.label || row.type}
                  </button>
                ))}
              </div>

              <ToggleCard
                title="Template Active"
                description="Inactive templates remain saved but are not used by automation."
                checked={Boolean(template?.is_active)}
                onChange={() => setTemplateField('is_active', !template?.is_active)}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Message Template</span>
                <textarea
                  className="min-h-[260px] w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={template?.message_template || ''}
                  onChange={(event) => setTemplateField('message_template', event.target.value)}
                  placeholder="Write Telegram message template..."
                />
              </label>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Supported Variables</p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <button
                      key={variable}
                      type="button"
                      onClick={() => insertVariable(variable)}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>
            </SettingsSection>

            <SettingsSection icon={Sparkles} title="Test Notification" description="Preview the current template and send a real Telegram test message.">
              <TelegramPreview message={preview} />
              <div className="flex flex-wrap gap-3">
                <PrimaryButton icon={Send} onClick={sendTest} loading={testing}>Send Test Message</PrimaryButton>
                <SecondaryButton icon={RefreshCcw} onClick={loadData}>Refresh</SecondaryButton>
              </div>
            </SettingsSection>

            <SettingsSection icon={FileText} title="Recent Telegram Logs">
              {logs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm font-semibold text-slate-400 dark:border-slate-700">
                  No Telegram logs yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{log.message_type}</p>
                        <StatusPill active={log.status === 'sent'} label={log.status} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{log.telegram_message}</p>
                    </div>
                  ))}
                </div>
              )}
            </SettingsSection>
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Telegram Settings'}
        </button>
      </div>
    </div>
  )
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function ToggleCard({ title, description, checked, onChange }) {
  return (
    <div className="flex min-h-24 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-950/50">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        {description && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={clsx('relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')}
      >
        <span className={clsx('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-6' : 'left-1')} />
      </button>
    </div>
  )
}

function TelegramPreview({ message }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-[#eef7ff] p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2aabee] text-white">
          <Bot size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Attendance Bot</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time preview</p>
        </div>
      </div>
      <div className="rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-slate-900">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-100">{message}</pre>
      </div>
    </div>
  )
}

function Field({ label, children, wide = false }) {
  return (
    <label className={clsx('block', wide && 'lg:col-span-2')}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function StatusPill({ active, label }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize',
      active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300',
    )}>
      {active ? <CheckCircle2 size={13} /> : <ShieldCheck size={13} />}
      {label}
    </span>
  )
}

function PrimaryButton({ icon: Icon, children, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
    >
      <Icon size={16} />
      {loading ? 'Working...' : children}
    </button>
  )
}

function SecondaryButton({ icon: Icon, children, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Icon size={16} />
      {loading ? 'Working...' : children}
    </button>
  )
}

const inputCls = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
