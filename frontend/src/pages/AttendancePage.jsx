import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle, BriefcaseBusiness, CalendarCheck, CheckCircle2, ChevronRight, Clock,
  LocateFixed, MapPinned, X,
} from 'lucide-react'
import clsx from 'clsx'
import AttendanceCircleButton from '../components/attendance/AttendanceCircleButton'
import { api } from '../services/api'
import { DataPanel, EmptyState, PanelHeader, StatusPill, SubmitButton } from '../components/shared/UI'
import { apiError, attendanceLocationMapUrl, canAccess, employeeFullName, formatAttendanceLocation, formatDate, formatDuration, formatTime, titleCase } from '../utils/format'
import { geolocationErrorMessage, isGeolocationSupported, isSecureGeolocationContext, requestCurrentPosition } from '../utils/geolocation'

export default function AttendancePage({ appData, onAttendanceAction, openPermissionRequest, setActive, user }) {
  const locationAlertShownRef = useRef(false)
  const [now, setNow] = useState(new Date())
  const [gpsReady, setGpsReady] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [actionNotice, setActionNotice] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const showNotice = (msg) => {
    setActionNotice(msg)
    window.setTimeout(() => setActionNotice(''), 4000)
  }

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const refreshGps = useCallback(() => {
    if (!isGeolocationSupported()) {
      const message = geolocationErrorMessage({ code: 'UNSUPPORTED' })
      setGpsReady(false)
      setGpsError(message)
      return
    }
    if (!isSecureGeolocationContext()) {
      const message = geolocationErrorMessage({})
      setGpsReady(false)
      setGpsError(message)
      return
    }
    setGpsError('')
    requestCurrentPosition()
      .then(() => { setGpsReady(true); setGpsError('') })
      .catch((err) => {
        const message = geolocationErrorMessage(err)
        setGpsReady(false)
        setGpsError(message)
      })
  }, [])

  useEffect(() => {
    refreshGps()
  }, [refreshGps])

  const today = appData.todayAttendance
  const scheduleToday = today?.schedule_today
  const isScheduledDayOff = scheduleToday && !scheduleToday.is_working_day
  const canCheckInToday = scheduleToday?.can_check_in !== false
  const checkedIn = Boolean(today?.check_in_at)
  const completed = Boolean(today?.check_out_at)

  const fmtTime = (dt) => new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const dayInTime = today?.check_in_at ? fmtTime(today.check_in_at) : '--:--'
  const dayOutTime = today?.check_out_at ? fmtTime(today.check_out_at) : '--:--'

  const canCheckIn = canAccess(user, ['attendance.check_in'])
  const canCheckOut = canAccess(user, ['attendance.check_out'])
  const canSubmitRequest = canAccess(user, ['requests.create'])

  const handleBigBtn = () => {
    if (completed) return
    if (!checkedIn) {
      if (!canCheckInToday) {
        showNotice(
          scheduleToday?.day_label
            ? `Today (${scheduleToday.day_label}) is your scheduled day off. Contact HR if you are working today.`
            : 'Check-in is not available today on your work schedule.',
        )
        return
      }
      if (canCheckIn) onAttendanceAction('check-in')
      else showNotice("You don't have permission to check in.")
    } else {
      if (canCheckOut) onAttendanceAction('check-out')
      else showNotice("You don't have permission to check out.")
    }
  }

  const lateDuration = today?.late_minutes != null ? formatDuration(today.late_minutes * 60) : '-'
  const workDuration = today?.work_minutes != null ? formatDuration(today.work_minutes * 60) : '-'

  const attendanceRows = appData.attendance.filter(
    (item) => !user?.employee?.id || item.employee_id === user.employee.id,
  )

  const todayStatus = today ? titleCase(today.status) : 'No Check In'
  const statusColor = today?.status === 'present'
    ? 'text-emerald-600' : today?.status === 'late'
    ? 'text-amber-500' : today?.status === 'absent'
    ? 'text-rose-500' : 'text-slate-500'

  /* â”€â”€â”€ Mobile layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <>
      <div className="space-y-4 pb-4 sm:hidden">

        {/* Status + clock card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">{timeStr}</p>
              <p className="mt-1 text-sm text-slate-400">{dateStr}</p>
            </div>
            <StatusPill status={todayStatus} />
          </div>

          {/* GPS status (informational — check-out still opens the location step) */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 px-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <MapPinned size={12} className={gpsReady ? 'text-emerald-500' : gpsError ? 'text-amber-500' : 'text-slate-300'} />
              <span>
                {gpsReady
                  ? 'Location ready'
                  : gpsError
                    ? 'Location unavailable'
                    : checkedIn
                      ? 'Tap Check Out — location is confirmed in the next step'
                      : 'Detecting location…'}
              </span>
            </span>
            {gpsError && (
              <button type="button" onClick={refreshGps} className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                Retry
              </button>
            )}
          </div>

          {/* Day In / Day Out */}
          <div className="mt-4 grid grid-cols-2 gap-3 px-4 pb-4">
            <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-400">
                <CheckCircle2 size={11} className="text-emerald-500" /> Day In
              </div>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">{dayInTime}</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3 dark:bg-rose-950/30">
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Clock size={11} className="text-rose-400" /> Day Out
              </div>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">{dayOutTime}</p>
            </div>
          </div>

          {isScheduledDayOff && !checkedIn && (
            <div className="mx-4 mb-1 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-100">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold">Scheduled day off</span>
                {scheduleToday?.schedule_name ? ` (${scheduleToday.schedule_name})` : ''}.
                Check-in is disabled. Staff who work today need a schedule with this day turned on.
              </span>
            </div>
          )}

          {/* Check in / check out â€” circular hand button */}
          {(canCheckIn || canCheckOut) && (
            <div className="border-t border-slate-100 px-4 py-6 dark:border-slate-800">
              {completed ? (
                <div className="flex flex-col items-center gap-2">
                  <AttendanceCircleButton completed checkedIn onClick={() => {}} size="md" />
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Attendance completed</p>
                </div>
              ) : (
                <AttendanceCircleButton
                  checkedIn={checkedIn}
                  dayOff={isScheduledDayOff && !checkedIn}
                  disabled={!checkedIn && !canCheckInToday}
                  onClick={handleBigBtn}
                  size="md"
                  className="mx-auto"
                />
              )}
            </div>
          )}
        </div>

        {/* GPS / action error */}
        {gpsError && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
        {actionNotice && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
            <span className="font-medium">{actionNotice}</span>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Status', value: todayStatus, color: statusColor },
            { label: 'Late',   value: lateDuration, color: 'text-amber-500' },
            { label: 'Work',   value: workDuration,  color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className={clsx('text-sm font-bold', s.color)}>{s.value}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Attendance history â€” card list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <PanelHeader title="Attendance History" subtitle="Your recent records" />
          {attendanceRows.length === 0
            ? <EmptyState text="No attendance records found." />
            : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceRows.slice(0, 15).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-slate-50 dark:active:bg-slate-800/60"
                    onClick={() => setSelectedRecord(item)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatDate(item.attendance_date)}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatTime(item.check_in_at) || '--:--'} â€“ {formatTime(item.check_out_at) || '--:--'}
                        {item.work_minutes ? ` Â· ${formatDuration(item.work_minutes * 60)}` : ''}
                      </p>
                    </div>
                    <StatusPill status={titleCase(item.status)} />
                    <ChevronRight size={15} className="shrink-0 text-slate-300 dark:text-slate-600" />
                  </button>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {selectedRecord && (
        <AttendanceDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}

      {/* â”€â”€â”€ Desktop layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="hidden sm:contents">

        {/* Clock hero card */}
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white pb-8 pt-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-5xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">{timeStr}</p>
          <p className="mt-1.5 text-sm text-slate-400">{dateStr}</p>

          <AttendanceCircleButton
            className="my-8"
            checkedIn={checkedIn}
            completed={completed}
            dayOff={isScheduledDayOff && !checkedIn}
            disabled={!checkedIn && !canCheckInToday}
            onClick={handleBigBtn}
            size="lg"
          />

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <MapPinned size={14} className={gpsReady ? 'text-emerald-500' : gpsError ? 'text-amber-500' : 'text-slate-300'} />
              <span>
                {gpsReady
                  ? 'Current location ready'
                  : gpsError
                    ? 'Location unavailable'
                    : checkedIn
                      ? 'Tap Check Out — location is confirmed in the next step'
                      : 'Detecting location…'}
              </span>
            </span>
            {gpsError && (
              <button type="button" onClick={refreshGps} className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                Retry
              </button>
            )}
          </div>

        </div>

        {gpsError && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
        {actionNotice && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-800 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rose-500" />
            <span className="font-medium">{actionNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <CheckCircle2 size={13} className="text-emerald-500" /> Day In
            </div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{dayInTime}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Clock size={13} className="text-rose-400" /> Day Out
            </div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{dayOutTime}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <DesktopInfoCard label="Today's Status" value={todayStatus} help="From attendance table" />
          <DesktopInfoCard label="Late Duration"  value={lateDuration} help="Late time shown as H:M:S" />
          <DesktopInfoCard label="Work Duration"  value={workDuration} help="Check-in to check-out shown as H:M:S" />
        </div>

        <AttendanceTable rows={attendanceRows} />
      </div>
    </>
  )
}

function DesktopInfoCard({ label, value, help }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  )
}

function AttendanceTable({ rows }) {
  const columns = ['Date', 'Status', 'Check In', 'Check Out', 'Work', 'Check In Location', 'Check Out Location']

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <PanelHeader title="Attendance History" subtitle="Your attendance records." />
      {rows.length === 0
        ? <EmptyState text="No attendance records found." />
        : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>{columns.map((c) => <th key={c} className="px-5 py-3">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="px-5 py-4">{formatDate(item.attendance_date)}</td>
                    <td className="px-5 py-4"><StatusPill status={titleCase(item.status)} /></td>
                    <td className="px-5 py-4">{formatTime(item.check_in_at)}</td>
                    <td className="px-5 py-4">{formatTime(item.check_out_at)}</td>
                    <td className="px-5 py-4">{item.work_minutes ? formatDuration(item.work_minutes * 60) : '-'}</td>
                    <td className="max-w-[200px] px-5 py-4 text-slate-600 dark:text-slate-300">
                      <LocationLink attendance={item} type="check_in" />
                    </td>
                    <td className="max-w-[200px] px-5 py-4 text-slate-600 dark:text-slate-300">
                      <LocationLink attendance={item} type="check_out" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}

function LocationLink({ attendance, type }) {
  const label = formatAttendanceLocation(attendance, type)
  const mapUrl = attendanceLocationMapUrl(attendance, type)

  if (!mapUrl) return label

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full flex-col gap-1 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
    >
      <span className="truncate">{label}</span>
      <span className="text-xs font-semibold underline">View map</span>
    </a>
  )
}

function AttendanceDetailModal({ record, onClose }) {
  const statusColors = {
    present:  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' },
    late:     { bg: 'bg-amber-50 dark:bg-amber-950/30',   text: 'text-amber-600 dark:text-amber-400' },
    absent:   { bg: 'bg-rose-50 dark:bg-rose-950/30',     text: 'text-rose-600 dark:text-rose-400' },
    half_day: { bg: 'bg-blue-50 dark:bg-blue-950/30',     text: 'text-blue-600 dark:text-blue-400' },
  }
  const sc = statusColors[record.status] || statusColors.present
  const checkInLocation  = formatAttendanceLocation(record, 'check_in')
  const checkOutLocation = formatAttendanceLocation(record, 'check_out')
  const checkInMapUrl    = attendanceLocationMapUrl(record, 'check_in')
  const checkOutMapUrl   = attendanceLocationMapUrl(record, 'check_out')

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/50 backdrop-blur-sm sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{formatDate(record.attendance_date)}</p>
            <p className="text-xs text-slate-400">Attendance Detail</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={clsx('rounded-full px-3 py-1 text-xs font-bold', sc.bg, sc.text)}>
              {titleCase(record.status)}
            </span>
            <button className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} type="button">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          {/* Check In / Out times */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-500" /> Check In
              </div>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatTime(record.check_in_at) || '--:--'}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Clock size={12} className="text-rose-400" /> Check Out
              </div>
              <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatTime(record.check_out_at) || '--:--'}
              </p>
            </div>
          </div>

          {/* Duration stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <BriefcaseBusiness size={12} /> Work Duration
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {record.work_minutes ? formatDuration(record.work_minutes * 60) : '-'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Clock size={12} className="text-amber-400" /> Late Duration
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {record.late_minutes ? formatDuration(record.late_minutes * 60) : '-'}
              </p>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <DetailRow
              icon={LocateFixed}
              iconColor="text-emerald-500"
              label="Check In Location"
              value={checkInLocation}
              mapUrl={checkInMapUrl}
            />
            <DetailRow
              icon={MapPinned}
              iconColor="text-rose-400"
              label="Check Out Location"
              value={checkOutLocation}
              mapUrl={checkOutMapUrl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, iconColor, label, value, mapUrl }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 dark:bg-slate-800">
        <Icon size={15} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">{value || '-'}</p>
        {mapUrl && (
          <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 underline dark:text-emerald-400">
            View on map
          </a>
        )}
      </div>
    </div>
  )
}
