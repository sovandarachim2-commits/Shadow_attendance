import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, BriefcaseBusiness, CalendarDays, CheckCircle2, ChevronDown,
  Clock3, Download, FileSpreadsheet, FileText, Filter,
  Gauge, Printer, RotateCcw, ShieldAlert, TimerOff,
  TrendingUp, Umbrella, Users, WalletCards, X,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import clsx from 'clsx'
import { api } from '../services/api'

const STATUS = [
  { key: 'present', label: 'Present', color: '#16a34a', icon: CheckCircle2 },
  { key: 'late', label: 'Late', color: '#f97316', icon: Clock3 },
  { key: 'absent', label: 'Absent', color: '#ef4444', icon: AlertCircle },
  { key: 'leave', label: 'Leave', color: '#9333ea', icon: FileText },
  { key: 'dayOff', label: 'Day Off', color: '#4f46e5', icon: Umbrella },
  { key: 'missingIn', label: 'Missing Check In', color: '#eab308', icon: TimerOff },
  { key: 'missingOut', label: 'Missing Check Out', color: '#ec4899', icon: ShieldAlert },
  { key: 'overtime', label: 'Overtime', color: '#0891b2', icon: TrendingUp },
]

const KPI_META = [
  { key: 'employees', label: 'Total Employees', color: 'blue', icon: Users },
  { key: 'present', label: 'Present', color: 'emerald', icon: CheckCircle2 },
  { key: 'late', label: 'Late', color: 'orange', icon: Clock3 },
  { key: 'absent', label: 'Absent', color: 'rose', icon: AlertCircle },
  { key: 'leave', label: 'Leave', color: 'violet', icon: FileText },
  { key: 'dayOff', label: 'Day Off', color: 'indigo', icon: Umbrella },
  { key: 'missingIn', label: 'Missing Check In', color: 'amber', icon: TimerOff },
  { key: 'missingOut', label: 'Missing Check Out', color: 'pink', icon: ShieldAlert },
  { key: 'rate', label: 'Attendance Rate', color: 'blue', icon: Gauge },
  { key: 'deduction', label: 'Total Deduction', color: 'rose', icon: WalletCards },
]

const TONES = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  pink: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
}

const fieldClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const STATUS_STORAGE_KEY = 'attendance-dashboard-visible-statuses'

function formatMinutesClock(minutes) {
  const totalSeconds = Math.max(0, Math.round(Number(minutes || 0) * 60))
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}h:${String(mins).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`
}

function FilterField({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>{children}</label>
}

function KpiCard({ item }) {
  const Icon = item.icon
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={clsx('grid h-12 w-12 shrink-0 place-items-center rounded-full', TONES[item.color])}><Icon size={23} /></div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold text-slate-500">{item.label}</p>
        <p className="mt-1 truncate text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">{item.value}</p>
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{item.percent}</p>
      </div>
    </div>
  )
}

function Panel({ title, actions, children, className }) {
  return (
    <section className={clsx('rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}

function EmployeeDrawer({ employee, onClose }) {
  const [activeTab, setActiveTab] = useState('Late History')
  const reportType = employee?.detailType === 'overtime' ? 'overtime' : 'late'
  const isOvertime = reportType === 'overtime'
  useEffect(() => {
    setActiveTab(isOvertime ? 'Overtime History' : 'Late History')
  }, [isOvertime, employee?.id])
  if (!employee) return null
  const allRecords = employee.allRecords || employee.records || []
  const statusCount = (statuses) => allRecords.filter((record) => statuses.includes(record.display_status || record.status)).length
  const tabs = isOvertime ? ['Summary', 'Overtime History', 'Daily Records'] : ['Summary', 'Late History', 'Daily Records', 'Deductions', 'Requests']
  const attendanceTime = (record, key) => {
    if (record?.[key]) return record[key]
    const value = record?.[`${key}_at`]
    return value
      ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '—'
  }
  const downloadReport = () => {
    const header = isOvertime ? 'Date,Check In,Check Out,Work Minutes,Overtime Minutes,Status\n' : 'Date,Check In,Late Minutes,Deduction,Status\n'
    const rows = (employee.records || []).map((record) => [
      record.attendance_date,
      attendanceTime(record, 'check_in'),
      ...(isOvertime
        ? [attendanceTime(record, 'check_out'), record.work_minutes || 0, Math.max(0, Number(record.work_minutes || 0) - 480)]
        : [record.late_minutes || 0, Number(record.deduction_amount || 0).toFixed(2)]),
      record.display_status || record.status,
    ].map((value) => `"${value}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([header + rows], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${employee.name || 'employee'}-${reportType}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6" onMouseDown={onClose}>
      <section className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{isOvertime ? 'Employee Overtime Report' : 'Employee Late Report'}</h2>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-extrabold text-white">
              {(employee.name || '?').split(' ').map((part) => part[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xl font-extrabold text-slate-900 dark:text-white">{employee.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{employee.position} <span className="mx-2">•</span> {employee.department}</p>
              <p className="mt-1 text-xs text-slate-400">Employee ID: {employee.id}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-600 dark:bg-emerald-950/40">Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 py-4 sm:grid-cols-4 dark:border-slate-800">
            {(isOvertime ? [
              ['Overtime Days', employee.overtimeDays, CalendarDays, 'blue'],
              ['Total Overtime', formatMinutesClock(employee.overtimeMinutes), TrendingUp, 'emerald'],
              ['Average Overtime', formatMinutesClock(employee.average), Clock3, 'orange'],
              ['Last Overtime', employee.lastOvertime || 'â€”', TimerOff, 'rose'],
            ] : [
              ['Late Days', employee.lateDays, CalendarDays, 'blue'],
              ['Late Minutes', formatMinutesClock(employee.lateMinutes), Clock3, 'orange'],
              ['Average Late', formatMinutesClock(employee.average), TimerOff, 'rose'],
              ['Deduction', `$${Number(employee.deduction || 0).toFixed(2)}`, WalletCards, 'emerald'],
            ]).map(([label, value, Icon, tone]) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <span className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-full', TONES[tone])}><Icon size={19} /></span>
                <span className="min-w-0"><span className="block truncate text-[10px] font-bold text-slate-500">{label}</span><span className="block truncate text-lg font-extrabold">{value}</span></span>
              </div>
            ))}
          </div>

          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={clsx('whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold', activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500')}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Late History' || activeTab === 'Overtime History' ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/60">
                  <tr>{(isOvertime ? ['Date', 'Check In', 'Check Out', 'Work Hours', 'Overtime', 'Status'] : ['Date', 'Check In', 'Schedule In', 'Late', 'Status']).map((heading) => <th key={heading} className="px-3 py-3 font-bold">{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(employee.records || []).slice(0, 8).map((record) => (
                    <tr key={record.id}>
                      <td className="px-3 py-3 font-semibold">{record.attendance_date}</td>
                      <td className="px-3 py-3">{attendanceTime(record, 'check_in')}</td>
                      {isOvertime ? (
                        <>
                          <td className="px-3 py-3">{attendanceTime(record, 'check_out')}</td>
                          <td className="px-3 py-3">{formatMinutesClock(record.work_minutes)}</td>
                          <td className="px-3 py-3 font-bold text-cyan-600">{formatMinutesClock(Math.max(0, Number(record.work_minutes || 0) - 480))}</td>
                          <td className="px-3 py-3"><span className="rounded-full bg-cyan-50 px-3 py-1 font-bold text-cyan-600 dark:bg-cyan-950/40">Overtime</span></td>
                        </>
                      ) : (
                        <>
                      <td className="px-3 py-3">—</td>
                      <td className="px-3 py-3 font-bold">{formatMinutesClock(record.late_minutes)}</td>
                      <td className="px-3 py-3"><span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-orange-600 dark:bg-orange-950/40">Late</span></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
              {activeTab} information will use the selected employee&apos;s attendance records.
            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            <h3 className="mb-3 text-sm font-bold">This Month Overview</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['Present', statusCount(['present']), 'emerald'],
                ['Late', statusCount(['late']), 'orange'],
                ['Absent', statusCount(['absent']), 'rose'],
                ['Leave', statusCount(['personal_request', 'on_leave', 'leave']), 'violet'],
              ].map(([label, value, tone]) => (
                <div key={label} className={clsx('rounded-lg p-3 text-center', TONES[tone])}><p className="text-[10px] font-bold">{label}</p><p className="mt-1 text-lg font-extrabold">{value} days</p></div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            <h3 className="mb-3 text-sm font-bold">Deduction Summary (This Month)</h3>
            <div className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {[
                ['Late Deduction', employee.deduction],
                ['Manual Adjustment', 0],
                ['Excused Deduction', 0],
                ['Total Deduction', employee.deduction],
              ].map(([label, value]) => <div key={label} className="flex justify-between py-2.5"><span className="text-slate-500">{label}</span><span className={clsx('font-bold', label === 'Total Deduction' && 'text-rose-500')}>${Number(value).toFixed(2)}</span></div>)}
            </div>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 p-4 dark:border-slate-800">
          <button type="button" onClick={onClose} className="h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">Close</button>
          <button type="button" onClick={downloadReport} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"><Download size={17} />Download Report</button>
        </div>
      </section>
    </div>
  )
}

export default function EmployeeDashboardPage({ appData }) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [filters, setFilters] = useState({ month: currentMonth, department: '', branch: '', employment: '', schedule: '', employee: '' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [report, setReport] = useState({ summary: {}, records: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [enabled, setEnabled] = useState(() => {
    const defaults = Object.fromEntries(STATUS.map((item) => [item.key, true]))
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || '{}') }
    } catch {
      return defaults
    }
  })
  const [statusDraft, setStatusDraft] = useState(enabled)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [displayBy, setDisplayBy] = useState('Daily')
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const employees = useMemo(() => appData?.employees || [], [appData?.employees])
  const departments = useMemo(() => [...new Map(employees.filter((employee) => employee.department).map((employee) => [employee.department.id, employee.department])).values()], [employees])
  const branches = useMemo(() => [...new Map(employees.filter((employee) => employee.branch).map((employee) => [employee.branch.id, employee.branch])).values()], [employees])
  const employmentTypes = useMemo(() => [...new Set(employees.map((employee) => employee.employment_type).filter(Boolean))], [employees])
  const records = (report.records || []).filter((record) =>
    !appliedFilters.employment ||
    employees.find((employee) => String(employee.id) === String(record.employee_id))?.employment_type === appliedFilters.employment)
  const summary = records.reduce((totals, record) => {
    const status = record.display_status || record.status || 'present'
    totals.total_records += 1
    totals.total_deduction += Number(record.deduction_amount || 0)
    if (['personal_request', 'on_leave', 'leave', 'half_day'].includes(status)) totals.personal_request += 1
    else if (['missing_checkin', 'missing_attendance'].includes(status)) totals.missing_checkin += 1
    else if (status === 'missing_checkout') totals.missing_checkout += 1
    else if (status === 'day_off') totals.day_off += 1
    else if (status in totals) totals[status] += 1
    return totals
  }, { total_records: 0, total_deduction: 0, present: 0, late: 0, absent: 0, personal_request: 0, day_off: 0, missing_checkin: 0, missing_checkout: 0 })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const params = { month: appliedFilters.month }
        if (appliedFilters.department) params.department_id = appliedFilters.department
        if (appliedFilters.branch) params.branch_id = appliedFilters.branch
        if (appliedFilters.employee) params.employee_id = appliedFilters.employee
        const response = await api.get('/attendance/reports/admin', { params })
        if (!cancelled) setReport(response.data || { summary: {}, records: [] })
      } catch (requestError) {
        if (!cancelled) {
          setReport({ summary: {}, records: [] })
          setError(requestError.response?.data?.message || 'Attendance dashboard data could not be loaded.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [appliedFilters])

  const scopedEmployees = employees.filter((employee) =>
    (!appliedFilters.department || String(employee.department_id) === String(appliedFilters.department)) &&
    (!appliedFilters.branch || String(employee.branch_id) === String(appliedFilters.branch)) &&
    (!appliedFilters.employment || employee.employment_type === appliedFilters.employment) &&
    (!appliedFilters.employee || String(employee.id) === String(appliedFilters.employee)))
  const totalRecords = Number(summary.total_records || 0)
  const statusValues = {
    present: Number(summary.present || 0), late: Number(summary.late || 0),
    absent: Number(summary.absent || 0), leave: Number(summary.personal_request || 0),
    dayOff: Number(summary.day_off || 0), missingIn: Number(summary.missing_checkin || 0),
    missingOut: Number(summary.missing_checkout || 0),
    overtime: records.filter((record) => Number(record.work_minutes || 0) > 480).length,
  }
  const percent = (value) => totalRecords ? `${((value / totalRecords) * 100).toFixed(1)}%` : '0%'
  const kpiItems = KPI_META.map((item) => {
    if (item.key === 'employees') return { ...item, value: scopedEmployees.length, percent: 'Active scope' }
    if (item.key === 'rate') {
      const rate = totalRecords ? ((statusValues.present + statusValues.late) / totalRecords) * 100 : 0
      return { ...item, value: `${rate.toFixed(1)}%`, percent: 'Overall' }
    }
    if (item.key === 'deduction') return { ...item, value: `$${Number(summary.total_deduction || 0).toFixed(2)}`, percent: 'Selected month' }
    return { ...item, value: statusValues[item.key] || 0, percent: percent(statusValues[item.key] || 0) }
  })
  const statusSummary = STATUS.map((item) => ({ ...item, value: statusValues[item.key] || 0, percent: percent(statusValues[item.key] || 0) }))
  const trend = useMemo(() => {
    const grouped = {}
    const [year, month] = appliedFilters.month.split('-').map(Number)
    const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 0
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      grouped[date] = { day: date, present: 0, late: 0, absent: 0, leave: 0, dayOff: 0, missingIn: 0, missingOut: 0, overtime: 0 }
    }
    records.forEach((record) => {
      const day = record.attendance_date
      if (!day) return
      grouped[day] ||= { day, present: 0, late: 0, absent: 0, leave: 0, dayOff: 0, missingIn: 0, missingOut: 0, overtime: 0 }
      const statusMap = { personal_request: 'leave', on_leave: 'leave', day_off: 'dayOff', missing_checkin: 'missingIn', missing_checkout: 'missingOut' }
      const key = statusMap[record.display_status] || record.display_status
      if (key in grouped[day]) grouped[day][key] += 1
      if (Number(record.work_minutes || 0) > 480) grouped[day].overtime += 1
    })
    return Object.values(grouped).sort((a, b) => a.day.localeCompare(b.day))
  }, [appliedFilters.month, records])
  const chartData = useMemo(() => {
    if (displayBy === 'Daily') {
      return trend.map((row) => ({
        ...row,
        label: new Date(`${row.day}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      }))
    }

    const grouped = {}
    trend.forEach((row) => {
      const date = new Date(`${row.day}T12:00:00`)
      const key = displayBy === 'Weekly' ? `Week ${Math.ceil(date.getDate() / 7)}` : appliedFilters.month
      grouped[key] ||= { label: key, present: 0, late: 0, absent: 0, leave: 0, dayOff: 0, missingIn: 0, missingOut: 0, overtime: 0 }
      STATUS.forEach((status) => { grouped[key][status.key] += Number(row[status.key] || 0) })
    })
    return Object.values(grouped)
  }, [appliedFilters.month, displayBy, trend])
  const lateEmployees = useMemo(() => {
    const grouped = {}
    records.filter((record) => Number(record.late_minutes) > 0).forEach((record) => {
      const id = record.employee_id
      grouped[id] ||= { id, name: record.employee_name, department: record.department || '—', position: record.position || '—', lateDays: 0, lateMinutes: 0, deduction: 0, lastLate: record.attendance_date, records: [] }
      const employee = grouped[id]
      employee.lateDays += 1
      employee.lateMinutes += Number(record.late_minutes || 0)
      employee.deduction += Number(record.deduction_amount || 0)
      employee.lastLate = employee.lastLate > record.attendance_date ? employee.lastLate : record.attendance_date
      employee.records.push(record)
    })
    return Object.values(grouped).map((employee) => ({
      ...employee,
      average: employee.lateDays ? Math.round(employee.lateMinutes / employee.lateDays) : 0,
      allRecords: records.filter((record) => String(record.employee_id) === String(employee.id)),
    })).sort((a, b) => b.lateMinutes - a.lateMinutes)
  }, [records])
  const overtimeEmployees = useMemo(() => {
    const grouped = {}
    records.forEach((record) => {
      const overtimeMinutes = Math.max(0, Number(record.work_minutes || 0) - 480)
      if (!overtimeMinutes) return
      const id = record.employee_id
      grouped[id] ||= {
        id,
        name: record.employee_name,
        department: record.department || '—',
        position: record.position || '—',
        overtimeDays: 0,
        overtimeMinutes: 0,
        lastOvertime: record.attendance_date,
        records: [],
      }
      const employee = grouped[id]
      employee.overtimeDays += 1
      employee.overtimeMinutes += overtimeMinutes
      employee.lastOvertime = employee.lastOvertime > record.attendance_date ? employee.lastOvertime : record.attendance_date
      employee.records.push(record)
    })
    return Object.values(grouped)
      .map((employee) => ({
        ...employee,
        average: employee.overtimeDays ? Math.round(employee.overtimeMinutes / employee.overtimeDays) : 0,
        allRecords: records.filter((record) => String(record.employee_id) === String(employee.id)),
      }))
      .sort((a, b) => b.overtimeMinutes - a.overtimeMinutes)
  }, [records])
  const departmentRates = useMemo(() => {
    const grouped = {}
    records.forEach((record) => {
      const name = record.department || 'Unassigned'
      grouped[name] ||= { name, total: 0, attended: 0 }
      grouped[name].total += 1
      if (['present', 'late'].includes(record.display_status)) grouped[name].attended += 1
    })
    return Object.values(grouped).map((row) => ({ name: row.name, rate: row.total ? Number(((row.attended / row.total) * 100).toFixed(1)) : 0 }))
  }, [records])

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const reset = () => {
    const clean = { month: currentMonth, department: '', branch: '', employment: '', schedule: '', employee: '' }
    setFilters(clean)
    setAppliedFilters(clean)
  }
  const exportCsv = () => {
    const header = 'Employee,Department,Position,Late Days,Late Minutes,Average Late,Deduction,Last Late Date\n'
    const rows = lateEmployees.map((employee) => [
      employee.name, employee.department, employee.position, employee.lateDays,
      employee.lateMinutes, employee.average, employee.deduction, employee.lastLate,
    ].map((value) => `"${value}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([header + rows], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'attendance-dashboard.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  const print = () => window.print()
  const saveVisibleStatuses = () => {
    setEnabled(statusDraft)
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statusDraft))
    setStatusMenuOpen(false)
  }

  return (
    <div className="space-y-5 p-3 pb-24 sm:p-6 print:p-0">
      <header className="flex flex-wrap justify-end gap-4 print:hidden">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={print} className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-xs font-bold text-rose-600 shadow-sm dark:bg-slate-900"><FileText size={16} />Export PDF</button>
          <button type="button" onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-xs font-bold text-emerald-600 shadow-sm dark:bg-slate-900"><FileSpreadsheet size={16} />Export Excel</button>
          <button type="button" onClick={print} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><Printer size={16} />Print</button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <FilterField label="Month"><input type="month" value={filters.month} onChange={(e) => update('month', e.target.value)} className={fieldClass} /></FilterField>
          <FilterField label="Department"><select value={filters.department} onChange={(e) => update('department', e.target.value)} className={fieldClass}><option value="">All Departments</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></FilterField>
          <FilterField label="Branch"><select value={filters.branch} onChange={(e) => update('branch', e.target.value)} className={fieldClass}><option value="">All Branches</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></FilterField>
          <FilterField label="Employment Type"><select value={filters.employment} onChange={(e) => update('employment', e.target.value)} className={fieldClass}><option value="">All Types</option>{employmentTypes.map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}</select></FilterField>
          <FilterField label="Work Schedule"><select value={filters.schedule} onChange={(e) => update('schedule', e.target.value)} className={fieldClass} disabled><option value="">Not available in report API</option></select></FilterField>
          <FilterField label="Employee"><select value={filters.employee} onChange={(e) => update('employee', e.target.value)} className={fieldClass}><option value="">All Employees</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.full_name || [employee.first_name, employee.last_name].filter(Boolean).join(' ')}</option>)}</select></FilterField>
          <div className="flex items-end gap-2">
            <button type="button" onClick={() => setAppliedFilters(filters)} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"><Filter size={16} />Filter</button>
            <button type="button" onClick={reset} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700" title="Reset"><RotateCcw size={16} /></button>
          </div>
        </div>
        <p className="mt-3 text-[10px] font-semibold text-slate-400">{loading ? 'Loading attendance data…' : `Showing database records for ${appliedFilters.month || 'all months'}.`}</p>
      </section>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{kpiItems.map((item) => <KpiCard key={item.key} item={item} />)}</div>

      <Panel
        title={`Attendance Trend by ${displayBy === 'Daily' ? 'Day' : displayBy === 'Weekly' ? 'Week' : 'Month'}`}
        actions={(
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setStatusDraft(enabled)
                setStatusMenuOpen((open) => !open)
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Display Status
              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600 dark:bg-blue-950/50">
                {Object.values(enabled).filter(Boolean).length}
              </span>
              <ChevronDown size={14} />
            </button>
            {statusMenuOpen && (
              <>
                <button type="button" className="fixed inset-0 z-20 cursor-default" onClick={() => setStatusMenuOpen(false)} aria-label="Close status menu" />
                <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-2 text-xs font-bold text-slate-800 dark:text-slate-100">Statuses to display</p>
                  <div className="space-y-1">
                    {STATUS.map((item) => (
                      <label key={item.key} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                        <input
                          type="checkbox"
                          checked={Boolean(statusDraft[item.key])}
                          onChange={(event) => setStatusDraft((current) => ({ ...current, [item.key]: event.target.checked }))}
                          className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                        />
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="flex-1">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={saveVisibleStatuses} className="mt-3 h-9 w-full rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700">
                    Save Display
                  </button>
                </div>
              </>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-500">Display by<select value={displayBy} onChange={(e) => setDisplayBy(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label>
        </div>
        )}
      >
        <div className="mb-2 flex flex-wrap gap-x-5 gap-y-2">
          {STATUS.filter((item) => enabled[item.key]).map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
        <div className="h-72 rounded-xl bg-slate-50/50 px-2 pt-3 dark:bg-slate-950/30">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <LineChart data={chartData} margin={{ top: 14, right: 16, left: -15, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={displayBy === 'Daily' ? 2 : 0} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }} />
              {STATUS.map((item) => enabled[item.key] && (
                <Line key={item.key} type="linear" dataKey={item.key} name={item.label} stroke={item.color} strokeWidth={2.5} dot={{ r: 3.5, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }}>
                  <LabelList
                    dataKey={item.key}
                    position="top"
                    offset={7}
                    fill={item.color}
                    fontSize={11}
                    fontWeight={700}
                    formatter={(value) => Number(value) > 0 ? value : ''}
                  />
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title={`Attendance Trend by ${displayBy === 'Daily' ? 'Day' : displayBy === 'Weekly' ? 'Week' : 'Month'} (Bar Chart)`}>
        <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2">
          {STATUS.filter((item) => enabled[item.key]).map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart data={chartData} margin={{ top: 12, right: 16, left: -15, bottom: 4 }} barGap={1}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }} />
              {STATUS.map((item) => enabled[item.key] && (
                <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={[3, 3, 0, 0]} maxBarSize={20}>
                  <LabelList
                    dataKey={item.key}
                    position="top"
                    fill={item.color}
                    fontSize={9}
                    fontWeight={700}
                    formatter={(value) => Number(value) > 0 ? value : ''}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid items-start gap-4 xl:grid-cols-[1.8fr_1fr]">
        <Panel title="Top Late Employees (This Month)" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-xs">
              <thead><tr className="border-b border-slate-100 text-left text-slate-400 dark:border-slate-800">{['Employee', 'Department', 'Position', 'Late Days', 'Late Minutes', 'Average Late', 'Deduction', 'Last Late Date', 'Action'].map((heading) => <th key={heading} className="px-2 py-3 font-bold">{heading}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{lateEmployees.map((employee) => <tr key={employee.id}>
                <td className="px-2 py-3 font-bold text-slate-800 dark:text-slate-100">{employee.name}</td><td className="px-2 py-3">{employee.department}</td><td className="px-2 py-3">{employee.position}</td><td className="px-2 py-3 font-bold">{employee.lateDays}</td><td className="px-2 py-3 font-bold">{formatMinutesClock(employee.lateMinutes)}</td><td className="px-2 py-3">{formatMinutesClock(employee.average)}</td><td className="px-2 py-3 font-bold text-rose-500">${employee.deduction.toFixed(2)}</td><td className="px-2 py-3">{employee.lastLate}</td>
                <td className="px-2 py-3"><button type="button" onClick={() => setSelectedEmployee(employee)} className="whitespace-nowrap rounded-lg border border-blue-200 px-2.5 py-1.5 font-bold text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-950">View Details</button></td>
              </tr>)}</tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Attendance Status Summary">
            <div className="space-y-3">{statusSummary.map((item) => <div key={item.key} className="flex items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="flex-1 text-slate-600 dark:text-slate-300">{item.label}</span><span className="font-bold text-slate-900 dark:text-white">{item.value.toLocaleString()} <span className="text-slate-400">({item.percent})</span></span></div>)}</div>
            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm font-bold dark:border-slate-800"><span>Total Records</span><span>{totalRecords.toLocaleString()}</span></div>
          </Panel>

          <Panel title="Deduction Summary">
            <div className="space-y-5 text-sm">{[['Total Late Deduction', `$${Number(summary.total_deduction || 0).toFixed(2)}`], ['Manual Adjustments', '$0.00'], ['Excused Deduction', '$0.00']].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><span className="text-slate-500">{label}</span><span className="font-bold">{value}</span></div>)}</div>
            <div className="mt-6 flex justify-between rounded-xl bg-blue-50 px-3 py-3 text-sm font-bold text-blue-600 dark:bg-blue-950/40"><span>Average per Employee</span><span>${scopedEmployees.length ? (Number(summary.total_deduction || 0) / scopedEmployees.length).toFixed(2) : '0.00'}</span></div>
          </Panel>
        </div>
      </div>

      <Panel title="Top Overtime Employees (This Month)" className="overflow-hidden">
        {overtimeEmployees.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 dark:border-slate-800">
                  {['Employee', 'Department', 'Position', 'Overtime Days', 'Total Overtime', 'Average Overtime', 'Last Overtime Date', 'Action'].map((heading) => (
                    <th key={heading} className="px-3 py-3 font-bold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {overtimeEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-3 py-3 font-bold text-slate-800 dark:text-slate-100">{employee.name}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{employee.department}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{employee.position}</td>
                    <td className="px-3 py-3 font-bold">{employee.overtimeDays}</td>
                    <td className="px-3 py-3 font-bold text-cyan-600">{formatMinutesClock(employee.overtimeMinutes)}</td>
                    <td className="px-3 py-3">{formatMinutesClock(employee.average)}</td>
                    <td className="px-3 py-3">{employee.lastOvertime}</td>
                    <td className="px-3 py-3"><button type="button" onClick={() => setSelectedEmployee({ ...employee, detailType: 'overtime' })} className="whitespace-nowrap rounded-lg border border-cyan-200 px-2.5 py-1.5 font-bold text-cyan-600 hover:bg-cyan-50 dark:border-cyan-900 dark:hover:bg-cyan-950">View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400 dark:border-slate-700">
            No overtime records for the selected filters.
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Department Attendance Rate"><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={departmentRates} layout="vertical" margin={{ left: 15 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" /><YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} /><Tooltip formatter={(value) => `${value}%`} /><Bar dataKey="rate" fill="#2563eb" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Leave Summary"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[['Annual Leave', 0], ['Sick Leave', 0], ['Personal Leave', Number(summary.personal_request || 0)], ['Business Trip', 0], ['Other Requests', 0]].map(([label, value], index) => <div key={label} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"><div className={clsx('mb-3 grid h-9 w-9 place-items-center rounded-full', TONES[['blue', 'violet', 'orange', 'emerald', 'indigo'][index]])}><BriefcaseBusiness size={16} /></div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div></Panel>
      </div>

      <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </div>
  )
}
