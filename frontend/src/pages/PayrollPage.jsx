import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Banknote, CalendarDays, CheckCircle2, Download, FileText, Gift, MinusCircle,
  Pencil, Plus, RefreshCw, ShieldCheck, TrendingUp, Wallet,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { apiError, canAccess } from '../utils/format'

const money = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const currentMonth = () => new Date().toISOString().slice(0, 7)

const emptySetup = {
  employee_id: '',
  salary_type: 'monthly',
  base_salary: 250,
  payroll_day: 28,
  overtime_rate: 0,
  commission_percent: 0,
  status: 'active',
  notes: '',
}

const emptyDeduction = {
  rule_name: '',
  deduction_type: 'late',
  threshold_minutes: 10,
  amount: 1,
  amount_type: 'fixed',
  status: true,
}

export default function PayrollPage({ user }) {
  const [month, setMonth] = useState(currentMonth())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState({ text: '', ok: true })
  const [activeTab, setActiveTab] = useState('records')
  const [setupForm, setSetupForm] = useState(emptySetup)
  const [deductionForm, setDeductionForm] = useState(emptyDeduction)
  const [advanceForm, setAdvanceForm] = useState({ employee_id: '', amount: 50, deduct_month: month, reason: '' })
  const [selectedItem, setSelectedItem] = useState(null)

  const canManage = canAccess(user, ['payroll.view_all'])
  const canGenerate = canAccess(user, ['payroll.create'])
  const canApprove = canAccess(user, ['payroll.approve'])
  const canPay = canAccess(user, ['payroll.pay'])

  const show = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3200)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/payroll?month=${month}`)
      setData(res.data)
      setAdvanceForm((current) => ({ ...current, deduct_month: month }))
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => { load() }, [load])

  const payroll = data?.payroll
  const items = payroll?.items || []
  const summary = data?.summary || {}

  const cards = [
    { label: 'Total Payroll', value: money(summary.total_payroll), help: 'Current month net salary', icon: Wallet, tone: 'emerald' },
    { label: 'Paid Employees', value: summary.paid_employees || 0, help: 'Marked paid', icon: CheckCircle2, tone: 'sky' },
    { label: 'Pending Payroll', value: summary.pending_payroll || 0, help: 'Draft or pending employees', icon: CalendarDays, tone: 'amber' },
    { label: 'Total Bonus', value: money(summary.total_bonus), help: 'Approved bonus snapshot', icon: Gift, tone: 'violet' },
    { label: 'Total Deductions', value: money(summary.total_deductions), help: 'Deductions and advances', icon: MinusCircle, tone: 'rose' },
  ]

  const generatePayroll = async () => {
    setSaving(true)
    try {
      const res = await api.post('/payroll/generate', { month })
      setData((current) => ({ ...current, payroll: res.data, summary: {
        total_payroll: res.data.total_net_salary,
        paid_employees: res.data.items.filter((i) => i.status === 'paid').length,
        pending_payroll: res.data.items.filter((i) => ['draft', 'pending'].includes(i.status)).length,
        total_bonus: res.data.total_bonus,
        total_deductions: res.data.total_deductions,
      } }))
      show('Payroll generated successfully.')
      setActiveTab('records')
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setSaving(false)
    }
  }

  const updatePayrollStatus = async (status) => {
    if (!payroll) return
    setSaving(true)
    try {
      const res = await api.patch(`/payroll/${payroll.id}/status`, { status })
      setData((current) => ({ ...current, payroll: res.data }))
      show(`Payroll marked ${status}.`)
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setSaving(false)
    }
  }

  const saveSetup = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api.post('/salary-setups', setupForm)
      setSetupForm(emptySetup)
      show('Salary setup saved.')
      await load()
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setSaving(false)
    }
  }

  const saveDeduction = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api.post('/deduction-rules', deductionForm)
      setDeductionForm(emptyDeduction)
      show('Deduction rule saved.')
      await load()
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setSaving(false)
    }
  }

  const saveAdvance = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api.post('/salary-advances', advanceForm)
      setAdvanceForm({ employee_id: '', amount: 50, deduct_month: month, reason: '' })
      show('Salary advance request saved.')
      await load()
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setSaving(false)
    }
  }

  const updateAdvanceStatus = async (advance, status) => {
    setSaving(true)
    try {
      await api.patch(`/salary-advances/${advance.id}/status`, { status, deduct_month: advance.deduct_month?.slice(0, 7) || month })
      show(`Advance ${status}.`)
      await load()
    } catch (error) {
      show(apiError(error), false)
    } finally {
      setSaving(false)
    }
  }

  const downloadPayslip = async (item) => {
    try {
      const res = await api.get(`/payroll-items/${item.id}/payslip`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `payslip-${item.employee_code}-${month}.html`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      show(apiError(error), false)
    }
  }

  if (loading && !data) return <p className="py-16 text-center text-sm text-slate-400">Loading payroll...</p>

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">Payroll Management</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">Manage employee salaries, deductions, bonuses and monthly payroll.</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input className={inputCls} type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <button className={secondaryBtn} onClick={load} type="button"><RefreshCw size={16} />Refresh</button>
          {canGenerate && <button className={primaryBtn} onClick={generatePayroll} disabled={saving} type="button"><Wallet size={16} />Generate Payroll</button>}
        </div>
      </div>

      {notice.text && (
        <div className={clsx('rounded-lg border px-4 py-3 text-sm font-semibold', notice.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800')}>
          {notice.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => <PayrollCard key={card.label} {...card} />)}
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        {[
          ['records', 'Payroll Records'],
          canManage && ['setup', 'Salary Setup'],
          canManage && ['deductions', 'Deduction Rules'],
          ['advances', 'Salary Advances'],
        ].filter(Boolean).map(([id, label]) => (
          <button key={id} className={clsx(tabBtn, activeTab === id && 'bg-emerald-600 text-white shadow-md')} onClick={() => setActiveTab(id)} type="button">
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'records' && (
        <PayrollRecords
          payroll={payroll}
          items={items}
          canApprove={canApprove}
          canPay={canPay}
          saving={saving}
          onStatus={updatePayrollStatus}
          onSelect={setSelectedItem}
          onDownload={downloadPayslip}
        />
      )}

      {activeTab === 'setup' && canManage && (
        <SalarySetupPanel
          employees={data?.employees || []}
          setups={data?.salary_setups || []}
          form={setupForm}
          setForm={setSetupForm}
          onSubmit={saveSetup}
          saving={saving}
        />
      )}

      {activeTab === 'deductions' && canManage && (
        <DeductionRulesPanel
          rules={data?.deduction_rules || []}
          form={deductionForm}
          setForm={setDeductionForm}
          onSubmit={saveDeduction}
          saving={saving}
        />
      )}

      {activeTab === 'advances' && (
        <AdvancesPanel
          advances={data?.salary_advances || []}
          employees={data?.employees || []}
          form={advanceForm}
          setForm={setAdvanceForm}
          onSubmit={saveAdvance}
          canManage={canManage}
          canApprove={canApprove}
          onStatus={updateAdvanceStatus}
          saving={saving}
        />
      )}

      {selectedItem && <PayrollDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}

function PayrollRecords({ payroll, items, canApprove, canPay, saving, onStatus, onSelect, onDownload }) {
  if (!payroll) {
    return <EmptyPanel title="No payroll generated" text="Choose a month and click Generate Payroll to create salary snapshots." />
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">{payroll.month_label}</h3>
          <p className="text-sm text-slate-500">Status: <StatusBadge status={payroll.status} /></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {payroll.status === 'draft' && <button className={secondaryBtn} disabled={saving} onClick={() => onStatus('pending')} type="button"><Pencil size={16} />Submit</button>}
          {canApprove && ['draft', 'pending'].includes(payroll.status) && <button className={primaryBtn} disabled={saving} onClick={() => onStatus('approved')} type="button"><ShieldCheck size={16} />Approve</button>}
          {canPay && payroll.status === 'approved' && <button className={primaryBtn} disabled={saving} onClick={() => onStatus('paid')} type="button"><Banknote size={16} />Mark Paid</button>}
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950">
            <tr>{['Employee', 'Base Salary', 'Bonus', 'Deduction', 'OT', 'Commission', 'Net Salary', 'Status', 'Action'].map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-4"><p className="font-bold">{item.employee_name}</p><p className="text-xs text-slate-400">{item.employee_code}</p></td>
                <td className="px-5 py-4 font-semibold">{money(item.base_salary)}</td>
                <td className="px-5 py-4 text-emerald-600">{money(item.bonus_amount)}</td>
                <td className="px-5 py-4 text-rose-600">{money(Number(item.deduction_amount) + Number(item.advance_amount))}</td>
                <td className="px-5 py-4">{money(item.overtime_amount)}</td>
                <td className="px-5 py-4">{money(item.commission_amount)}</td>
                <td className="px-5 py-4 text-lg font-extrabold">{money(item.net_salary)}</td>
                <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-5 py-4"><ActionButtons item={item} onSelect={onSelect} onDownload={onDownload} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {items.map((item) => <PayrollMobileCard key={item.id} item={item} onSelect={onSelect} onDownload={onDownload} />)}
      </div>
    </section>
  )
}

function PayrollMobileCard({ item, onSelect, onDownload }) {
  return (
    <article className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950 dark:text-white">{item.employee_name}</p>
          <p className="text-xs text-slate-400">{item.employee_code}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <MiniMetric label="Base" value={money(item.base_salary)} />
        <MiniMetric label="Net Salary" value={money(item.net_salary)} strong />
        <MiniMetric label="Bonus" value={money(item.bonus_amount)} />
        <MiniMetric label="Deduction" value={money(Number(item.deduction_amount) + Number(item.advance_amount))} />
      </div>
      <ActionButtons item={item} onSelect={onSelect} onDownload={onDownload} mobile />
    </article>
  )
}

function ActionButtons({ item, onSelect, onDownload, mobile = false }) {
  return (
    <div className={clsx('flex gap-2', mobile && 'mt-4')}>
      <button className={secondaryBtn} onClick={() => onSelect(item)} type="button"><FileText size={16} />View</button>
      <button className={secondaryBtn} onClick={() => onDownload(item)} type="button"><Download size={16} />Payslip</button>
    </div>
  )
}

function SalarySetupPanel({ employees, setups, form, setForm, onSubmit, saving }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
      <form onSubmit={onSubmit} className={panelCls}>
        <PanelTitle title="Salary Setup" subtitle="Assign base salary and commission rules." />
        <Field label="Employee"><select className={inputCls} value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required><option value="">Select employee</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.employee_code})</option>)}</select></Field>
        <Field label="Salary Type"><select className={inputCls} value={form.salary_type} onChange={(e) => setForm({ ...form, salary_type: e.target.value })}><option value="monthly">Monthly Salary</option><option value="daily">Daily Salary</option><option value="commission_only">Commission Only</option></select></Field>
        <Field label="Base Salary"><input className={inputCls} type="number" min="0" step="0.01" value={form.base_salary} onChange={(e) => setForm({ ...form, base_salary: Number(e.target.value) })} /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Payroll Day"><input className={inputCls} type="number" min="1" max="31" value={form.payroll_day} onChange={(e) => setForm({ ...form, payroll_day: Number(e.target.value) })} /></Field><Field label="OT Rate"><input className={inputCls} type="number" min="0" step="0.01" value={form.overtime_rate} onChange={(e) => setForm({ ...form, overtime_rate: Number(e.target.value) })} /></Field></div>
        <Field label="Commission %"><input className={inputCls} type="number" min="0" max="100" step="0.01" value={form.commission_percent} onChange={(e) => setForm({ ...form, commission_percent: Number(e.target.value) })} /></Field>
        <button className={primaryBtn} disabled={saving} type="submit"><Plus size={16} />Save Salary Setup</button>
      </form>
      <section className={panelCls}>
        <PanelTitle title="Configured Salaries" subtitle={`${setups.length} employee salary profiles`} />
        <div className="space-y-2">{setups.map((setup) => <div key={setup.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-800"><div><p className="font-bold">{setup.employee_name}</p><p className="text-xs text-slate-400">{setup.salary_type.replace('_', ' ')} · {setup.department || '-'}</p></div><p className="font-extrabold">{money(setup.base_salary)}</p></div>)}</div>
      </section>
    </div>
  )
}

function DeductionRulesPanel({ rules, form, setForm, onSubmit, saving }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
      <form onSubmit={onSubmit} className={panelCls}>
        <PanelTitle title="Deduction Rule" subtitle="Late, absent and missing checkout deductions." />
        <Field label="Rule Name"><input className={inputCls} value={form.rule_name} onChange={(e) => setForm({ ...form, rule_name: e.target.value })} required /></Field>
        <Field label="Type"><select className={inputCls} value={form.deduction_type} onChange={(e) => setForm({ ...form, deduction_type: e.target.value })}><option value="late">Late Deduction</option><option value="absent">Absent Deduction</option><option value="missing_checkout">Missing Checkout</option><option value="manual_penalty">Manual Penalty</option><option value="salary_advance">Salary Advance</option></select></Field>
        <Field label="Threshold Minutes"><input className={inputCls} type="number" min="0" value={form.threshold_minutes || 0} onChange={(e) => setForm({ ...form, threshold_minutes: Number(e.target.value) })} /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Amount"><input className={inputCls} type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></Field><Field label="Amount Type"><select className={inputCls} value={form.amount_type} onChange={(e) => setForm({ ...form, amount_type: e.target.value })}><option value="fixed">Fixed</option><option value="daily_salary">Daily Salary</option></select></Field></div>
        <button className={primaryBtn} disabled={saving} type="submit"><Plus size={16} />Save Rule</button>
      </form>
      <section className={panelCls}>
        <PanelTitle title="Deduction Summary" subtitle={`${rules.length} active rules`} />
        <div className="space-y-2">{rules.map((rule) => <div key={rule.id} className="rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-800"><div className="flex justify-between gap-3"><p className="font-bold">{rule.rule_name}</p><StatusBadge status={rule.status ? 'active' : 'inactive'} /></div><p className="mt-1 text-sm text-slate-500">{rule.deduction_type.replace('_', ' ')} · {rule.amount_type === 'daily_salary' ? 'Daily salary' : money(rule.amount)} · threshold {rule.threshold_minutes ?? 0} min</p></div>)}</div>
      </section>
    </div>
  )
}

function AdvancesPanel({ advances, employees, form, setForm, onSubmit, canManage, canApprove, onStatus, saving }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
      <form onSubmit={onSubmit} className={panelCls}>
        <PanelTitle title="Salary Advance" subtitle={canManage ? 'Create or record employee advances.' : 'Request an advance for approval.'} />
        {canManage && <Field label="Employee"><select className={inputCls} value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}><option value="">Select employee</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></Field>}
        <Field label="Amount"><input className={inputCls} type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required /></Field>
        <Field label="Deduct Month"><input className={inputCls} type="month" value={form.deduct_month || ''} onChange={(e) => setForm({ ...form, deduct_month: e.target.value })} /></Field>
        <Field label="Reason"><textarea className={`${inputCls} min-h-24 py-3`} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field>
        <button className={primaryBtn} disabled={saving} type="submit"><Plus size={16} />Save Advance</button>
      </form>
      <section className={panelCls}>
        <PanelTitle title="Advance Requests" subtitle={`${advances.length} recent records`} />
        <div className="space-y-2">{advances.map((advance) => <div key={advance.id} className="rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-800"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{advance.employee?.full_name || advance.employee?.first_name || 'Employee'}</p><p className="text-xs text-slate-400">{advance.reason || 'No reason'}</p></div><div className="text-right"><p className="font-extrabold">{money(advance.amount)}</p><StatusBadge status={advance.status} /></div></div>{canApprove && advance.status === 'pending' && <div className="mt-3 flex gap-2"><button className={primaryBtn} onClick={() => onStatus(advance, 'approved')} type="button">Approve</button><button className={secondaryBtn} onClick={() => onStatus(advance, 'rejected')} type="button">Reject</button></div>}</div>)}</div>
      </section>
    </div>
  )
}

function PayrollDetail({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-3 lg:items-center lg:justify-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-5 shadow-2xl dark:bg-slate-900 lg:max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase text-emerald-600">Payroll Detail</p><h3 className="text-xl font-extrabold">{item.employee_name}</h3><p className="text-sm text-slate-500">{item.department || '-'} · {item.position || '-'}</p></div>
          <button className={secondaryBtn} onClick={onClose} type="button">Close</button>
        </div>
        <div className="my-5 rounded-lg bg-emerald-50 p-5 text-center dark:bg-emerald-950/30"><p className="text-sm font-bold text-emerald-700">Net Salary</p><p className="mt-1 text-4xl font-extrabold text-emerald-600">{money(item.net_salary)}</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Breakdown title="Attendance Summary" rows={[['Present', item.present_days], ['Late', item.late_days], ['Absent', item.absent_days], ['Missing Checkout', item.missing_checkout_days], ['Overtime Hours', item.overtime_hours]]} />
          <Breakdown title="Salary Breakdown" rows={[['Base Salary', money(item.base_salary)], ['Bonus', money(item.bonus_amount)], ['Commission', money(item.commission_amount)], ['Overtime', money(item.overtime_amount)], ['Deduction', money(Number(item.deduction_amount) + Number(item.advance_amount))]]} />
        </div>
      </div>
    </div>
  )
}

function Breakdown({ title, rows }) {
  return <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"><h4 className="font-bold">{title}</h4><div className="mt-3 space-y-2">{rows.map(([label, value]) => <div key={label} className="flex justify-between text-sm"><span className="text-slate-500">{label}</span><strong>{value}</strong></div>)}</div></section>
}

function PayrollCard({ label, value, help, icon: Icon, tone }) {
  const tones = {
    emerald: 'from-emerald-500 to-teal-500',
    sky: 'from-sky-500 to-cyan-500',
    amber: 'from-amber-500 to-orange-500',
    violet: 'from-violet-500 to-fuchsia-500',
    rose: 'from-rose-500 to-pink-500',
  }
  return <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className={clsx('grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br text-white shadow-lg', tones[tone])}><Icon size={21} /></div><p className="mt-4 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p><p className="mt-1 text-xs text-slate-400"><TrendingUp className="mr-1 inline" size={12} />{help}</p></article>
}

function MiniMetric({ label, value, strong }) {
  return <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60"><p className="text-xs text-slate-400">{label}</p><p className={clsx('mt-1 font-bold', strong && 'text-lg text-emerald-600')}>{value}</p></div>
}

function PanelTitle({ title, subtitle }) {
  return <div className="mb-4"><h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3><p className="text-sm text-slate-500">{subtitle}</p></div>
}

function Field({ label, children }) {
  return <label className="mb-3 block"><span className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>{children}</label>
}

function StatusBadge({ status }) {
  const cls = {
    draft: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    paid: 'bg-sky-100 text-sky-700',
    locked: 'bg-violet-100 text-violet-700',
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    rejected: 'bg-rose-100 text-rose-700',
    deducted: 'bg-sky-100 text-sky-700',
  }[status] || 'bg-slate-100 text-slate-600'
  return <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize', cls)}>{String(status || '-').replace('_', ' ')}</span>
}

function EmptyPanel({ title, text }) {
  return <section className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><Wallet className="mx-auto text-slate-300" size={36} /><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></section>
}

const inputCls = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const primaryBtn = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60'
const secondaryBtn = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
const tabBtn = 'h-10 shrink-0 rounded-lg px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
const panelCls = 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'
