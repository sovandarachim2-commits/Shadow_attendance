import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, Calendar, Check, ChevronDown, ChevronRight, Clock,
  ClipboardList, Download, Filter, MapPin, RotateCcw, Timer, UserMinus, Users,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { EmptyState, FloatingSpinner } from '../components/shared/UI'
import AttendanceDetailModal from '../components/attendance/reports/AttendanceDetailModal'
import MyAttendanceReportsDesktop from '../components/attendance/reports/MyAttendanceReportsDesktop'
import {
  StatusBadge, formatHoursCompact,
  formatBranchName,
  formatMobileDate, formatMonthLabel, formatPeriodLabel, formatWorkHours,
} from '../components/attendance/reports/attendanceReportShared'
import { apiError, canAccess } from '../utils/format'

export default function MyAttendanceReportsPage({ user, openPermissionRequest }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [branch, setBranch] = useState('')
  const [draft, setDraft] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState({ employee: null, summary: {}, records: [] })
  const [detail, setDetail] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [mobileFullOpen, setMobileFullOpen] = useState(false)
  const [mobileFullTab, setMobileFullTab] = useState('history')

  const canExport = canAccess(user, ['reports.attendance.export', 'reports.attendance.view_own', 'attendance.view_own'])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { month }
      if (status) params.status = status
      if (type) params.type = type
      const res = await api.get('/attendance/reports/employee', { params })
      setData(res.data)
    } catch (ex) {
      setError(apiError(ex))
      setData({ employee: null, summary: {}, records: [] })
    } finally {
      setLoading(false)
    }
  }, [month, status, type])

  useEffect(() => {
    // Reload report data whenever the selected report filters change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const summary = data.summary || {}
  const records = useMemo(() => {
    const list = data.records || []
    if (!branch) return list
    return list.filter((record) => formatBranchName(record.branch) === branch)
  }, [data.records, branch])
  const monthRange = useMemo(() => getMonthRange(month), [month])
  const mobileRecords = records.slice(0, 3)

  useEffect(() => {
    // Reset the full mobile view when report filters change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileFullOpen(false)
    setMobileFullTab('history')
  }, [month, status, type, branch])

  const applyMobileFilters = () => {
    setMonth(draft.month ?? month)
    setStatus(draft.status ?? '')
    setType(draft.type ?? '')
    setBranch(draft.branch ?? '')
    setDraft({})
    setMobileFiltersOpen(false)
  }

  const resetMobileFilters = () => {
    setDraft({})
    setMonth(new Date().toISOString().slice(0, 7))
    setStatus('')
    setType('')
    setBranch('')
    setMobileFiltersOpen(false)
  }

  const exportCsv = async () => {
    setExporting(true)
    try {
      const params = { month }
      if (status) params.status = status
      if (type) params.type = type
      const res = await api.get('/attendance/reports/export', { params, responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `my-attendance-${month}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      window.alert('Export failed.')
    } finally {
      setExporting(false)
    }
  }

  if (!loading && error) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <EmptyState title="Cannot load attendance reports" description={error} />
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-md space-y-5 pb-24 lg:hidden">
        {detail ? (
          <MobileAttendanceDetail
            record={detail}
            onBack={() => setDetail(null)}
          />
        ) : mobileFullOpen ? (
          <MobileFullAttendanceView
            activeTab={mobileFullTab}
            setActiveTab={setMobileFullTab}
            records={records}
            month={month}
            summary={summary}
            onBack={() => setMobileFullOpen(false)}
            onMonthChange={setMonth}
            onSelectDate={(row) => row && setDetail(row)}
          />
        ) : (
          <>
            <MobilePeriodPicker month={month} monthRange={monthRange} onMonthChange={setMonth} />

            <MobileReportActions
              canExport={canExport}
              exporting={exporting}
              onExport={exportCsv}
              onCorrection={() => openPermissionRequest?.('Attendance Edit')}
            />

            <section>
              <h3 className="mb-3 text-xl font-bold text-slate-950 dark:text-white">Overview</h3>
              <MobileStatsGrid summary={summary} loading={loading} />
            </section>

            <MobileFilters
              open={mobileFiltersOpen}
              setOpen={setMobileFiltersOpen}
              month={month}
              draft={draft}
              setDraft={setDraft}
              allRecords={data.records || []}
              onApply={applyMobileFilters}
              onReset={resetMobileFilters}
            />

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">Attendance History</h3>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400"
                  onClick={() => setMobileFullOpen(true)}
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>

              {loading ? (
                <div className="py-16"><FloatingSpinner /></div>
              ) : records.length === 0 ? (
                <EmptyState title="No attendance records" description="No data for this period." />
              ) : (
                <div className="space-y-3">
                  {mobileRecords.map((row) => (
                    <MobileDayCard key={row.id} row={row} onTap={() => setDetail(row)} />
                  ))}
                </div>
              )}
            </section>

            <MobileCalendar
              month={month}
              records={records}
              selectedDate=""
              onMonthChange={setMonth}
              onSelectDate={(row) => row && setDetail(row)}
            />
          </>
        )}
      </div>

      <div className="hidden lg:block">
        <MyAttendanceReportsDesktop
          summary={summary}
          records={records}
          allRecords={data.records || []}
          loading={loading}
          month={month}
          draft={draft}
          setDraft={setDraft}
          onMonthChange={setMonth}
          onApply={() => {
            setMonth(draft.month ?? month)
            setStatus(draft.status ?? '')
            setType(draft.type ?? '')
            setBranch(draft.branch ?? '')
            setDraft({})
          }}
          onReset={() => {
            setDraft({})
            setMonth(new Date().toISOString().slice(0, 7))
            setStatus('')
            setType('')
            setBranch('')
          }}
          onView={setDetail}
          canExport={canExport}
          exporting={exporting}
          exportCsv={exportCsv}
          openPermissionRequest={openPermissionRequest}
        />
      </div>

      {detail && (
        <div className="hidden lg:block">
        <AttendanceDetailModal record={detail} onClose={() => setDetail(null)} canEdit={false} />
        </div>
      )}
    </>
  )
}

function MobilePeriodPicker({ month, monthRange, onMonthChange }) {
  return (
    <label className="flex h-14 cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <span>{formatPeriodLabel(monthRange.from, monthRange.to)}</span>
      <span className="grid h-9 w-9 place-items-center rounded-xl text-slate-700 dark:text-slate-200">
        <Calendar size={20} />
      </span>
      <input type="month" className="sr-only" value={month} onChange={(event) => onMonthChange(event.target.value)} />
    </label>
  )
}

function MobileReportActions({ canExport, exporting, onExport, onCorrection }) {
  return (
    <section className="grid grid-cols-2 gap-3">
      {canExport && (
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition active:scale-[0.99] disabled:opacity-60"
        >
          <Download size={17} />
          {exporting ? 'Downloading...' : 'Download Report'}
        </button>
      )}
      <button
        type="button"
        onClick={onCorrection}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-900 shadow-sm transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      >
        <ClipboardList size={17} />
        Request Correction
      </button>
    </section>
  )
}

function MobileStatsGrid({ summary, loading }) {
  const stats = [
    { label: 'Present Days', value: loading ? '-' : (summary.present ?? 0), help: 'from this month', icon: Users, tone: 'emerald' },
    { label: 'Late Days', value: loading ? '-' : (summary.late ?? 0), help: 'from this month', icon: Clock, tone: 'amber', down: true },
    { label: 'Absent Days', value: loading ? '-' : (summary.absent ?? 0), help: 'from this month', icon: UserMinus, tone: 'rose', down: true },
    { label: 'Total Working Hours', value: loading ? '-' : formatHoursCompact(summary.total_work_minutes), help: 'from this month', icon: Timer, tone: 'sky' },
    { label: 'Overtime Hours', value: loading ? '-' : formatHoursCompact(summary.overtime_minutes), help: 'from this month', icon: Clock, tone: 'violet' },
  ]

  return (
    <section className="grid grid-cols-2 gap-3">
      {stats.map((item) => <MobileStatTile key={item.label} {...item} />)}
    </section>
  )
}

function MobileStatTile({ label, value, help, icon: Icon, tone, down }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300',
    sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
  }

  return (
    <article className="min-h-[112px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className={clsx('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', tones[tone])}>
          <Icon size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p>
        </div>
      </div>
      <p className={clsx('mt-3 text-xs font-bold', down ? 'text-rose-500' : 'text-emerald-600')}>{down ? 'Down' : 'Up'} {help}</p>
    </article>
  )
}

function MobileFilters({ open, setOpen, month, draft, setDraft, allRecords, onApply, onReset }) {
  const locations = useMemo(() => [...new Set(allRecords.map((record) => formatBranchName(record.branch)).filter(Boolean))], [allRecords])

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
          <Filter size={19} />
          Filters
        </span>
        <ChevronDown size={18} className={clsx('transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4 dark:border-slate-800">
          <MobileFilterField label="Month">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950"
              type="month"
              value={draft.month ?? month}
              onChange={(event) => setDraft((current) => ({ ...current, month: event.target.value }))}
            />
          </MobileFilterField>
          <MobileFilterField label="Status">
            <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950" value={draft.status ?? ''} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="on_leave">Leave</option>
            </select>
          </MobileFilterField>
          <MobileFilterField label="Type">
            <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950" value={draft.type ?? ''} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}>
              <option value="">All Types</option>
              <option value="office">Office</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </MobileFilterField>
          <MobileFilterField label="Location">
            <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950" value={draft.branch ?? ''} onChange={(event) => setDraft((current) => ({ ...current, branch: event.target.value }))}>
              <option value="">All Locations</option>
              {locations.map((location) => <option key={location} value={location}>{location}</option>)}
            </select>
          </MobileFilterField>
          <button type="button" onClick={onApply} className="h-12 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20">Apply Filter</button>
          <button type="button" onClick={onReset} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-extrabold dark:border-slate-700">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      )}
    </section>
  )
}

function MobileFilterField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function MobileDayCard({ row, onTap }) {
  const displayStatus = row.display_status || row.status
  const statusTone = displayStatus === 'late' ? 'orange' : displayStatus === 'absent' ? 'red' : 'green'

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      onClick={onTap}
      onKeyDown={(event) => event.key === 'Enter' && onTap()}
      role="button"
      tabIndex={0}
    >
      <span className={clsx('absolute inset-y-0 left-0 w-1.5', {
        'bg-emerald-500': statusTone === 'green',
        'bg-amber-500': statusTone === 'orange',
        'bg-rose-500': statusTone === 'red',
      })} />
      <div className="flex items-center gap-4 px-4 py-3 pl-5">
        <div className={clsx('grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-center', {
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40': statusTone === 'green',
          'bg-amber-50 text-amber-700 dark:bg-amber-950/40': statusTone === 'orange',
          'bg-rose-50 text-rose-700 dark:bg-rose-950/40': statusTone === 'red',
        })}>
          <div>
            <p className="text-sm font-bold">{monthShort(row.attendance_date)}</p>
            <p className="text-3xl font-extrabold leading-none">{dayNumber(row.attendance_date)}</p>
            <p className="mt-1 text-xs font-bold">{formatDayShort(row.attendance_date)}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-base font-extrabold text-slate-950 dark:text-white">{timeRange(row)}</p>
            <StatusBadge status={displayStatus} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500">Working Hours</p>
              <p className="mt-0.5 font-extrabold text-slate-900 dark:text-white">{formatWorkHours(row.work_minutes)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Late</p>
              <p className={clsx('mt-0.5 font-extrabold', row.late_minutes > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white')}>
                {row.late_minutes > 0 ? `${row.late_minutes}m` : '0m'}
              </p>
            </div>
          </div>
        </div>
        <ChevronRight size={22} className="shrink-0 text-slate-800 dark:text-slate-200" />
      </div>
    </article>
  )
}

function MobileCalendar({ month, records, selectedDate, onMonthChange, onSelectDate }) {
  const recordByDate = useMemo(() => {
    const map = {}
    records.forEach((record) => { map[record.attendance_date] = record })
    return map
  }, [records])
  const cells = useMemo(() => buildCalendarCells(month), [month])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-emerald-500" />
          <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <p className="mr-2 text-sm font-bold text-slate-800 dark:text-slate-100">{formatMonthLabel(month)}</p>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-700" onClick={() => shiftMonth(month, -1, onMonthChange)} aria-label="Previous month">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-700" onClick={() => shiftMonth(month, 1, onMonthChange)} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {cells.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} className="h-9" />
          const record = recordByDate[date]
          const active = selectedDate === date
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(record)}
              className={clsx(
                'relative grid h-9 place-items-center rounded-full text-sm font-bold',
                active ? 'bg-emerald-600 text-white' : record ? 'text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800' : 'text-slate-400',
              )}
            >
              {dayNumber(date)}
              {record && <span className={clsx('absolute bottom-1 h-1 w-1 rounded-full', statusDotClass(record), active && 'bg-white')} />}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function MobileFullAttendanceView({
  activeTab, setActiveTab, records, month, summary, onBack, onMonthChange, onSelectDate,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft size={21} />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold text-slate-950 dark:text-white">My Attendance History</h2>
          <p className="text-sm font-semibold text-slate-500">{formatMonthLabel(month)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {['history', 'calendar', 'timeline'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'h-12 rounded-xl text-sm font-extrabold capitalize transition',
              activeTab === tab ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-700 dark:text-slate-200',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'history' && (
        records.length === 0 ? (
          <EmptyState title="No attendance records" description="No data for this period." />
        ) : (
          <section className="space-y-3">
            {records.map((row) => (
              <MobileDayCard key={row.id} row={row} onTap={() => onSelectDate(row)} />
            ))}
          </section>
        )
      )}

      {activeTab === 'calendar' && (
        <>
          <MobileCalendar
            month={month}
            records={records}
            selectedDate=""
            onMonthChange={onMonthChange}
            onSelectDate={onSelectDate}
          />
          <MobileAttendanceSummary summary={summary} />
        </>
      )}

      {activeTab === 'timeline' && (
        records.length === 0 ? (
          <EmptyState title="No attendance records" description="No data for this period." />
        ) : (
          <section className="space-y-3">
            {records.map((record) => (
              <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-extrabold text-slate-950 dark:text-white">{formatMobileDate(record.attendance_date)}</p>
                    <p className="text-sm font-semibold text-slate-500">{formatDayShort(record.attendance_date)}</p>
                  </div>
                  <StatusBadge status={record.display_status || record.status} />
                </div>
                <TimelineList record={record} timeline={record.timeline || []} compact />
              </article>
            ))}
          </section>
        )
      )}
    </div>
  )
}

function MobileAttendanceDetail({ record, onBack }) {
  return (
    <div className="space-y-3">
      <MobileDetailCard record={record} />
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back
      </button>
    </div>
  )
}

function MobileDetailCard({ record }) {
  const timeline = record.timeline || []
  const displayStatus = record.display_status || record.status

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={clsx('flex items-center justify-between px-5 py-4', displayStatus === 'late' ? 'bg-amber-50 dark:bg-amber-950/30' : displayStatus === 'absent' ? 'bg-rose-50 dark:bg-rose-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30')}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
          <Check size={24} />
        </span>
        <StatusBadge status={displayStatus} />
      </div>
      <div className="p-5">
        <TimelineList record={record} timeline={timeline} compact />
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-slate-100 pt-5 dark:border-slate-800">
          <DetailMetric label="Working Hours" value={formatWorkHours(record.work_minutes)} />
          <DetailMetric label="Overtime Hours" value={formatWorkHours(Math.max(0, record.overtime_minutes ?? ((record.work_minutes || 0) - 480)))} />
          <DetailMetric label="Late Minutes" value={`${record.late_minutes ?? 0}m`} />
          <DetailMetric label="Attendance Type" value={record.type === 'outdoor' ? 'Outdoor' : 'Office'} />
        </div>
      </div>
    </section>
  )
}

function TimelineList({ record, timeline, compact = false }) {
  const branchName = formatBranchName(record.branch)

  return (
    <div className="relative border-l-2 border-slate-100 pl-6 dark:border-slate-800">
      {timeline.map((event) => (
        <div key={event.key} className={clsx('relative', compact ? 'pb-5 last:pb-0' : 'pb-7 last:pb-0')}>
          <span className={clsx(
            'absolute -left-[2.05rem] top-0 grid h-8 w-8 place-items-center rounded-full border-4 border-white text-white shadow-sm dark:border-slate-900',
            event.tone === 'orange' ? 'bg-amber-500' : event.tone === 'blue' ? 'bg-blue-500' : event.tone === 'red' ? 'bg-rose-500' : 'bg-emerald-600',
          )}>
            <Clock size={14} />
          </span>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-extrabold text-slate-950 dark:text-white">{event.label}</p>
              {event.note && <p className="mt-0.5 text-sm font-medium text-slate-500">{event.note}</p>}
              {(event.key === 'check_in' || event.key === 'check_out') && (branchName || record.location) && (
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <MapPin size={12} />
                  {branchName || record.location}
                </p>
              )}
            </div>
            <p className="shrink-0 font-extrabold tabular-nums text-slate-950 dark:text-white">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DetailMetric({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-slate-950 dark:text-white">{value}</p>
    </div>
  )
}

function MobileAttendanceSummary({ summary }) {
  const rows = [
    { label: 'Total Present Days', value: summary.present ?? 0, icon: Users, tone: 'emerald' },
    { label: 'Total Late Days', value: summary.late ?? 0, icon: Clock, tone: 'amber' },
    { label: 'Total Absent Days', value: summary.absent ?? 0, icon: UserMinus, tone: 'rose' },
    { label: 'Total Leave Days', value: summary.leave ?? summary.on_leave ?? 0, icon: Calendar, tone: 'sky' },
    { label: 'Total Working Hours', value: formatHoursCompact(summary.total_work_minutes), icon: Timer, tone: 'sky' },
    { label: 'Overtime Hours', value: formatHoursCompact(summary.overtime_minutes), icon: Clock, tone: 'violet' },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="border-b border-slate-100 px-5 py-4 text-xl font-extrabold text-slate-950 dark:border-slate-800 dark:text-white">Attendance Summary</h3>
      <div className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
        {rows.map((row) => <SummaryRow key={row.label} {...row} />)}
      </div>
    </section>
  )
}

function SummaryRow({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <SummaryIcon Icon={Icon} tone={tone} />
        <span className="font-bold text-slate-800 dark:text-slate-100">{label}</span>
      </div>
      <span className="text-lg font-extrabold text-slate-950 dark:text-white">{value}</span>
    </div>
  )
}

function SummaryIcon({ Icon, tone }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    sky: 'bg-sky-100 text-sky-600',
    violet: 'bg-violet-100 text-violet-600',
  }

  return (
    <span className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', tones[tone] || tones.emerald)}>
      <Icon size={20} />
    </span>
  )
}

function getMonthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  return {
    from: `${monthStr}-01`,
    to: `${monthStr}-${String(lastDay).padStart(2, '0')}`,
  }
}

function buildCalendarCells(monthStr) {
  const [year, month] = monthStr.split('-').map(Number)
  const firstDow = new Date(year, month - 1, 1).getDay()
  const days = new Date(year, month, 0).getDate()
  const cells = Array(firstDow).fill(null)
  for (let day = 1; day <= days; day += 1) {
    cells.push(`${monthStr}-${String(day).padStart(2, '0')}`)
  }
  return cells
}

function dayNumber(dateStr) {
  if (!dateStr) return ''
  return Number(dateStr.split('-')[2])
}

function monthShort(dateStr) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short' })
}

function formatDayShort(dateStr) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

function timeRange(row) {
  const checkIn = shortTime(row.check_in_at)
  const checkOut = shortTime(row.check_out_at)
  if (!checkIn && !checkOut) return '-'
  return `${checkIn || '-'} - ${checkOut || '-'}`
}

function shortTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function statusDotClass(row) {
  const status = row.display_status || row.status
  if (status === 'late') return 'bg-amber-500'
  if (status === 'absent') return 'bg-rose-500'
  if (status === 'on_leave' || status === 'half_day' || status === 'leave') return 'bg-sky-500'
  return 'bg-emerald-500'
}

function shiftMonth(monthStr, delta, onChange) {
  const [year, month] = monthStr.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  onChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
}
