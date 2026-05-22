import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lightbulb,
  ListOrdered,
  Pencil,
  Plus,
  Save,
  Settings2,
  Timer,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'

const DEFAULT_SETTINGS = {
  work_start_time: '08:00:00',
  grace_minutes: 15,
  auto_mark_late: true,
  notify_admin: true,
  auto_apply_deduction: true,
  include_in_payroll: true,
  notify_employee: true,
  exclude_on_holidays: false,
  preview_check_in: '08:35:00',
}

const DEDUCTION_TYPES = [
  { value: 'none', label: 'No Deduction' },
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'percentage', label: 'Percentage' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'full_day', label: 'Full Day' },
]

const AUTOMATION_TOGGLES = [
  { key: 'auto_mark_late', label: 'Auto Mark Late', desc: 'Automatically mark attendance as late.' },
  { key: 'auto_apply_deduction', label: 'Auto Apply Deduction', desc: 'Apply payroll deduction from matched rule.' },
  { key: 'include_in_payroll', label: 'Include in Payroll', desc: 'Export deductions to payroll reports.' },
  { key: 'notify_admin', label: 'Notify Admin', desc: 'Alert admin on late check-in.' },
  { key: 'notify_employee', label: 'Notify Employee', desc: 'Notify employee when late is recorded.' },
  { key: 'exclude_on_holidays', label: 'Exclude on Holidays', desc: 'Skip late rules on public holidays.' },
]

const EMPTY_RULE = {
  rule_name: '',
  from_minutes: 0,
  to_minutes: 15,
  deduction_type: 'none',
  deduction_amount: '',
  status: true,
  telegram_chat_id: '',
  telegram_topic_id: '',
  schedule_id: null,
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0
  const [h, m] = String(timeStr).slice(0, 5).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function formatMinutesToTime(minutes) {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatRange(from, to) {
  if (to == null || to === '') return `${from}+ min`
  return `${from}-${to} min`
}

function deductionLabel(type, amount) {
  if (type === 'none') return 'No Deduction'
  if (type === 'half_day') return 'Half Day'
  if (type === 'full_day') return 'Full Day'
  if (type === 'percentage') return `${amount ?? 0}%`
  return amount != null ? `$${Number(amount).toFixed(2)}` : '—'
}

function findAppliedRule(lateMinutes, rules) {
  const active = rules.filter((r) => r.status)
  return active.find((r) => {
    const to = r.to_minutes == null ? Infinity : Number(r.to_minutes)
    return lateMinutes >= Number(r.from_minutes) && lateMinutes <= to
  }) || null
}

export default function LateRulesSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [deductionRules, setDeductionRules] = useState([])
  const [workSchedules, setWorkSchedules] = useState([])
  const [previewScheduleId, setPreviewScheduleId] = useState(null)
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState({ text: '', ok: true })
  const [ruleModal, setRuleModal] = useState(null)

  const showNotice = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3200)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/late-rules')
      setSettings({ ...DEFAULT_SETTINGS, ...res.data.settings })
      setDeductionRules(res.data.deduction_rules || [])
      setWorkSchedules(res.data.work_schedules || [])
      setStats(res.data.stats || {})
    } catch {
      showNotice('Could not load late rules.', false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const set = (key, val) => setSettings((p) => ({ ...p, [key]: val }))

  const preview = useMemo(() => {
    // Resolve start time: use selected schedule's first working day, else global setting
    const selectedSchedule = previewScheduleId
      ? workSchedules.find((s) => s.id === previewScheduleId)
      : null

    const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const scheduleStart = selectedSchedule
      ? DAYS.map((d) => selectedSchedule[`${d}_start`]).find((t) => t != null)
      : null

    const startStr = scheduleStart ?? settings.work_start_time
    const start = parseTimeToMinutes(startStr)
    const checkIn = parseTimeToMinutes(settings.preview_check_in)
    const grace = Number(settings.grace_minutes) || 0
    const rawLate = Math.max(0, checkIn - start)
    const lateMinutes = Math.max(0, rawLate - grace)

    // Schedule-aware rule matching: schedule-specific first, then global fallback
    const scheduleRules = previewScheduleId
      ? deductionRules.filter((r) => r.schedule_id === previewScheduleId)
      : []
    const globalRules = deductionRules.filter((r) => r.schedule_id == null)
    const applied = findAppliedRule(lateMinutes, scheduleRules.length ? scheduleRules : globalRules)

    const lateAfterMin = start + grace

    return {
      workStart: formatMinutesToTime(start),
      grace,
      checkIn: formatMinutesToTime(checkIn),
      lateAfter: formatMinutesToTime(lateAfterMin),
      lateMinutes,
      applied,
      scheduleName: selectedSchedule?.schedule_name ?? 'Global',
      deduction: applied ? deductionLabel(applied.deduction_type, applied.deduction_amount) : '—',
      range: applied ? formatRange(applied.from_minutes, applied.to_minutes) : '—',
    }
  }, [settings, deductionRules, previewScheduleId, workSchedules])

  const saveAll = async () => {
    setSaving(true)
    try {
      const res = await api.put('/late-rules', settings)
      setSettings({ ...DEFAULT_SETTINGS, ...res.data.settings })
      setDeductionRules(res.data.deduction_rules || [])
      setWorkSchedules(res.data.work_schedules || [])
      setStats(res.data.stats || {})
      showNotice('Late rules saved successfully.')
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Failed to save late rules.', false)
    } finally {
      setSaving(false)
    }
  }

  const saveRule = async (form, id) => {
    const payload = {
      rule_name: form.rule_name.trim() || `Late ${form.from_minutes}-${form.to_minutes ?? '∞'} min`,
      from_minutes: Number(form.from_minutes),
      to_minutes: form.to_minutes === '' || form.to_minutes == null ? null : Number(form.to_minutes),
      deduction_type: form.deduction_type,
      deduction_amount: ['fixed', 'percentage'].includes(form.deduction_type) && form.deduction_amount !== ''
        ? Number(form.deduction_amount)
        : null,
      status: Boolean(form.status),
      telegram_chat_id: form.telegram_chat_id?.trim() || null,
      telegram_topic_id: form.telegram_topic_id !== '' && form.telegram_topic_id != null ? Number(form.telegram_topic_id) : null,
      schedule_id: form.schedule_id ? Number(form.schedule_id) : null,
    }
    try {
      if (id) {
        await api.put(`/late-deduction-rules/${id}`, payload)
        showNotice('Deduction rule updated.')
      } else {
        await api.post('/late-deduction-rules', payload)
        showNotice('Deduction rule added.')
      }
      setRuleModal(null)
      await load()
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Could not save rule.', false)
    }
  }

  const removeRule = async (row) => {
    if (!window.confirm(`Delete rule "${row.rule_name}"?`)) return
    try {
      await api.delete(`/late-deduction-rules/${row.id}`)
      await load()
      showNotice('Rule removed.')
    } catch {
      showNotice('Could not delete rule.', false)
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-sm text-slate-500">Loading late rules…</p>
  }

  return (
    <div className="space-y-6 pb-28 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Late Rules</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Grace period and late arrival automation.
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 hover:shadow-emerald-600/30 disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? 'Saving…' : 'Save Late Rules'}
        </button>
      </div>

      {notice.text && (
        <div className={clsx(
          'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold',
          notice.ok
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
            : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200',
        )}>
          {notice.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {notice.text}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Clock} color="emerald" label="Work Start Time" value={stats.work_start_time || preview.workStart} />
        <SummaryCard icon={Timer} color="amber" label="Grace Period" value={`${stats.grace_minutes ?? settings.grace_minutes} min`} />
        <SummaryCard icon={AlertTriangle} color="rose" label="Late After" value={stats.late_after || preview.lateAfter} />
        <SummaryCard icon={Users} color="violet" label="Employees Late Today" value={String(stats.employees_late_today ?? 0)} />
      </div>

      {/* 2×2 grid matching mockup */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. Late Rule Settings — top left */}
        <SectionCard number={1} title="Late Rule Settings" icon={Settings2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TimeField
              label="Work Start Time"
              value={settings.work_start_time?.slice(0, 5) || '08:00'}
              onChange={(v) => set('work_start_time', v)}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Grace Period (minutes)</span>
              <input
                type="number"
                min={0}
                max={240}
                className={inputCls}
                value={settings.grace_minutes ?? 15}
                onChange={(e) => set('grace_minutes', Number(e.target.value))}
              />
            </label>
          </div>
          <div className="space-y-3 pt-1">
            <Toggle
              label="Auto Mark Late After Grace Period"
              description="Employees will be marked as late after grace period."
              checked={settings.auto_mark_late}
              onChange={(v) => set('auto_mark_late', v)}
            />
            <Toggle
              label="Notify Admin When Late"
              description="Send notification to admin when employee is late."
              checked={settings.notify_admin}
              onChange={(v) => set('notify_admin', v)}
            />
          </div>
        </SectionCard>

        {/* 2. Late Rules table — top right */}
        <SectionCard
          number={2}
          title="Late Rules"
          icon={ListOrdered}
          action={(
            <button
              type="button"
              onClick={() => setRuleModal({ mode: 'add', form: { ...EMPTY_RULE }, schedules: workSchedules })}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={15} />
              Add Rule
            </button>
          )}
        >
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60">
                  {['#', 'Schedule', 'Late Minutes Range', 'Deduction Type', 'Deduction Amount', 'Status', 'Action'].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                {deductionRules.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No rules yet. Click Add Rule.</td>
                  </tr>
                ) : deductionRules.map((row, i) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-4 font-medium text-slate-400">{i + 1}</td>
                    <td className="px-4 py-4">
                      <ScheduleBadge scheduleId={row.schedule_id} scheduleName={row.schedule?.schedule_name} />
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-100">{formatRange(row.from_minutes, row.to_minutes)}</td>
                    <td className="px-4 py-4"><TypeBadge type={row.deduction_type} /></td>
                    <td className="px-4 py-4 font-semibold tabular-nums text-slate-700 dark:text-slate-200">{deductionLabel(row.deduction_type, row.deduction_amount)}</td>
                    <td className="px-4 py-4"><StatusBadge active={row.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setRuleModal({ mode: 'edit', id: row.id, form: { ...row, deduction_amount: row.deduction_amount ?? '', schedule_id: row.schedule_id ?? null } })} className="text-sm font-bold text-emerald-600 hover:underline dark:text-emerald-400">Edit</button>
                        <button type="button" onClick={() => removeRule(row)} className="text-sm font-bold text-rose-600 hover:underline dark:text-rose-400">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {deductionRules.map((row, i) => (
              <div key={row.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">#{i + 1} {formatRange(row.from_minutes, row.to_minutes)}</p>
                    <ScheduleBadge scheduleId={row.schedule_id} scheduleName={row.schedule?.schedule_name} />
                  </div>
                  <TypeBadge type={row.deduction_type} />
                </div>
                <p className="mt-2 text-sm font-semibold">{deductionLabel(row.deduction_type, row.deduction_amount)}</p>
                <div className="mt-3 flex gap-3">
                  <button type="button" className="text-xs font-bold text-emerald-600" onClick={() => setRuleModal({ mode: 'edit', id: row.id, form: { ...row, deduction_amount: row.deduction_amount ?? '', schedule_id: row.schedule_id ?? null } })}>Edit</button>
                  <button type="button" className="text-xs font-bold text-rose-600" onClick={() => removeRule(row)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <InfoBar variant="emerald">Rules are applied based on total late minutes after grace period.</InfoBar>
        </SectionCard>

        {/* 3. Calculation Preview — bottom left */}
        <SectionCard number={3} title="Calculation Preview" icon={Calculator}>
          {/* Schedule selector */}
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Preview as Schedule</span>
            <select
              className={inputCls}
              value={previewScheduleId ?? ''}
              onChange={(e) => setPreviewScheduleId(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">Global (default work start time)</option>
              {workSchedules.map((s) => (
                <option key={s.id} value={s.id}>{s.schedule_name}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:grid-cols-3">
            <PreviewStat label={`Work Start (${preview.scheduleName})`} value={preview.workStart} />
            <PreviewStat label="Grace Period" value={`${preview.grace} min`} />
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Employee Check In</span>
              <input
                type="time"
                className={clsx(inputCls, 'mt-1')}
                value={settings.preview_check_in?.slice(0, 5) || '08:35'}
                onChange={(e) => set('preview_check_in', e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-col items-stretch gap-2 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 p-4 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-emerald-950/20 sm:flex-row sm:items-center sm:justify-between">
            <FlowStep label="Late Minutes" value={`${preview.lateMinutes} min`} accent />
            <ChevronRight className="hidden shrink-0 text-emerald-400 sm:block" size={20} />
            <ArrowRight className="shrink-0 text-emerald-400 sm:hidden" size={18} />
            <FlowStep label="Applied Rule" value={preview.range} />
            <ChevronRight className="hidden shrink-0 text-emerald-400 sm:block" size={20} />
            <ArrowRight className="shrink-0 text-emerald-400 sm:hidden" size={18} />
            <FlowStep label="Deduction" value={preview.deduction} highlight />
          </div>

          <InfoBar variant="sky">This is a preview. Actual deduction may vary based on rules.</InfoBar>
        </SectionCard>

        {/* 4. Automation Settings — bottom right */}
        <SectionCard number={4} title="Automation Settings" icon={Zap}>
          <div className="grid gap-3 sm:grid-cols-2">
            {AUTOMATION_TOGGLES.map(({ key, label, desc }) => (
              <Toggle
                key={key}
                label={label}
                description={desc}
                checked={settings[key]}
                onChange={(v) => set(key, v)}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Formula bar */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3.5 text-sm text-amber-950 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-100">
        <Lightbulb className="mt-0.5 shrink-0 text-amber-500" size={18} />
        <p>
          <span className="font-bold">Late minutes</span>
          {' = (Check In Time − Work Start Time) − Grace Period'}
        </p>
      </div>

      {/* Mobile FAB */}
      <button
        type="button"
        onClick={() => setRuleModal({ mode: 'add', form: { ...EMPTY_RULE }, schedules: workSchedules })}
        className="fixed bottom-24 right-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-xl lg:hidden"
        aria-label="Add rule"
      >
        <Plus size={24} />
      </button>

      {ruleModal && (
        <RuleModal modal={ruleModal} onClose={() => setRuleModal(null)} onSave={saveRule} workSchedules={workSchedules} />
      )}
    </div>
  )
}

function SectionCard({ number, title, icon: Icon, children, action }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-100/80 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Icon size={20} />
          </div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            {number}. {title}
          </h3>
        </div>
        {action}
      </div>
      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </div>
  )
}

function SummaryCard({ icon: Icon, color, label, value }) {
  const iconBg = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-100/80 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      <div className={clsx('grid h-12 w-12 shrink-0 place-items-center rounded-xl', iconBg[color])}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function TimeField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="relative">
        <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="time"
          className={clsx(inputCls, 'pl-10')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  )
}

function PreviewStat({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

function FlowStep({ label, value, accent }) {
  return (
    <div className="min-w-0 flex-1 text-center sm:text-left">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={clsx('mt-0.5 text-sm font-bold', accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white')}>
        {value}
      </p>
    </div>
  )
}

function InfoBar({ children, variant }) {
  const styles = {
    emerald: 'border-emerald-100 bg-emerald-50/90 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300',
    sky: 'border-sky-100 bg-sky-50/90 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300',
  }
  return (
    <p className={clsx('rounded-xl border px-4 py-3 text-xs font-medium leading-relaxed', styles[variant])}>
      {children}
    </p>
  )
}

function ScheduleBadge({ scheduleId, scheduleName }) {
  if (!scheduleId) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        All Schedules
      </span>
    )
  }
  return (
    <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
      {scheduleName || `Schedule #${scheduleId}`}
    </span>
  )
}

function TypeBadge({ type }) {
  const config = {
    none: { cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300', label: 'No Deduction' },
    fixed: { cls: 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300', label: 'Fixed Amount' },
    percentage: { cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300', label: 'Percentage' },
    half_day: { cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300', label: 'Half Day' },
    full_day: { cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300', label: 'Full Day' },
  }
  const c = config[type] || config.fixed
  return (
    <span className={clsx('inline-flex rounded-full px-3 py-1 text-xs font-bold', c.cls)}>
      {c.label}
    </span>
  )
}

function StatusBadge({ active }) {
  return (
    <span className={clsx(
      'inline-flex rounded-full px-3 py-1 text-xs font-bold',
      active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-500',
    )}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/50">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <span className={clsx(
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'left-6' : 'left-1',
        )} />
      </button>
    </div>
  )
}

function RuleModal({ modal, onClose, onSave, workSchedules = [] }) {
  const [form, setForm] = useState(modal.form)
  const [testingChat, setTestingChat] = useState(false)
  const [chatNotice, setChatNotice] = useState(null)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const testChat = async () => {
    const chatId = form.telegram_chat_id?.trim()
    if (!chatId) {
      setChatNotice({ ok: false, text: 'Enter a Group Chat ID first.' })
      return
    }
    setTestingChat(true)
    setChatNotice(null)
    try {
      await api.post('/telegram-notifications/test-chat', {
        chat_id: chatId,
        topic_id: form.telegram_topic_id ? Number(form.telegram_topic_id) : null,
      })
      setChatNotice({ ok: true, text: 'Test message sent!' })
    } catch (ex) {
      setChatNotice({ ok: false, text: ex.response?.data?.message || 'Failed to send test message.' })
    } finally {
      setTestingChat(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{modal.mode === 'edit' ? 'Edit Rule' : 'Add Rule'}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 text-sm font-semibold">Applies to Schedule</span>
            <select
              className={inputCls}
              value={form.schedule_id ?? ''}
              onChange={(e) => set('schedule_id', e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">All Schedules (Global)</option>
              {workSchedules.map((s) => (
                <option key={s.id} value={s.id}>{s.schedule_name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              "All Schedules" is the fallback — used when no schedule-specific rule matches.
            </p>
          </label>
          <ModalField label="Rule name" value={form.rule_name} onChange={(v) => set('rule_name', v)} placeholder="Late 16-30 min" />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="From (min)" type="number" value={form.from_minutes} onChange={(v) => set('from_minutes', v)} />
            <ModalField label="To (min)" type="number" value={form.to_minutes ?? ''} onChange={(v) => set('to_minutes', v)} placeholder="∞" />
          </div>
          <label className="block">
            <span className="mb-1 text-sm font-semibold">Deduction type</span>
            <select className={inputCls} value={form.deduction_type} onChange={(e) => set('deduction_type', e.target.value)}>
              {DEDUCTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          {['fixed', 'percentage'].includes(form.deduction_type) && (
            <ModalField label="Amount" type="number" value={form.deduction_amount} onChange={(v) => set('deduction_amount', v)} />
          )}
          <Toggle label="Active" checked={form.status} onChange={(v) => set('status', v)} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-slate-700 dark:bg-slate-950/50">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Telegram Alert (optional)</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Override the default late attendance group. Leave empty to use the global destination.</p>
            <ModalField label="Group Chat ID" value={form.telegram_chat_id ?? ''} onChange={(v) => set('telegram_chat_id', v)} placeholder="-1001234567890" mono />
            <ModalField label="Topic ID" type="number" value={form.telegram_topic_id ?? ''} onChange={(v) => set('telegram_topic_id', v)} placeholder="Optional" mono />
            <button
              type="button"
              onClick={testChat}
              disabled={testingChat}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
            >
              {testingChat ? '⏳ Sending...' : '📡 Test Bot'}
            </button>
            {chatNotice && (
              <p className={clsx('text-xs font-semibold', chatNotice.ok ? 'text-emerald-600' : 'text-rose-500')}>
                {chatNotice.text}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm font-semibold">Cancel</button>
          <button type="button" onClick={() => onSave(form, modal.id)} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}

function ModalField({ label, value, onChange, type = 'text', placeholder, mono = false }) {
  return (
    <label className="block">
      <span className="mb-1 text-sm font-semibold">{label}</span>
      <input type={type} className={clsx(inputCls, mono && 'font-mono')} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

const inputCls = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
