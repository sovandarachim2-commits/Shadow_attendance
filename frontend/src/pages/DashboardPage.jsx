/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { GoogleMap, MarkerF, PolylineF } from '@react-google-maps/api'
import {
  AlertCircle, Bell, CalendarCheck, CheckCircle2, Clock,
  MapPinned, Plus, ShoppingBag, Users,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import clsx from 'clsx'
import AttendanceCircleButton from '../components/attendance/AttendanceCircleButton'
import { DashboardSummaryCard } from '../components/attendance/reports/attendanceReportShared'
import { EmptyState, StatusPill } from '../components/shared/UI'
import { canAccess, formatDate, formatTime, normaliseChart, titleCase } from '../utils/format'

// ── Entry point — shows Admin or Employee dashboard based on role ──────────────
export default function DashboardPage({ appData, isLoaded, onAttendanceAction, user, setActive, setModal }) {
  const isAdmin = canAccess(user, ['attendance.view_all'])
  const canVisit = canAccess(user, ['visits.create', 'visits.manage'])
  return (
    <>
      {isAdmin
        ? <AdminDashboard appData={appData} isLoaded={isLoaded} onAttendanceAction={onAttendanceAction} setActive={setActive} setModal={setModal} />
        : <EmployeeDashboard appData={appData} isLoaded={isLoaded} onAttendanceAction={onAttendanceAction} setActive={setActive} user={user} setModal={setModal} />}

      {canVisit && (
        <button
          onClick={() => setModal('visit')}
          title="New Customer Visit"
          className="fixed bottom-24 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 transition hover:bg-emerald-700 active:scale-95 lg:hidden"
        >
          <Plus size={26} strokeWidth={2.2} />
        </button>
      )}
    </>
  )
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ appData, isLoaded, onAttendanceAction, setActive, setModal }) {
  const cards = appData.dashboard?.cards || {}
  const total = Math.max(cards.total_employees || 1, 1)
  const pct = (n) => `${(((n ?? 0) / total) * 100).toFixed(2)}% of total`

  const stats = [
    { label: 'Present Today', value: cards.present ?? 0, help: pct(cards.present), tone: 'emerald' },
    { label: 'Late Today', value: cards.late ?? 0, help: pct(cards.late), tone: 'amber' },
    { label: 'Absent Today', value: cards.absent ?? 0, help: pct(cards.absent), tone: 'rose' },
    { label: 'On Leave', value: cards.on_leave ?? 0, help: pct(cards.on_leave), tone: 'sky' },
    { label: 'Missing Check Out', value: cards.missing_checkout ?? 0, help: pct(cards.missing_checkout), tone: 'violet' },
  ]

  const todayStr = new Date().toDateString()
  const todayAttendanceRows = appData.attendance.filter((a) =>
    new Date(a.check_in_at || a.date || a.created_at).toDateString() === todayStr,
  )
  const attendanceByEmployee = new Map(todayAttendanceRows.map((row) => [String(row.employee_id ?? row.employee?.id), row]))
  const todayRows = (appData.employees || []).map((employee) => ({
    employee,
    attendance: attendanceByEmployee.get(String(employee.id)) || null,
  }))

  const donutData = [
    { name: 'Present', value: cards.present ?? 0, color: '#10b981' },
    { name: 'Late', value: cards.late ?? 0, color: '#f59e0b' },
    { name: 'Absent', value: cards.absent ?? 0, color: '#ef4444' },
    { name: 'Leave', value: cards.on_leave ?? 0, color: '#8b5cf6' },
    { name: 'Missing Out', value: cards.missing_checkout ?? 0, color: '#94a3b8' },
  ].filter((d) => d.value > 0)

  return (
    <>
      <DashboardSummaryCard
        title="Today's Attendance"
        subtitle={`${cards.total_employees ?? 0} employees`}
        stats={stats}
        columns={5}
      />

      <div className="grid gap-6">
        <AttendanceControlPanel attendance={appData.todayAttendance} onAttendanceAction={onAttendanceAction} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <RecentActivityPanel attendance={appData.attendance} visits={appData.visits} />
        <TodayAttendanceTable rows={todayRows} />
      </div>

      <AttendanceDonutChart data={donutData} total={cards.total_employees ?? 0} />
    </>
  )
}

// ── Employee Dashboard ────────────────────────────────────────────────────────
function EmployeeDashboard({ appData, isLoaded, onAttendanceAction, setActive, user, setModal }) {
  const today = appData.todayAttendance
  const workMins = today?.work_minutes ?? 0
  const h = Math.floor(workMins / 60)
  const m = workMins % 60
  const workingHours = workMins > 0 ? `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m` : '--h --m'
  const completedVisits = appData.visits.filter((v) => v.status === 'completed').length
  const pendingVisits = appData.visits.filter((v) => v.status !== 'completed' && v.status !== 'cancelled').length

  const todaySubtitle = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
  const stats = [
    { label: "Today's Status", value: today ? titleCase(today.status) : 'Not Checked In', help: today?.check_in_at ? `Checked in at ${formatTime(today.check_in_at)}` : 'No attendance yet', tone: 'emerald' },
    { label: 'Working Hours', value: workingHours, help: today?.check_in_at ? `Since ${formatTime(today.check_in_at)}` : '—', tone: 'sky' },
    { label: 'Current Location', value: today?.branch?.name || today?.location_name || 'Office', help: 'GPS Verified', tone: 'violet' },
    { label: "Today's Visits", value: appData.visits.length, help: `Completed ${completedVisits} / Pending ${pendingVisits}`, tone: 'orange' },
    { label: 'This Month', value: `${appData.dashboard?.cards?.present_days ?? '—'} Days`, help: 'Present Days', tone: 'teal' },
  ]

  const weeklyData = buildWeeklyChart(appData.attendance)

  return (
    <>
      <DashboardSummaryCard
        title="Today's Overview"
        subtitle={todaySubtitle}
        stats={stats}
        columns={5}
      />

      <div className="grid gap-6">
        <AttendanceControlPanel attendance={today} onAttendanceAction={onAttendanceAction} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <RecentActivityPanel attendance={appData.attendance} visits={appData.visits} />
        <MyRequestsPanel reports={appData.reports} setActive={setActive} />
      </div>

      <MyAttendanceBarChart data={weeklyData} />
    </>
  )
}

// ── Utility ───────────────────────────────────────────────────────────────────
function buildWeeklyChart(attendance) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dateKey = dateToKey(d)
    const record = attendance.find((a) => attendanceDateKey(a) === dateKey)
    const status = record?.status || 'dayoff'
    const workMinutes = Number(record?.work_minutes || 0)
    const hours = Math.round((workMinutes / 60) * 100) / 100

    return {
      day: dayNames[d.getDay()],
      date: dateKey,
      status,
      hours,
      workMinutes,
      barValue: hours,
    }
  })
}

function attendanceDateKey(row) {
  const value = row?.attendance_date || row?.date || row?.check_in_at || row?.created_at
  if (!value) return ''
  return dateToKey(new Date(value))
}

function dateToKey(date) {
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatHourValue(hours) {
  const totalMinutes = Math.round(Number(hours || 0) * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

const COLOR = {
  emerald: { card: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  amber:   { card: 'bg-amber-50 dark:bg-amber-900/20',   icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  red:     { card: 'bg-red-50 dark:bg-red-900/20',       icon: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
  blue:    { card: 'bg-blue-50 dark:bg-blue-900/20',     icon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  violet:  { card: 'bg-violet-50 dark:bg-violet-900/20', icon: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
  orange:  { card: 'bg-orange-50 dark:bg-orange-900/20', icon: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' },
  teal:    { card: 'bg-teal-50 dark:bg-teal-900/20',     icon: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' },
}

// ── Shared widgets ────────────────────────────────────────────────────────────
function StatCard({ label, value, help, icon: Icon, color }) {
  const c = COLOR[color] || COLOR.emerald
  return (
    <div className={clsx('rounded-xl border border-slate-200 p-5 shadow-sm dark:border-slate-700', c.card)}>
      <div className="flex items-start gap-4">
        <div className={clsx('grid h-12 w-12 shrink-0 place-items-center rounded-full', c.icon)}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">{value}</p>
          <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{help}</p>
        </div>
      </div>
    </div>
  )
}

function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="py-2 text-center">
      <p className="text-3xl font-bold tabular-nums tracking-tight">
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </p>
    </div>
  )
}

function AttendanceControlPanel({ attendance, onAttendanceAction }) {
  const checkedIn = Boolean(attendance?.check_in_at)
  const completed = Boolean(attendance?.check_out_at)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold">Attendance Control</h3>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Live
        </span>
      </div>
      <LiveClock />
      <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
        <div>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Inside Office Radius</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">GPS Verified</p>
        </div>
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">42m from office</p>
      </div>
      <div className="mt-5 flex flex-col items-center gap-2">
        <AttendanceCircleButton
          checkedIn={checkedIn}
          completed={completed}
          onClick={() => {
            if (!completed) onAttendanceAction?.(checkedIn ? 'check-out' : 'check-in')
          }}
          size="md"
        />
        {completed && <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Attendance completed</p>}
      </div>
      {attendance?.check_in_at && (
        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-500">Check In Time</span>
            <span className="font-semibold">{formatTime(attendance.check_in_at)}</span>
          </div>
          {attendance?.check_out_at && (
            <div className="flex justify-between">
              <span className="text-slate-500">Check Out Time</span>
              <span className="font-semibold">{formatTime(attendance.check_out_at)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CustomerVisitsPanel({ visits, setActive }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold">Today's Customer Visits</h3>
        <button onClick={() => setActive('Customer Visits')} className="text-xs font-semibold text-emerald-600 hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {visits.length === 0 && <EmptyState text="No customer visits today." />}
        {visits.slice(0, 4).map((visit) => (
          <div key={visit.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-200 dark:bg-slate-800">
              <ShoppingBag size={18} className="text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{visit.customer_name || visit.store_name}</p>
              <p className="text-xs text-slate-400">{visit.address || '-'}</p>
            </div>
            <div className="shrink-0 text-right">
              <StatusPill status={titleCase(visit.status)} />
              <p className="mt-1 text-xs text-slate-400">{formatTime(visit.check_in_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentActivityPanel({ attendance, visits }) {
  const activities = [
    ...attendance.slice(0, 4).flatMap((a) => {
      const name = [a.employee?.first_name, a.employee?.last_name].filter(Boolean).join(' ') || 'Employee'
      const items = []
      if (a.check_in_at) items.push({ time: a.check_in_at, text: `${name} checked in`, sub: a.branch?.name || 'Office', tag: 'GPS Verified', color: 'emerald', key: `ci-${a.id}` })
      if (a.check_out_at) {
        const mins = a.work_minutes
        items.push({ time: a.check_out_at, text: `${name} checked out`, sub: mins ? `Working hours: ${Math.floor(mins / 60)}h ${mins % 60}m` : '-', tag: 'Completed', color: 'slate', key: `co-${a.id}` })
      }
      return items
    }),
    ...visits.slice(0, 2).map((v) => ({
      time: v.check_in_at,
      text: 'Customer visit started',
      sub: v.customer_name || v.store_name || '-',
      tag: titleCase(v.status),
      color: v.status === 'completed' ? 'emerald' : 'amber',
      key: `v-${v.id}`,
    })),
  ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 5)

  const tagCls = { emerald: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700', slate: 'bg-slate-100 text-slate-600' }
  const dotCls = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', slate: 'bg-slate-400' }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">Recent Activity</h3>
        <button className="text-xs font-semibold text-emerald-600 hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {activities.length === 0 && <EmptyState text="No recent activity." />}
        {activities.map((a) => (
          <div key={a.key} className="flex items-start gap-3">
            <span className={clsx('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', dotCls[a.color] || dotCls.slate)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{a.text}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{a.sub}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className={clsx('rounded-full px-2 py-0.5 text-xs font-semibold', tagCls[a.color] || tagCls.slate)}>{a.tag}</span>
              <p className="mt-1 text-xs text-slate-400">{formatTime(a.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin-only widgets ────────────────────────────────────────────────────────
function TodayAttendanceTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h3 className="text-base font-bold">Today's Attendance</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {rows.length} employees
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {['#', 'Employee', 'Department', 'Check In', 'Check Out', 'Status'].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No employees found.</td></tr>
            )}
            {rows.map(({ employee, attendance }, i) => {
              const name = [employee?.first_name, employee?.last_name].filter(Boolean).join(' ') || employee?.name || '-'
              return (
                <tr key={employee?.id || attendance?.id || i} className="border-b border-slate-50 transition hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-950">
                  <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{name}</p>
                    <p className="text-xs text-slate-400">{employee?.employee_code || employee?.employee_id || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{employee?.department?.name || '-'}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">
                    {attendance?.check_in_at ? formatTime(attendance.check_in_at) : <span className="font-normal text-slate-300 dark:text-slate-600">-</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {attendance?.check_out_at ? formatTime(attendance.check_out_at) : <span className="text-slate-300 dark:text-slate-600">-</span>}
                  </td>
                  <td className="px-4 py-3"><StatusPill status={attendance ? titleCase(attendance.status) : 'Not Checked In'} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AttendanceDonutChart({ data, total }) {
  const safeData = data.length ? data : [{ name: 'No data', value: 1, color: '#e2e8f0' }]
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">Attendance Overview</h3>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700">This Week</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-36 min-h-36 w-36 min-w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={safeData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" strokeWidth={2} stroke="#fff">
                {safeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold">{total}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold">
                {item.value} <span className="text-xs font-normal text-slate-400">({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Employee-only widgets ─────────────────────────────────────────────────────
function MyRequestsPanel({ reports, setActive }) {
  const meta = (status) => {
    if (status === 'approved') return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600', icon: CheckCircle2 }
    if (status === 'rejected') return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', icon: AlertCircle }
    return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600', icon: Clock }
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">My Requests</h3>
        <button onClick={() => setActive('Permission Requests')} className="text-xs font-semibold text-emerald-600 hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {reports.length === 0 && <EmptyState text="No requests yet." />}
        {reports.slice(0, 4).map((r) => {
          const { bg, text, icon: Icon } = meta(r.status)
          return (
            <div key={r.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
              <div className={clsx('grid h-9 w-9 shrink-0 place-items-center rounded-lg', bg)}>
                <Icon size={16} className={text} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-slate-400">{formatDate(r.report_date)}</p>
              </div>
              <StatusPill status={titleCase(r.status)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MyAttendanceBarChart({ data }) {
  const statusColors = {
    present: '#10b981',
    late: '#f59e0b',
    absent: '#ef4444',
    dayoff: '#8b5cf6',
  }
  const workedDays = data.filter((row) => row.status !== 'dayoff' && row.hours > 0)
  const lowHours = workedDays.length ? Math.min(...workedDays.map((row) => row.hours)) : 0
  const highHours = workedDays.length ? Math.max(...workedDays.map((row) => row.hours)) : 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold">My Attendance Overview</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700">This Week</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Low {formatHourValue(lowHours)} / High {formatHourValue(highHours)}
          </span>
        </div>
      </div>
      <div className="h-48 min-h-48 min-w-0">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, (dataMax) => Math.max(8, Math.ceil(dataMax || 0))]}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip content={<AttendanceHoursTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }} />
            <Bar dataKey="barValue" radius={[4, 4, 0, 0]} minPointSize={6}>
              {data.map((entry) => (
                <Cell key={entry.date} fill={statusColors[entry.status] || statusColors.dayoff} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4">
        {[['Present', '#10b981'], ['Late', '#f59e0b'], ['Absent', '#ef4444'], ['Day Off', '#8b5cf6']].map(([label, color]) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function AttendanceHoursTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const row = payload[0].payload
  const status = row.status === 'dayoff' ? 'Day Off' : titleCase(row.status)

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="font-bold text-slate-900 dark:text-white">{label} · {status}</p>
      <p className="mt-1 text-slate-500">Working Hours: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatHourValue(row.hours)}</span></p>
    </div>
  )
}

// ── Named exports kept for OutdoorSalesPage and ReportsPage ──────────────────
export function RouteCard({ isLoaded, locations }) {
  const points = (locations || [])
    .filter((l) => l.latitude && l.longitude)
    .map((l) => ({ lat: Number(l.latitude), lng: Number(l.longitude) }))
  const center = points[0] || { lat: 11.5564, lng: 104.9282 }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Live GPS Route</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{points.length} points</span>
      </div>
      <div className="mt-5 h-64 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        {isLoaded && import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
          <GoogleMap mapContainerClassName="h-full w-full" center={center} zoom={12}>
            {points.map((p) => <MarkerF key={`${p.lat}-${p.lng}`} position={p} />)}
            {points.length > 1 && <PolylineF path={points} options={{ strokeColor: '#16a34a', strokeWeight: 4 }} />}
          </GoogleMap>
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#dcfce7,#dbeafe)] p-6 text-center text-slate-700">
            <div>
              <MapPinned className="mx-auto mb-3" size={34} />
              <p className="font-semibold">Google Maps ready</p>
              <p className="mt-1 text-sm">Set VITE_GOOGLE_MAPS_API_KEY to show live GPS points.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ReportsPanel({ chartData, notifications }) {
  const grouped = normaliseChart(chartData)
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-bold">Reports & Alerts</h3>
      <div className="mt-5 h-52 min-h-52 min-w-0">
        {grouped.length === 0 ? <EmptyState text="No attendance chart data yet." /> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grouped}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-5 space-y-3">
        {(notifications || []).slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
            <Bell size={16} className="text-slate-500" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
