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
  Eye,
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
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    dot: 'bg-blue-500',
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
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    row: '',
  },
  missing_checkout: {
    label: 'Missing Check Out',
    badge: 'bg-orange-200 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300',
    dot: 'bg-orange-700',
    row: '',
  },
  missing_attendance: {
    label: 'Missing Check In',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    row: '',
  },
  day_off: {
    label: 'Day Off',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400',
    dot: 'bg-violet-500',
    row: 'bg-sky-50/40 dark:bg-sky-950/10',
  },
  on_leave: {
    label: 'Personal Leave',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
    dot: 'bg-cyan-500',
    row: '',
  },
  leave: {
    label: 'Personal Leave',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
    dot: 'bg-cyan-500',
    row: '',
  },
  half_day: {
    label: 'Half Day',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    dot: 'bg-amber-500',
    row: '',
  },
  personal_request: {
    label: 'Personal Leave',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
    dot: 'bg-cyan-500',
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
  { key: 'present', label: 'Present', icon: CheckCircle2, tone: 'emerald' },
  { key: 'absent', label: 'Absent', icon: UserX, tone: 'rose' },
  { key: 'late', label: 'Late Check In', icon: Clock, tone: 'orange' },
  { key: 'missing_checkin', label: 'Missing Check In', icon: AlertCircle, tone: 'gray' },
  { key: 'early_checkout', label: 'Early Check Out', icon: LogOut, tone: 'blue' },
  { key: 'day_off', label: 'Day Off', icon: Umbrella, tone: 'violet' },
  { key: 'missing_checkout', label: 'Missing Check Out', icon: LogOut, tone: 'darkOrange' },
  { key: 'personal_request', label: 'Personal Leave', icon: XCircle, tone: 'cyan' },
  { key: 'half_day', label: 'Half Day', icon: Clock, tone: 'amber' },
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
  gray: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300',
  darkOrange: 'bg-orange-200 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400',
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
  gray: 'text-slate-500 dark:text-slate-300',
  darkOrange: 'text-orange-800 dark:text-orange-300',
  sky: 'text-sky-700 dark:text-sky-300',
  blue: 'text-blue-700 dark:text-blue-300',
  cyan: 'text-cyan-700 dark:text-cyan-300',
}

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late Check In' },
  { value: 'early_checkout', label: 'Early Check Out' },
  { value: 'absent', label: 'Absent' },
  { value: 'missing_checkin', label: 'Missing Check In' },
  { value: 'missing_checkout', label: 'Missing Check Out' },
  { value: 'personal_request', label: 'Personal Leave' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'day_off', label: 'Day Off' },
  { value: 'holiday', label: 'Holiday' },
]

const LEGEND_ITEMS = [
  { dot: 'bg-emerald-500', label: 'Present' },
  { dot: 'bg-rose-500', label: 'Absent' },
  { dot: 'bg-orange-500', label: 'Late Check In' },
  { dot: 'bg-slate-400', label: 'Missing Check In' },
  { dot: 'bg-blue-500', label: 'Early Check Out' },
  { dot: 'bg-violet-500', label: 'Day Off' },
  { dot: 'bg-orange-700', label: 'Missing Check Out' },
  { dot: 'bg-cyan-500', label: 'Personal Leave' },
  { dot: 'bg-amber-500', label: 'Half Day' },
]

const TABLE_COLS = ['Date', 'Schedule', 'Check In', 'Check Out', 'Work Hours', 'Late', 'Deduction', 'Overtime', 'Status']
const MOBILE_TABLE_COLS = ['Date', 'Day', 'In', 'Out', 'Hours', 'Status']
const MOBILE_PAGE_SIZE = 10

const PRINT_TEXT = {
  en: {
    title: 'Monthly Report',
    employeeInfo: 'Employee Information',
    employee: 'Employee',
    employeeId: 'Employee ID',
    position: 'Position',
    department: 'Department',
    reportMonth: 'Report Month',
    attendanceSummary: 'Attendance Summary',
    attendanceRecords: 'Attendance Records',
    leaveAbsence: 'Leave & Absence',
    qty: 'Qty',
    status: 'Status',
    total: 'Total',
    workingDays: 'Working Days',
    present: 'Present',
    late: 'Late Check In',
    earlyCheckout: 'Early Check Out',
    absent: 'Absent',
    missingCheckin: 'Missing Check In',
    missingCheckout: 'Missing Check Out',
    dayOff: 'Day Off',
    personalRequest: 'Personal Leave',
    tableCols: TABLE_COLS,
    preparedBy: 'Prepared by',
    hrDepartment: 'HR Department',
    reviewedBy: 'Reviewed by',
    departmentManager: 'Department Manager',
    approvedBy: 'Approved by',
    authorizedSignature: 'Authorized Signature',
  },
  km: {
    title: 'របាយការណ៍ប្រចាំខែ',
    employeeInfo: 'ព័ត៌មានបុគ្គលិក',
    employee: 'បុគ្គលិក',
    employeeId: 'លេខសម្គាល់បុគ្គលិក',
    position: 'តួនាទី',
    department: 'ផ្នែក',
    reportMonth: 'ខែរបាយការណ៍',
    attendanceSummary: 'សង្ខេបវត្តមាន',
    attendanceRecords: 'កំណត់ត្រាវត្តមាន',
    leaveAbsence: 'ការឈប់ និងអវត្តមាន',
    qty: 'ចំនួន',
    status: 'ស្ថានភាព',
    total: 'សរុប',
    workingDays: 'រំពឹងច៉នួនថ្ងៃធ្វើការ',
    present: 'មានវត្តមាន',
    late: 'ចូលយឺត',
    earlyCheckout: 'ចេញមុន',
    absent: 'អវត្តមាន',
    missingCheckin: 'ភ្លេចចុចចូល',
    missingCheckout: 'ភ្លេចចុចចេញ',
    dayOff: 'ថ្ងៃឈប់សម្រាក',
    personalRequest: 'សំណើផ្ទាល់ខ្លួន',
    tableCols: ['កាលបរិច្ឆេទ', 'កាលវិភាគ', 'ម៉ោងចូល', 'ម៉ោងចេញ', 'ម៉ោងធ្វើការ', 'យឺត', 'ការកាត់', 'ថែមម៉ោង', 'ស្ថានភាព'],
    preparedBy: 'រៀបចំដោយ',
    hrDepartment: 'ផ្នែកធនធានមនុស្ស',
    reviewedBy: 'ពិនិត្យដោយ',
    departmentManager: 'អ្នកគ្រប់គ្រងផ្នែក',
    approvedBy: 'អនុម័តដោយ',
    authorizedSignature: 'ហត្ថលេខាអនុញ្ញាត',
  },
}

const PRINT_STATUS_LABELS = {
  en: Object.fromEntries(Object.entries(STATUS_META).map(([key, meta]) => [key, meta.label])),
  km: {
    present: PRINT_TEXT.km.present,
    late: PRINT_TEXT.km.late,
    early_checkout: PRINT_TEXT.km.earlyCheckout,
    absent: PRINT_TEXT.km.absent,
    missing_checkin: PRINT_TEXT.km.missingCheckin,
    missing_checkout: PRINT_TEXT.km.missingCheckout,
    missing_attendance: PRINT_TEXT.km.missingCheckin,
    day_off: PRINT_TEXT.km.dayOff,
    on_leave: PRINT_TEXT.km.personalRequest,
    leave: PRINT_TEXT.km.personalRequest,
    half_day: 'ពាក់កណ្តាលថ្ងៃ',
    personal_request: PRINT_TEXT.km.personalRequest,
    holiday: 'ថ្ងៃឈប់បុណ្យ',
  },
}

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
  half_day: 'Half Day',
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

function formatDateWithDay(dateStr, dayLabel) {
  if (!dateStr) return '–'
  const day = dayLabel || new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' })
  return `${formatDateShort(dateStr)} (${day})`
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

function attendanceDetailTotals(days = []) {
  return days.reduce(
    (totals, day) => ({
      work_minutes: totals.work_minutes + Number(day.work_minutes || 0),
      late_minutes: totals.late_minutes + Number(day.late_minutes || 0),
      deduction_amount: totals.deduction_amount + Number(day.deduction_amount || 0),
      overtime_minutes: totals.overtime_minutes + Number(day.overtime_minutes || 0),
    }),
    { work_minutes: 0, late_minutes: 0, deduction_amount: 0, overtime_minutes: 0 },
  )
}

const PAYROLL_FIELDS = [
  ['baseSalary', 'Base Salary'],
  ['allowances', 'Allowances'],
  ['overtime', 'Overtime'],
  ['commission', 'Commission'],
  ['bonus', 'Bonus'],
  ['deductions', 'Deductions'],
  ['tax', 'Tax'],
]

const EMPTY_PAYROLL_SUMMARY = PAYROLL_FIELDS.reduce((fields, [key]) => ({ ...fields, [key]: '' }), {})

const STATUS_SUMMARY_TEXT_COLOR = {
  present: '#059669',
  absent: '#DC2626',
  late: '#EA580C',
  missing_checkin: '#6B7280',
  missing_attendance: '#6B7280',
  early_checkout: '#2563EB',
  day_off: '#7C3AED',
  missing_checkout: '#C2410C',
  personal_request: '#0891B2',
  on_leave: '#0891B2',
  leave: '#0891B2',
  half_day: '#D97706',
}

function statusSummaryColor(key) {
  return STATUS_SUMMARY_TEXT_COLOR[key] || '#111827'
}

function defaultPayrollSummary(report, savedSummary = null) {
  const data = report?.data || {}
  const dailyTotals = attendanceDetailTotals(data.days || [])
  const deductionTotal = Number(data.late_analysis?.deduction_amount ?? dailyTotals.deduction_amount ?? 0)

  return {
    ...EMPTY_PAYROLL_SUMMARY,
    ...(savedSummary || {}),
    deductions: savedSummary?.deductions ?? deductionTotal.toFixed(2),
  }
}

function payrollNumber(value) {
  return Number(value || 0)
}

function payrollNet(summary = {}) {
  return (
    payrollNumber(summary.baseSalary) +
    payrollNumber(summary.allowances) +
    payrollNumber(summary.overtime) +
    payrollNumber(summary.commission) +
    payrollNumber(summary.bonus) -
    payrollNumber(summary.deductions) -
    payrollNumber(summary.tax)
  )
}

function fmtMoney(value) {
  return `$${payrollNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
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
    'Date', 'Schedule', 'Check In', 'Check Out', 'Work Hours', 'Late',
    'Deduction', 'Overtime', 'Status',
  ].join(',')
  const rows = (data.days || []).map((d) =>
    [
      esc(d.date),
      esc(d.schedule || '–'),
      esc(displayReportTime(d, 'check_in') || '–'),
      esc(displayReportTime(d, 'check_out') || '–'),
      esc(fmtWork(d.work_minutes)),
      esc(fmtWork(d.late_minutes)),
      esc(Number(d.deduction_amount || 0).toFixed(2)),
      esc(fmtWork(d.overtime_minutes || 0)),
      esc(STATUS_META[d.status]?.label || d.status),
    ].join(','),
  )
  const totals = attendanceDetailTotals(data.days || [])
  const totalRow = [
    esc('Total'),
    esc(''),
    esc(''),
    esc(''),
    esc(fmtWork(totals.work_minutes)),
    esc(fmtWork(totals.late_minutes)),
    esc(Number(totals.deduction_amount || 0).toFixed(2)),
    esc(fmtWork(totals.overtime_minutes)),
    esc(''),
  ].join(',')

  return [header, ...rows, totalRow].join('\n')
}

function buildClientExcel(data, payrollSummary = null) {
  const esc = (v) =>
    String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  const keyValueTable = (title, items) => `
    <table class="meta">
      <tr><th colspan="2">${esc(title)}</th></tr>
      ${items.map(([label, value]) => `<tr><td>${esc(label)}</td><td>${esc(value)}</td></tr>`).join('')}
    </table>
  `
  const summary = data.summary || {}
  const monthly = data.monthly_summary || {}
  const requests = data.request_summary || {}
  const late = data.late_analysis || {}
  const requestRows = Object.entries(requests)
  const workSummaryRows = [
    ['present', 'Present', summary.present ?? 0],
    ['late', 'Late Check In', summary.late ?? 0],
    ['early_checkout', 'Early Check Out', summary.early_checkout ?? 0],
    ['missing_checkout', 'Missing Check Out', summary.missing_checkout ?? 0],
  ]
  const absenceSummaryRows = [
    ['absent', 'Absent', summary.absent ?? 0],
    ['missing_checkin', 'Missing Check In', summary.missing_checkin ?? 0],
    ['day_off', 'Day Off', summary.day_off ?? 0],
    ['personal_request', 'Personal Leave', summary.personal_request ?? 0],
    ['half_day', 'Half Day', summary.half_day ?? 0],
  ]
  const workSummaryTotal = workSummaryRows.reduce((total, [, , value]) => total + Number(value || 0), 0)
  const absenceSummaryTotal = absenceSummaryRows.reduce((total, [, , value]) => total + Number(value || 0), 0)
  const payrollSummaryRows = payrollSummary
    ? PAYROLL_FIELDS.filter(([key]) => payrollNumber(payrollSummary[key]) !== 0).map(([key, label]) => {
        const isDeduction = key === 'deductions' || key === 'tax'
        return [label, isDeduction ? `(${fmtMoney(payrollSummary[key])})` : fmtMoney(payrollSummary[key])]
      })
    : []
  const netSalary = payrollSummary ? payrollNet(payrollSummary) : 0
  const hasNetSalary = netSalary !== 0
  const summaryRowCount = Math.max(workSummaryRows.length, absenceSummaryRows.length, payrollSummaryRows.length) + 1
  const summaryRowsHtml = Array.from({ length: summaryRowCount }).map((_, index) => {
    const isTotalRow = index === summaryRowCount - 1
    const [workKey = '', workLabel = '', workValue = ''] = isTotalRow ? ['', 'Total', workSummaryTotal] : workSummaryRows[index] || []
    const [absenceKey = '', absenceLabel = '', absenceValue = ''] = isTotalRow ? ['', 'Total', absenceSummaryTotal] : absenceSummaryRows[index] || []
    const [payrollLabel = '', payrollValue = ''] = isTotalRow
      ? hasNetSalary
        ? ['Net Salary', fmtMoney(netSalary)]
        : []
      : payrollSummaryRows[index] || []
    const workStyle = workKey ? ` style="color:${statusSummaryColor(workKey)};font-weight:700;"` : ''
    const absenceStyle = absenceKey ? ` style="color:${statusSummaryColor(absenceKey)};font-weight:700;"` : ''
    return `
      <tr>
        <td${workStyle}>${esc(workLabel)}</td><td${workStyle}>${esc(workValue)}</td>
        <td${absenceStyle}>${esc(absenceLabel)}</td><td${absenceStyle}>${esc(absenceValue)}</td>
        <td>${esc(payrollLabel)}</td><td>${esc(payrollValue)}</td>
      </tr>
    `
  }).join('')
  const summaryHtml = `
    <table class="meta">
      <tr><th colspan="6">Attendance Summary</th></tr>
      <tr><td>Working Days</td><td colspan="5">${esc(summary.working_days ?? 0)}</td></tr>
      <tr><th>Work</th><th>Qty</th><th>Absent</th><th>Qty</th><th>Payroll Summary</th><th>Amount</th></tr>
      ${summaryRowsHtml}
    </table>
  `
  const monthlyHtml = keyValueTable('Work Summary', [
    ['Total Working Hours (Expected)', fmtWork(monthly.expected_minutes ?? 0)],
    ['Total Worked Hours', fmtWork(monthly.worked_minutes ?? 0)],
    ['Overtime', fmtWork(monthly.overtime_minutes ?? 0)],
    ['Late Time', fmtWork(monthly.late_minutes ?? 0)],
    ['Missing Hours', fmtWork(monthly.missing_minutes ?? 0)],
    ['Average Daily Work Hours', fmtWork(monthly.average_minutes ?? 0)],
    ['Longest Work Day', fmtWork(monthly.longest_minutes ?? 0)],
    ['Shortest Work Day', fmtWork(monthly.shortest_minutes ?? 0)],
  ])
  const lateHtml = keyValueTable('Late Summary', [
    ['Total Late Days', late.days ?? 0],
    ['Total Late Time', fmtWork(late.total_minutes ?? 0)],
    ['Average Late', fmtWork(Math.round(Number(late.average_minutes || 0)))],
    ['Longest Late', fmtWork(late.longest_minutes ?? 0)],
    ['Late Deduction', `$${Number(late.deduction_amount || 0).toFixed(2)}`],
  ])
  const requestHtml = keyValueTable(
    'Approved Requests',
    requestRows.length ? requestRows : [['No approved requests', 0]],
  )
  const rows = (data.days || []).map((d) => `
    <tr>
      <td>${esc(d.date)}</td>
      <td>${esc(d.schedule || '-')}</td>
      <td>${esc(displayReportTime(d, 'check_in') || '-')}</td>
      <td>${esc(displayReportTime(d, 'check_out') || '-')}</td>
      <td>${esc(fmtWork(d.work_minutes))}</td>
      <td>${esc(fmtWork(d.late_minutes))}</td>
      <td>${esc(Number(d.deduction_amount || 0).toFixed(2))}</td>
      <td>${esc(fmtWork(d.overtime_minutes || 0))}</td>
      <td style="color:${statusSummaryColor(d.status)};font-weight:700;">${esc(STATUS_META[d.status]?.label || d.status)}</td>
    </tr>
  `)
  const totals = attendanceDetailTotals(data.days || [])

  return `<!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          table { border-collapse: collapse; }
          td, th { border: 1px solid #999; padding: 6px; }
          th { font-weight: bold; background: #eef2f7; }
          .meta th { text-align: left; background: #f8fafc; }
        </style>
      </head>
      <body>
        <table class="meta">
          <tr><th colspan="2">Employee Monthly Report</th></tr>
          <tr><td>Employee</td><td>${esc(data.employee?.name || '-')}</td></tr>
          <tr><td>Employee Code</td><td>${esc(data.employee?.employee_code || '-')}</td></tr>
          <tr><td>Department</td><td>${esc(data.employee?.department || '-')}</td></tr>
          <tr><td>Month</td><td>${esc(data.month_label || data.month || '-')}</td></tr>
        </table>
        <br />
        ${summaryHtml}
        <br />
        ${monthlyHtml}
        <br />
        ${lateHtml}
        <br />
        ${requestHtml}
        <br />
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Schedule</th><th>Check In</th><th>Check Out</th><th>Work Hours</th><th>Late</th><th>Deduction</th><th>Overtime</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join('')}
            <tr>
              <th colspan="4">Total</th>
              <th>${esc(fmtWork(totals.work_minutes))}</th>
              <th>${esc(fmtWork(totals.late_minutes))}</th>
              <th>${esc(Number(totals.deduction_amount || 0).toFixed(2))}</th>
              <th>${esc(fmtWork(totals.overtime_minutes))}</th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`
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
  absent: '#f43f5e',
  late: '#f97316',
  missing_checkin: '#94a3b8',
  early_checkout: '#3b82f6',
  day_off: '#8b5cf6',
  missing_checkout: '#c2410c',
  personal_request: '#06b6d4',
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
    const isLate = Number(day.late_minutes) > 0
    const checkInTime = displayReportTime(day, 'check_in')
    const checkOutTime = displayReportTime(day, 'check_out')

    return (
      <tr
        key={`${day.date}-${i}`}
        className={clsx(
          i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-[#F9FAFB] dark:bg-slate-950/40',
          'transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10',
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
          {isLate ? fmtWork(day.late_minutes) : '–'}
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

function DesktopReportCard({ days, monthLabel, employee, onPrev, onNext, onToday, disabled }) {
  const employeeMeta = [employee?.employee_code, employee?.department]
    .filter(Boolean)
    .join(' - ')
  const totals = attendanceDetailTotals(days)

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
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Details</h2>
          {employee?.name && (
            <p className="mt-0.5 truncate text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {employee.name}
              {employeeMeta ? <span className="font-medium text-slate-500 dark:text-slate-400"> ({employeeMeta})</span> : null}
            </p>
          )}
        </div>
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
            <tfoot className="border-t-2 border-emerald-200 bg-emerald-50/80 text-sm font-bold dark:border-emerald-900/60 dark:bg-emerald-950/25">
              <tr>
                <td className="px-4 py-3.5 text-slate-900 dark:text-slate-100" colSpan={4}>Total</td>
                <td className="px-4 py-3.5 text-slate-900 dark:text-slate-100">{fmtWork(totals.work_minutes)}</td>
                <td className="px-4 py-3.5 text-orange-600 dark:text-orange-300">{fmtWork(totals.late_minutes)}</td>
                <td className="px-4 py-3.5 text-rose-600 dark:text-rose-300">${Number(totals.deduction_amount || 0).toFixed(2)}</td>
                <td className="px-4 py-3.5 text-emerald-700 dark:text-emerald-300">{fmtWork(totals.overtime_minutes)}</td>
                <td className="px-4 py-3.5" />
              </tr>
            </tfoot>
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

function MobileReportCard({ days, monthLabel, employee, onPrev, onNext, mobileShown, onShowMore, disabled }) {
  const visible = days.slice(0, mobileShown)
  const remaining = days.length - mobileShown
  const employeeMeta = [employee?.employee_code, employee?.department]
    .filter(Boolean)
    .join(' - ')
  const totals = attendanceDetailTotals(days)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:hidden print:hidden">
      <MobileMonthToolbar monthLabel={monthLabel} onPrev={onPrev} onNext={onNext} disabled={disabled} />
      {employee?.name && (
        <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
          <p className="truncate text-xs font-bold text-slate-900 dark:text-white">Attendance Details - {employee.name}</p>
          {employeeMeta && (
            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{employeeMeta}</p>
          )}
        </div>
      )}

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
                  <tr
                    key={`${day.date}-${i}`}
                    className={clsx(
                      i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-[#F9FAFB] dark:bg-slate-950/40',
                      'hover:bg-slate-50/80 dark:hover:bg-slate-800/30',
                    )}
                  >
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
            <tfoot className="border-t border-emerald-100 bg-emerald-50/80 text-[11px] font-bold dark:border-emerald-900/60 dark:bg-emerald-950/25">
              <tr>
                <td className="px-2 py-2.5 text-slate-900 dark:text-slate-100" colSpan={4}>Total</td>
                <td className="whitespace-nowrap px-2 py-2.5 text-emerald-700 dark:text-emerald-300">{fmtWork(totals.work_minutes)}</td>
                <td className="px-2 py-2.5" />
              </tr>
            </tfoot>
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

function PrintReportSheet({ report, appSettings = {}, language = 'en', payrollSummary = null }) {
  if (!report?.data?.employee) return null

  const { data, filters } = report
  const { employee, summary, days, month_label: monthLabel } = data
  const totals = attendanceDetailTotals(days)
  const companyName = appSettings.company_name || appSettings.site_title || 'Attendance System'
  const reportMonth = filters.monthLabel || monthLabel || '-'
  const text = PRINT_TEXT[language] || PRINT_TEXT.en
  const statusLabels = PRINT_STATUS_LABELS[language] || PRINT_STATUS_LABELS.en
  const workHeading = language === 'km' ? 'ការងារ' : 'Work'
  const absenceHeading = language === 'km' ? text.absent : 'Absent'
  const workSummaryRows = [
    ['present', text.present, summary.present ?? 0],
    ['late', text.late, summary.late ?? 0],
    ['early_checkout', text.earlyCheckout, summary.early_checkout ?? 0],
    ['missing_checkout', text.missingCheckout, summary.missing_checkout ?? 0],
  ]
  const absenceSummaryRows = [
    ['absent', text.absent, summary.absent ?? 0],
    ['missing_checkin', text.missingCheckin, summary.missing_checkin ?? 0],
    ['day_off', text.dayOff, summary.day_off ?? 0],
    ['personal_request', text.personalRequest, summary.personal_request ?? 0],
    ['half_day', language === 'km' ? 'ពាក់កណ្តាលថ្ងៃ' : 'Half Day', summary.half_day ?? 0],
  ]
  const workSummaryTotal = workSummaryRows.reduce((total, [, , value]) => total + Number(value || 0), 0)
  const absenceSummaryTotal = absenceSummaryRows.reduce((total, [, , value]) => total + Number(value || 0), 0)
  const payrollSummaryRows = payrollSummary
    ? PAYROLL_FIELDS.filter(([key]) => payrollNumber(payrollSummary[key]) !== 0).map(([key, label]) => {
        const isDeduction = key === 'deductions' || key === 'tax'
        return [label, isDeduction ? `(${fmtMoney(payrollSummary[key])})` : fmtMoney(payrollSummary[key])]
      })
    : []
  const netSalary = payrollSummary ? payrollNet(payrollSummary) : 0
  const hasNetSalary = netSalary !== 0
  const summaryRowCount = Math.max(workSummaryRows.length, absenceSummaryRows.length, payrollSummaryRows.length) + 1

  return (
    <div className={clsx('monthly-report-print-sheet hidden text-blue-950', language === 'km' && 'monthly-report-print-km')}>
      <div className="mb-7 border-b-[3px] border-blue-950 pb-4 text-center">
        <h1 className="text-[20px] font-black uppercase tracking-wide text-blue-950">{text.title}</h1>
      </div>

      <div className="grid grid-cols-[0.65fr_1.35fr] items-start gap-8">
      <div className="text-[12px] text-blue-950">
        <h2 className="text-sm font-black uppercase tracking-wide text-blue-950">{text.employeeInfo}</h2>
        <div className="mt-4 grid grid-cols-[130px_1fr] gap-x-4 gap-y-3">
          <p className="font-bold">{text.employee}:</p>
          <p>{employee.name || '-'}</p>
          <p className="font-bold">{text.employeeId}:</p>
          <p>{employee.employee_code || '-'}</p>
          <p className="font-bold">{text.position}:</p>
          <p>{employee.position || '-'}</p>
          <p className="font-bold">{text.department}:</p>
          <p>{employee.department || filters.departmentLabel || '-'}</p>
          <p className="font-bold">{text.reportMonth}:</p>
          <p>{reportMonth}</p>
          <p className="font-bold">{text.workingDays}:</p>
          <p>{summary.working_days ?? 0}</p>
        </div>
      </div>

      <div>
        <table className="w-full border-collapse border border-black text-[12px] text-black">
          <thead>
            <tr>
              <th className="border border-black px-3 py-2 text-left text-[12px] font-black" colSpan={payrollSummary ? 6 : 4}>
                {text.attendanceSummary}
              </th>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1 text-center font-black">{workHeading}</th>
              <th className="w-14 border border-black px-2 py-1 text-center font-black">{text.qty}</th>
              <th className="border border-black px-2 py-1 text-center font-black">{absenceHeading}</th>
              <th className="w-14 border border-black px-2 py-1 text-center font-black">{text.qty}</th>
              {payrollSummary && (
                <>
                  <th className="border border-black px-2 py-1 text-center font-black">Payroll Summary</th>
                  <th className="w-24 border border-black px-2 py-1 text-center font-black">Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: summaryRowCount }).map((_, index) => {
              const isTotalRow = index === summaryRowCount - 1
              const [workKey = '', workLabel = '', workValue = ''] = isTotalRow ? ['', text.total, workSummaryTotal] : workSummaryRows[index] || []
              const [absenceKey = '', absenceLabel = '', absenceValue = ''] = isTotalRow ? ['', text.total, absenceSummaryTotal] : absenceSummaryRows[index] || []
              const [payrollLabel = '', payrollValue = ''] = isTotalRow
                ? hasNetSalary
                  ? ['Net Salary', fmtMoney(netSalary)]
                  : []
                : payrollSummaryRows[index] || []
              const workStyle = workKey ? { color: statusSummaryColor(workKey), fontWeight: 700 } : undefined
              const absenceStyle = absenceKey ? { color: statusSummaryColor(absenceKey), fontWeight: 700 } : undefined
              return (
                <tr
                  key={`summary-${index}`}
                  className={clsx(index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]', isTotalRow && 'font-black')}
                >
                  <td className="border border-black px-2 py-1 text-center" style={workStyle}>{workLabel}</td>
                  <td className="border border-black px-2 py-1 text-center" style={workStyle}>{workValue}</td>
                  <td className="border border-black px-2 py-1 text-center" style={absenceStyle}>{absenceLabel}</td>
                  <td className="border border-black px-2 py-1 text-center" style={absenceStyle}>{absenceValue}</td>
                  {payrollSummary && (
                    <>
                      <td className={clsx('border border-black px-2 py-1 text-center', payrollLabel === 'Net Salary' && 'font-black')}>{payrollLabel}</td>
                      <td className={clsx('border border-black px-2 py-1 text-right', payrollLabel === 'Net Salary' && 'font-black')}>{payrollValue}</td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      </div>

      <table className="mt-10 w-full border-collapse text-[11px] text-blue-950">
        <thead>
          <tr className="bg-[#eaf2fb]">
            {text.tableCols.map((h) => (
              <th key={h} className="border border-black px-2 py-2 text-center font-black text-blue-950">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr
              key={day.date}
              className={clsx(
                index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]',
                day.status === 'absent' && 'monthly-report-absent-row font-black text-rose-600',
              )}
            >
              <td className="border border-black px-2 py-1.5 text-center">{formatDateWithDay(day.date, day.day)}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{day.schedule || '–'}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{displayReportTime(day, 'check_in') || '–'}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{displayReportTime(day, 'check_out') || '–'}</td>
              <td className="border border-black px-2 py-1.5 text-center">{fmtWork(day.work_minutes)}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{day.late_minutes ? fmtWork(day.late_minutes) : '–'}</td>
              <td className="border border-black px-2 py-1.5 text-center">${Number(day.deduction_amount || 0).toFixed(2)}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{Number(day.overtime_minutes || 0) > 0 ? fmtWork(day.overtime_minutes) : '–'}</td>
              <td className="border border-black px-2 py-1.5 text-center font-bold" style={{ color: statusSummaryColor(day.status) }}>{statusLabels[day.status] || STATUS_META[day.status]?.label || day.status}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#eaf2fb] font-black text-blue-950">
            <td className="border border-black px-2 py-2 text-center" colSpan={4}>{text.total}</td>
            <td className="border border-black px-2 py-2 text-center">{fmtWork(totals.work_minutes)}</td>
            <td className="border border-black px-2 py-2 text-center">{fmtWork(totals.late_minutes)}</td>
            <td className="border border-black px-2 py-2 text-center">${Number(totals.deduction_amount || 0).toFixed(2)}</td>
            <td className="border border-black px-2 py-2 text-center">{fmtWork(totals.overtime_minutes)}</td>
            <td className="border border-black px-2 py-2" />
          </tr>
        </tfoot>
      </table>

      <div className="mt-12 grid grid-cols-3 gap-10 text-center text-xs text-blue-950">
        {[
          [text.preparedBy, text.hrDepartment],
          [text.reviewedBy, text.departmentManager],
          [text.approvedBy, text.authorizedSignature],
        ].map(([title, role]) => (
          <div key={title}>
            <p className="font-bold">{title}</p>
            <div className="mx-auto mt-16 w-48 border-b border-dotted border-blue-950" />
            <p className="mt-3 font-medium text-slate-950">{role}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t-4 border-blue-900 pt-4 text-center text-[10px] font-medium text-slate-500">
        {companyName}
      </div>
    </div>
  )
}

function PrintLanguageDialog({ open, onCancel, onSelect }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:hidden" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Choose report language</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select the language for the printed monthly report.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => onSelect('km')}
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-sm font-bold text-blue-800 transition hover:bg-blue-100"
          >
            Khmer Report
            <span className="mt-0.5 block text-xs font-semibold text-blue-600">របាយការណ៍ភាសាខ្មែរ</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect('en')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            English Report
            <span className="mt-0.5 block text-xs font-semibold text-slate-500">Use English labels for the printout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PayrollSummaryDialog({ open, report, values, action = 'print', onChange, onCancel, onSubmit }) {
  if (!open) return null

  const employee = report?.data?.employee
  const filters = report?.filters || {}
  const reportMonth = filters.monthLabel || report?.data?.month_label || '-'
  const department = employee?.department || filters.departmentLabel || '-'
  const submitLabel = action === 'excel' ? 'Continue to Export' : 'Continue to Print'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:hidden" role="dialog" aria-modal="true">
      <form
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Payroll Summary Preview</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fill this before printing the monthly report.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-200">Employee:</span>
            <span>{employee?.name || '-'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">Month:</span>
            <span>{reportMonth}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">Department:</span>
            <span>{department}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PAYROLL_FIELDS.map(([key, label]) => (
            <label key={key} className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={values[key]}
                onChange={(event) => onChange(key, event.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="0.00"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm dark:border-blue-900/40 dark:bg-blue-950/30">
          <span className="font-black text-blue-950 dark:text-blue-200">Net Salary</span>
          <span className="font-black text-blue-950 dark:text-blue-200">{fmtMoney(payrollNet(values))}</span>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

function PayrollHistoryDialog({
  open,
  monthLabel,
  rows,
  selectedItem,
  values,
  loading,
  saving,
  canSave,
  onSelect,
  onChange,
  onCancel,
  onSave,
}) {
  if (!open) return null

  const report = selectedItem?.report_snapshot || {}
  const employee = report.employee || selectedItem
  const summary = report.summary || {}
  const monthly = report.monthly_summary || {}
  const late = report.late_analysis || {}
  const metricRows = [
    ['Working Days', summary.working_days ?? 0],
    ['Present', summary.present ?? 0],
    ['Absent', summary.absent ?? 0],
    ['Late Days', late.days ?? summary.late ?? 0],
    ['Missing Check In', summary.missing_checkin ?? 0],
    ['Missing Check Out', summary.missing_checkout ?? 0],
    ['Work Hours', fmtWork(monthly.worked_minutes ?? 0)],
    ['Overtime', fmtWork(monthly.overtime_minutes ?? 0)],
    ['Late Deduction', fmtMoney(late.deduction_amount ?? 0)],
  ]
  const grossSalary = payrollNumber(values.baseSalary)
    + payrollNumber(values.allowances)
    + payrollNumber(values.overtime)
    + payrollNumber(values.commission)
    + payrollNumber(values.bonus)
  const totalDeductions = payrollNumber(values.deductions) + payrollNumber(values.tax)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 print:hidden" role="dialog" aria-modal="true">
      <form
        className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave && selectedItem) onSave()
        }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Payroll History</p>
            <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">All Employees</h2>
            <p className="mt-0.5 text-sm font-semibold text-slate-500">{monthLabel || '-'}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close payroll history"
          >
            <XCircle size={19} />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm font-semibold text-slate-500">Loading payroll history...</div>
        ) : (
          <div className="p-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[1180px] border-collapse text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    {['#', 'Employee ID', 'Employee', 'Department', 'Basic Salary', 'OT', 'Allowance', 'Bonus', 'Gross Salary', 'Deductions', 'Net Salary', 'Status', 'Action'].map((heading) => (
                      <th key={heading} className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700" colSpan={13}>
                        No employees found for this month.
                      </td>
                    </tr>
                  ) : rows.map((item) => {
                    const isSelected = selectedItem?.employee_id === item.employee_id
                    return (
                      <tr key={item.employee_id} className={clsx('bg-white dark:bg-slate-900', isSelected && 'bg-indigo-50 dark:bg-indigo-950/30')}>
                        <td className="border border-slate-200 px-4 py-3 text-center font-bold dark:border-slate-700">{item.number}</td>
                        <td className="border border-slate-200 px-4 py-3 text-center font-bold dark:border-slate-700">{item.employee_code || '-'}</td>
                        <td className="border border-slate-200 px-4 py-3 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 text-xs font-black text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                              {item.photo_url ? <img src={item.photo_url} alt={item.employee_name} className="h-full w-full object-cover" /> : item.employee_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="font-black text-slate-900 dark:text-white">{item.employee_name || '-'}</span>
                          </div>
                        </td>
                        <td className="border border-slate-200 px-4 py-3 text-center font-semibold dark:border-slate-700">{item.department || '-'}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700">{fmtMoney(item.summary?.baseSalary)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700">{fmtMoney(item.summary?.overtime)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700">{fmtMoney(item.summary?.allowances)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700">{fmtMoney(item.summary?.bonus)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-black dark:border-slate-700">{fmtMoney(item.gross_salary)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700">{fmtMoney(item.total_deductions)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-right font-black dark:border-slate-700">{fmtMoney(item.net_salary)}</td>
                        <td className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">
                          <span className={clsx(
                            'inline-flex rounded-lg px-3 py-1 text-xs font-black capitalize',
                            item.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
                          )}>
                            {item.status || 'pending'}
                          </span>
                        </td>
                        <td className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => onSelect(item)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            aria-label={`View payroll for ${item.employee_name}`}
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {selectedItem && (
              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">{selectedItem.employee_name}</h3>
                      <p className="text-xs font-semibold text-slate-500">{[selectedItem.employee_code, selectedItem.department, monthLabel].filter(Boolean).join(' - ')}</p>
                    </div>
                    <span className={clsx(
                      'rounded-full px-2.5 py-1 text-xs font-bold capitalize',
                      selectedItem.history
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
                    )}>
                      {selectedItem.history ? 'Saved' : 'New'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {metricRows.map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-white bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-[11px] font-bold uppercase text-slate-400">{label}</p>
                        <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  {selectedItem.history?.updated_at && (
                    <p className="mt-4 text-xs font-semibold text-slate-500">
                      Last saved: {new Date(selectedItem.history.updated_at).toLocaleString()}
                    </p>
                  )}
                </section>

                <section>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PAYROLL_FIELDS.map(([key, label]) => (
                      <label key={key} className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {label}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={values[key]}
                          disabled={!canSave}
                          onChange={(event) => onChange(key, event.target.value)}
                          className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-800"
                          placeholder="0.00"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                      <p className="text-xs font-bold uppercase text-slate-400">Gross Salary</p>
                      <p className="mt-1 font-black">{fmtMoney(grossSalary)}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                      <p className="text-xs font-bold uppercase text-slate-400">Deductions</p>
                      <p className="mt-1 font-black">{fmtMoney(totalDeductions)}</p>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                      <p className="text-xs font-bold uppercase text-indigo-500">Net Salary</p>
                      <p className="mt-1 font-black text-indigo-950 dark:text-indigo-200">{fmtMoney(payrollNet(values))}</p>
                    </div>
                  </div>

                  {!canSave && (
                    <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                      You can view payroll history, but your role cannot save payroll values.
                    </p>
                  )}
                </section>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-100 p-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Close
          </button>
          {canSave && (
            <button
              type="submit"
              disabled={saving || loading || !selectedItem}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-700 bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              <CheckCircle2 size={16} />
              {saving ? 'Saving...' : 'Save Payroll History'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default function EmployeeMonthlyReportPage({ user, appData, openPayrollHistoryPage }) {
  const employees = appData?.employees || []
  const canViewAll = canAccess(user, ['employee_report.view_all'])
  const canViewOwn = canAccess(user, ['employee_report.view_own'])
  const canExport = canAccess(user, ['employee_report.export'])
  const canViewPayroll = canAccess(user, ['payroll.view_all', 'payroll.view_own', 'payroll.create', 'payroll.update'])
  const canSavePayrollHistory = canAccess(user, ['payroll.create', 'payroll.update'])
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
  const [printLanguage, setPrintLanguage] = useState('en')
  const [printLanguageDialogOpen, setPrintLanguageDialogOpen] = useState(false)
  const [printPayrollSummary, setPrintPayrollSummary] = useState(null)
  const [payrollHistoryOpen, setPayrollHistoryOpen] = useState(false)
  const [payrollHistoryLoading, setPayrollHistoryLoading] = useState(false)
  const [payrollHistorySaving, setPayrollHistorySaving] = useState(false)
  const [payrollHistoryRows, setPayrollHistoryRows] = useState([])
  const [selectedPayrollHistoryItem, setSelectedPayrollHistoryItem] = useState(null)
  const [payrollHistoryMonthLabel, setPayrollHistoryMonthLabel] = useState('')
  const [payrollHistoryDraft, setPayrollHistoryDraft] = useState(EMPTY_PAYROLL_SUMMARY)
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
        setPayrollHistoryRows([])
        setSelectedPayrollHistoryItem(null)
        setPrintPayrollSummary(null)
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
      setPayrollHistoryRows([])
      setSelectedPayrollHistoryItem(null)
      setPrintPayrollSummary(null)
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
    setPayrollHistoryRows([])
    setSelectedPayrollHistoryItem(null)
    setPrintPayrollSummary(null)
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

  const exportExcelWithPayroll = async (payrollSummary) => {
    if (!requireLoadedReport()) return
    const snap = reportSnapshotRef.current

    setExporting(true)
    setError(null)
    try {
      downloadBlob(
        new Blob([buildClientExcel(snap.data, payrollSummary)], { type: 'application/vnd.ms-excel;charset=utf-8;' }),
        `monthly-report-${snap.data.employee?.employee_code || 'emp'}-${snap.data.month}.xls`,
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Export failed. Click Search and try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = () => {
    if (!requireLoadedReport()) return
    setError(null)
    exportExcelWithPayroll(printPayrollSummary)
  }

  const handlePrint = () => {
    if (!requireLoadedReport()) return
    setError(null)
    setPrintLanguageDialogOpen(true)
  }

  const handlePayrollHistoryDraftChange = (key, value) => {
    setPayrollHistoryDraft((current) => ({ ...current, [key]: value }))
  }

  const openPayrollHistory = async () => {
    const historyMonth = reportSnapshotRef.current?.data?.month || draftMonth || month
    openPayrollHistoryPage?.(historyMonth)
  }

  const selectPayrollHistoryItem = (item) => {
    setSelectedPayrollHistoryItem(item)
    setPayrollHistoryDraft(defaultPayrollSummary({ data: item.report_snapshot }, item.summary))
    if (reportSnapshotRef.current?.data?.employee?.id === item.employee_id) {
      setPrintPayrollSummary(item.summary)
    }
  }

  const savePayrollHistory = async () => {
    if (!selectedPayrollHistoryItem) return

    const item = selectedPayrollHistoryItem
    setPayrollHistorySaving(true)
    setError(null)

    try {
      const payload = {
        month: item.report_snapshot?.month || reportSnapshotRef.current?.data?.month || draftMonth,
        employee_id: item.employee_id,
        base_salary: payrollNumber(payrollHistoryDraft.baseSalary),
        allowances: payrollNumber(payrollHistoryDraft.allowances),
        overtime: payrollNumber(payrollHistoryDraft.overtime),
        commission: payrollNumber(payrollHistoryDraft.commission),
        bonus: payrollNumber(payrollHistoryDraft.bonus),
        deductions: payrollNumber(payrollHistoryDraft.deductions),
        tax: payrollNumber(payrollHistoryDraft.tax),
        report_snapshot: item.report_snapshot,
      }
      const res = await employeeMonthlyReportService.savePayrollHistory(payload)
      if (res.history?.summary) {
        const updatedItem = {
          ...item,
          history: res.history,
          summary: res.history.summary,
          gross_salary:
            payrollNumber(res.history.summary.baseSalary)
            + payrollNumber(res.history.summary.allowances)
            + payrollNumber(res.history.summary.overtime)
            + payrollNumber(res.history.summary.commission)
            + payrollNumber(res.history.summary.bonus),
          total_deductions: payrollNumber(res.history.summary.deductions) + payrollNumber(res.history.summary.tax),
          net_salary: payrollNumber(res.history.net_salary),
          status: 'paid',
        }
        setSelectedPayrollHistoryItem(updatedItem)
        setPayrollHistoryRows((rows) => rows.map((row) => (row.employee_id === updatedItem.employee_id ? updatedItem : row)))
        setPayrollHistoryDraft(defaultPayrollSummary({ data: updatedItem.report_snapshot }, res.history.summary))
        if (reportSnapshotRef.current?.data?.employee?.id === updatedItem.employee_id) {
          setPrintPayrollSummary(res.history.summary)
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payroll history.')
    } finally {
      setPayrollHistorySaving(false)
    }
  }

  const printSelectedLanguage = (language) => {
    setPrintLanguage(language)
    setPrintLanguageDialogOpen(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
      })
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
  const reportActions = (
    <>
      {canViewPayroll && (
        <button
          type="button"
          onClick={openPayrollHistory}
          disabled={!draftMonth || payrollHistoryLoading}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-900 dark:bg-slate-900 dark:hover:bg-indigo-950/30"
        >
          <Clock size={16} />
          Payroll History
        </button>
      )}
      {canExport && exportButtons}
    </>
  )
  const hasReportActions = canViewPayroll || canExport

  return (
    <div className="employee-monthly-report space-y-4 p-3 pb-24 sm:space-y-5 sm:p-6 print:space-y-4 print:p-0">
      <PrintReportSheet
        report={reportSnapshotRef.current}
        appSettings={appData?.appSettings || {}}
        language={printLanguage}
        payrollSummary={printPayrollSummary}
      />
      <PrintLanguageDialog
        open={printLanguageDialogOpen}
        onCancel={() => setPrintLanguageDialogOpen(false)}
        onSelect={printSelectedLanguage}
      />

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

          {hasReportActions && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              {reportActions}
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
            {hasReportActions && reportActions}
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
          <div className="hidden grid-cols-3 gap-3 lg:grid xl:grid-cols-4 print:hidden">
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
            employee={employee}
            onPrev={() => handleMonthNav(-1)}
            onNext={() => handleMonthNav(1)}
            onToday={handleToday}
            disabled={loading}
          />

          <MobileReportCard
            days={days}
            monthLabel={monthLabel}
            employee={employee}
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
