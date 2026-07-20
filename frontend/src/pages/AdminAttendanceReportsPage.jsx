import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, Calendar, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Eye, FileSpreadsheet, FileText, Image, LogOut, MapPinned, Pencil,
  Users, X,
} from 'lucide-react'
import {
  CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import clsx from 'clsx'
import { api } from '../services/api'
import { EmptyState, FloatingSpinner } from '../components/shared/UI'
import AttendanceDetailSidebar from '../components/attendance/reports/AttendanceDetailSidebar'
import EditAttendanceModal from '../components/attendance/EditAttendanceModal'
import {
  GpsBadge, StatusBadge, SummaryCard, TypeBadge, formatDateWithDay,
  formatLateDuration, formatPeriodLabel, formatWorkHours, inputCls,
  monthStartStr, todayStr,
} from '../components/attendance/reports/attendanceReportShared'
import { canAccess, employeeFullName, formatTime, initials } from '../utils/format'

const PAGE_SIZE = 10

export default function AdminAttendanceReportsPage({ user, appData, isLoaded }) {
  const employees = appData?.employees || []
  const departments = useMemo(() => {
    const map = new Map()
    employees.forEach((e) => { if (e.department?.id) map.set(e.department.id, e.department) })
    return [...map.values()].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [employees])
  const branches = useMemo(() => {
    const map = new Map()
    employees.forEach((e) => { if (e.branch?.id) map.set(e.branch.id, e.branch) })
    return [...map.values()].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [employees])

  const [from, setFrom] = useState(monthStartStr())
  const [to, setTo] = useState(todayStr())
  const [employeeId, setEmployeeId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [gpsStatus, setGpsStatus] = useState('')
  const [draft, setDraft] = useState({})
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ summary: {}, records: [] })
  const [detail, setDetail] = useState(null)
  const [editing, setEditing] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const canEdit = canAccess(user, ['reports.attendance.edit', 'attendance.edit'])
  const canExport = canAccess(user, ['reports.attendance.export', 'reports.attendance.view_all', 'attendance.view_all'])

  const buildParams = useCallback(() => {
    const p = { from, to }
    if (employeeId) p.employee_id = employeeId
    if (departmentId) p.department_id = departmentId
    if (branchId) p.branch_id = branchId
    if (type) p.type = type
    if (status) p.status = status
    if (gpsStatus) p.gps_status = gpsStatus
    return p
  }, [from, to, employeeId, departmentId, branchId, type, status, gpsStatus])

  const fetchReport = async (overrides = {}) => {
    setLoading(true)
    try {
      const p = {
        from: overrides.from ?? from,
        to: overrides.to ?? to,
        ...(overrides.employeeId !== undefined ? { employee_id: overrides.employeeId || undefined } : employeeId ? { employee_id: employeeId } : {}),
        ...(overrides.departmentId !== undefined ? { department_id: overrides.departmentId || undefined } : departmentId ? { department_id: departmentId } : {}),
        ...(overrides.branchId !== undefined ? { branch_id: overrides.branchId || undefined } : branchId ? { branch_id: branchId } : {}),
        ...(overrides.type !== undefined ? { type: overrides.type || undefined } : type ? { type } : {}),
        ...(overrides.status !== undefined ? { status: overrides.status || undefined } : status ? { status } : {}),
        ...(overrides.gpsStatus !== undefined ? { gps_status: overrides.gpsStatus || undefined } : gpsStatus ? { gps_status: gpsStatus } : {}),
      }
      const res = await api.get('/attendance/reports/admin', { params: p })
      setData(res.data)
      setPage(1)
      setDetail(null)
    } catch {
      setData({ summary: {}, records: [] })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const next = {
      from: draft.from ?? from,
      to: draft.to ?? to,
      employeeId: draft.employeeId ?? employeeId,
      departmentId: draft.departmentId ?? departmentId,
      branchId: draft.branchId ?? branchId,
      type: draft.type ?? type,
      status: draft.status ?? status,
      gpsStatus: draft.gpsStatus ?? gpsStatus,
    }
    setFrom(next.from)
    setTo(next.to)
    setEmployeeId(next.employeeId)
    setDepartmentId(next.departmentId)
    setBranchId(next.branchId)
    setType(next.type)
    setStatus(next.status)
    setGpsStatus(next.gpsStatus)
    fetchReport(next)
  }

  const resetFilters = () => {
    const reset = {
      from: monthStartStr(), to: todayStr(),
      employeeId: '', departmentId: '', branchId: '', type: '', status: '', gpsStatus: '',
    }
    setDraft({})
    setFrom(reset.from)
    setTo(reset.to)
    setEmployeeId('')
    setDepartmentId('')
    setBranchId('')
    setType('')
    setStatus('')
    setGpsStatus('')
    fetchReport(reset)
  }

  useEffect(() => { fetchReport() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const records = data.records || []
  const summary = data.summary || {}
  const totalRecords = Math.max(summary.total_records || records.length, 1)
  const pct = (n) => `${(((n ?? 0) / totalRecords) * 100).toFixed(2)}%`

  const analytics = useMemo(() => buildAnalytics(records, summary), [records, summary])

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const paged = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportFile = async () => {
    if (!canExport) return
    setExporting(true)
    try {
      const res = await api.get('/attendance/reports/export', { params: buildParams(), responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-reports-${from}-to-${to}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.alert('Export failed.')
    } finally {
      setExporting(false)
    }
  }

  const exportPdf = () => window.print()

  const statCards = [
    { label: 'Present Employees', value: summary.present ?? 0, pct: pct(summary.present), trend: 'In selected period', icon: Users, tone: 'emerald' },
    { label: 'Late Check In', value: summary.late ?? 0, pct: pct(summary.late), trend: 'In selected period', icon: Clock, tone: 'orange' },
    { label: 'Absent Employees', value: summary.absent ?? 0, pct: pct(summary.absent), trend: 'In selected period', icon: AlertCircle, tone: 'rose' },
    { label: 'Early Check Out', value: summary.early_checkout ?? 0, pct: pct(summary.early_checkout), trend: 'In selected period', icon: LogOut, tone: 'yellow' },
    { label: 'Day Off', value: summary.day_off ?? 0, pct: pct(summary.day_off), trend: 'In selected period', icon: Calendar, tone: 'sky' },
    { label: 'Missing Check In', value: summary.missing_checkin ?? summary.missing_attendance ?? 0, pct: pct(summary.missing_checkin ?? summary.missing_attendance), trend: 'In selected period', icon: AlertCircle, tone: 'violet' },
    { label: 'Missing Check Out', value: summary.missing_checkout ?? 0, pct: pct(summary.missing_checkout), trend: 'In selected period', icon: LogOut, tone: 'fuchsia' },
    { label: 'Personal Leave', value: summary.personal_request ?? summary.on_leave ?? 0, pct: pct(summary.personal_request ?? summary.on_leave), trend: 'In selected period', icon: FileText, tone: 'blue' },
    { label: 'Outdoor Attendance', value: summary.outdoor ?? 0, pct: pct(summary.outdoor), trend: 'In selected period', icon: MapPinned, tone: 'sky' },
    { label: 'Total Working Hours', value: formatWorkHours(summary.total_work_minutes), pct: null, trend: `${summary.total_records ?? 0} records`, icon: Clock, tone: 'slate' },
  ]

  return (
    <div className="space-y-6 pb-24 print:pb-0">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
          <label className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Calendar size={16} className="text-slate-400" />
            <input type="date" className="w-[7.5rem] border-0 bg-transparent text-sm outline-none" value={from} onChange={(e) => { setFrom(e.target.value); fetchReport({ from: e.target.value, to }) }} />
            <span className="text-slate-300">–</span>
            <input type="date" className="w-[7.5rem] border-0 bg-transparent text-sm outline-none" value={to} onChange={(e) => { setTo(e.target.value); fetchReport({ from, to: e.target.value }) }} />
          </label>
          {canExport && (
            <>
              <button type="button" onClick={exportFile} disabled={exporting} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700">
                <FileSpreadsheet size={16} />
                {exporting ? 'Exporting…' : 'Export Excel'}
              </button>
              <button type="button" onClick={exportPdf} className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:hover:bg-rose-950/30">
                <FileText size={16} />
                Export PDF
              </button>
            </>
          )}
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((c) => (
          <SummaryCard key={c.label} {...c} />
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterField label="Employee">
            <select className={inputCls} value={draft.employeeId ?? employeeId} onChange={(e) => setDraft((d) => ({ ...d, employeeId: e.target.value }))}>
              <option value="">All employees</option>
              {employees.map((emp) => <option key={emp.id} value={emp.id}>{employeeFullName(emp)}</option>)}
            </select>
          </FilterField>
          <FilterField label="Department">
            <select className={inputCls} value={draft.departmentId ?? departmentId} onChange={(e) => setDraft((d) => ({ ...d, departmentId: e.target.value }))}>
              <option value="">All departments</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </FilterField>
          <FilterField label="Branch">
            <select className={inputCls} value={draft.branchId ?? branchId} onChange={(e) => setDraft((d) => ({ ...d, branchId: e.target.value }))}>
              <option value="">All branches</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </FilterField>
          <FilterField label="Attendance Type">
            <select className={inputCls} value={draft.type ?? type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}>
              <option value="">All types</option>
              <option value="office">Office</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </FilterField>
          <FilterField label="Status">
            <select className={inputCls} value={draft.status ?? status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
              <option value="">All statuses</option>
              <option value="present">Present</option>
              <option value="late">Late Check In</option>
              <option value="early_checkout">Early Check Out</option>
              <option value="day_off">Day Off</option>
              <option value="missing_checkin">Missing Check In</option>
              <option value="missing_checkout">Missing Check Out</option>
              <option value="personal_request">Personal Leave</option>
              <option value="absent">Absent</option>
            </select>
          </FilterField>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="GPS Status">
            <select className={inputCls} value={draft.gpsStatus ?? gpsStatus} onChange={(e) => setDraft((d) => ({ ...d, gpsStatus: e.target.value }))}>
              <option value="">All</option>
              <option value="verified">Verified</option>
              <option value="partial">Partial</option>
              <option value="unverified">Unverified</option>
            </select>
          </FilterField>
          <FilterField label="Date From">
            <input type="date" className={inputCls} value={draft.from ?? from} onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))} />
          </FilterField>
          <FilterField label="Date To">
            <input type="date" className={inputCls} value={draft.to ?? to} onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))} />
          </FilterField>
          <div className="flex items-end gap-2">
            <button type="button" onClick={resetFilters} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700">Reset</button>
            <button type="button" onClick={applyFilters} className="h-11 flex-1 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700">Filter</button>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">{formatPeriodLabel(from, to)}</p>
      </div>

      {/* Table + sidebar */}
      <div className={clsx('flex flex-col gap-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row', detail && 'lg:items-stretch')}>
        <div className="min-w-0 flex-1">
          {loading ? <FloatingSpinner /> : records.length === 0 ? (
            <EmptyState title="No records" description="Adjust filters or date range." />
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50">
                      {['Employee', 'Employee ID', 'Department', 'Date', 'Check In', 'Check Out', 'Working Hours', 'Late Check In', 'Status', 'Type', 'GPS', 'Photo', 'Action'].map((h) => (
                        <th key={h} className="whitespace-nowrap px-4 py-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paged.map((row) => (
                      <tr
                        key={row.id}
                        className={clsx(
                          'cursor-pointer transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                          detail?.id === row.id && 'bg-emerald-50/60 dark:bg-emerald-950/20',
                        )}
                        onClick={() => setDetail(row)}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{initials(row.employee_name)}</span>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{row.employee_name}</p>
                              <p className="text-xs text-slate-500">{row.position || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{row.employee_code}</td>
                        <td className="px-4 py-3.5">{row.department || '—'}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium">{formatDateWithDay(row.attendance_date)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold tabular-nums">{formatTime(row.check_in_at)}</p>
                          {row.late_minutes > 0 ? (
                            <p className="text-xs font-semibold text-rose-600">{formatLateDuration(row.late_minutes)}</p>
                          ) : row.check_in_at ? (
                            <p className="text-xs font-semibold text-emerald-600">On Time</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3.5 tabular-nums font-medium">{formatTime(row.check_out_at)}</td>
                        <td className="px-4 py-3.5 font-semibold">{formatWorkHours(row.work_minutes)}</td>
                        <td className="px-4 py-3.5 font-semibold text-rose-600 tabular-nums">
                          {row.late_minutes > 0 ? formatWorkHours(row.late_minutes) : '—'}
                        </td>
                        <td className="px-4 py-3.5"><StatusBadge status={row.display_status || row.status} /></td>
                        <td className="px-4 py-3.5"><TypeBadge type={row.type} /></td>
                        <td className="px-4 py-3.5">
                          {row.gps_status === 'verified' ? (
                            <CheckCircle2 size={18} className="text-emerald-500" aria-label="GPS verified" />
                          ) : (
                            <GpsBadge status={row.gps_status} />
                          )}
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <PhotoButton row={row} onView={setPhotoPreview} />
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <ActionBtn icon={Eye} title="View" onClick={() => setDetail(row)} />
                            {canEdit && <ActionBtn icon={Pencil} title="Edit" onClick={() => setEditing(row)} />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 lg:hidden">
                {paged.map((row) => (
                  <button key={row.id} type="button" onClick={() => setDetail(row)} className="w-full rounded-xl border border-slate-200 p-4 text-left dark:border-slate-700">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{row.employee_name}</p>
                        <p className="text-xs text-slate-500">{formatDateWithDay(row.attendance_date)}</p>
                      </div>
                      <StatusBadge status={row.display_status || row.status} />
                    </div>
                    <p className="mt-2 text-sm tabular-nums">{formatTime(row.check_in_at)} → {formatTime(row.check_out_at)}</p>
                  </button>
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} total={records.length} onPage={setPage} />
            </>
          )}
        </div>

        {detail && (
          <AttendanceDetailSidebar
            record={detail}
            onClose={() => setDetail(null)}
            canEdit={canEdit}
            onEdit={(r) => { setEditing(r) }}
          />
        )}
      </div>

      {/* Analytics */}
      {!loading && records.length > 0 && (
        <div className="grid gap-6 print:hidden xl:grid-cols-3">
          <ReportDonutChart data={analytics.donut} total={summary.total_records ?? records.length} />
          <ReportTrendChart data={analytics.trend} />
          <DepartmentSummaryTable rows={analytics.departments} />
        </div>
      )}

      {editing && (
        <EditAttendanceModal
          attendance={editing}
          isLoaded={isLoaded}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchReport() }}
        />
      )}

      {photoPreview && (
        <PhotoPreviewModal preview={photoPreview} onClose={() => setPhotoPreview(null)} />
      )}
    </div>
  )
}

function attendancePhotoItems(row) {
  return [
    { label: 'Check In', url: row.check_in_photo_url || row.photo_url },
    { label: 'Check Out', url: row.check_out_photo_url },
  ].filter((item) => item.url)
}

function PhotoButton({ row, onView }) {
  const photos = attendancePhotoItems(row)
  if (photos.length === 0) {
    return <span className="text-slate-300">-</span>
  }

  return (
    <button
      type="button"
      onClick={() => onView({ row, photos })}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
      title="View attendance photo"
    >
      <Image size={14} />
      View
    </button>
  )
}

function PhotoPreviewModal({ preview, onClose }) {
  const [activeUrl, setActiveUrl] = useState(preview.photos[0]?.url || null)
  const activePhoto = preview.photos.find((item) => item.url === activeUrl) || preview.photos[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 print:hidden" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Attendance Photo</p>
            <h3 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{preview.row.employee_name}</h3>
            <p className="text-sm text-slate-500">{formatDateWithDay(preview.row.attendance_date)}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close photo preview">
            <X size={18} />
          </button>
        </div>

        {preview.photos.length > 1 && (
          <div className="flex gap-2 px-5 pt-4">
            {preview.photos.map((photo) => (
              <button
                key={photo.label}
                type="button"
                onClick={() => setActiveUrl(photo.url)}
                className={clsx(
                  'h-9 rounded-lg px-3 text-xs font-bold',
                  activePhoto?.url === photo.url
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
                )}
              >
                {photo.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-5">
          {activePhoto?.url ? (
            <img
              src={activePhoto.url}
              alt={`${activePhoto.label} attendance photo for ${preview.row.employee_name}`}
              className="max-h-[70vh] w-full rounded-xl border border-slate-100 object-contain dark:border-slate-800"
            />
          ) : (
            <div className="grid h-64 place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
              No photo available.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function buildAnalytics(records, summary) {
  const donut = [
    { name: 'Present', value: summary.present ?? 0, color: '#10b981' },
    { name: 'Late Check In', value: summary.late ?? 0, color: '#f97316' },
    { name: 'Absent', value: summary.absent ?? 0, color: '#ef4444' },
    { name: 'Early Check Out', value: summary.early_checkout ?? 0, color: '#eab308' },
    { name: 'Day Off', value: summary.day_off ?? 0, color: '#0ea5e9' },
    { name: 'Missing Check In', value: summary.missing_checkin ?? summary.missing_attendance ?? 0, color: '#8b5cf6' },
    { name: 'Missing Check Out', value: summary.missing_checkout ?? 0, color: '#d946ef' },
    { name: 'Personal Leave', value: summary.personal_request ?? summary.on_leave ?? 0, color: '#2563eb' },
  ].filter((d) => d.value > 0)

  const dayMap = {}
  const today = new Date()
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    dayMap[key] = {
      date: d.toLocaleDateString(undefined, { weekday: 'short' }),
      present: 0,
      late: 0,
      early: 0,
      dayOff: 0,
      missingIn: 0,
      missingOut: 0,
      personal: 0,
      absent: 0,
    }
  }
  records.forEach((r) => {
    const key = r.attendance_date
    if (!dayMap[key]) return
    const status = r.display_status || r.status
    if (status === 'present') dayMap[key].present += 1
    else if (status === 'late') dayMap[key].late += 1
    else if (status === 'early_checkout') dayMap[key].early += 1
    else if (status === 'day_off') dayMap[key].dayOff += 1
    else if (status === 'missing_checkin' || status === 'missing_attendance') dayMap[key].missingIn += 1
    else if (status === 'missing_checkout') dayMap[key].missingOut += 1
    else if (status === 'personal_request' || status === 'on_leave' || status === 'half_day' || status === 'leave') dayMap[key].personal += 1
    else if (status === 'absent') dayMap[key].absent += 1
  })
  const trend = Object.values(dayMap)

  const deptMap = {}
  records.forEach((r) => {
    const d = r.department || 'Unassigned'
    if (!deptMap[d]) deptMap[d] = { department: d, present: 0, total: 0 }
    deptMap[d].total += 1
    if (['present', 'late'].includes(r.status)) deptMap[d].present += 1
  })
  const departments = Object.values(deptMap)
    .map((row) => ({ ...row, pct: row.total ? ((row.present / row.total) * 100).toFixed(2) : '0.00' }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  return { donut, trend, departments }
}

function ReportDonutChart({ data, total }) {
  const safe = data.length ? data : [{ name: 'No data', value: 1, color: '#e2e8f0' }]
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Attendance Overview</h3>
      <div className="flex items-center gap-4">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={safe} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={2} stroke="#fff">
                {safe.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold">{total}</p>
            <p className="text-[10px] text-slate-400">Total Records</p>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReportTrendChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Daily Attendance Trend</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="present" name="Present" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="late" name="Late Check In" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="early" name="Early Check Out" stroke="#eab308" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="dayOff" name="Day Off" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="missingIn" name="Missing Check In" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="missingOut" name="Missing Check Out" stroke="#d946ef" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="personal" name="Personal Leave" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DepartmentSummaryTable({ rows }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Department Summary</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-bold uppercase tracking-wider text-slate-400">
            <th className="pb-2">Department</th>
            <th className="pb-2 text-center">Present / Total</th>
            <th className="pb-2 text-right">%</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          {rows.length === 0 ? (
            <tr><td colSpan={3} className="py-4 text-center text-slate-400">No data</td></tr>
          ) : rows.map((row) => (
            <tr key={row.department}>
              <td className="py-2.5 font-medium">{row.department}</td>
              <td className="py-2.5 text-center tabular-nums">{row.present} / {row.total}</td>
              <td className="py-2.5 text-right font-semibold text-emerald-600">{row.pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FilterField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function ActionBtn({ icon: Icon, title, onClick }) {
  return (
    <button type="button" title={title} onClick={onClick} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
      <Icon size={15} />
    </button>
  )
}

function Pagination({ page, totalPages, total, onPage }) {
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)
  const pages = useMemo(() => {
    const items = []
    const max = 5
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, start + max - 1)
    start = Math.max(1, end - max + 1)
    for (let i = start; i <= end; i += 1) items.push(i)
    return items
  }, [page, totalPages])

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
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
              n === page ? 'bg-emerald-600 text-white' : 'border hover:bg-slate-50 dark:hover:bg-slate-800',
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
