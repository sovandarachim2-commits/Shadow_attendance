import { useEffect, useState } from 'react'
import { CheckCircle2, DollarSign, Download, FileSpreadsheet, LockKeyhole, Pencil, Printer, RotateCcw, Search, ShieldCheck, Users, Wallet, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { employeeMonthlyReportService } from '../services/api'
import { inputCls } from '../components/attendance/reports/attendanceReportShared'
import { canAccess } from '../utils/format'

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
const PAYROLL_VALUE_COLOR = {
  baseSalary: 'text-[#111827]',
  allowances: 'text-[#111827]',
  overtime: 'text-[#111827]',
  commission: 'text-[#111827]',
  bonus: 'text-[#111827]',
  deductions: 'text-[#DC2626]',
  tax: 'text-[#EA580C]',
}
const MONTH_OPTIONS = [
  ['01', 'January'],
  ['02', 'February'],
  ['03', 'March'],
  ['04', 'April'],
  ['05', 'May'],
  ['06', 'June'],
  ['07', 'July'],
  ['08', 'August'],
  ['09', 'September'],
  ['10', 'October'],
  ['11', 'November'],
  ['12', 'December'],
]
const PRINT_TABLE_COLS = ['Date', 'Schedule', 'Check In', 'Check Out', 'Work Hours', 'Late', 'Deduction', 'Overtime', 'Status']
const PRINT_STATUS_LABELS = {
  present: 'Present',
  late: 'Late Check In',
  early_checkout: 'Early Check Out',
  absent: 'Absent',
  missing_checkin: 'Missing Check In',
  missing_checkout: 'Missing Check Out',
  missing_attendance: 'Missing Check In',
  day_off: 'Day Off',
  on_leave: 'Personal Request',
  leave: 'Personal Request',
  half_day: 'Personal Request',
  personal_request: 'Personal Request',
  holiday: 'Holiday',
}
const PAYROLL_PRINT_TEXT = {
  en: {
    chooseTitle: 'Choose report language',
    chooseHelp: 'Select the language for the payroll print or Excel report.',
    khmerReport: 'Khmer Report',
    khmerHelp: 'របាយការណ៍ភាសាខ្មែរ',
    englishReport: 'English Report',
    englishHelp: 'Use English labels for the report',
    monthlyReport: 'Monthly Report',
    payrollHistory: 'Payroll History',
    employeeInfo: 'Employee Information',
    employee: 'Employee',
    employeeId: 'Employee ID',
    position: 'Position',
    department: 'Department',
    reportMonth: 'Report Month',
    workingDays: 'Working Days',
    attendanceSummary: 'Attendance Summary',
    work: 'Work',
    absent: 'Absent',
    qty: 'Qty',
    payrollSummary: 'Payroll Summary',
    amount: 'Amount',
    total: 'Total',
    preparedBy: 'Prepared by',
    hrDepartment: 'HR Department',
    reviewedBy: 'Reviewed by',
    departmentManager: 'Department Manager',
    approvedBy: 'Approved by',
    authorizedSignature: 'Authorized Signature',
    company: 'Company',
    payrollMonth: 'Payroll Month',
    totalEmployees: 'Total Employees',
    paidEmployees: 'Paid Employees',
    pendingEmployees: 'Pending Employees',
    paid: 'Paid',
    pending: 'Pending',
    noAttendanceRecords: 'No attendance records found.',
    tableCols: PRINT_TABLE_COLS,
    listCols: ['#', 'Employee ID', 'Employee', 'Department', 'Position', 'Base Salary', 'Allowances', 'Overtime', 'Commission', 'Bonus', 'Deductions', 'Tax', 'Net Salary', 'Status'],
    payrollFields: Object.fromEntries(PAYROLL_FIELDS.map(([key, label]) => [key, label])),
    netSalary: 'Net Salary',
  },
  km: {
    chooseTitle: 'ជ្រើសរើសភាសារបាយការណ៍',
    chooseHelp: 'ជ្រើសរើសភាសាសម្រាប់បោះពុម្ព ឬ Excel ប្រាក់ខែ។',
    khmerReport: 'របាយការណ៍ខ្មែរ',
    khmerHelp: 'ប្រើស្លាកជាភាសាខ្មែរ',
    englishReport: 'របាយការណ៍អង់គ្លេស',
    englishHelp: 'Use English labels for the report',
    monthlyReport: 'របាយការណ៍ប្រចាំខែ',
    payrollHistory: 'ប្រវត្តិបើកប្រាក់ខែ',
    employeeInfo: 'ព័ត៌មានបុគ្គលិក',
    employee: 'បុគ្គលិក',
    employeeId: 'លេខសម្គាល់បុគ្គលិក',
    position: 'តួនាទី',
    department: 'ផ្នែក',
    reportMonth: 'ខែរបាយការណ៍',
    workingDays: 'ថ្ងៃធ្វើការ',
    attendanceSummary: 'សង្ខេបវត្តមាន',
    work: 'ការងារ',
    absent: 'អវត្តមាន',
    qty: 'ចំនួន',
    payrollSummary: 'សង្ខេបប្រាក់ខែ',
    amount: 'ចំនួនទឹកប្រាក់',
    total: 'សរុប',
    preparedBy: 'រៀបចំដោយ',
    hrDepartment: 'ផ្នែកធនធានមនុស្ស',
    reviewedBy: 'ពិនិត្យដោយ',
    departmentManager: 'អ្នកគ្រប់គ្រងផ្នែក',
    approvedBy: 'អនុម័តដោយ',
    authorizedSignature: 'ហត្ថលេខាអនុញ្ញាត',
    company: 'ក្រុមហ៊ុន',
    payrollMonth: 'ខែប្រាក់ខែ',
    totalEmployees: 'បុគ្គលិកសរុប',
    paidEmployees: 'បុគ្គលិកបានបង់',
    pendingEmployees: 'បុគ្គលិកមិនទាន់បង់',
    paid: 'បានបង់',
    pending: 'មិនទាន់បង់',
    noAttendanceRecords: 'រកមិនឃើញកំណត់ត្រាវត្តមាន។',
    tableCols: ['កាលបរិច្ឆេទ', 'កាលវិភាគ', 'ម៉ោងចូល', 'ម៉ោងចេញ', 'ម៉ោងធ្វើការ', 'យឺត', 'កាត់ប្រាក់', 'ថែមម៉ោង', 'ស្ថានភាព'],
    listCols: ['#', 'លេខសម្គាល់', 'បុគ្គលិក', 'ផ្នែក', 'តួនាទី', 'ប្រាក់ខែគោល', 'ប្រាក់បន្ថែម', 'ថែមម៉ោង', 'កម្រៃជើងសារ', 'ប្រាក់រង្វាន់', 'កាត់ប្រាក់', 'ពន្ធ', 'ប្រាក់ខែសុទ្ធ', 'ស្ថានភាព'],
    payrollFields: {
      baseSalary: 'ប្រាក់ខែគោល',
      allowances: 'ប្រាក់បន្ថែម',
      overtime: 'ថែមម៉ោង',
      commission: 'កម្រៃជើងសារ',
      bonus: 'ប្រាក់រង្វាន់',
      deductions: 'កាត់ប្រាក់',
      tax: 'ពន្ធ',
    },
    netSalary: 'ប្រាក់ខែសុទ្ធ',
  },
}
const PAYROLL_PRINT_STATUS_LABELS = {
  en: PRINT_STATUS_LABELS,
  km: {
    present: 'មានវត្តមាន',
    late: 'ចូលយឺត',
    early_checkout: 'ចេញមុន',
    absent: 'អវត្តមាន',
    missing_checkin: 'ភ្លេចចុចចូល',
    missing_checkout: 'ភ្លេចចុចចេញ',
    missing_attendance: 'ភ្លេចចុចចូល',
    day_off: 'ថ្ងៃឈប់សម្រាក',
    on_leave: 'សំណើផ្ទាល់ខ្លួន',
    leave: 'សំណើផ្ទាល់ខ្លួន',
    half_day: 'សំណើផ្ទាល់ខ្លួន',
    personal_request: 'សំណើផ្ទាល់ខ្លួន',
    holiday: 'ថ្ងៃឈប់បុណ្យ',
  },
}
const ATTENDANCE_STATUS_TEXT_COLOR = {
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
  half_day: '#0891B2',
}

function attendanceStatusTextColor(status) {
  return ATTENDANCE_STATUS_TEXT_COLOR[status] || '#111827'
}

function payrollPrintText(language = 'en') {
  return PAYROLL_PRINT_TEXT[language] || PAYROLL_PRINT_TEXT.en
}

function payrollPrintStatusLabel(status, language = 'en') {
  const labels = PAYROLL_PRINT_STATUS_LABELS[language] || PAYROLL_PRINT_STATUS_LABELS.en
  return labels[status] || status || '-'
}

function payrollPaymentStatusLabel(status, language = 'en') {
  const text = payrollPrintText(language)
  return status === 'paid' ? text.paid : text.pending
}

function currentMonthStr() {
  return new Date().toISOString().slice(0, 7)
}

function formatMonthLabel(value) {
  if (!value) return '-'
  const [year, month] = value.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
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

function payrollValueColorClass(key, value) {
  if (key === 'netSalary') return payrollNumber(value) < 0 ? 'text-[#DC2626]' : 'text-[#059669]'
  return PAYROLL_VALUE_COLOR[key] || 'text-[#111827]'
}

function netSalaryStatusClass(value) {
  const amount = payrollNumber(value)
  if (amount === 0) return 'bg-[#FEE2E2] text-[#DC2626]'
  if (amount < 0) return 'bg-[#FEF3C7] text-[#DC2626]'
  return 'bg-[#DCFCE7] text-[#059669]'
}

function payrollValueDisplayClass(key, value) {
  return key === 'netSalary' ? netSalaryStatusClass(value) : payrollValueColorClass(key, value)
}

function payrollStatusPrintClass(status) {
  return status === 'paid' ? 'text-[#059669]' : 'text-[#DC2626]'
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function payrollHistoryExcelHtml(rows = [], monthLabel = '-', companyName = 'Attendance System', language = 'en') {
  const text = payrollPrintText(language)
  const esc = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const total = (selector) => rows.reduce((sum, item) => sum + payrollNumber(selector(item)), 0)
  const moneyCell = (value, color = '#111827', extra = '') => `<td class="money ${extra}" style="color:${color};">${esc(fmtMoney(value))}</td>`
  const netCell = (value, extra = '') => {
    const amount = payrollNumber(value)
    const background = amount === 0 ? '#FEE2E2' : amount < 0 ? '#FEF3C7' : '#DCFCE7'
    const color = amount < 0 || amount === 0 ? '#DC2626' : '#059669'
    return `<td class="money net ${extra}" style="background:${background};color:${color};">${esc(fmtMoney(value))}</td>`
  }
  const statusCell = (status) => {
    const value = status || 'pending'
    const color = value === 'paid' ? '#059669' : '#DC2626'
    return `<td class="center status" style="color:${color};">${esc(payrollPaymentStatusLabel(value, language))}</td>`
  }

  const bodyRows = rows.map((item, index) => {
    const bg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
    return `
      <tr style="background:${bg};">
        <td class="center">${index + 1}</td>
        <td class="center">${esc(item.employee_code || '-')}</td>
        <td>${esc(item.employee_name || '-')}</td>
        <td class="center">${esc(item.department || '-')}</td>
        <td class="center">${esc(item.position || '-')}</td>
        ${moneyCell(item.summary?.baseSalary)}
        ${moneyCell(item.summary?.allowances)}
        ${moneyCell(item.summary?.overtime)}
        ${moneyCell(item.summary?.commission)}
        ${moneyCell(item.summary?.bonus)}
        ${moneyCell(item.summary?.deductions, '#DC2626')}
        ${moneyCell(item.summary?.tax, '#EA580C')}
        ${netCell(item.net_salary)}
        ${statusCell(item.status)}
      </tr>
    `
  }).join('')

  const paidCount = rows.filter((item) => item.status === 'paid').length
  const pendingCount = rows.length - paidCount

  return `<!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: "Khmer OS Battambang", "Noto Sans Khmer", Arial, sans-serif; color: #111827; }
          table { border-collapse: collapse; }
          td, th { border: 1px solid #999; padding: 6px; }
          th { font-weight: bold; background: #eef2f7; }
          .meta th { text-align: left; background: #f8fafc; }
          .report { width: 100%; font-size: 10px; }
          .report th { color: #172554; text-align: center; }
          .report tfoot td { background: #eef2f7; font-weight: 800; }
          .center { text-align: center; }
          .money { text-align: right; color: #111827; }
          .net, .status { font-weight: 800; }
        </style>
      </head>
      <body>
        <table class="meta">
          <tr><th colspan="2">${esc(text.payrollHistory)}</th></tr>
          <tr><td>${esc(text.company)}</td><td>${esc(companyName)}</td></tr>
          <tr><td>${esc(text.payrollMonth)}</td><td>${esc(monthLabel || '-')}</td></tr>
          <tr><td>${esc(text.totalEmployees)}</td><td>${esc(rows.length)}</td></tr>
          <tr><td>${esc(text.paidEmployees)}</td><td>${esc(paidCount)}</td></tr>
          <tr><td>${esc(text.pendingEmployees)}</td><td>${esc(pendingCount)}</td></tr>
        </table>
        <br />
        <table class="report">
          <thead>
            <tr>
              ${text.listCols.map((heading) => `<th>${esc(heading)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
          <tfoot>
            <tr>
              <td class="money" colspan="5">${esc(text.total)}</td>
              ${moneyCell(total((item) => item.summary?.baseSalary))}
              ${moneyCell(total((item) => item.summary?.allowances))}
              ${moneyCell(total((item) => item.summary?.overtime))}
              ${moneyCell(total((item) => item.summary?.commission))}
              ${moneyCell(total((item) => item.summary?.bonus))}
              ${moneyCell(total((item) => item.summary?.deductions), '#DC2626')}
              ${moneyCell(total((item) => item.summary?.tax), '#EA580C')}
              ${netCell(total((item) => item.net_salary))}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>`
}

function fmtWork(minutes) {
  if (minutes == null) return '-'
  const value = Number(minutes) || 0
  const h = Math.floor(value / 60)
  const m = value % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function formatDateShort(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateWithDay(dateStr, dayLabel) {
  if (!dateStr) return '-'
  const day = dayLabel || new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' })
  return `${formatDateShort(dateStr)} (${day})`
}

function displayReportTime(day, key) {
  if (day?.[key]) return day[key]
  const timestamp = day?.[`${key}_at`]
  const match = String(timestamp || '').match(/(?:T|\s)(\d{2}:\d{2})/)
  return match?.[1] || null
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

function payrollWorkMinutes(item) {
  const monthlyWorked = Number(item?.report_snapshot?.monthly_summary?.worked_minutes || 0)
  if (monthlyWorked > 0) return monthlyWorked

  const dayTotal = attendanceDetailTotals(item?.report_snapshot?.days || []).work_minutes
  if (dayTotal > 0) return dayTotal

  return Number(item?.report_snapshot?.summary?.present || 0) * 24 * 60
}

function defaultPayrollSummary(item) {
  return {
    ...EMPTY_PAYROLL_SUMMARY,
    ...(item?.summary || {}),
  }
}

function PayrollSummaryModal({ open, item, monthLabel, values, saving, canSave, onChange, onClose, onSave }) {
  if (!open || !item) return null

  const reportSummary = item.report_snapshot?.summary || {}
  const attendanceSummaryItems = [
    ['present', 'Present', reportSummary.present ?? 0],
    ['absent', 'Absent', reportSummary.absent ?? 0],
    ['late', 'Late Check In', reportSummary.late ?? 0],
    ['missing_checkin', 'Missing Check In', reportSummary.missing_checkin ?? reportSummary.missing_attendance ?? 0],
    ['missing_checkout', 'Missing Check Out', reportSummary.missing_checkout ?? 0],
    ['day_off', 'Day Off', reportSummary.day_off ?? 0],
    ['personal_request', 'Personal Request', reportSummary.personal_request ?? 0],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave()
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Edit Payroll</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update salary details for this employee.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-200">Employee:</span>
            <span>{item.employee_name || '-'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">Month:</span>
            <span>{monthLabel || '-'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">Department:</span>
            <span>{item.department || '-'}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950/40">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Attendance Summary</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Worked {fmtWork(payrollWorkMinutes(item))}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {attendanceSummaryItems.map(([key, label, value]) => (
              <div key={key} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</div>
                <div className="mt-1 text-lg font-black" style={{ color: attendanceStatusTextColor(key) }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PAYROLL_FIELDS.map(([key, label]) => (
            <label key={key} className={clsx('text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400', key === 'tax' && 'sm:col-span-1')}>
              {label}
              <input
                type="number"
                min="0"
                step="0.01"
                value={values[key]}
                disabled={!canSave}
                onChange={(event) => onChange(key, event.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-800"
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
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancel
          </button>
          {canSave && (
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

function PayrollHistoryPrintSheet({ item, companyName = 'Attendance System', language = 'en' }) {
  if (!item?.report_snapshot?.employee) return null

  const text = payrollPrintText(language)
  const data = item.report_snapshot
  const employee = data.employee || {}
  const summary = data.summary || {}
  const days = data.days || []
  const totals = attendanceDetailTotals(days)
  const payrollSummary = defaultPayrollSummary(item)
  const payrollRows = PAYROLL_FIELDS
    .filter(([key]) => payrollNumber(payrollSummary[key]) !== 0)
    .map(([key, label]) => {
      const isDeduction = key === 'deductions' || key === 'tax'
      return [key, text.payrollFields[key] || label, isDeduction ? `(${fmtMoney(payrollSummary[key])})` : fmtMoney(payrollSummary[key])]
    })
  const workSummaryRows = [
    [payrollPrintStatusLabel('present', language), summary.present ?? 0],
    [payrollPrintStatusLabel('late', language), summary.late ?? 0],
    [payrollPrintStatusLabel('early_checkout', language), summary.early_checkout ?? 0],
    [payrollPrintStatusLabel('missing_checkout', language), summary.missing_checkout ?? 0],
  ]
  const absenceSummaryRows = [
    [payrollPrintStatusLabel('absent', language), summary.absent ?? 0],
    [payrollPrintStatusLabel('missing_checkin', language), summary.missing_checkin ?? 0],
    [payrollPrintStatusLabel('day_off', language), summary.day_off ?? 0],
    [payrollPrintStatusLabel('personal_request', language), summary.personal_request ?? 0],
  ]
  const workSummaryTotal = workSummaryRows.reduce((total, [, value]) => total + Number(value || 0), 0)
  const absenceSummaryTotal = absenceSummaryRows.reduce((total, [, value]) => total + Number(value || 0), 0)
  const summaryRowCount = Math.max(workSummaryRows.length, absenceSummaryRows.length, payrollRows.length) + 1
  const netSalary = payrollNet(payrollSummary)

  return (
    <div className={clsx('monthly-report-print-sheet hidden text-blue-950', language === 'km' && 'monthly-report-print-km')}>
      <div className="mb-7 border-b-[3px] border-blue-950 pb-4 text-center">
        <h1 className="text-[20px] font-black uppercase tracking-wide text-blue-950">{text.monthlyReport}</h1>
      </div>

      <div className="grid grid-cols-[0.65fr_1.35fr] items-start gap-8">
        <div className="text-[12px] text-blue-950">
          <h2 className="text-sm font-black uppercase tracking-wide text-blue-950">{text.employeeInfo}</h2>
          <div className="mt-4 grid grid-cols-[130px_1fr] gap-x-4 gap-y-3">
            <p className="font-bold">{text.employee}:</p>
            <p>{employee.name || item.employee_name || '-'}</p>
            <p className="font-bold">{text.employeeId}:</p>
            <p>{employee.employee_code || item.employee_code || '-'}</p>
            <p className="font-bold">{text.position}:</p>
            <p>{employee.position || item.position || '-'}</p>
            <p className="font-bold">{text.department}:</p>
            <p>{employee.department || item.department || '-'}</p>
            <p className="font-bold">{text.reportMonth}:</p>
            <p>{data.month_label || formatMonthLabel(data.month) || '-'}</p>
            <p className="font-bold">{text.workingDays}:</p>
            <p>{summary.working_days ?? 0}</p>
          </div>
        </div>

        <div>
          <table className="w-full border-collapse border border-black text-[12px] text-black">
            <thead>
              <tr>
                <th className="border border-black px-3 py-2 text-left text-[12px] font-black" colSpan={6}>
                  {text.attendanceSummary}
                </th>
              </tr>
              <tr>
                <th className="border border-black px-2 py-1 text-center font-black">{text.work}</th>
                <th className="w-14 border border-black px-2 py-1 text-center font-black">{text.qty}</th>
                <th className="border border-black px-2 py-1 text-center font-black">{text.absent}</th>
                <th className="w-14 border border-black px-2 py-1 text-center font-black">{text.qty}</th>
                <th className="border border-black px-2 py-1 text-center font-black">{text.payrollSummary}</th>
                <th className="w-24 border border-black px-2 py-1 text-center font-black">{text.amount}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: summaryRowCount }).map((_, index) => {
                const isTotalRow = index === summaryRowCount - 1
                const [workLabel = '', workValue = ''] = isTotalRow ? [text.total, workSummaryTotal] : workSummaryRows[index] || []
                const [absenceLabel = '', absenceValue = ''] = isTotalRow ? [text.total, absenceSummaryTotal] : absenceSummaryRows[index] || []
                const [payrollKey = '', payrollLabel = '', payrollValue = ''] = isTotalRow ? ['netSalary', text.netSalary, fmtMoney(netSalary)] : payrollRows[index] || []
                return (
                  <tr key={`payroll-print-summary-${index}`} className={isTotalRow ? 'font-black' : undefined}>
                    <td className="border border-black px-2 py-1 text-center">{workLabel}</td>
                    <td className="border border-black px-2 py-1 text-center">{workValue}</td>
                    <td className="border border-black px-2 py-1 text-center">{absenceLabel}</td>
                    <td className="border border-black px-2 py-1 text-center">{absenceValue}</td>
                    <td className="border border-black px-2 py-1 text-center">{payrollLabel}</td>
                    <td className={clsx('border border-black px-2 py-1 text-right', payrollValue && payrollValueDisplayClass(payrollKey, isTotalRow ? netSalary : payrollSummary[payrollKey]))}>{payrollValue}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <table className="mt-10 w-full border-collapse text-[11px] text-blue-950">
        <thead>
          <tr className="bg-[#F1F5F9]">
            {text.tableCols.map((heading) => (
              <th key={heading} className="border border-black px-2 py-2 text-center font-black text-blue-950">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.length ? days.map((day) => (
            <tr key={day.date} className={day.status === 'absent' ? 'monthly-report-absent-row bg-[#fdecee] font-black text-rose-600' : undefined}>
              <td className="border border-black px-2 py-1.5 text-center">{formatDateWithDay(day.date, day.day)}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{day.schedule || '-'}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{displayReportTime(day, 'check_in') || '-'}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{displayReportTime(day, 'check_out') || '-'}</td>
              <td className="border border-black px-2 py-1.5 text-center">{fmtWork(day.work_minutes)}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{day.late_minutes ? fmtWork(day.late_minutes) : '-'}</td>
              <td className="border border-black px-2 py-1.5 text-center">${Number(day.deduction_amount || 0).toFixed(2)}</td>
              <td className="border border-blue-200 px-2 py-1.5 text-center">{Number(day.overtime_minutes || 0) > 0 ? fmtWork(day.overtime_minutes) : '-'}</td>
              <td
                className="border border-black px-2 py-1.5 text-center font-bold"
                style={{ color: attendanceStatusTextColor(day.status) }}
              >
                {payrollPrintStatusLabel(day.status, language)}
              </td>
            </tr>
          )) : (
            <tr>
              <td className="border border-black px-2 py-6 text-center" colSpan={PRINT_TABLE_COLS.length}>{text.noAttendanceRecords}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-[#F1F5F9] font-black text-blue-950">
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

function PayrollHistoryListPrintSheet({ rows = [], monthLabel, companyName = 'Attendance System', language = 'en' }) {
  if (!rows.length) return null

  const text = payrollPrintText(language)
  const total = (selector) => rows.reduce((sum, item) => sum + payrollNumber(selector(item)), 0)

  return (
    <div className={clsx('monthly-report-print-sheet hidden text-blue-950', language === 'km' && 'monthly-report-print-km')}>
      <div className="mb-7 border-b-[3px] border-blue-950 pb-4 text-center">
        <h1 className="text-[20px] font-black uppercase tracking-wide text-blue-950">{text.payrollHistory}</h1>
        <p className="mt-2 text-[12px] font-bold text-blue-950">{monthLabel || '-'}</p>
      </div>

      <table className="w-full border-collapse text-[10px] text-blue-950">
        <thead>
          <tr className="bg-[#F1F5F9]">
            {text.listCols.map((heading) => (
              <th key={heading} className="border border-black px-1.5 py-2 text-center font-black text-blue-950">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={item.employee_id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
              <td className="border border-black px-1.5 py-1.5 text-center">{index + 1}</td>
              <td className="border border-black px-1.5 py-1.5 text-center">{item.employee_code || '-'}</td>
              <td className="border border-black px-1.5 py-1.5">{item.employee_name || '-'}</td>
              <td className="border border-black px-1.5 py-1.5 text-center">{item.department || '-'}</td>
              <td className="border border-black px-1.5 py-1.5 text-center">{item.position || '-'}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('baseSalary', item.summary?.baseSalary))}>{fmtMoney(item.summary?.baseSalary)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('allowances', item.summary?.allowances))}>{fmtMoney(item.summary?.allowances)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('overtime', item.summary?.overtime))}>{fmtMoney(item.summary?.overtime)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('commission', item.summary?.commission))}>{fmtMoney(item.summary?.commission)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('bonus', item.summary?.bonus))}>{fmtMoney(item.summary?.bonus)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('deductions', item.summary?.deductions))}>{fmtMoney(item.summary?.deductions)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right', payrollValueColorClass('tax', item.summary?.tax))}>{fmtMoney(item.summary?.tax)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-right font-black', netSalaryStatusClass(item.net_salary))}>{fmtMoney(item.net_salary)}</td>
              <td className={clsx('border border-black px-1.5 py-1.5 text-center font-black', payrollStatusPrintClass(item.status || 'pending'))}>{payrollPaymentStatusLabel(item.status || 'pending', language)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#F1F5F9] font-black text-blue-950">
            <td className="border border-black px-1.5 py-2 text-right" colSpan={5}>{text.total}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('baseSalary', total((item) => item.summary?.baseSalary)))}>{fmtMoney(total((item) => item.summary?.baseSalary))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('allowances', total((item) => item.summary?.allowances)))}>{fmtMoney(total((item) => item.summary?.allowances))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('overtime', total((item) => item.summary?.overtime)))}>{fmtMoney(total((item) => item.summary?.overtime))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('commission', total((item) => item.summary?.commission)))}>{fmtMoney(total((item) => item.summary?.commission))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('bonus', total((item) => item.summary?.bonus)))}>{fmtMoney(total((item) => item.summary?.bonus))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('deductions', total((item) => item.summary?.deductions)))}>{fmtMoney(total((item) => item.summary?.deductions))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', payrollValueColorClass('tax', total((item) => item.summary?.tax)))}>{fmtMoney(total((item) => item.summary?.tax))}</td>
            <td className={clsx('border border-black px-1.5 py-2 text-right', netSalaryStatusClass(total((item) => item.net_salary)))}>{fmtMoney(total((item) => item.net_salary))}</td>
            <td className="border border-black px-1.5 py-2" />
          </tr>
        </tfoot>
      </table>

      <div className="mt-10 border-t-4 border-blue-900 pt-4 text-center text-[10px] font-medium text-slate-500">
        {companyName}
      </div>
    </div>
  )
}

function ReportLanguageDialog({ open, onCancel, onSelect }) {
  if (!open) return null

  const text = payrollPrintText('en')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:hidden" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">{text.chooseTitle}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text.chooseHelp}</p>
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
            {text.khmerReport}
            <span className="mt-0.5 block text-xs font-semibold text-blue-600">{text.khmerHelp}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect('en')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {text.englishReport}
            <span className="mt-0.5 block text-xs font-semibold text-slate-500">{text.englishHelp}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PayrollLockGate({ status, pin, error, unlocking, onPinChange, onUnlock }) {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] place-items-center p-4">
      <form
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        onSubmit={(event) => {
          event.preventDefault()
          onUnlock()
        }}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <LockKeyhole size={28} />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Payroll History Locked</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter the Payroll PIN to view salary history for this session.
          </p>
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200">Payroll PIN</span>
          <input
            type="password"
            value={pin}
            onChange={(event) => onPinChange(event.target.value)}
            autoFocus
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-center text-lg font-black tracking-widest text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="Enter PIN"
          />
        </label>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!pin || unlocking}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-black text-white shadow-sm shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShieldCheck size={18} />
          {unlocking ? 'Unlocking...' : 'Unlock Payroll'}
        </button>

        <p className="mt-4 text-center text-xs font-semibold text-slate-400">
          Auto-lock after {status?.unlock_minutes || 15} minutes.
        </p>
      </form>
    </div>
  )
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={clsx(inputCls, 'h-11 w-full appearance-auto rounded-xl shadow-sm')}
      >
        {children}
      </select>
    </label>
  )
}

function SummaryMetric({ icon: Icon, color, label, value }) {
  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900/40 sm:px-4 sm:py-4">
      <div className={clsx('grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-sm sm:h-12 sm:w-12', color)}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 truncate text-xl font-black text-slate-950 dark:text-white sm:text-2xl">{value}</p>
      </div>
    </article>
  )
}

export default function PayrollHistoryPage({ user, appData, initialMonth }) {
  const canViewPayroll = canAccess(user, ['payroll.view_all', 'payroll.view_own', 'payroll.create', 'payroll.update'])
  const canSave = canAccess(user, ['payroll.create', 'payroll.update'])
  const [month, setMonth] = useState(initialMonth || currentMonthStr())
  const [rows, setRows] = useState([])
  const [filters, setFilters] = useState(() => {
    const [year, monthValue] = (initialMonth || currentMonthStr()).split('-')
    return {
      month: monthValue,
      year,
      department: '',
      employee: '',
      status: '',
      paymentMethod: '',
      branch: '',
    }
  })
  const [draftFilters, setDraftFilters] = useState(() => {
    const [year, monthValue] = (initialMonth || currentMonthStr()).split('-')
    return {
      month: monthValue,
      year,
      department: '',
      employee: '',
      status: '',
      paymentMethod: '',
      branch: '',
    }
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [printItem, setPrintItem] = useState(null)
  const [printMode, setPrintMode] = useState(null)
  const [printLanguage, setPrintLanguage] = useState('en')
  const [pendingReportAction, setPendingReportAction] = useState(null)
  const [printExcludedEmployeeIds, setPrintExcludedEmployeeIds] = useState([])
  const [draft, setDraft] = useState(EMPTY_PAYROLL_SUMMARY)
  const [monthLabel, setMonthLabel] = useState(formatMonthLabel(initialMonth || currentMonthStr()))
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusSavingId, setStatusSavingId] = useState(null)
  const [error, setError] = useState(null)
  const [payrollSecurityStatus, setPayrollSecurityStatus] = useState(null)
  const [checkingPayrollSecurity, setCheckingPayrollSecurity] = useState(true)
  const [unlockPin, setUnlockPin] = useState('')
  const [unlockingPayroll, setUnlockingPayroll] = useState(false)
  const [unlockError, setUnlockError] = useState('')
  const payrollAccessReady = !canViewPayroll || (payrollSecurityStatus && (!payrollSecurityStatus.enabled || payrollSecurityStatus.unlocked))

  useEffect(() => {
    if (initialMonth) {
      setMonth(initialMonth)
      const [year, monthValue] = initialMonth.split('-')
      setFilters((current) => ({ ...current, year, month: monthValue }))
      setDraftFilters((current) => ({ ...current, year, month: monthValue }))
    }
  }, [initialMonth])

  const loadPayrollSecurityStatus = async () => {
    if (!canViewPayroll) {
      setCheckingPayrollSecurity(false)
      return
    }
    setCheckingPayrollSecurity(true)
    setUnlockError('')
    try {
      const status = await employeeMonthlyReportService.payrollSecurityStatus()
      setPayrollSecurityStatus(status)
    } catch (err) {
      setUnlockError(err.response?.data?.message || 'Could not check payroll security.')
      setPayrollSecurityStatus({ enabled: true, unlocked: false, unlock_minutes: 15 })
    } finally {
      setCheckingPayrollSecurity(false)
    }
  }

  useEffect(() => {
    loadPayrollSecurityStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewPayroll])

  const loadHistory = async (targetMonth = month) => {
    if (!canViewPayroll || !targetMonth || !payrollAccessReady) return
    setLoading(true)
    setError(null)
    setSelectedItem(null)
    setDraft(EMPTY_PAYROLL_SUMMARY)

    try {
      const res = await employeeMonthlyReportService.payrollHistory({ month: targetMonth })
      const items = res.items || []
      setRows(items)
      setMonthLabel(res.month_label || formatMonthLabel(targetMonth))
      if (items.length) selectItem(items[0])
    } catch (err) {
      if (err.response?.status === 423) {
        setPayrollSecurityStatus({ enabled: true, unlocked: false, unlock_minutes: payrollSecurityStatus?.unlock_minutes || 15 })
        setUnlockError(err.response?.data?.message || 'Payroll History is locked.')
        return
      }
      setError(err.response?.data?.message || 'Failed to load payroll history.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (payrollAccessReady) loadHistory(month)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, canViewPayroll, payrollAccessReady])

  useEffect(() => {
    const rowIds = new Set(rows.map((item) => String(item.employee_id)))
    setPrintExcludedEmployeeIds((current) => current.filter((id) => rowIds.has(String(id))))
  }, [rows])

  const selectItem = (item) => {
    setSelectedItem(item)
    setDraft(defaultPayrollSummary(item))
  }

  const openSummaryModal = (item = selectedItem || rows[0]) => {
    if (!item) return
    selectItem(item)
    setSummaryModalOpen(true)
  }

  const runPayrollHistoryPrint = (item, language = printLanguage) => {
    if (!item) return
    setPrintLanguage(language)
    setPrintMode('employee')
    setPrintItem(item)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
      })
    })
  }

  const runPayrollHistoryListPrint = (language = printLanguage) => {
    if (!printRows.length) return
    setPrintLanguage(language)
    setPrintMode('history')
    setPrintItem(null)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
      })
    })
  }

  const printPayrollHistory = (item) => {
    if (!item) return
    setPendingReportAction({ type: 'employee-print', item })
  }

  const printPayrollHistoryList = () => {
    if (!printRows.length) return
    setPendingReportAction({ type: 'history-print' })
  }

  const unlockPayrollHistory = async () => {
    if (!unlockPin || unlockingPayroll) return
    setUnlockingPayroll(true)
    setUnlockError('')
    try {
      const status = await employeeMonthlyReportService.unlockPayrollSecurity(unlockPin)
      setPayrollSecurityStatus(status)
      setUnlockPin('')
    } catch (err) {
      setUnlockError(err.response?.data?.message || 'Payroll PIN is incorrect.')
    } finally {
      setUnlockingPayroll(false)
    }
  }

  const saveHistory = async () => {
    if (!selectedItem || !canSave) return
    setSaving(true)
    setError(null)

    try {
      const payload = {
        month: selectedItem.report_snapshot?.month || month,
        employee_id: selectedItem.employee_id,
        base_salary: payrollNumber(draft.baseSalary),
        allowances: payrollNumber(draft.allowances),
        overtime: payrollNumber(draft.overtime),
        commission: payrollNumber(draft.commission),
        bonus: payrollNumber(draft.bonus),
        deductions: payrollNumber(draft.deductions),
        tax: payrollNumber(draft.tax),
        status: selectedItem.status || 'pending',
        report_snapshot: selectedItem.report_snapshot,
      }
      const res = await employeeMonthlyReportService.savePayrollHistory(payload)
      if (!res.history?.summary) return

      const updatedItem = {
        ...selectedItem,
        history: res.history,
        summary: res.history.summary,
        gross_salary:
          payrollNumber(res.history.summary.baseSalary) +
          payrollNumber(res.history.summary.allowances) +
          payrollNumber(res.history.summary.overtime) +
          payrollNumber(res.history.summary.commission) +
          payrollNumber(res.history.summary.bonus),
        total_deductions: payrollNumber(res.history.summary.deductions) + payrollNumber(res.history.summary.tax),
        net_salary: payrollNumber(res.history.net_salary),
        status: res.history.status || selectedItem.status || 'pending',
      }
      setSelectedItem(updatedItem)
      setDraft(defaultPayrollSummary(updatedItem))
      setRows((items) => items.map((item) => (item.employee_id === updatedItem.employee_id ? updatedItem : item)))
      setSummaryModalOpen(false)
    } catch (err) {
      if (err.response?.status === 423) {
        setSummaryModalOpen(false)
        setPayrollSecurityStatus({ enabled: true, unlocked: false, unlock_minutes: payrollSecurityStatus?.unlock_minutes || 15 })
        setUnlockError(err.response?.data?.message || 'Payroll History is locked.')
        return
      }
      setError(err.response?.data?.message || 'Failed to save payroll history.')
    } finally {
      setSaving(false)
    }
  }

  const saveRowStatus = async (item, status) => {
    if (!item || !canSave || status === item.status) return
    setStatusSavingId(item.employee_id)
    setError(null)

    try {
      const summary = defaultPayrollSummary(item)
      const payload = {
        month: item.report_snapshot?.month || month,
        employee_id: item.employee_id,
        base_salary: payrollNumber(summary.baseSalary),
        allowances: payrollNumber(summary.allowances),
        overtime: payrollNumber(summary.overtime),
        commission: payrollNumber(summary.commission),
        bonus: payrollNumber(summary.bonus),
        deductions: payrollNumber(summary.deductions),
        tax: payrollNumber(summary.tax),
        status,
        report_snapshot: item.report_snapshot,
      }
      const res = await employeeMonthlyReportService.savePayrollHistory(payload)
      const nextStatus = res.history?.status || status
      const updatedItem = { ...item, history: res.history || item.history, status: nextStatus }

      setRows((items) => items.map((row) => (row.employee_id === item.employee_id ? updatedItem : row)))
      setSelectedItem((current) => (current?.employee_id === item.employee_id ? { ...current, status: nextStatus, history: updatedItem.history } : current))
    } catch (err) {
      if (err.response?.status === 423) {
        setPayrollSecurityStatus({ enabled: true, unlocked: false, unlock_minutes: payrollSecurityStatus?.unlock_minutes || 15 })
        setUnlockError(err.response?.data?.message || 'Payroll History is locked.')
        return
      }
      setError(err.response?.data?.message || 'Failed to update payroll status.')
    } finally {
      setStatusSavingId(null)
    }
  }

  const changeMonth = (nextMonth) => {
    setMonth(nextMonth)
    setMonthLabel(formatMonthLabel(nextMonth))
  }

  const filterOptions = (field) => {
    return [...new Set(rows.map((item) => item[field]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)))
  }

  const filteredRows = rows.filter((item) => {
    if (filters.department && item.department !== filters.department) return false
    if (filters.employee && String(item.employee_id) !== String(filters.employee)) return false
    if (filters.status && item.status !== filters.status) return false
    if (filters.branch && item.branch !== filters.branch) return false
    return true
  }).sort((a, b) => {
    const workDiff = payrollWorkMinutes(b) - payrollWorkMinutes(a)
    if (workDiff !== 0) return workDiff
    return String(a.employee_name || '').localeCompare(String(b.employee_name || ''))
  })
  const printExcludedSet = new Set(printExcludedEmployeeIds.map((id) => String(id)))
  const printRows = filteredRows.filter((item) => !printExcludedSet.has(String(item.employee_id)))
  const hiddenPrintCount = filteredRows.length - printRows.length
  const allFilteredRowsIncludedInPrint = filteredRows.length > 0 && hiddenPrintCount === 0
  const payrollYears = Array.from({ length: 7 }, (_, index) => String(new Date().getFullYear() - 3 + index))
  const totalGross = filteredRows.reduce((total, item) => total + payrollNumber(item.gross_salary), 0)
  const totalDeductions = filteredRows.reduce((total, item) => total + payrollNumber(item.total_deductions), 0)
  const totalNet = filteredRows.reduce((total, item) => total + payrollNumber(item.net_salary), 0)
  const paidEmployees = filteredRows.filter((item) => item.status === 'paid').length
  const companyName = appData?.appSettings?.company_name || appData?.appSettings?.site_title || 'Attendance System'

  const applyFilters = () => {
    const nextMonth = `${draftFilters.year}-${draftFilters.month}`
    setFilters(draftFilters)
    if (nextMonth !== month) {
      changeMonth(nextMonth)
    }
  }

  const resetFilters = () => {
    const [year, monthValue] = currentMonthStr().split('-')
    const next = {
      month: monthValue,
      year,
      department: '',
      employee: '',
      status: '',
      paymentMethod: '',
      branch: '',
    }
    setDraftFilters(next)
    setFilters(next)
    changeMonth(`${year}-${monthValue}`)
  }

  const setPrintEmployeeIncluded = (employeeId, isIncluded) => {
    const targetId = String(employeeId)
    setPrintExcludedEmployeeIds((current) => {
      const currentIds = current.map((id) => String(id))
      if (isIncluded) return currentIds.filter((id) => id !== targetId)
      return currentIds.includes(targetId) ? currentIds : [...currentIds, targetId]
    })
  }

  const setAllFilteredEmployeesIncludedInPrint = (isIncluded) => {
    const filteredIds = filteredRows.map((item) => String(item.employee_id))
    setPrintExcludedEmployeeIds((current) => {
      const currentIds = current.map((id) => String(id))
      if (isIncluded) return currentIds.filter((id) => !filteredIds.includes(id))
      return [...new Set([...currentIds, ...filteredIds])]
    })
  }

  const runPayrollHistoryExcelExport = (language = printLanguage) => {
    if (!printRows.length) return
    setPrintLanguage(language)
    const html = payrollHistoryExcelHtml(printRows, monthLabel, companyName, language)
    downloadBlob(
      new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' }),
      `payroll-history-${month}.xls`,
    )
  }

  const exportPayrollHistoryExcel = () => {
    if (!printRows.length) return
    setPendingReportAction({ type: 'history-excel' })
  }

  const runPendingReportAction = (language) => {
    const action = pendingReportAction
    setPendingReportAction(null)
    if (!action) return
    if (action.type === 'employee-print') {
      runPayrollHistoryPrint(action.item, language)
      return
    }
    if (action.type === 'history-print') {
      runPayrollHistoryListPrint(language)
      return
    }
    if (action.type === 'history-excel') {
      runPayrollHistoryExcelExport(language)
    }
  }

  if (!canViewPayroll) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          You do not have permission to view payroll history.
        </div>
      </div>
    )
  }

  if (checkingPayrollSecurity) {
    return (
      <div className="grid min-h-[calc(100vh-8rem)] place-items-center p-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Checking payroll security...
        </div>
      </div>
    )
  }

  if (payrollSecurityStatus?.enabled && !payrollSecurityStatus?.unlocked) {
    return (
      <PayrollLockGate
        status={payrollSecurityStatus}
        pin={unlockPin}
        error={unlockError}
        unlocking={unlockingPayroll}
        onPinChange={setUnlockPin}
        onUnlock={unlockPayrollHistory}
      />
    )
  }

  return (
    <div className="max-w-full space-y-4 overflow-hidden p-3 pb-28 sm:space-y-5 sm:p-6">
      <PayrollHistoryPrintSheet
        item={printMode === 'employee' ? printItem : null}
        companyName={companyName}
        language={printLanguage}
      />
      <PayrollHistoryListPrintSheet
        rows={printMode === 'history' ? printRows : []}
        monthLabel={monthLabel}
        companyName={companyName}
        language={printLanguage}
      />
      <ReportLanguageDialog
        open={Boolean(pendingReportAction)}
        onCancel={() => setPendingReportAction(null)}
        onSelect={runPendingReportAction}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Report filters</p>
          <p className="text-xs text-slate-500">Choose payroll period and options, then search</p>
        </div>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
            <FilterSelect label="Payroll Month" value={draftFilters.month} onChange={(value) => setDraftFilters((current) => ({ ...current, month: value }))}>
              {MONTH_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </FilterSelect>
            <FilterSelect label="Payroll Year" value={draftFilters.year} onChange={(value) => setDraftFilters((current) => ({ ...current, year: value }))}>
              {payrollYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </FilterSelect>
            <FilterSelect label="Department" value={draftFilters.department} onChange={(value) => setDraftFilters((current) => ({ ...current, department: value, employee: '' }))}>
              <option value="">All</option>
              {filterOptions('department').map((department) => <option key={department} value={department}>{department}</option>)}
            </FilterSelect>
            <FilterSelect label="Employee" value={draftFilters.employee} onChange={(value) => setDraftFilters((current) => ({ ...current, employee: value }))}>
              <option value="">All</option>
              {rows
                .filter((item) => !draftFilters.department || item.department === draftFilters.department)
                .map((item) => <option key={item.employee_id} value={item.employee_id}>{item.employee_name}</option>)}
            </FilterSelect>
            <FilterSelect label="Payment Status" value={draftFilters.status} onChange={(value) => setDraftFilters((current) => ({ ...current, status: value }))}>
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </FilterSelect>
            <FilterSelect label="Payment Method" value={draftFilters.paymentMethod} onChange={(value) => setDraftFilters((current) => ({ ...current, paymentMethod: value }))}>
              <option value="">All</option>
            </FilterSelect>
            <FilterSelect label="Branch" value={draftFilters.branch} onChange={(value) => setDraftFilters((current) => ({ ...current, branch: value }))}>
              <option value="">All</option>
              {filterOptions('branch').map((branch) => <option key={branch} value={branch}>{branch}</option>)}
            </FilterSelect>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
              {filteredRows.length > 0 && (
                <label className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={allFilteredRowsIncludedInPrint}
                    onChange={(event) => setAllFilteredEmployeesIncludedInPrint(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Include all in print
                </label>
              )}
              {hiddenPrintCount > 0 && (
                <span className="text-xs font-black text-orange-600 dark:text-orange-300">
                  {hiddenPrintCount} hidden from list print
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-4 lg:flex lg:items-center lg:justify-end">
              <button type="button" onClick={applyFilters} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 lg:w-auto lg:min-w-32">
                <Search size={18} />
                Search
              </button>
              <button type="button" onClick={resetFilters} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 lg:w-auto lg:min-w-32">
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                type="button"
                onClick={exportPayrollHistoryExcel}
                disabled={!printRows.length}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-black text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 lg:w-auto lg:min-w-40"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
              <button
                type="button"
                onClick={printPayrollHistoryList}
                disabled={!printRows.length}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300 lg:w-auto lg:min-w-44"
              >
                <Printer size={18} />
                Print Payroll History
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryMetric icon={Users} color="bg-blue-600" label="Total Employees" value={filteredRows.length} />
        <SummaryMetric icon={DollarSign} color="bg-emerald-600" label="Total Gross Salary" value={fmtMoney(totalGross)} />
        <SummaryMetric icon={Download} color="bg-orange-500" label="Total Deductions" value={fmtMoney(totalDeductions)} />
        <SummaryMetric icon={Wallet} color="bg-violet-600" label="Total Net Salary" value={fmtMoney(totalNet)} />
        <SummaryMetric icon={CheckCircle2} color="bg-cyan-600" label="Paid Employees" value={paidEmployees} />
      </div>

      <PayrollSummaryModal
        open={summaryModalOpen}
        item={selectedItem}
        monthLabel={monthLabel}
        values={draft}
        saving={saving}
        canSave={canSave}
        onChange={(key, value) => setDraft((current) => ({ ...current, [key]: value }))}
        onClose={() => setSummaryModalOpen(false)}
        onSave={saveHistory}
      />

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          <XCircle size={18} />
          {error}
        </div>
      )}

      <section className="md:hidden">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            Loading payroll history...
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            No payroll history rows match the selected filters.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1280px] border-collapse text-xs">
                <thead className="bg-[#F1F5F9] text-[10px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    {['#', 'Print', 'Employee ID', 'Employee', 'Department', 'Position', 'Base Salary', 'Allowances', 'Overtime', 'Commission', 'Bonus', 'Deductions', 'Tax', 'Net Salary', 'Status', 'Action'].map((heading) => (
                      <th key={heading} className="border border-slate-200 px-3 py-2.5 text-center dark:border-slate-700">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((item, index) => {
                    const isSelected = selectedItem?.employee_id === item.employee_id
                    return (
                      <tr
                        key={item.employee_id}
                        className={clsx(
                          index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-[#F8FAFC] dark:bg-slate-950/40',
                          'hover:bg-[#EFF6FF] dark:hover:bg-blue-950/20',
                          isSelected && 'bg-[#DBEAFE] dark:bg-blue-950/40',
                        )}
                      >
                        <td className="border border-slate-200 px-3 py-3 text-center font-bold dark:border-slate-700">{index + 1}</td>
                        <td className="border border-slate-200 px-3 py-3 text-center dark:border-slate-700">
                          <input
                            type="checkbox"
                            checked={!printExcludedSet.has(String(item.employee_id))}
                            onChange={(event) => setPrintEmployeeIncluded(item.employee_id, event.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Show ${item.employee_name || 'employee'} in list print`}
                          />
                        </td>
                        <td className="border border-slate-200 px-3 py-3 text-center font-bold dark:border-slate-700">{item.employee_code || '-'}</td>
                        <td className="border border-slate-200 px-3 py-3 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 text-xs font-black text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                              {item.photo_url ? <img src={item.photo_url} alt={item.employee_name} className="h-full w-full object-cover" /> : item.employee_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="max-w-36 truncate font-black text-slate-900 dark:text-white">{item.employee_name || '-'}</span>
                          </div>
                        </td>
                        <td className="border border-slate-200 px-3 py-3 text-center font-semibold dark:border-slate-700">{item.department || '-'}</td>
                        <td className="border border-slate-200 px-3 py-3 text-center font-semibold dark:border-slate-700">{item.position || '-'}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('baseSalary', item.summary?.baseSalary))}>{fmtMoney(item.summary?.baseSalary)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('allowances', item.summary?.allowances))}>{fmtMoney(item.summary?.allowances)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('overtime', item.summary?.overtime))}>{fmtMoney(item.summary?.overtime)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('commission', item.summary?.commission))}>{fmtMoney(item.summary?.commission)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('bonus', item.summary?.bonus))}>{fmtMoney(item.summary?.bonus)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('deductions', item.summary?.deductions))}>{fmtMoney(item.summary?.deductions)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('tax', item.summary?.tax))}>{fmtMoney(item.summary?.tax)}</td>
                        <td className={clsx('border border-slate-200 px-3 py-3 text-right font-black dark:border-slate-700', netSalaryStatusClass(item.net_salary))}>{fmtMoney(item.net_salary)}</td>
                        <td className="border border-slate-200 px-3 py-3 text-center dark:border-slate-700">
                          <select
                            value={item.status || 'pending'}
                            disabled={!canSave || statusSavingId === item.employee_id}
                            onChange={(event) => saveRowStatus(item, event.target.value)}
                            className={clsx(
                              'h-8 rounded-lg border px-2 text-xs font-black capitalize outline-none transition disabled:cursor-not-allowed disabled:opacity-60',
                              item.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
                            )}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                          </select>
                        </td>
                        <td className="border border-slate-200 px-3 py-3 text-center dark:border-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => printPayrollHistory(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 shadow-sm transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300"
                              aria-label={`Print payroll for ${item.employee_name}`}
                            >
                              <Printer size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openSummaryModal(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                              aria-label={`Edit payroll for ${item.employee_name}`}
                            >
                              <Pencil size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-[#F1F5F9] text-xs font-black text-slate-900 dark:bg-slate-800 dark:text-white">
                  <tr>
                    <td className="border border-slate-200 px-3 py-3 text-right dark:border-slate-700" colSpan={6}>Total</td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('baseSalary', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.baseSalary), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.baseSalary), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('allowances', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.allowances), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.allowances), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('overtime', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.overtime), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.overtime), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('commission', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.commission), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.commission), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('bonus', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.bonus), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.bonus), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('deductions', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.deductions), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.deductions), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', payrollValueColorClass('tax', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.tax), 0)))}>
                      {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.tax), 0))}
                    </td>
                    <td className={clsx('border border-slate-200 px-3 py-3 text-right dark:border-slate-700', netSalaryStatusClass(totalNet))}>
                      {fmtMoney(totalNet)}
                    </td>
                    <td className="border border-slate-200 px-3 py-3 dark:border-slate-700" colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1440px] border-collapse text-sm">
            <thead className="bg-[#F1F5F9] text-xs font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                {['#', 'Print', 'Employee ID', 'Employee', 'Department', 'Position', 'Base Salary', 'Allowances', 'Overtime', 'Commission', 'Bonus', 'Deductions', 'Tax', 'Net Salary', 'Status', 'Action'].map((heading) => (
                  <th key={heading} className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700" colSpan={16}>
                    Loading payroll history...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td className="border border-slate-200 px-4 py-10 text-center text-slate-500 dark:border-slate-700" colSpan={16}>
                    No payroll history rows match the selected filters.
                  </td>
                </tr>
              ) : filteredRows.map((item, index) => {
                const isSelected = selectedItem?.employee_id === item.employee_id
                return (
                  <tr
                    key={item.employee_id}
                    className={clsx(
                      index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-[#F8FAFC] dark:bg-slate-950/40',
                      'hover:bg-[#EFF6FF] dark:hover:bg-blue-950/20',
                      isSelected && 'bg-[#DBEAFE] dark:bg-blue-950/40',
                    )}
                  >
                    <td className="border border-slate-200 px-4 py-3 text-center font-bold dark:border-slate-700">{index + 1}</td>
                    <td className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">
                      <input
                        type="checkbox"
                        checked={!printExcludedSet.has(String(item.employee_id))}
                        onChange={(event) => setPrintEmployeeIncluded(item.employee_id, event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Show ${item.employee_name || 'employee'} in list print`}
                      />
                    </td>
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
                    <td className="border border-slate-200 px-4 py-3 text-center font-semibold dark:border-slate-700">{item.position || '-'}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('baseSalary', item.summary?.baseSalary))}>{fmtMoney(item.summary?.baseSalary)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('allowances', item.summary?.allowances))}>{fmtMoney(item.summary?.allowances)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('overtime', item.summary?.overtime))}>{fmtMoney(item.summary?.overtime)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('commission', item.summary?.commission))}>{fmtMoney(item.summary?.commission)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('bonus', item.summary?.bonus))}>{fmtMoney(item.summary?.bonus)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('deductions', item.summary?.deductions))}>{fmtMoney(item.summary?.deductions)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-bold dark:border-slate-700', payrollValueColorClass('tax', item.summary?.tax))}>{fmtMoney(item.summary?.tax)}</td>
                    <td className={clsx('border border-slate-200 px-4 py-3 text-right font-black dark:border-slate-700', netSalaryStatusClass(item.net_salary))}>{fmtMoney(item.net_salary)}</td>
                    <td className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">
                      <select
                        value={item.status || 'pending'}
                        disabled={!canSave || statusSavingId === item.employee_id}
                        onChange={(event) => saveRowStatus(item, event.target.value)}
                        className={clsx(
                          'h-9 rounded-lg border px-3 text-xs font-black capitalize outline-none transition disabled:cursor-not-allowed disabled:opacity-60',
                          item.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
                        )}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 px-4 py-3 text-center dark:border-slate-700">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => printPayrollHistory(item)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 shadow-sm transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300"
                          aria-label={`Print payroll for ${item.employee_name}`}
                        >
                          <Printer size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openSummaryModal(item)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                          aria-label={`Edit payroll for ${item.employee_name}`}
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {!loading && filteredRows.length > 0 && (
              <tfoot className="bg-[#F1F5F9] text-sm font-black text-slate-900 dark:bg-slate-800 dark:text-white">
                <tr>
                  <td className="border border-slate-200 px-4 py-3 text-right dark:border-slate-700" colSpan={6}>Total</td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('baseSalary', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.baseSalary), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.baseSalary), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('allowances', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.allowances), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.allowances), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('overtime', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.overtime), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.overtime), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('commission', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.commission), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.commission), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('bonus', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.bonus), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.bonus), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('deductions', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.deductions), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.deductions), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', payrollValueColorClass('tax', filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.tax), 0)))}>
                    {fmtMoney(filteredRows.reduce((total, item) => total + payrollNumber(item.summary?.tax), 0))}
                  </td>
                  <td className={clsx('border border-slate-200 px-4 py-3 text-right dark:border-slate-700', netSalaryStatusClass(totalNet))}>
                    {fmtMoney(totalNet)}
                  </td>
                  <td className="border border-slate-200 px-4 py-3 dark:border-slate-700" colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>
    </div>
  )
}
