import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, Calendar, ChevronLeft, ChevronRight, Clock, Download, Eye,
  MapPin, MoreVertical, RefreshCw, Timer, TrendingDown, TrendingUp, UserMinus, Users,
} from 'lucide-react'
import clsx from 'clsx'
import { EmptyState, FloatingSpinner } from '../../shared/UI'
import {
  StatusBadge, TIMELINE_TONE, TypeBadge, formatMobileDate, formatMonthLabel,
  formatBranchName, formatPeriodLabel, formatWorkHours, inputCls,
} from './attendanceReportShared'
import { formatTime } from '../../../utils/format'

const PAGE_SIZE = 7
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MyAttendanceReportsDesktop({
  summary, records, allRecords = records, loading, month, draft, setDraft,
  onApply, onReset, onMonthChange, onView, canExport, exporting, exportCsv,
  openPermissionRequest,
}) {
  const [page, setPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)

  const monthRange = useMemo(() => getMonthRange(month), [month])
  const daysInMonth = useMemo(() => {
    const [y, m] = month.split('-').map(Number)
    return new Date(y, m, 0).getDate()
  }, [month])

  const recordByDate = useMemo(() => {
    const map = {}
    records.forEach((r) => { if (r.attendance_date) map[r.attendance_date] = r })
    return map
  }, [records])

  useEffect(() => {
    // Reset pagination and selected timeline when the report rows change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
    const first = records[0]?.attendance_date
    setSelectedDate((prev) => (prev && recordByDate[prev] ? prev : first))
  }, [records, month]) // eslint-disable-line react-hooks/exhaustive-deps

  const selected = selectedDate ? recordByDate[selectedDate] : null
  const selectedBranchName = formatBranchName(selected?.branch)
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const paged = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const pct = (n) => `${(((n ?? 0) / Math.max(daysInMonth, 1)) * 100).toFixed(2)}%`

  const statCards = [
    { label: 'Present Days', value: summary.present ?? 0, pct: pct(summary.present), trend: 'In selected period', trendUp: true, icon: Users, tone: 'emerald' },
    { label: 'Late Check In', value: summary.late ?? 0, pct: pct(summary.late), trend: 'In selected period', trendUp: false, icon: Clock, tone: 'orange' },
    { label: 'Absent Days', value: summary.absent ?? 0, pct: pct(summary.absent), trend: 'In selected period', trendUp: false, icon: UserMinus, tone: 'rose' },
    { label: 'Early Check Out', value: summary.early_checkout ?? 0, pct: pct(summary.early_checkout), trend: 'In selected period', trendUp: false, icon: AlertCircle, tone: 'yellow' },
    { label: 'Day Off', value: summary.day_off ?? 0, pct: pct(summary.day_off), trend: 'In selected period', trendUp: true, icon: Calendar, tone: 'sky' },
    { label: 'Missing Check In', value: summary.missing_checkin ?? summary.missing_attendance ?? 0, pct: pct(summary.missing_checkin ?? summary.missing_attendance), trend: 'In selected period', trendUp: false, icon: AlertCircle, tone: 'violet' },
    { label: 'Missing Check Out', value: summary.missing_checkout ?? 0, pct: pct(summary.missing_checkout), trend: 'In selected period', trendUp: false, icon: AlertCircle, tone: 'fuchsia' },
    { label: 'Personal Request', value: summary.personal_request ?? summary.on_leave ?? 0, pct: pct(summary.personal_request ?? summary.on_leave), trend: 'In selected period', trendUp: true, icon: AlertCircle, tone: 'blue' },
    { label: 'Total Working Hours', value: formatWorkHours(summary.total_work_minutes), pct: null, trend: `${summary.total_records ?? 0} days logged`, trendUp: true, icon: Timer, tone: 'sky' },
    { label: 'Overtime Hours', value: formatWorkHours(summary.overtime_minutes), pct: null, trend: 'In selected period', trendUp: true, icon: AlertCircle, tone: 'violet' },
  ]

  const calendarCells = useMemo(() => buildCalendarCells(month), [month])

  return (
    <div className="space-y-6 pb-8">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Calendar size={16} className="text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{formatPeriodLabel(monthRange.from, monthRange.to)}</span>
            <input
              type="month"
              className="sr-only"
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              aria-label="Select month"
            />
          </label>
          {canExport && (
            <button type="button" onClick={exportCsv} disabled={exporting} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700">
              <Download size={16} />
              {exporting ? 'Exporting…' : 'Download Report'}
            </button>
          )}
          <button type="button" onClick={() => openPermissionRequest?.('Missing Check In')} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            <RefreshCw size={16} />
            Request Correction
          </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((c) => <ReportStatCard key={c.label} {...c} />)}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-6">
          <FilterSelect label="Month">
            <input type="month" className={inputCls} value={draft.month ?? month} onChange={(e) => setDraft((d) => ({ ...d, month: e.target.value }))} />
          </FilterSelect>
          <FilterSelect label="Status">
            <select className={inputCls} value={draft.status ?? ''} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late Check In</option>
              <option value="early_checkout">Early Check Out</option>
              <option value="day_off">Day Off</option>
              <option value="missing_checkin">Missing Check In</option>
              <option value="missing_checkout">Missing Check Out</option>
              <option value="personal_request">Personal Request</option>
              <option value="absent">Absent</option>
            </select>
          </FilterSelect>
          <FilterSelect label="Attendance Type">
            <select className={inputCls} value={draft.type ?? ''} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}>
              <option value="">All Types</option>
              <option value="office">Office</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </FilterSelect>
          <FilterSelect label="Work Location">
            <select className={inputCls} value={draft.branch ?? ''} onChange={(e) => setDraft((d) => ({ ...d, branch: e.target.value }))}>
              <option value="">All Locations</option>
              {[...new Set(allRecords.map((r) => formatBranchName(r.branch)).filter(Boolean))].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </FilterSelect>
          <div className="flex items-end gap-2 lg:col-span-2">
            <button type="button" onClick={onApply} className="h-11 flex-1 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700">Apply Filter</button>
            <button type="button" onClick={onReset} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700">Reset</button>
          </div>
        </div>
      </div>

      {/* Main + sidebar */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Attendance History</h3>
            </div>
            {loading ? <FloatingSpinner /> : records.length === 0 ? (
              <EmptyState title="No attendance records" description="No data for this period." />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950/50">
                        {['Date', 'Day', 'Check In', 'Break Out', 'Break In', 'Check Out', 'Working Hours', 'Status', 'Late Check In', 'Action'].map((h) => (
                          <th key={h} className="whitespace-nowrap px-4 py-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {paged.map((row) => (
                        <tr
                          key={row.id}
                          className={clsx(
                            'hover:bg-slate-50/60 dark:hover:bg-slate-800/30',
                            selectedDate === row.attendance_date && 'bg-emerald-50/50 dark:bg-emerald-950/20',
                          )}
                          onClick={() => setSelectedDate(row.attendance_date)}
                        >
                          <td className="px-4 py-3.5 font-medium">{formatMobileDate(row.attendance_date)}</td>
                          <td className="px-4 py-3.5 text-slate-500">{formatDayShort(row.attendance_date)}</td>
                          <td className="px-4 py-3.5 tabular-nums">{formatTime(row.check_in_at)}</td>
                          <td className="px-4 py-3.5 text-slate-400">—</td>
                          <td className="px-4 py-3.5 text-slate-400">—</td>
                          <td className="px-4 py-3.5 tabular-nums">{formatTime(row.check_out_at)}</td>
                          <td className="px-4 py-3.5 font-semibold">{formatWorkHours(row.work_minutes)}</td>
                          <td className="px-4 py-3.5"><StatusBadge status={row.display_status || row.status} /></td>
                          <td className={clsx('px-4 py-3.5 font-semibold tabular-nums', row.late_minutes > 0 ? 'text-rose-600' : 'text-slate-500')}>
                            {row.late_minutes > 0 ? `${row.late_minutes}m` : '0m'}
                          </td>
                          <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => onView(row)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50">
                                <Eye size={14} /> View
                              </button>
                              <button type="button" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="More options">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePagination page={page} totalPages={totalPages} total={records.length} onPage={setPage} />
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="Previous month" onClick={() => shiftMonth(month, -1, onMonthChange)}>
                <ChevronLeft size={18} />
              </button>
              <p className="text-sm font-bold">{formatMonthLabel(month)}</p>
              <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="Next month" onClick={() => shiftMonth(month, 1, onMonthChange)}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-slate-400">
              {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((date, i) => {
                if (!date) return <span key={`pad-${i}`} />
                const rec = recordByDate[date]
                const dayNum = Number(date.split('-')[2])
                const isSelected = selectedDate === date
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={clsx(
                      'relative flex flex-col items-center rounded-lg py-1.5 text-xs font-semibold transition',
                      isSelected ? 'bg-emerald-600 text-white' : rec ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-300',
                    )}
                  >
                    {dayNum}
                    {rec && (
                      <span className={clsx('mt-0.5 h-1 w-1 rounded-full', statusDotClass(rec), isSelected && 'bg-white')} />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
              <LegendDot color="bg-emerald-500" label="Present" />
              <LegendDot color="bg-orange-500" label="Late Check In" />
              <LegendDot color="bg-yellow-500" label="Early Check Out" />
              <LegendDot color="bg-rose-500" label="Absent" />
              <LegendDot color="bg-sky-500" label="Day Off" />
              <LegendDot color="bg-violet-500" label="Missing Check In" />
              <LegendDot color="bg-fuchsia-500" label="Missing Check Out" />
              <LegendDot color="bg-blue-500" label="Personal Request" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendance Timeline</p>
                <p className="mt-1 font-bold text-slate-900 dark:text-white">
                  {selected ? formatMobileDate(selected.attendance_date) : 'Select a day'}
                </p>
              </div>
              {selected && <StatusBadge status={selected.display_status || selected.status} />}
            </div>

            {selected ? (
              <>
                <div className="relative border-l-2 border-slate-100 pl-4 dark:border-slate-700">
                  {(selected.timeline || []).map((ev) => (
                    <div key={ev.key} className="relative pb-4 last:pb-0">
                      <span className="absolute -left-[1.2rem] top-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      <div className={clsx('rounded-lg border-l-4 p-2.5', TIMELINE_TONE[ev.tone] || TIMELINE_TONE.green)}>
                        <p className="text-sm font-bold">{ev.label}</p>
                        <p className="text-sm tabular-nums text-slate-600">{ev.time}</p>
                        {(selectedBranchName || selected.location) && ev.key === 'check_in' && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} /> {selectedBranchName || selected.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <DetailCell label="Working Hours" value={formatWorkHours(selected.work_minutes)} />
                  <DetailCell label="Overtime Hours" value={formatWorkHours(Math.max(0, (selected.work_minutes || 0) - 8 * 60))} />
                  <DetailCell label="Late Check In Minutes" value={`${selected.late_minutes ?? 0} min`} />
                  <DetailCell label="Attendance Type" value={<TypeBadge type={selected.type} />} />
                </dl>
              </>
            ) : (
              <p className="text-sm text-slate-500">Select a date on the calendar to view timeline.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function ReportStatCard({ label, value, pct, trend, trendUp, icon: Icon, tone }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    rose: 'bg-rose-100 text-rose-600',
    sky: 'bg-sky-100 text-sky-600',
    violet: 'bg-violet-100 text-violet-600',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-600',
    blue: 'bg-blue-100 text-blue-600',
  }
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={clsx('grid h-10 w-10 place-items-center rounded-xl', tones[tone])}>
        <Icon size={20} />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
        {pct != null && <span className="ml-1 text-sm font-semibold text-slate-400">{pct}</span>}
      </p>
      {trend && (
        <p className={clsx('mt-1 flex items-center gap-1 text-xs font-semibold', trendUp ? 'text-emerald-600' : 'text-rose-500')}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </p>
      )}
    </div>
  )
}

function FilterSelect({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function DetailCell({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-bold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1">
      <span className={clsx('h-1.5 w-1.5 rounded-full', color)} />
      {label}
    </span>
  )
}

function TablePagination({ page, totalPages, total, onPage }) {
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)
  const pages = useMemo(() => {
    const items = []
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, start + 4)
    start = Math.max(1, end - 4)
    for (let i = start; i <= end; i += 1) items.push(i)
    return items
  }, [page, totalPages])

  return (
    <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">Showing {from} to {to} of {total} entries</p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="grid h-8 w-8 place-items-center rounded-lg border disabled:opacity-40">
          <ChevronLeft size={16} />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            className={clsx(
              'grid h-8 min-w-[2rem] place-items-center rounded-lg px-2 text-sm font-semibold',
              n === page ? 'bg-emerald-600 text-white' : 'border hover:bg-slate-50',
            )}
          >
            {n}
          </button>
        ))}
        <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="grid h-8 w-8 place-items-center rounded-lg border disabled:opacity-40">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

function getMonthRange(monthStr) {
  const [y, m] = monthStr.split('-').map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  return {
    from: `${monthStr}-01`,
    to: `${monthStr}-${String(lastDay).padStart(2, '0')}`,
  }
}

function buildCalendarCells(monthStr) {
  const [y, m] = monthStr.split('-').map(Number)
  const firstDow = new Date(y, m - 1, 1).getDay()
  const days = new Date(y, m, 0).getDate()
  const cells = Array(firstDow).fill(null)
  for (let d = 1; d <= days; d += 1) {
    cells.push(`${monthStr}-${String(d).padStart(2, '0')}`)
  }
  return cells
}

function formatDayShort(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

function statusDotClass(row) {
  const s = row.display_status || row.status
  if (s === 'late') return 'bg-orange-500'
  if (s === 'early_checkout') return 'bg-yellow-500'
  if (s === 'absent') return 'bg-rose-500'
  if (s === 'day_off') return 'bg-sky-500'
  if (s === 'missing_checkin' || s === 'missing_attendance') return 'bg-violet-500'
  if (s === 'missing_checkout') return 'bg-fuchsia-500'
  if (s === 'personal_request' || s === 'on_leave' || s === 'half_day' || s === 'leave') return 'bg-blue-500'
  return 'bg-emerald-500'
}

function shiftMonth(monthStr, delta, onChange) {
  const [y, m] = monthStr.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  onChange(next)
}
