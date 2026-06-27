import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  FileText,
  Filter,
  LogOut,
  Printer,
  RotateCcw,
  Search,
  Umbrella,
  UserRound,
  UserX,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { employeeMonthlyReportService } from '../services/api'
import { FloatingSpinner } from '../components/shared/UI'
import { inputCls } from '../components/attendance/reports/attendanceReportShared'
import { canAccess } from '../utils/format'

const STATUS_META = {
  present: {
    label: 'Present',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    row: '',
  },
  late: {
    label: 'Late Check In',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400',
    dot: 'bg-orange-500',
    row: '',
  },
  early_checkout: {
    label: 'Early Check Out',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    row: '',
  },
  absent: {
    label: 'Absent',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    dot: 'bg-rose-500',
    row: 'bg-rose-50/40 dark:bg-rose-950/10',
  },
  missing_checkin: {
    label: 'Missing Check In',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400',
    dot: 'bg-violet-500',
    row: '',
  },
  missing_checkout: {
    label: 'Missing Check Out',
    badge: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-400',
    dot: 'bg-fuchsia-500',
    row: '',
  },
  missing_attendance: {
    label: 'Missing Check In',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400',
    dot: 'bg-violet-500',
    row: '',
  },
  day_off: {
    label: 'Day Off',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
    dot: 'bg-sky-500',
    row: 'bg-sky-50/40 dark:bg-sky-950/10',
  },
  on_leave: {
    label: 'Personal Request',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    dot: 'bg-blue-500',
    row: '',
  },
  leave: {
    label: 'Personal Request',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    dot: 'bg-blue-500',
    row: '',
  },
  half_day: {
    label: 'Personal Request',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    dot: 'bg-blue-500',
    row: '',
  },
  personal_request: {
    label: 'Personal Request',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    dot: 'bg-blue-500',
    row: '',
  },
  holiday: {
    label: 'Holiday',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
    dot: 'bg-cyan-500',
    row: 'bg-cyan-50/40 dark:bg-cyan-950/10',
  },
}

const CARDS_CONFIG = [
  { key: 'working_days', label: 'Working Days', icon: Calendar, tone: 'blue', pct: false },
  { key: 'present', label: 'Present', icon: CheckCircle2, tone: 'emerald' },
  { key: 'late', label: 'Late', icon: Clock, tone: 'orange' },
  { key: 'absent', label: 'Absent', icon: UserX, tone: 'rose' },
  { key: 'personal_request', label: 'Leave', icon: XCircle, tone: 'violet' },
  { key: 'day_off', label: 'Day Off', icon: Umbrella, tone: 'violet' },
  { key: 'missing_checkin', label: 'Missing Check In', icon: AlertCircle, tone: 'violet' },
  { key: 'missing_checkout', label: 'Missing Check Out', icon: LogOut, tone: 'rose' },
]

const TONE_ICON = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-400',
  slate: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
}

const TONE_VALUE = {
  emerald: 'text-emerald-700 dark:text-emerald-300',
  amber: 'text-amber-700 dark:text-amber-300',
  orange: 'text-orange-700 dark:text-orange-300',
  yellow: 'text-yellow-700 dark:text-yellow-300',
  rose: 'text-rose-700 dark:text-rose-300',
  violet: 'text-violet-700 dark:text-violet-300',
  fuchsia: 'text-fuchsia-700 dark:text-fuchsia-300',
  slate: 'text-slate-600 dark:text-slate-300',
  sky: 'text-sky-700 dark:text-sky-300',
  blue: 'text-blue-700 dark:text-blue-300',
}

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late Check In' },
  { value: 'early_checkout', label: 'Early Check Out' },
  { value: 'absent', label: 'Absent' },
  { value: 'missing_checkin', label: 'Missing Check In' },
  { value: 'missing_checkout', label: 'Missing Check Out' },
  { value: 'personal_request', label: 'Personal Request' },
  { value: 'day_off', label: 'Day Off' },
  { value: 'holiday', label: 'Holiday' },
]

const LEGEND_ITEMS = [
  { dot: 'bg-emerald-500', label: 'Present' },
  { dot: 'bg-orange-500', label: 'Late Check In' },
  { dot: 'bg-yellow-500', label: 'Early Check Out' },
  { dot: 'bg-sky-500', label: 'Day Off' },
  { dot: 'bg-violet-500', label: 'Missing Check In' },
  { dot: 'bg-fuchsia-500', label: 'Missing Check Out' },
  { dot: 'bg-blue-500', label: 'Personal Request' },
  { dot: 'bg-rose-500', label: 'Absent' },
  { dot: 'bg-cyan-500', label: 'Holiday' },
]

const TABLE_COLS = ['Date', 'Schedule', 'Check In', 'Check Out', 'Work Hours', 'Late', 'Deduction', 'Overtime', 'Status']
const MOBILE_TABLE_COLS = ['Date', 'Day', 'In', 'Out', 'Hours', 'Status']
const MOBILE_PAGE_SIZE = 10

const MOBILE_STATUS_LABELS = {
  present: 'Present',
  late: 'Late In',
  early_checkout: 'Early Out',
  absent: 'Absent',
  missing_checkin: 'Missing In',
  missing_checkout: 'Missing Out',
  missing_attendance: 'Missing In',
  day_off: 'Day Off',
  on_leave: 'Personal',
  leave: 'Personal',
  half_day: 'Personal',
  personal_request: 'Personal',
  holiday: 'Holiday',
}

function currentMonthStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function shiftMonth(monthStr, delta) {
  const [y, m] = monthStr.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return ''
  const d = new Date(`${monthStr}-01T12:00:00`)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function formatDateShort(dateStr) {
  if (!dateStr) return '–'
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateMobile(dateStr) {
  if (!dateStr) return '–'
  const d = new Date(`${dateStr}T12:00:00`)
  const day = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleDateString(undefined, { month: 'short' })
  return `${day} ${month}`
}

function fmtWork(minutes) {
  if (minutes == null) return '–'
  const h = Math.floor(Number(minutes) / 60)
  const m = Number(minutes) % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function displayReportTime(day, key) {
  if (day?.[key]) return day[key]
  const timestamp = day?.[`${key}_at`]
  const match = String(timestamp || '').match(/(?:T|\s)(\d{2}:\d{2})/)
  return match?.[1] || null
}

function fmtSummaryMinutes(minutes) {
  const value = Math.max(0, Number(minutes) || 0)
  const h = Math.floor(value / 60)
  const m = Math.round(value % 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function buildClientCsv(data) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = [
    'Date', 'Schedule', 'Check In', 'Check Out', 'Work Hours', 'Late (min)',
    'Deduction', 'Overtime', 'Status',
  ].join(',')
  const rows = (data.days || []).map((d) =>
    [
      esc(d.date),
      esc(d.schedule || '–'),
      esc(displayReportTime(d, 'check_in') || '–'),
      esc(displayReportTime(d, 'check_out') || '–'),
      esc(fmtWork(d.work_minutes)),
      esc(d.late_minutes || 0),
      esc(Number(d.deduction_amount || 0).toFixed(2)),
      esc(fmtWork(d.overtime_minutes || 0)),
      esc(STATUS_META[d.status]?.label || d.status),
    ].join(','),
  )
  return [header, ...rows].join('\n')
}

function StatusBadge({ status, compact = false }) {
  const meta = STATUS_META[status] || {
    label: status,
    badge: 'bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  }
  const label = compact ? (MOBILE_STATUS_LABELS[status] || meta.label) : meta.label
  return (
    <span
      className={clsx(
        'inline-flex items-center whitespace-nowrap rounded-full font-bold',
        compact ? 'gap-1 px-2 py-0.5 text-[10px]' : 'gap-1.5 px-2.5 py-1 text-xs',
        meta.badge,
      )}
    >
      {!compact && <span className={clsx('h-1.5 w-1.5 rounded-full', meta.dot)} />}
      {label}
    </span>
  )
}

function SummaryCard({ label, value, icon: Icon, tone = 'emerald', trend = 'This month', compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className={clsx('grid h-9 w-9 shrink-0 place-items-center rounded-lg', TONE_ICON[tone])}>
          {Icon && <Icon size={16} />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-medium text-slate-500">{label}</p>
          <p className={clsx('text-xl font-bold tabular-nums leading-tight', TONE_VALUE[tone])}>{value ?? 0}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900/40">
      <div className={clsx('grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105', TONE_ICON[tone])}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className={clsx('mt-0.5 text-2xl font-bold tabular-nums leading-none', TONE_VALUE[tone])}>
          {value ?? 0}
        </p>
        <p className="mt-1 truncate text-[10px] font-medium text-slate-400">{trend}</p>
      </div>
    </div>
  )
}

const MONTHLY_SUMMARY_ROWS = [
  { key: 'expected_minutes', label: 'Total Working Hours (Expected)', tone: 'text-slate-700 dark:text-slate-200' },
  { key: 'worked_minutes', label: 'Total Worked Hours', tone: 'text-slate-700 dark:text-slate-200' },
  { key: 'overtime_minutes', label: 'Overtime', tone: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'late_minutes', label: 'Late Minutes', tone: 'text-orange-500' },
  { key: 'missing_minutes', label: 'Missing Hours', tone: 'text-rose-500' },
  { key: 'average_minutes', label: 'Average Daily Work Hours', tone: 'text-slate-700 dark:text-slate-200' },
  { key: 'longest_minutes', label: 'Longest Work Day', tone: 'text-slate-700 dark:text-slate-200' },
  { key: 'shortest_minutes', label: 'Shortest Work Day', tone: 'text-slate-700 dark:text-slate-200' },
]

const REQUEST_TONES = [
  'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  'bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
]

const CHART_STATUS_COLORS = {
  present: '#10b981',
  late: '#f97316',
  absent: '#f43f5e',
  personal_request: '#3b82f6',
  day_off: '#0ea5e9',
  missing_checkin: '#8b5cf6',
  missing_checkout: '#d946ef',
  early_checkout: '#eab308',
}

function EmployeeReportCharts({ days = [], summary = {} }) {
  const dailyHours = days.map((day) => ({
    day: new Date(`${day.date}T12:00:00`).getDate(),
    worked: Number(((Number(day.work_minutes) || 0) / 60).toFixed(2)),
    expected: Number(((Number(day.scheduled_minutes) || 0) / 60).toFixed(2)),
  }))
  const statusData = Object.entries(CHART_STATUS_COLORS)
    .map(([key, color]) => ({
      key,
      name: STATUS_META[key]?.label || key,
      value: Number(summary[key] || 0),
      color,
    }))
    .filter((item) => item.value > 0)
  const attended = Number(summary.present || 0) + Number(summary.late || 0)
  const workingDays = Number(summary.working_days || 0)
  const attendanceRate = workingDays ? Math.round((attended / workingDays) * 100) : 0

  return (
    <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr] print:hidden">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Work Hours</h2>
          <p className="mt-1 text-xs text-slate-500">Worked hours compared with scheduled hours</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart data={dailyHours} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="h" />
              <Tooltip
                formatter={(value, name) => [`${value}h`, name === 'worked' ? 'Worked' : 'Expected']}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="expected" fill="#dbeafe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="worked" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-blue-100" />Expected</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Worked</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
        <p className="mt-1 text-xs text-slate-500">Status breakdown for this employee</p>
        <div className="relative mx-auto mt-2 h-52 max-w-xs">
          {statusData.length ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2}>
                    {statusData.map((item) => <Cell key={item.key} fill={item.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{attendanceRate}%</p>
                  <p className="text-[10px] font-medium text-slate-500">Attendance</p>
                </div>
              </div>
            </>
          ) : (
            <div className="grid h-full place-items-center text-xs text-slate-400">No attendance data</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {statusData.map((item) => (
            <div key={item.key} className="flex min-w-0 items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 flex-1 truncate text-slate-500">{item.name}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function MonthlyDetailSummary({ monthlySummary = {}, requestSummary = {}, lateAnalysis = {} }) {
  const requestRows = Object.entries(requestSummary)
  const totalRequests = requestRows.reduce((total, [, count]) => total + Number(count || 0), 0)

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_0.72fr] print:hidden">
      <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Calendar size={108} className="pointer-events-none absolute bottom-10 right-7 text-slate-100 dark:text-slate-800/60" />
        <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Monthly Summary</h2>
        <div className="relative divide-y divide-slate-100 dark:divide-slate-800">
          {MONTHLY_SUMMARY_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 py-2 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">{row.label}</span>
              <span className={clsx('font-bold tabular-nums', row.tone)}>
                {fmtSummaryMinutes(monthlySummary[row.key])}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Leave &amp; Requests Summary</h2>
        {requestRows.length ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requestRows.map(([type, count], index) => (
              <div key={type} className="flex items-center gap-3 py-2">
                <span className={clsx('grid h-7 w-7 shrink-0 place-items-center rounded-full', REQUEST_TONES[index % REQUEST_TONES.length])}>
                  <FileText size={13} />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600 dark:text-slate-300">{type}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {count} Request{Number(count) === 1 ? '' : 's'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-slate-200 text-center dark:border-slate-700">
            <div>
              <FileText size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium text-slate-400">No approved requests this month</p>
            </div>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/60">
          <span className="font-bold text-slate-700 dark:text-slate-200">Total Requests</span>
          <span className="font-bold text-slate-900 dark:text-white">{totalRequests}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-950/50">
            <Clock size={14} />
          </span>
          Late Analysis
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            ['Total Late Days', lateAnalysis.days ?? 0, 'text-slate-800 dark:text-slate-100'],
            ['Total Late Minutes', `${lateAnalysis.total_minutes ?? 0} mins`, 'text-orange-500'],
            ['Average Late', `${lateAnalysis.average_minutes ?? 0} mins`, 'text-slate-800 dark:text-slate-100'],
            ['Longest Late', `${lateAnalysis.longest_minutes ?? 0} mins`, 'text-slate-800 dark:text-slate-100'],
            ['Late Deduction', `$${Number(lateAnalysis.deduction_amount || 0).toFixed(2)}`, 'text-rose-500'],
          ].map(([label, value, tone]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
              <span className={clsx('whitespace-nowrap font-bold tabular-nums', tone)}>{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function MonthToolbar({ monthLabel, onPrev, onNext, onToday, disabled }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center gap-3">
        <p className="text-sm font-bold text-slate-800 dark:text-white sm:text-base">{monthLabel}</p>
        <button
          type="button"
          onClick={onToday}
          disabled={disabled}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
        >
          Today
        </button>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

function AttendanceTableRows({ days }) {
  return days.map((day, i) => {
    const rowTone = STATUS_META[day.status]?.row || ''
    const isLate = Number(day.late_minutes) > 0
    const checkInTime = displayReportTime(day, 'check_in')
    const checkOutTime = displayReportTime(day, 'check_out')

    return (
      <tr
        key={`${day.date}-${i}`}
        className={clsx(
          'transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10',
          rowTone,
        )}
      >
        <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
          {formatDateShort(day.date)}
        </td>
        <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="block font-semibold text-slate-700 dark:text-slate-300">{day.schedule || '–'}</span>
          <span>{day.day}</span>
        </td>
        <td className="px-4 py-3.5">
          {checkInTime ? (
            <span
              className={clsx(
                'font-semibold',
                isLate ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300',
              )}
            >
              {checkInTime}
            </span>
          ) : (
            <span className="text-slate-300 dark:text-slate-600">–</span>
          )}
        </td>
        <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
          {checkOutTime || <span className="text-slate-300 dark:text-slate-600">–</span>}
        </td>
        <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
          {fmtWork(day.work_minutes)}
        </td>
        <td className={clsx('whitespace-nowrap px-4 py-3.5 font-semibold', isLate ? 'text-orange-600' : 'text-slate-400')}>
          {isLate ? `${day.late_minutes} min` : '–'}
        </td>
        <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-rose-500">
          ${Number(day.deduction_amount || 0).toFixed(2)}
        </td>
        <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
          {Number(day.overtime_minutes || 0) > 0 ? fmtWork(day.overtime_minutes) : '–'}
        </td>
        <td className="px-4 py-3.5">
          <StatusBadge status={day.status} />
        </td>
      </tr>
    )
  })
}

function DesktopReportCard({ days, monthLabel, onPrev, onNext, onToday, disabled }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block print:hidden">
      <MonthToolbar
        monthLabel={monthLabel}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
        disabled={disabled}
      />
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Details</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>View by:</span>
          <span className="inline-flex h-8 items-center gap-5 rounded-lg border border-slate-200 bg-white px-3 font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Daily
            <ChevronDown size={13} />
          </span>
        </div>
      </div>
      {days.length === 0 ? (
        <div className="p-14 text-center">
          <Calendar size={44} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
          <p className="font-medium text-slate-400">No records match the selected filters.</p>
        </div>
      ) : (
        <div>
          <table className="w-full table-fixed text-sm">
            <thead className="bg-slate-50 shadow-sm dark:bg-slate-800/95">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {TABLE_COLS.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              <AttendanceTableRows days={days} />
            </tbody>
          </table>
        </div>
      )}
      <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {LEGEND_ITEMS.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={clsx('h-2.5 w-2.5 rounded-full', l.dot)} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-emerald-100 bg-emerald-50 px-5 py-3 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/25 dark:text-emerald-300">
        <strong>Note:</strong> Working hours is calculated based on Check In and Check Out.
      </div>
    </div>
  )
}

function MobileMonthToolbar({ monthLabel, onPrev, onNext, disabled }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>
      <p className="text-sm font-bold text-slate-800 dark:text-white">{monthLabel}</p>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

function MobileReportCard({ days, monthLabel, onPrev, onNext, mobileShown, onShowMore, disabled }) {
  const visible = days.slice(0, mobileShown)
  const remaining = days.length - mobileShown

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:hidden print:hidden">
      <MobileMonthToolbar monthLabel={monthLabel} onPrev={onPrev} onNext={onNext} disabled={disabled} />

      {days.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-400">No records for this month.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[340px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
                {MOBILE_TABLE_COLS.map((h) => (
                  <th
                    key={h}
                    className="px-2 py-2.5 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {visible.map((day, i) => {
                const isLate = Number(day.late_minutes) > 0
                const checkInTime = displayReportTime(day, 'check_in')
                const checkOutTime = displayReportTime(day, 'check_out')
                return (
                  <tr key={`${day.date}-${i}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                    <td className="whitespace-nowrap px-2 py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      {formatDateMobile(day.date)}
                    </td>
                    <td className="px-2 py-2.5 text-slate-400">{day.day}</td>
                    <td className="px-2 py-2.5">
                      {checkInTime ? (
                        <span className={clsx('font-semibold', isLate && 'text-amber-600')}>
                          {checkInTime}
                        </span>
                      ) : (
                        <span className="text-slate-300">–</span>
                      )}
                    </td>
                    <td className="px-2 py-2.5 font-medium text-slate-700 dark:text-slate-300">
                      {checkOutTime || <span className="text-slate-300">–</span>}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-medium text-slate-700 dark:text-slate-300">
                      {fmtWork(day.work_minutes)}
                    </td>
                    <td className="px-2 py-2.5">
                      <StatusBadge status={day.status} compact />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {remaining > 0 && (
        <button
          type="button"
          onClick={onShowMore}
          className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50"
        >
          View More
          <ChevronDown size={16} />
        </button>
      )}

      <div className="border-t border-slate-100 px-3 py-3 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
          {LEGEND_ITEMS.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={clsx('h-2 w-2 shrink-0 rounded-full', l.dot)} />
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const filterControlCls =
  'h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

function FilterField({ label, required, children, className }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {label}
        {required && <span className="normal-case text-rose-500"> *</span>}
      </label>
      <div className="relative min-w-0">{children}</div>
    </div>
  )
}

function FilterSelect({
  label,
  icon: Icon,
  required,
  value,
  onChange,
  disabled,
  children,
  className,
}) {
  return (
    <FilterField label={label} icon={Icon} required={required} className={className}>
      <div className="relative min-w-0">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          />
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            filterControlCls,
            'appearance-none truncate pl-10 pr-9',
            disabled && 'cursor-not-allowed bg-slate-50 text-slate-600 dark:bg-slate-800/60',
          )}
        >
          {children}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </FilterField>
  )
}

function FilterMonthInput({ value, onChange }) {
  return (
    <FilterField label="Month" required>
      <div className="relative min-w-0">
        <Calendar
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
        />
        <input
          type="month"
          value={value}
          onChange={onChange}
          className={clsx(filterControlCls, 'pl-10')}
        />
      </div>
    </FilterField>
  )
}

/** Locked employee field for users with employee_report.view_own only */
function OwnEmployeeField({ employeeId, displayName, employeeCode }) {
  const label = displayName || 'Your profile'
  const sub = employeeCode ? ` (${employeeCode})` : ''
  return (
    <FilterSelect label="Employee" icon={UserRound} value={employeeId} disabled>
      <option value={employeeId}>
        {label}
        {sub}
      </option>
    </FilterSelect>
  )
}

function MobileFilterToolbar({
  filtersOpen,
  onToggleFilters,
  exportOpen,
  onToggleExport,
  onExportExcel,
  onPrint,
  hasExport,
  exportReady,
  exporting,
}) {
  return (
    <div className="flex items-center gap-2 lg:hidden print:hidden">
      <button
        type="button"
        onClick={onToggleFilters}
        className={clsx(
          'inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition',
          filtersOpen
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
        )}
      >
        <Filter size={16} />
        {filtersOpen ? 'Hide filters' : 'Show filters'}
      </button>
      {hasExport && (
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onToggleExport}
            disabled={!exportReady}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
            aria-label="Export options"
          >
            <FileSpreadsheet size={18} className="text-emerald-600" />
          </button>
          {exportOpen && exportReady && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => onToggleExport(false)} aria-hidden />
              <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  disabled={exporting}
                  onClick={() => {
                    onToggleExport(false)
                    setTimeout(() => onExportExcel(), 200)
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:hover:bg-emerald-950/30"
                >
                  <FileSpreadsheet size={16} />
                  {exporting ? 'Exporting…' : 'Export Excel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleExport(false)
                    setTimeout(() => onPrint(), 200)
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Printer size={16} />
                  Print
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function PrintReportSheet({ report }) {
  if (!report?.data?.employee) return null

  const { data, filters } = report
  const { employee, summary, days, month_label: monthLabel } = data

  return (
    <div className="monthly-report-print-sheet hidden">
      <h1 className="text-xl font-bold text-slate-900">Employee Monthly Report</h1>
      <p className="mt-1 text-sm text-slate-600">{monthLabel}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600 sm:grid-cols-4">
        <p>
          <span className="font-semibold">Month:</span> {filters.monthLabel}
        </p>
        <p>
          <span className="font-semibold">Employee:</span> {employee.name}
        </p>
        <p>
          <span className="font-semibold">Department:</span> {filters.departmentLabel}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {filters.statusLabel}
        </p>
      </div>

      <div className="mt-4 rounded border border-slate-200 p-3 text-sm">
        <p className="font-bold">{employee.name}</p>
        <p className="text-slate-600">
          {[employee.employee_code, employee.position, employee.department, employee.branch]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm sm:grid-cols-6">
        {CARDS_CONFIG.map((c) => (
          <div key={c.key} className="rounded border border-slate-200 p-2">
            <p className="text-[10px] text-slate-500">{c.label}</p>
            <p className="text-base font-bold">{summary[c.key] ?? 0}</p>
          </div>
        ))}
      </div>

      <table className="mt-6 w-full border-collapse text-[11px]">
        <thead>
          <tr className="border-b-2 border-slate-400 bg-slate-50">
            {TABLE_COLS.map((h) => (
              <th key={h} className="px-2 py-2 text-left font-bold text-slate-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date} className="border-b border-slate-200">
              <td className="px-2 py-1.5">{formatDateShort(day.date)}</td>
              <td className="px-2 py-1.5">{day.schedule || '–'}</td>
              <td className="px-2 py-1.5">{displayReportTime(day, 'check_in') || '–'}</td>
              <td className="px-2 py-1.5">{displayReportTime(day, 'check_out') || '–'}</td>
              <td className="px-2 py-1.5">{fmtWork(day.work_minutes)}</td>
              <td className="px-2 py-1.5">{day.late_minutes ? `${day.late_minutes} min` : '–'}</td>
              <td className="px-2 py-1.5">${Number(day.deduction_amount || 0).toFixed(2)}</td>
              <td className="px-2 py-1.5">{Number(day.overtime_minutes || 0) > 0 ? fmtWork(day.overtime_minutes) : '–'}</td>
              <td className="px-2 py-1.5">{STATUS_META[day.status]?.label || day.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-[10px] text-slate-500">
        Working hours are calculated from check-in and check-out times. Printed{' '}
        {new Date().toLocaleString()}.
      </p>
    </div>
  )
}

export default function EmployeeMonthlyReportPage({ user, appData }) {
  const employees = appData?.employees || []
  const canViewAll = canAccess(user, ['employee_report.view_all'])
  const canViewOwn = canAccess(user, ['employee_report.view_own'])
  const canExport = canAccess(user, ['employee_report.export'])
  const isViewOwnOnly = canViewOwn && !canViewAll

  const departments = useMemo(() => {
    const map = new Map()
    employees.forEach((e) => {
      if (e.department?.id) map.set(e.department.id, e.department)
    })
    return [...map.values()].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [employees])

  const now = currentMonthStr()
  const selfId = user?.employee_id ?? user?.employee?.id
  const selfIdStr = selfId ? String(selfId) : ''
  const selfEmployee = useMemo(() => {
    if (user?.employee) return user.employee
    return employees.find((e) => String(e.id) === selfIdStr) ?? null
  }, [user?.employee, employees, selfIdStr])
  const selfDisplayName = selfEmployee
    ? [selfEmployee.first_name, selfEmployee.last_name].filter(Boolean).join(' ')
    : user?.name || ''
  const selfEmployeeCode = selfEmployee?.employee_code || user?.employee?.employee_code || ''

  const defaultEmpId = isViewOwnOnly && selfIdStr ? selfIdStr : ''

  const [month, setMonth] = useState(now)
  const [employeeId, setEmployeeId] = useState(defaultEmpId)
  const [departmentId, setDeptId] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [draftMonth, setDraftMonth] = useState(now)
  const [draftEmp, setDraftEmp] = useState(defaultEmpId)
  const [draftDept, setDraftDept] = useState('')
  const [draftStatus, setDraftStatus] = useState('')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)
  const [mobileShown, setMobileShown] = useState(MOBILE_PAGE_SIZE)
  const [exportOpen, setExportOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(true)
  const reportSnapshotRef = useRef(null)

  const filteredEmployees = useMemo(() => {
    if (!draftDept) return employees
    return employees.filter((e) => String(e.department?.id) === draftDept)
  }, [employees, draftDept])

  useEffect(() => {
    if (isViewOwnOnly && selfIdStr) {
      setDraftEmp(selfIdStr)
      setEmployeeId(selfIdStr)
    }
  }, [isViewOwnOnly, selfIdStr])

  const buildFilterLabels = useCallback(
    (m, eid, did, s) => {
      const dept = departments.find((d) => String(d.id) === String(did))
      const emp =
        employees.find((e) => String(e.id) === String(eid)) ||
        (String(eid) === selfIdStr ? selfEmployee : null)
      const statusOpt = STATUS_FILTER_OPTIONS.find((o) => o.value === s)
      return {
        monthLabel: formatMonthLabel(m),
        employeeLabel: emp
          ? [emp.first_name, emp.last_name].filter(Boolean).join(' ')
          : isViewOwnOnly
            ? selfDisplayName
            : '—',
        departmentLabel: dept?.name || 'All departments',
        statusLabel: statusOpt?.label || 'All Status',
      }
    },
    [departments, employees, isViewOwnOnly, selfDisplayName, selfEmployee, selfIdStr],
  )

  const fetchReport = useCallback(
    async ({ month: m, employeeId: eid, departmentId: did, status: s }) => {
      setLoading(true)
      setError(null)
      try {
        const params = { month: m }
        if (eid) params.employee_id = eid
        if (did) params.department_id = did
        if (s) params.status = s
        const res = await employeeMonthlyReportService.fetch(params)
        setData(res)
        setMobileShown(MOBILE_PAGE_SIZE)
        reportSnapshotRef.current = {
          data: res,
          params: { month: m, employeeId: eid, departmentId: did, status: s },
          filters: buildFilterLabels(m, eid || (isViewOwnOnly ? selfIdStr : ''), did, s),
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report.')
      } finally {
        setLoading(false)
      }
    },
    [buildFilterLabels, isViewOwnOnly, selfIdStr],
  )

  const handleSearch = () => {
    const empId = isViewOwnOnly ? selfIdStr : draftEmp

    if (canViewAll && !empId) {
      setError('Please select an employee.')
      return
    }
    if (isViewOwnOnly && !selfIdStr) {
      setError('Your user account is not linked to an employee profile.')
      return
    }

    setMonth(draftMonth)
    setEmployeeId(empId)
    setDeptId(draftDept)
    setStatusFilter(draftStatus)
    fetchReport({
      month: draftMonth,
      employeeId: isViewOwnOnly ? '' : empId,
      departmentId: draftDept,
      status: draftStatus,
    })
  }

  const applyDesktopFilters = ({ employee = draftEmp, reportMonth = draftMonth } = {}) => {
    const empId = isViewOwnOnly ? selfIdStr : employee
    setDraftEmp(empId)
    setDraftMonth(reportMonth)

    if (!empId) {
      setEmployeeId('')
      setData(null)
      setError(null)
      reportSnapshotRef.current = null
      return
    }

    setMonth(reportMonth)
    setEmployeeId(empId)
    setDeptId('')
    setStatusFilter('')
    setDraftDept('')
    setDraftStatus('')
    fetchReport({
      month: reportMonth,
      employeeId: isViewOwnOnly ? '' : empId,
      departmentId: '',
      status: '',
    })
  }

  const handleReset = () => {
    const m = currentMonthStr()
    const emp = isViewOwnOnly ? selfIdStr : ''
    setDraftMonth(m)
    setDraftEmp(emp)
    setDraftDept('')
    setDraftStatus('')
    setMonth(m)
    setEmployeeId(emp)
    setDeptId('')
    setStatusFilter('')
    setData(null)
    setError(null)
    reportSnapshotRef.current = null
  }

  const handleMonthNav = (delta) => {
    const newMonth = shiftMonth(month, delta)
    setMonth(newMonth)
    setDraftMonth(newMonth)
    fetchReport({ month: newMonth, employeeId, departmentId, status: statusFilter })
  }

  const handleToday = () => {
    const m = currentMonthStr()
    setMonth(m)
    setDraftMonth(m)
    fetchReport({ month: m, employeeId, departmentId, status: statusFilter })
  }

  const appliedEmpId = isViewOwnOnly ? selfIdStr : employeeId
  const filtersDirty =
    draftMonth !== month ||
    (canViewAll && draftEmp !== appliedEmpId) ||
    draftDept !== departmentId ||
    draftStatus !== statusFilter

  const buildExportParams = () => {
    const snap = reportSnapshotRef.current
    if (!snap) return null
    const { month: m, employeeId: eid, departmentId: did, status: s } = snap.params
    const params = { month: m }
    if (eid) params.employee_id = eid
    if (did) params.department_id = did
    if (s) params.status = s
    return params
  }

  const requireLoadedReport = () => {
    if (filtersDirty) {
      setError('Filters changed. Click Search to load the report, then export or print.')
      return false
    }
    if (!reportSnapshotRef.current?.data?.employee) {
      setError('Click Search to load the report first.')
      return false
    }
    return true
  }

  const handleExportExcel = async () => {
    if (!requireLoadedReport()) return
    const snap = reportSnapshotRef.current
    const exportParams = buildExportParams()
    if (!exportParams) return

    setExporting(true)
    setError(null)
    try {
      if (canExport) {
        const blob = await employeeMonthlyReportService.exportCsv(exportParams)
        downloadBlob(
          new Blob([blob], { type: 'text/csv;charset=utf-8;' }),
          `monthly-report-${snap.data.employee?.employee_code || 'emp'}-${snap.data.month}.csv`,
        )
        return
      }
      downloadBlob(
        new Blob([buildClientCsv(snap.data)], { type: 'text/csv;charset=utf-8;' }),
        `monthly-report-${snap.data.employee?.employee_code || 'emp'}-${snap.data.month}.csv`,
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Export failed. Click Search and try again.')
      downloadBlob(
        new Blob([buildClientCsv(snap.data)], { type: 'text/csv;charset=utf-8;' }),
        `monthly-report-${snap.data.employee?.employee_code || 'emp'}-${snap.data.month}.csv`,
      )
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = () => {
    if (!requireLoadedReport()) return
    setError(null)
    requestAnimationFrame(() => {
      window.print()
    })
  }

  const days = data?.days || []
  const summary = data?.summary || {}
  const employee = data?.employee || null
  const scheduleName = data?.schedule?.name || null
  const monthLabel = data?.month_label || formatMonthLabel(data?.month || month)
  const hasExportData = Boolean(
    reportSnapshotRef.current?.data?.employee && !filtersDirty,
  )
  const showReport = Boolean(employee)

  const exportButtons = (
    <>
      <button
        type="button"
        onClick={handleExportExcel}
        disabled={!hasExportData || exporting}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-900 dark:bg-slate-900 dark:hover:bg-emerald-950/30"
      >
        <FileSpreadsheet size={16} />
        {exporting ? 'Exporting…' : 'Export Excel'}
      </button>
      <button
        type="button"
        onClick={handlePrint}
        disabled={!hasExportData}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900"
      >
        <Printer size={16} className="text-slate-400" />
        Print
      </button>
    </>
  )

  return (
    <div className="employee-monthly-report space-y-4 p-3 pb-24 sm:space-y-5 sm:p-6 print:space-y-4 print:p-0">
      <PrintReportSheet report={reportSnapshotRef.current} />

      <MobileFilterToolbar
        filtersOpen={mobileFiltersOpen}
        onToggleFilters={() => setMobileFiltersOpen((v) => !v)}
        exportOpen={exportOpen}
        onToggleExport={(open) => setExportOpen(typeof open === 'boolean' ? open : (v) => !v)}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
        hasExport={false}
        exportReady={hasExportData}
        exporting={exporting}
      />

      {/* Filters */}
      <div
        className={clsx(
          'overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-0 print:hidden',
          !mobileFiltersOpen && 'hidden lg:block',
        )}
      >
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Report filters</p>
          <p className="text-xs text-slate-500">Choose month and options, then search</p>
        </div>

        <div className="p-4 sm:p-5">
        {/* Mobile layout */}
        <div className="space-y-4 lg:hidden">
          <FilterMonthInput value={draftMonth} onChange={(e) => setDraftMonth(e.target.value)} />

          {isViewOwnOnly && selfIdStr && (
            <OwnEmployeeField
              employeeId={selfIdStr}
              displayName={selfDisplayName}
              employeeCode={selfEmployeeCode}
            />
          )}

          {canViewAll && (
            <FilterSelect
              label="Employee"
              icon={UserRound}
              value={draftEmp}
              onChange={(e) => setDraftEmp(e.target.value)}
            >
              <option value="">Select employee</option>
              {filteredEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {[e.first_name, e.last_name].filter(Boolean).join(' ')}
                  {e.employee_code ? ` (${e.employee_code})` : ''}
                </option>
              ))}
            </FilterSelect>
          )}

          {canViewAll && (
            <FilterSelect
              label="Department"
              icon={Building2}
              value={draftDept}
              onChange={(e) => {
                setDraftDept(e.target.value)
                setDraftEmp('')
              }}
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </FilterSelect>
          )}

          {isViewOwnOnly && (
            <FilterSelect label="Department" icon={Building2} value="" disabled>
              <option value="">
                {selfEmployee?.department?.name || user?.employee?.department?.name || '—'}
              </option>
            </FilterSelect>
          )}

          <FilterSelect
            label="Status"
            icon={Filter}
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </FilterSelect>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                handleSearch()
                setMobileFiltersOpen(false)
              }}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
            >
              <Search size={16} />
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          {canExport && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              {exportButtons}
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex lg:items-end lg:gap-7">
          <div className="w-[270px] shrink-0">
            {isViewOwnOnly && selfIdStr && (
              <OwnEmployeeField
                employeeId={selfIdStr}
                displayName={selfDisplayName}
                employeeCode={selfEmployeeCode}
              />
            )}
            {canViewAll && (
              <FilterField label="Employee" required>
                <div className="relative">
                  <UserRound size={15} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
                  <select
                    value={draftEmp}
                    onChange={(e) => applyDesktopFilters({ employee: e.target.value })}
                    className={clsx(inputCls, 'appearance-none pl-9 pr-8')}
                  >
                    <option value="">Select employee</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {[e.first_name, e.last_name].filter(Boolean).join(' ')}
                        {e.employee_code ? ` (${e.employee_code})` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FilterField>
            )}
          </div>

          <div className="w-[260px] shrink-0">
            <FilterField label="Month" required>
              <div className="flex h-11 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => applyDesktopFilters({ reportMonth: shiftMonth(draftMonth, -1) })}
                  className="grid w-11 shrink-0 place-items-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="relative min-w-0 flex-1">
                  <input
                    type="month"
                    value={draftMonth}
                    onChange={(e) => applyDesktopFilters({ reportMonth: e.target.value })}
                    className="h-full w-full border-0 bg-transparent px-3 text-center text-sm font-bold text-slate-800 outline-none dark:text-slate-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => applyDesktopFilters({ reportMonth: shiftMonth(draftMonth, 1) })}
                  className="grid w-11 shrink-0 place-items-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </FilterField>
          </div>

          <div className="ml-auto flex items-center gap-2 pb-px">
            {canExport && exportButtons}
            <button
              type="button"
              onClick={handleReset}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              title="Reset report"
              aria-label="Reset report"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
        </div>
      </div>

      {loading && <FloatingSpinner />}
      {filtersDirty && data && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 print:hidden dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertCircle size={18} className="shrink-0" />
          Filters changed — click <strong>Search</strong> before export or print.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 print:hidden">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 print:hidden dark:border-slate-700 dark:bg-slate-800/30">
          <Search size={32} className="mx-auto mb-3 text-slate-300" />
          {canViewAll ? (
            <p>
              Select <strong>Month</strong> and <strong>Employee</strong>, then click <strong>Search</strong>.
            </p>
          ) : (
            <p>
              Your employee is selected automatically. Choose <strong>Month</strong> and click{' '}
              <strong>Search</strong>.
            </p>
          )}
        </div>
      )}

      {data && !showReport && canViewAll && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 print:hidden">
          <UserRound size={32} className="mx-auto mb-3 text-slate-300" />
          Select an <strong>Employee</strong> and click <strong>Search</strong> to load the report.
        </div>
      )}

      {showReport && (
        <>
          <div className="hidden items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 shadow-sm sm:flex dark:from-emerald-950/30 dark:to-slate-900 print:hidden">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
              {employee.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">{employee.name}</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                {[employee.employee_code, employee.position, employee.department, employee.branch, scheduleName]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:hidden print:hidden">
            {CARDS_CONFIG.map((c) => (
              <SummaryCard
                key={c.key}
                label={c.label}
                value={summary[c.key] ?? 0}
                icon={c.icon}
                tone={c.tone}
                compact
              />
            ))}
          </div>
          <div className="hidden grid-cols-3 gap-3 lg:grid xl:grid-cols-6 print:hidden">
            {CARDS_CONFIG.map((c) => (
              <SummaryCard
                key={c.key}
                label={c.label}
                value={summary[c.key] ?? 0}
                icon={c.icon}
                tone={c.tone}
                trend={monthLabel}
              />
            ))}
          </div>

          <EmployeeReportCharts days={days} summary={summary} />

          <MonthlyDetailSummary
            monthlySummary={data?.monthly_summary}
            requestSummary={data?.request_summary}
            lateAnalysis={data?.late_analysis}
          />

          <DesktopReportCard
            days={days}
            monthLabel={monthLabel}
            onPrev={() => handleMonthNav(-1)}
            onNext={() => handleMonthNav(1)}
            onToday={handleToday}
            disabled={loading}
          />

          <MobileReportCard
            days={days}
            monthLabel={monthLabel}
            onPrev={() => handleMonthNav(-1)}
            onNext={() => handleMonthNav(1)}
            mobileShown={mobileShown}
            onShowMore={() => setMobileShown((v) => v + MOBILE_PAGE_SIZE)}
            disabled={loading}
          />

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 lg:hidden print:hidden dark:border-emerald-900/40 dark:bg-emerald-950/25 dark:text-emerald-300">
            <strong>Note:</strong> Working hours is calculated based on Check In and Check Out.
          </div>
        </>
      )}
    </div>
  )
}
