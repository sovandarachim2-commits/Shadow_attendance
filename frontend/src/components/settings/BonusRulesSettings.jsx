import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Award,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Gift,
  MapPin,
  Pencil,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { api, employeeService } from '../../services/api'

const BONUS_TYPE_LABELS = {
  perfect_attendance: 'Perfect Attendance Bonus',
  no_late: 'No Late Bonus',
  no_absent: 'No Absent Bonus',
  overtime: 'Overtime Bonus',
  outdoor_sales: 'Outdoor Sales Bonus',
  customer_visit: 'Customer Visit Bonus',
  sales_target: 'Sales Target Bonus',
  monthly_performance: 'Monthly Performance Bonus',
  custom: 'Custom Bonus',
}

const TYPE_BADGE = {
  perfect_attendance: { label: 'Attendance', tone: 'emerald' },
  no_late: { label: 'Attendance', tone: 'emerald' },
  no_absent: { label: 'Attendance', tone: 'emerald' },
  overtime: { label: 'Performance', tone: 'violet' },
  outdoor_sales: { label: 'Outdoor Sales', tone: 'orange' },
  customer_visit: { label: 'Outdoor Sales', tone: 'orange' },
  sales_target: { label: 'Sales', tone: 'blue' },
  monthly_performance: { label: 'Performance', tone: 'violet' },
  custom: { label: 'Performance', tone: 'violet' },
}

const RULE_ICONS = {
  perfect_attendance: Award,
  no_late: Clock,
  no_absent: CheckCircle2,
  customer_visit: MapPin,
  outdoor_sales: MapPin,
  sales_target: Target,
  overtime: Zap,
  monthly_performance: Sparkles,
  custom: Gift,
}

const CONDITION_LABELS = {
  no_late: 'No Late Attendance',
  no_absent: 'No Absent',
  full_attendance: 'Full Attendance',
  overtime_hours: 'Overtime Hours',
  customer_visit_count: 'Customer Visit Count',
  sales_amount: 'Sales Amount',
  route_completion: 'Route Completion',
  working_days: 'Working Days',
  custom_logic: 'Custom Logic',
}

const AUTOMATION_TOGGLES = [
  { key: 'auto_calculate_bonus', label: 'Auto Calculate Bonus' },
  { key: 'include_in_payroll', label: 'Include in Payroll' },
  { key: 'notify_employee', label: 'Notify Employee (Telegram)' },
  { key: 'notify_admin', label: 'Notify HR/Admin' },
  { key: 'auto_approve_bonus', label: 'Auto Approve Bonus' },
  { key: 'bonus_expiration', label: 'Bonus Expiration' },
]

const EMPTY_RULE = {
  rule_name: '',
  bonus_type: 'perfect_attendance',
  condition_type: 'full_attendance',
  condition_value: '',
  bonus_amount: 20,
  frequency: 'monthly',
  start_date: '',
  end_date: '',
  status: true,
}

const inputCls = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const PAGE_SIZE = 6

export default function BonusRulesSettings() {
  const [settings, setSettings] = useState({})
  const [rules, setRules] = useState([])
  const [employeeBonuses, setEmployeeBonuses] = useState([])
  const [stats, setStats] = useState({})
  const [chart, setChart] = useState({ total: 0, segments: [] })
  const [preview, setPreview] = useState(null)
  const [employees, setEmployees] = useState([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [previewEmployeeId, setPreviewEmployeeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [savingRule, setSavingRule] = useState(false)
  const [notice, setNotice] = useState({ text: '', ok: true })
  const [ruleModal, setRuleModal] = useState(null)
  const [rulesPage, setRulesPage] = useState(1)
  const [showAutomation, setShowAutomation] = useState(false)

  const showNotice = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3200)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ month })
      if (previewEmployeeId) params.set('preview_employee_id', previewEmployeeId)
      const res = await api.get(`/bonus-rules?${params}`)
      setSettings(res.data.settings || {})
      setRules(res.data.rules || [])
      setEmployeeBonuses(res.data.employee_bonuses || [])
      setStats(res.data.stats || {})
      setChart(res.data.chart || { total: 0, segments: [] })
      setPreview(res.data.preview || null)
    } catch {
      showNotice('Could not load bonus rules.', false)
    } finally {
      setLoading(false)
    }
  }, [month, previewEmployeeId])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    employeeService.fetchAll().then((list) => {
      setEmployees(list)
      if (!previewEmployeeId && list[0]?.id) setPreviewEmployeeId(String(list[0].id))
    }).catch(() => {})
  }, [])

  const set = (key, val) => setSettings((p) => ({ ...p, [key]: val }))

  const pendingBonuses = useMemo(
    () => employeeBonuses.filter((b) => b.status === 'pending'),
    [employeeBonuses],
  )

  const rulesPages = Math.max(1, Math.ceil(rules.length / PAGE_SIZE))
  const pagedRules = useMemo(() => {
    const start = (rulesPage - 1) * PAGE_SIZE
    return rules.slice(start, start + PAGE_SIZE)
  }, [rules, rulesPage])

  const saveSettings = async () => {
    setSaving(true)
    try {
      await api.put('/bonus-rules/settings', settings)
      showNotice('Settings saved.')
      await load()
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Failed to save settings.', false)
    } finally {
      setSaving(false)
    }
  }

  const saveRule = async (form, id) => {
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      showNotice('End date must be on or after start date.', false)
      return
    }

    const payload = {
      ...form,
      condition_value: form.condition_value === '' ? null : Number(form.condition_value),
      bonus_amount: Number(form.bonus_amount),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: Boolean(form.status),
    }
    setSavingRule(true)
    try {
      if (id) await api.put(`/bonus-rules/rules/${id}`, payload)
      else await api.post('/bonus-rules/rules', payload)
      setRuleModal(null)
      showNotice(id ? 'Rule updated.' : 'Rule added.')
      await load()
    } catch (ex) {
      const errors = ex.response?.data?.errors
      const firstError = errors && Object.values(errors).flat()[0]
      showNotice(firstError || ex.response?.data?.message || 'Could not save rule.', false)
    } finally {
      setSavingRule(false)
    }
  }

  const removeRule = async (row) => {
    if (!window.confirm(`Delete "${row.rule_name}"?`)) return
    try {
      await api.delete(`/bonus-rules/rules/${row.id}`)
      await load()
      showNotice('Rule removed.')
    } catch {
      showNotice('Could not delete rule.', false)
    }
  }

  const runCalculate = async () => {
    setCalculating(true)
    try {
      const res = await api.post('/employee-bonuses/calculate', { month })
      showNotice(res.data?.message || 'Calculation complete.')
      await load()
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Calculation failed.', false)
    } finally {
      setCalculating(false)
    }
  }

  const reviewBonus = async (row, status) => {
    try {
      await api.patch(`/employee-bonuses/${row.id}/status`, { status })
      showNotice(`Bonus ${status}.`)
      await load()
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Action failed.', false)
    }
  }

  if (loading && rules.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-500">Loading bonus rules…</p>
  }

  return (
    <div className="space-y-6 pb-28 lg:pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Bonus Rules</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure employee bonus automation and reward policies.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="month" className={clsx(inputCls, 'w-auto !h-10')} value={month} onChange={(e) => setMonth(e.target.value)} />
          <button type="button" onClick={runCalculate} disabled={calculating} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Zap size={16} className="text-violet-500" />
            {calculating ? 'Running…' : 'Calculate'}
          </button>
        </div>
      </div>

      {notice.text && (
        <div className={clsx('flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold', notice.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800')}>
          {notice.ok ? <CheckCircle2 size={16} /> : <X size={16} />}
          {notice.text}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Gift}
          iconBg="bg-emerald-100 text-emerald-600"
          label="Active Bonus Rules"
          value={stats.active_rules ?? 0}
          trend={stats.active_rules_delta > 0 ? `+${stats.active_rules_delta} from last month` : stats.active_rules_delta < 0 ? `${stats.active_rules_delta} from last month` : null}
          trendUp={stats.active_rules_delta >= 0}
        />
        <MetricCard
          icon={Wallet}
          iconBg="bg-violet-100 text-violet-600"
          label="Total Bonus This Month"
          value={`$${Number(stats.total_bonus_month || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          trend={stats.total_bonus_delta_pct != null ? `${stats.total_bonus_delta_pct >= 0 ? '+' : ''}${stats.total_bonus_delta_pct}% from last month` : null}
          trendUp={stats.total_bonus_delta_pct == null || stats.total_bonus_delta_pct >= 0}
        />
        <MetricCard
          icon={Users}
          iconBg="bg-blue-100 text-blue-600"
          label="Employees Eligible"
          value={stats.employees_eligible ?? 0}
          trend="All active employees"
          trendUp
        />
        <MetricCard
          icon={Clock}
          iconBg="bg-amber-100 text-amber-600"
          label="Pending Approval"
          value={stats.pending_approval ?? 0}
          trend={stats.pending_approval > 0 ? 'View pending bonuses' : 'All reviewed'}
          trendUp={false}
          onTrendClick={stats.pending_approval > 0 ? () => document.getElementById('pending-bonuses')?.scrollIntoView({ behavior: 'smooth' }) : undefined}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          {/* Bonus Rules table */}
          <Panel>
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bonus Rules</h3>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setShowAutomation((v) => !v)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <Settings2 size={16} />
                  Automation Settings
                </button>
                <button type="button" onClick={() => setRuleModal({ mode: 'add', form: { ...EMPTY_RULE } })} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700">
                  <Plus size={16} />
                  Add Bonus Rule
                </button>
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50">
                    {['Rule Name', 'Bonus Type', 'Condition', 'Bonus Amount', 'Frequency', 'Status', 'Action'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pagedRules.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No bonus rules yet.</td></tr>
                  ) : pagedRules.map((row) => (
                    <RuleRow key={row.id} row={row} onEdit={() => setRuleModal({ mode: 'edit', id: row.id, form: { ...row, condition_value: row.condition_value ?? '', start_date: row.start_date || '', end_date: row.end_date || '' } })} onDelete={() => removeRule(row)} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {pagedRules.map((row) => (
                <RuleMobileCard key={row.id} row={row} onEdit={() => setRuleModal({ mode: 'edit', id: row.id, form: { ...row, condition_value: row.condition_value ?? '', start_date: row.start_date || '', end_date: row.end_date || '' } })} onDelete={() => removeRule(row)} />
              ))}
            </div>

            <Pagination
              page={rulesPage}
              totalPages={rulesPages}
              total={rules.length}
              pageSize={PAGE_SIZE}
              onPage={setRulesPage}
            />
          </Panel>

          {/* Pending approvals */}
          <Panel id="pending-bonuses">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pending Bonus Approvals</h3>
              <p className="mt-0.5 text-xs text-slate-500">{pendingBonuses.length} awaiting review</p>
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50">
                    {['Employee', 'Bonus Type', 'Rule Name', 'Month', 'Bonus Amount', 'Status', 'Action'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingBonuses.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No pending bonuses.</td></tr>
                  ) : pendingBonuses.map((row) => (
                    <PendingRow key={row.id} row={row} onApprove={() => reviewBonus(row, 'approved')} onReject={() => reviewBonus(row, 'rejected')} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {pendingBonuses.map((row) => (
                <PendingMobileCard key={row.id} row={row} onApprove={() => reviewBonus(row, 'approved')} onReject={() => reviewBonus(row, 'rejected')} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <Panel>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bonus Calculation Preview</h3>
            </div>
            <div className="p-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Employee</label>
              <select className={clsx(inputCls, 'mb-4')} value={previewEmployeeId} onChange={(e) => setPreviewEmployeeId(e.target.value)}>
                <option value="">Select employee…</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                ))}
              </select>

              {preview ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
                      {preview.employee_name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{preview.employee_name}</p>
                      <p className="text-xs text-slate-500">{preview.employee_code || `ID ${preview.employee_id}`}</p>
                    </div>
                  </div>

                  <dl className="space-y-2.5 text-sm">
                    <PreviewRow label="Attendance (This Month)" value={preview.attendance_status} valueClass="text-emerald-600 font-semibold" />
                    <PreviewRow label="Late Count" value={String(preview.late_count)} />
                    <PreviewRow label="Absent" value={String(preview.absent_count)} />
                    <PreviewRow label="Missing Checkout" value={String(preview.missing_checkout ?? 0)} />
                  </dl>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Applied Rules</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      {preview.applied_rules_count || 0} Rules
                    </span>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-4 text-center dark:border-emerald-900/40 dark:bg-emerald-950/30">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Total Bonus</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      ${Number(preview.bonus_amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select an employee to preview.</p>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bonus Summary</h3>
              <p className="text-xs text-slate-500">{month}</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-5 sm:flex-row sm:items-center">
              <DonutChart segments={chart.segments || []} total={chart.total || stats.total_bonus_month || 0} />
              <ul className="w-full space-y-2 text-sm sm:flex-1">
                {(chart.segments || []).map((seg) => (
                  <li key={seg.label} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                      {seg.label}
                    </span>
                    <span className="font-bold tabular-nums text-slate-900 dark:text-white">${Number(seg.amount).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel className={showAutomation ? 'ring-2 ring-emerald-500/30' : ''}>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Automation Settings</h3>
            </div>
            <div className="space-y-1 p-4">
              {AUTOMATION_TOGGLES.map((t) => (
                <label key={t.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.label}</span>
                  <ToggleSwitch checked={Boolean(settings[t.key])} onChange={(v) => set(t.key, v)} />
                </label>
              ))}
            </div>
            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <button type="button" onClick={saveSettings} disabled={saving} className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-60">
                <Save size={16} />
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <button type="button" onClick={() => setRuleModal({ mode: 'add', form: { ...EMPTY_RULE } })} className="fixed bottom-24 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-xl lg:hidden" aria-label="Add rule">
        <Plus size={26} />
      </button>

      {ruleModal && (
        <RuleModal mode={ruleModal.mode} form={ruleModal.form} saving={savingRule} onClose={() => setRuleModal(null)} onSave={(form) => saveRule(form, ruleModal.id)} />
      )}
    </div>
  )
}

function Panel({ children, id, className }) {
  return (
    <section id={id} className={clsx('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}>
      {children}
    </section>
  )
}

function MetricCard({ icon: Icon, iconBg, label, value, trend, trendUp, onTrendClick }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div className={clsx('grid h-11 w-11 place-items-center rounded-xl', iconBg)}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
      {trend && (
        <button type="button" onClick={onTrendClick} className={clsx('mt-2 flex items-center gap-1 text-xs font-semibold', onTrendClick && 'hover:underline', trendUp ? 'text-emerald-600' : 'text-amber-600')}>
          {trendUp && <TrendingUp size={12} />}
          {trend}
        </button>
      )}
    </div>
  )
}

function RuleRow({ row, onEdit, onDelete }) {
  const Icon = RULE_ICONS[row.bonus_type] || Gift
  const badge = TYPE_BADGE[row.bonus_type] || TYPE_BADGE.custom

  return (
    <tr className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Icon size={16} />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">{row.rule_name}</span>
        </div>
      </td>
      <td className="px-5 py-4"><TypeBadge tone={badge.tone} label={badge.label} /></td>
      <td className="max-w-[180px] px-5 py-4 text-slate-600 dark:text-slate-300">{row.condition_label}</td>
      <td className="px-5 py-4 font-bold tabular-nums text-slate-900 dark:text-white">${Number(row.bonus_amount).toFixed(2)}</td>
      <td className="px-5 py-4 capitalize text-slate-600 dark:text-slate-300">{row.frequency}</td>
      <td className="px-5 py-4"><ActiveBadge active={row.status} /></td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <IconBtn icon={Pencil} onClick={onEdit} />
          <IconBtn icon={Trash2} onClick={onDelete} danger />
        </div>
      </td>
    </tr>
  )
}

function RuleMobileCard({ row, onEdit, onDelete }) {
  const badge = TYPE_BADGE[row.bonus_type] || TYPE_BADGE.custom
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-slate-900 dark:text-white">{row.rule_name}</p>
        <TypeBadge tone={badge.tone} label={badge.label} />
      </div>
      <p className="mt-2 text-sm text-slate-500">{row.condition_label}</p>
      <p className="mt-1 text-lg font-bold text-emerald-600">${Number(row.bonus_amount).toFixed(2)} <span className="text-sm font-normal text-slate-400 capitalize">{row.frequency}</span></p>
      <div className="mt-3 flex gap-3">
        <button type="button" className="text-xs font-bold text-emerald-600" onClick={onEdit}>Edit</button>
        <button type="button" className="text-xs font-bold text-rose-600" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

function PendingRow({ row, onApprove, onReject }) {
  const badge = TYPE_BADGE[row.bonus_type] || TYPE_BADGE.custom
  const initials = row.employee_name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || '?'

  return (
    <tr>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-xs font-bold text-slate-700 dark:from-slate-600 dark:to-slate-700 dark:text-slate-200">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{row.employee_name}</p>
            <p className="text-xs text-slate-500">{row.employee_code}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><TypeBadge tone={badge.tone} label={badge.label} /></td>
      <td className="px-5 py-4 text-slate-600">{row.rule_name || '—'}</td>
      <td className="px-5 py-4 text-slate-600">{row.month_label}</td>
      <td className="px-5 py-4 font-bold text-emerald-600">${Number(row.bonus_amount).toFixed(2)}</td>
      <td className="px-5 py-4"><PendingBadge /></td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onApprove} className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200" title="Approve"><Check size={16} /></button>
          <button type="button" onClick={onReject} className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200" title="Reject"><XCircle size={16} /></button>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200" title="View"><Eye size={16} /></button>
        </div>
      </td>
    </tr>
  )
}

function PendingMobileCard({ row, onApprove, onReject }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <p className="font-bold">{row.employee_name}</p>
      <p className="text-sm text-slate-500">{row.rule_name} · ${Number(row.bonus_amount).toFixed(2)}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onApprove} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">Approve</button>
        <button type="button" onClick={onReject} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white">Reject</button>
      </div>
    </div>
  )
}

function TypeBadge({ tone, label }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  }
  return <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold', tones[tone] || tones.violet)}>{label}</span>
}

function ActiveBadge({ active }) {
  return <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold', active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{active ? 'Active' : 'Inactive'}</span>
}

function PendingBadge() {
  return <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">Pending</span>
}

function IconBtn({ icon: Icon, onClick, danger }) {
  return (
    <button type="button" onClick={onClick} className={clsx('grid h-8 w-8 place-items-center rounded-lg transition', danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800')}>
      <Icon size={15} />
    </button>
  )
}

function PreviewRow({ label, value, valueClass }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className={clsx('font-semibold', valueClass || 'text-slate-900 dark:text-white')}>{value}</dd>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={clsx('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')}>
      <span className={clsx('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition', checked && 'translate-x-5')} />
    </button>
  )
}

function DonutChart({ segments, total }) {
  const size = 140
  const stroke = 22
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const sum = segments.reduce((a, s) => a + Number(s.amount), 0) || 1
  let offset = 0

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        {segments.map((seg) => {
          const pct = Number(seg.amount) / sum
          const dash = pct * circumference
          const el = (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
          offset += dash
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-slate-400">Total</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">${Number(total).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, total, pageSize, onPage }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-500">Showing {from} to {to} of {total} entries</p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40 dark:border-slate-700"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
          <button key={p} type="button" onClick={() => onPage(p)} className={clsx('grid h-8 min-w-[2rem] place-items-center rounded-lg px-2 text-sm font-semibold', p === page ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-600 dark:border-slate-700')}>{p}</button>
        ))}
        <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40 dark:border-slate-700"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}

function RuleModal({ mode, form: initial, saving = false, onClose, onSave }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const needsValue = ['overtime_hours', 'customer_visit_count', 'sales_amount', 'route_completion', 'working_days'].includes(form.condition_type)

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/50 p-0 sm:place-items-center sm:p-4">
      <form className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl" onSubmit={(e) => { e.preventDefault(); onSave(form) }}>
        <div className="shrink-0 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">{mode === 'edit' ? 'Edit Bonus Rule' : 'Add Bonus Rule'}</h3>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X size={20} /></button>
          </div>
          <p className="mt-1 text-xs text-slate-500">Dates are optional. Leave them blank when the rule has no start or end limit.</p>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <Field label="Rule Name"><input className={inputCls} value={form.rule_name} onChange={(e) => set('rule_name', e.target.value)} required /></Field>
          <Field label="Bonus Type">
            <select className={inputCls} value={form.bonus_type} onChange={(e) => set('bonus_type', e.target.value)}>
              {Object.entries(BONUS_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Condition Type">
            <select className={inputCls} value={form.condition_type} onChange={(e) => set('condition_type', e.target.value)}>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          {needsValue && <Field label="Condition Value"><input type="number" min={0} className={inputCls} value={form.condition_value} onChange={(e) => set('condition_value', e.target.value)} /></Field>}
          <Field label="Bonus Amount ($)"><input type="number" min={0} step={0.01} className={inputCls} value={form.bonus_amount} onChange={(e) => set('bonus_amount', e.target.value)} required /></Field>
          <Field label="Frequency">
            <select className={inputCls} value={form.frequency} onChange={(e) => set('frequency', e.target.value)}>
              {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Start Date">
              <input
                type="date"
                className={inputCls}
                value={form.start_date}
                onChange={(e) => {
                  const start = e.target.value
                  setForm((current) => ({
                    ...current,
                    start_date: start,
                    end_date: current.end_date && start && current.end_date < start ? start : current.end_date,
                  }))
                }}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                className={inputCls}
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={(e) => set('end_date', e.target.value)}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.status} onChange={(e) => set('status', e.target.checked)} className="accent-emerald-600" /> Active</label>
        </div>
        <div className="shrink-0 border-t border-slate-100 bg-white/95 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={onClose} disabled={saving} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-60 dark:border-slate-700">Cancel</button>
            <button type="submit" disabled={saving} className="h-11 flex-1 rounded-xl bg-emerald-600 text-sm font-bold text-white disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Rule'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>{children}</label>
}
