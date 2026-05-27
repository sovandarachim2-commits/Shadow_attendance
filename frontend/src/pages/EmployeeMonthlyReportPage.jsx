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
  Home,
  Printer,
  RotateCcw,
  Search,
  UserRound,
  UserX,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'
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
    label: 'Late',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    dot: 'bg-amber-500',
    row: '',
  },
  absent: {
    label: 'Absent',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    dot: 'bg-rose-500',
    row: 'bg-rose-50/40 dark:bg-rose-950/10',
  },
  missing_checkout: {
    label: 'Missing Check Out',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400',
    dot: 'bg-violet-500',
    row: '',
  },
  day_off: {
    label: 'Day Off',
    badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
    row: 'bg-slate-50/70 dark:bg-slate-800/20',
  },
  on_leave: {
    label: 'Leave',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
    dot: 'bg-sky-500',
    row: '',
  },
  leave: {
    label: 'Leave',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
    dot: 'bg-sky-500',
    row: '',
  },
  half_day: {
    label: 'Half Day',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
    dot: 'bg-sky-500',
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
  { key: 'present', label: 'Present Days', icon: CheckCircle2, tone: 'emerald' },
  { key: 'late', label: 'Late Days', icon: Clock, tone: 'amber' },
  { key: 'absent', label: 'Absent Days', icon: UserX, tone: 'rose' },
  { key: 'missing_checkout', label: 'Missing Check Out', icon: AlertCircle, tone: 'violet' },
  { key: 'day_off', label: 'Day Off', icon: Calendar, tone: 'slate' },
  { key: 'on_leave', label: 'Leave Days', icon: XCircle, tone: 'sky' },
]

const TONE_ICON = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
  slate: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
}

const TONE_VALUE = {
  emerald: 'text-emerald-700 dark:text-emerald-300',
  amber: 'text-amber-700 dark:text-amber-300',
  rose: 'text-rose-700 dark:text-rose-300',
  violet: 'text-violet-700 dark:text-violet-300',
  slate: 'text-slate-600 dark:text-slate-300',
  sky: 'text-sky-700 dark:text-sky-300',
}

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
  { value: 'missing_checkout', label: 'Missing Checkout' },
  { value: 'on_leave', label: 'Leave' },
  { value: 'day_off', label: 'Day Off' },
  { value: 'holiday', label: 'Holiday' },
]

const LEGEND_ITEMS = [
  { dot: 'bg-emerald-500', label: 'Present' },
  { dot: 'bg-amber-500', label: 'Late' },
  { dot: 'bg-rose-500', label: 'Absent' },
  { dot: 'bg-violet-500', label: 'Missing Check Out' },
  { dot: 'bg-slate-400', label: 'Day Off' },
  { dot: 'bg-sky-500', label: 'Leave' },
  { dot: 'bg-cyan-500', label: 'Holiday' },
]

const TABLE_COLS = ['Date', 'Day', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Note']
const MOBILE_TABLE_COLS = ['Date', 'Day', 'In', 'Out', 'Hours', 'Status']
const MOBILE_PAGE_SIZE = 10

const MOBILE_STATUS_LABELS = {
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  missing_checkout: 'Missing Out',
  day_off: 'Day Off',
  on_leave: 'Leave',
  leave: 'Leave',
  half_day: 'Half Day',
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

function dayNote(day) {
  if (day.notes) return day.notes
  return '–'
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
  const header = ['Date', 'Day', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Note'].join(',')
  const rows = (data.days || []).map((d) =>
    [
      esc(d.date),
      esc(d.day),
      esc(d.check_in || '–'),
      esc(d.check_out || '–'),
      esc(fmtWork(d.work_minutes)),
      esc(STATUS_META[d.status]?.label || d.status),
      esc(dayNote(d)),
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
    const note = dayNote(day)

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
        <td className="px-4 py-3.5 text-xs text-slate-400 dark:text-slate-500">{day.day}</td>
        <td className="px-4 py-3.5">
          {day.check_in ? (
            <span
              className={clsx(
                'font-semibold',
                isLate ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300',
              )}
            >
              {day.check_in}
            </span>
          ) : (
            <span className="text-slate-300 dark:text-slate-600">–</span>
          )}
        </td>
        <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
          {day.check_out || <span className="text-slate-300 dark:text-slate-600">–</span>}
        </td>
        <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
          {fmtWork(day.work_minutes)}
        </td>
        <td className="px-4 py-3.5">
          <StatusBadge status={day.status} />
        </td>
        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{note}</td>
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
      {days.length === 0 ? (
        <div className="p-14 text-center">
          <Calendar size={44} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
          <p className="font-medium text-slate-400">No records match the selected filters.</p>
        </div>
      ) : (
        <div className="max-h-[min(65vh,680px)] overflow-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm dark:bg-slate-800/95">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {TABLE_COLS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
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
                return (
                  <tr key={`${day.date}-${i}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                    <td className="whitespace-nowrap px-2 py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      {formatDateMobile(day.date)}
                    </td>
                    <td className="px-2 py-2.5 text-slate-400">{day.day}</td>
                    <td className="px-2 py-2.5">
                      {day.check_in ? (
                        <span className={clsx('font-semibold', isLate && 'text-amber-600')}>
                          {day.check_in}
                        </span>
                      ) : (
                        <span className="text-slate-300">–</span>
                      )}
                    </td>
                    <td className="px-2 py-2.5 font-medium text-slate-700 dark:text-slate-300">
                      {day.check_out || <span className="text-slate-300">–</span>}
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

function FilterField({ label, icon: Icon, required, children, className }) {
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
  onExportPdf,
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
                    setTimeout(() => onExportPdf(), 200)
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <FileText size={16} />
                  Export PDF
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
              <td className="px-2 py-1.5">{day.day}</td>
              <td className="px-2 py-1.5">{day.check_in || '–'}</td>
              <td className="px-2 py-1.5">{day.check_out || '–'}</td>
              <td className="px-2 py-1.5">{fmtWork(day.work_minutes)}</td>
              <td className="px-2 py-1.5">{STATUS_META[day.status]?.label || day.status}</td>
              <td className="px-2 py-1.5">{dayNote(day)}</td>
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
        className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:bg-slate-900"
      >
        <FileText size={16} />
        Export PDF
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
        onExportPdf={handlePrint}
        onPrint={handlePrint}
        hasExport={canExport}
        exportReady={hasExportData}
        exporting={exporting}
      />

      {/* Header — desktop */}
      <div className="hidden flex-wrap items-start justify-between gap-4 lg:flex print:hidden">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Home size={14} className="text-slate-400" />
            <span className="text-slate-400">Home</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Reports</span>
            <span className="text-slate-300">›</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Employee Monthly Report</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Monthly Report
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            View each employee&apos;s daily attendance status for the selected month.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">{exportButtons}</div>
      </div>

      {/* Header — tablet export */}
      <div className="hidden flex-wrap gap-2 sm:flex lg:hidden print:hidden">{exportButtons}</div>

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
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:block">
          <div className={clsx('grid gap-4', canViewAll ? 'grid-cols-4' : isViewOwnOnly ? 'grid-cols-3' : 'grid-cols-2')}>
            <FilterField label="Month" required>
              <div className="relative">
                <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
                <input type="month" value={draftMonth} onChange={(e) => setDraftMonth(e.target.value)} className={clsx(inputCls, 'pl-9')} />
              </div>
            </FilterField>
            {isViewOwnOnly && selfIdStr && (
              <OwnEmployeeField
                employeeId={selfIdStr}
                displayName={selfDisplayName}
                employeeCode={selfEmployeeCode}
              />
            )}
            {canViewAll && (
              <FilterField label="Employee">
                <div className="relative">
                  <UserRound size={15} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
                  <select value={draftEmp} onChange={(e) => setDraftEmp(e.target.value)} className={clsx(inputCls, 'appearance-none pl-9 pr-8')}>
                    <option value="">Select employee</option>
                    {filteredEmployees.map((e) => (
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
            {canViewAll && (
              <FilterField label="Department">
                <div className="relative">
                  <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
                  <select
                    value={draftDept}
                    onChange={(e) => {
                      setDraftDept(e.target.value)
                      setDraftEmp('')
                    }}
                    className={clsx(inputCls, 'appearance-none pl-9 pr-8')}
                  >
                    <option value="">All Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FilterField>
            )}
            <FilterField label="Status">
              <div className="relative">
                <Filter size={15} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
                <select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)} className={clsx(inputCls, 'appearance-none pl-9 pr-8')}>
                  {STATUS_FILTER_OPTIONS.map((o) => (
                    <option key={o.value || 'all'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </FilterField>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-60"
            >
              <Search size={14} />
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
            >
              <RotateCcw size={13} />
              Reset
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
