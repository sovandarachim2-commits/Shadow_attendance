import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar, Check, Clock, Download,
  LogIn, LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { EmptyState, FloatingSpinner } from '../components/shared/UI'
import AttendanceDetailModal from '../components/attendance/reports/AttendanceDetailModal'
import MyAttendanceReportsDesktop from '../components/attendance/reports/MyAttendanceReportsDesktop'
import {
  DashboardSummaryCard, StatusBadge, formatHoursCompact, formatLateShort,
  formatMobileDate, formatMonthLabel, formatWeekday, formatWorkHours,
} from '../components/attendance/reports/attendanceReportShared'
import { canAccess } from '../utils/format'

const TIMELINE_ICONS = {
  check_in: LogIn,
  check_out: LogOut,
  missing_out: LogOut,
  lunch_out: Clock,
  lunch_in: Clock,
}

export default function MyAttendanceReportsPage({ user, openPermissionRequest }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [branch, setBranch] = useState('')
  const [draft, setDraft] = useState({})
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState({ employee: null, summary: {}, records: [] })
  const [detail, setDetail] = useState(null)

  const canExport = canAccess(user, ['reports.attendance.export', 'reports.attendance.view_own', 'attendance.view_own'])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { month }
      if (status) params.status = status
      if (type) params.type = type
      const res = await api.get('/attendance/reports/employee', { params })
      setData(res.data)
    } catch {
      setData({ employee: null, summary: {}, records: [] })
    } finally {
      setLoading(false)
    }
  }, [month, status, type, branch])

  useEffect(() => { load() }, [load])

  const summary = data.summary || {}
  const records = useMemo(() => {
    const list = data.records || []
    if (!branch) return list
    return list.filter((r) => r.branch === branch)
  }, [data.records, branch])

  const exportCsv = async () => {
    setExporting(true)
    try {
      const params = { month }
      if (status) params.status = status
      if (type) params.type = type
      const res = await api.get('/attendance/reports/export', { params, responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `my-attendance-${month}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.alert('Export failed.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="space-y-4 lg:hidden">
        <MonthlySummaryCard
            month={month}
            onMonthChange={setMonth}
            summary={summary}
            loading={loading}
          />

          {loading ? (
            <div className="py-16"><FloatingSpinner /></div>
          ) : records.length === 0 ? (
            <EmptyState title="No attendance records" description="No data for this period." />
          ) : (
            <div className="space-y-3 pb-4">
              {records.map((row) => (
                <MobileDayCard key={row.id} row={row} onTap={() => setDetail(row)} />
              ))}
            </div>
          )}

        {canExport && (
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting}
            className="fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-lg"
            aria-label="Download report"
          >
            <Download size={22} />
          </button>
        )}
      </div>

      {/* ── Desktop layout ──────────────────────────────────────────── */}
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
        <AttendanceDetailModal record={detail} onClose={() => setDetail(null)} canEdit={false} />
      )}
    </>
  )
}

function MonthlySummaryCard({ month, onMonthChange, summary, loading }) {
  return (
    <DashboardSummaryCard
      title={formatMonthLabel(month)}
      subtitle="Monthly Summary"
      headerRight={<MonthSelectButton month={month} onMonthChange={onMonthChange} />}
      stats={[
        { label: 'Present', value: loading ? '—' : (summary.present ?? 0), tone: 'emerald' },
        { label: 'Late', value: loading ? '—' : (summary.late ?? 0), tone: 'amber' },
        { label: 'Absent', value: loading ? '—' : (summary.absent ?? 0), tone: 'rose' },
        { label: 'Hours', value: loading ? '—' : formatHoursCompact(summary.total_work_minutes), tone: 'sky' },
      ]}
      columns={4}
    />
  )
}

function MonthSelectButton({ month, onMonthChange }) {
  return (
    <label
      className="relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-2xl bg-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-emerald-200 active:scale-95"
      aria-label="Select month"
    >
      <Calendar size={20} className="text-white" strokeWidth={2.25} />
      <input
        type="month"
        className="absolute inset-0 cursor-pointer opacity-0"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      />
    </label>
  )
}

function MobileDayCard({ row, onTap }) {
  const timeline = row.timeline || []
  const displayStatus = row.display_status || row.status

  return (
    <article
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      onClick={onTap}
      onKeyDown={(e) => e.key === 'Enter' && onTap()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{formatMobileDate(row.attendance_date)}</p>
          <p className="text-sm text-slate-500">{formatWeekday(row.attendance_date)}</p>
        </div>
        <StatusBadge status={displayStatus} />
      </div>

      <div className="relative mx-4 mt-4 mb-3 border-l-2 border-slate-100 pl-5 dark:border-slate-700">
        {timeline.map((ev) => {
          const Icon = TIMELINE_ICONS[ev.key] || Check
          const isLate = ev.key === 'check_in' && row.late_minutes > 0
          const iconTone = ev.tone === 'red' ? 'bg-rose-100 text-rose-600' : ev.tone === 'orange' ? 'bg-amber-100 text-amber-600' : ev.key.includes('lunch') ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'

          return (
            <div key={ev.key} className="relative pb-4 last:pb-0">
              <span className={clsx('absolute -left-[1.6rem] grid h-7 w-7 place-items-center rounded-full', iconTone)}>
                <Icon size={14} />
              </span>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ev.label}</p>
                  <p className="text-sm tabular-nums text-slate-500">{ev.time}</p>
                </div>
                {isLate && (
                  <p className="text-xs font-bold text-rose-600">{formatLateShort(row.late_minutes)}</p>
                )}
                {ev.note && !isLate && (
                  <p className="text-xs font-bold text-amber-600">{ev.note}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <span className="text-sm text-slate-500">Working Hours</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{formatWorkHours(row.work_minutes)}</span>
      </div>
    </article>
  )
}

