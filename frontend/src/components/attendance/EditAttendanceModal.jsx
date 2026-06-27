/* eslint-disable no-unused-vars */
import { useMemo, useRef, useState } from 'react'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import {
  AlertTriangle, Building2, Calendar, Camera, CheckCircle2, Clock,
  FileText, History, Loader2, MapPin, Paperclip, Shield, ShieldCheck,
  Upload, User, X, XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'
import { apiError, formatTime, initials, titleCase } from '../../utils/format'

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'present',          label: 'Present',           color: 'emerald' },
  { value: 'late',             label: 'Late',              color: 'amber'   },
  { value: 'absent',           label: 'Absent',            color: 'red'     },
  { value: 'leave',            label: 'Leave',             color: 'blue'    },
  { value: 'missing_checkout', label: 'Missing Check Out', color: 'violet'  },
]

const TYPE_OPTIONS = [
  { value: 'office',   label: 'Office'        },
  { value: 'outdoor',  label: 'Outdoor Sales' },
]

const STATUS_BADGE = {
  present:          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  late:             'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-300',
  absent:           'bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-300',
  leave:            'bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-300',
  missing_checkout: 'bg-violet-100  text-violet-700  dark:bg-violet-900/30  dark:text-violet-300',
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ' +
  'transition placeholder:text-slate-400 ' +
  'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ' +
  'dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600'

// ── Main component ────────────────────────────────────────────────────────────
export default function EditAttendanceModal({ attendance, onClose, onSaved, isLoaded = false }) {
  const fileRef = useRef(null)
  const dateInputRef = useRef(null)
  const checkInInputRef = useRef(null)
  const checkOutInputRef = useRef(null)
  const employee    = attendance?.employee || {}
  const employeeName = [employee.first_name, employee.last_name].filter(Boolean).join(' ') || 'Employee'

  const toTime = (iso) => (iso ? new Date(iso).toTimeString().slice(0, 5) : '')

  // Form state
  const [date,        setDate]        = useState(attendance?.date || attendance?.check_in_at?.slice(0, 10) || '')
  const [checkIn,     setCheckIn]     = useState(toTime(attendance?.check_in_at))
  const [checkOut,    setCheckOut]    = useState(toTime(attendance?.check_out_at))
  const [status,      setStatus]      = useState(attendance?.status || 'present')
  const [type,        setType]        = useState(attendance?.type   || 'office')
  const [deductionAmount, setDeductionAmount] = useState(attendance?.deduction_amount ?? '')
  const [deductionReason, setDeductionReason] = useState(attendance?.deduction_reason || '')
  const [reason,      setReason]      = useState('')
  const [attachments, setAttachments] = useState([])
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')

  // Auto-calculate working hours from time inputs
  const workingHours = useMemo(() => {
    if (!checkIn || !checkOut) return '--h --m'
    const [ih, im] = checkIn.split(':').map(Number)
    const [oh, om] = checkOut.split(':').map(Number)
    const mins = oh * 60 + om - (ih * 60 + im)
    if (mins <= 0) return '--h --m'
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`
  }, [checkIn, checkOut])

  // GPS data
  const lat    = attendance?.check_in_latitude
  const lng    = attendance?.check_in_longitude
  const hasGps = lat != null && lng != null
  const mapCenter = hasGps ? { lat: Number(lat), lng: Number(lng) } : { lat: 11.5564, lng: 104.9282 }

  // Build history from logs or fall back to synthetic records
  const history = attendance?.logs?.length
    ? attendance.logs
    : [
        attendance?.check_in_at  && { id: 1, action: 'Checked In',  value: attendance.check_in_at,  editor: 'System', reason: 'Employee check-in via app',    ts: attendance.check_in_at  },
        attendance?.check_out_at && { id: 2, action: 'Checked Out', value: attendance.check_out_at, editor: 'System', reason: 'Employee check-out via app',   ts: attendance.check_out_at },
      ].filter(Boolean)

  // File handling
  const addFiles = (e) => setAttachments((p) => [...p, ...Array.from(e.target.files || [])])
  const removeFile = (i) => setAttachments((p) => p.filter((_, idx) => idx !== i))

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return

    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
        return
      } catch {
        // Fall back to focus/click for browsers that restrict showPicker.
      }
    }

    input.focus()
    input.click()
  }

  const openInputPicker = (input) => {
    if (!input) return

    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
        return
      } catch {
        // Fall back to focus/click for browsers that restrict showPicker.
      }
    }

    input.focus()
    input.click()
  }

  // Submit
  const handleSave = async () => {
    if (!date) { setError('Please select an attendance date.'); return }
    if (!reason.trim()) { setError('Please enter a reason for this attendance edit.'); return }
    const parsedDeductionAmount = deductionAmount === '' ? null : Number(deductionAmount)
    if (parsedDeductionAmount !== null && (!Number.isFinite(parsedDeductionAmount) || parsedDeductionAmount < 0)) {
      setError('Please enter a valid deduction amount.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const changes = {
        attendance_date: date,
        check_in_at: checkIn ? `${date} ${checkIn}:00` : null,
        check_out_at: checkOut ? `${date} ${checkOut}:00` : null,
        status,
        type,
        deduction_amount: parsedDeductionAmount,
        deduction_reason: deductionReason.trim() || null,
      }

      await api.patch(`/attendance/${attendance?.id}/edit`, {
        changes,
        reason,
      })
      onSaved()
    } catch (ex) {
      setError(apiError(ex))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl">

        {/* ── Modal header ── */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Clock size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Edit Attendance</h2>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">All changes are permanently logged</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">

          {/* Employee card */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-base font-bold text-white ring-2 ring-white dark:ring-slate-700">
              {employee.photo_url
                ? <img src={employee.photo_url} alt={employeeName} className="h-full w-full object-cover" />
                : initials(employeeName)}
              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 dark:text-white">{employeeName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{employee.employee_id || 'EMP-???'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{employee.department?.name || '-'}</p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendance Date</p>
              <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                {date ? new Date(date + 'T00:00:00').toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}
              </p>
              <span className={clsx('mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_BADGE[status] || 'bg-slate-100 text-slate-600')}>
                {titleCase(status)}
              </span>
            </div>
          </div>

          {/* ── Attendance Information ── */}
          <ModalSection title="Attendance Information" icon={Calendar}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <Field label="Attendance Date" required>
                <div className="relative">
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={clsx(inputCls, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={openDatePicker}
                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Open attendance date picker"
                  >
                    <Calendar size={16} />
                  </button>
                </div>
              </Field>

              <Field label="Working Hours">
                <div className={clsx(inputCls, 'flex cursor-default items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10')}>
                  <Clock size={14} className="shrink-0 text-emerald-500" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{workingHours}</span>
                  <span className="ml-auto text-[10px] text-slate-400">auto</span>
                </div>
              </Field>

              <Field label="Check In Time" required>
                <div className="relative">
                  <input
                    ref={checkInInputRef}
                    type="time"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={clsx(inputCls, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => openInputPicker(checkInInputRef.current)}
                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Open check in time picker"
                  >
                    <Clock size={16} />
                  </button>
                </div>
              </Field>

              <Field label="Check Out Time">
                <div className="relative">
                  <input
                    ref={checkOutInputRef}
                    type="time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={clsx(inputCls, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => openInputPicker(checkOutInputRef.current)}
                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Open check out time picker"
                  >
                    <Clock size={16} />
                  </button>
                </div>
              </Field>

              <Field label="Attendance Status" required>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={clsx(inputCls, 'appearance-none pr-8')}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span className={clsx('pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full', {
                    'bg-emerald-500': status === 'present',
                    'bg-amber-500':   status === 'late',
                    'bg-red-500':     status === 'absent',
                    'bg-blue-500':    status === 'leave',
                    'bg-violet-500':  status === 'missing_checkout',
                  })} />
                </div>
              </Field>

              <Field label="Attendance Type" required>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={clsx(inputCls, 'appearance-none')}
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Deduction Amount">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deductionAmount}
                  onChange={(e) => setDeductionAmount(e.target.value)}
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>

              <Field label="Deduction Reason">
                <input
                  type="text"
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  className={inputCls}
                  placeholder="Reason for deduction"
                />
              </Field>

            </div>
          </ModalSection>

          {/* ── GPS & Verification ── */}
          <ModalSection title="GPS & Verification" icon={MapPin}>

            <div className="grid gap-3 sm:grid-cols-2">
              <GpsCard
                icon={MapPin}
                label="GPS Status"
                value={hasGps ? 'Verified' : 'Not Available'}
                sub={hasGps ? `±${attendance?.check_in_accuracy ?? '?'} m accuracy` : 'No GPS data recorded'}
                color={hasGps ? 'emerald' : 'slate'}
              />
              <GpsCard
                icon={Building2}
                label="Distance from Office"
                value={attendance?.check_in_distance != null ? `${attendance.check_in_distance} m` : '—'}
                sub={attendance?.branch?.name || 'Main Office'}
                color="blue"
              />
            </div>

            {hasGps && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800">
                <MapPin size={12} className="shrink-0 text-slate-400" />
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
                </span>
              </div>
            )}

            {/* Mini map */}
            <div className="mt-3 h-32 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-blue-50 dark:border-slate-700 dark:from-slate-800 dark:to-slate-850 sm:h-36">
              {isLoaded && hasGps && import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <GoogleMap
                  mapContainerClassName="h-full w-full"
                  center={mapCenter}
                  zoom={15}
                  options={{ disableDefaultUI: true, gestureHandling: 'none' }}
                >
                  <MarkerF position={mapCenter} />
                </GoogleMap>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <MapPin size={26} className="text-emerald-400" />
                  <p className="text-xs font-semibold">
                    {hasGps
                      ? `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`
                      : 'No GPS coordinates recorded'}
                  </p>
                </div>
              )}
            </div>

            {/* Selfie proof */}
            {attendance?.photo_url && (
              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Selfie Proof</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <img
                    src={attendance.photo_url}
                    alt="Check-in selfie"
                    className="h-16 w-16 rounded-xl border border-slate-200 object-cover shadow-sm dark:border-slate-700"
                  />
                  <div className="flex-1 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-1.5">
                      <Camera size={12} className="text-emerald-600" />
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Face Verified</p>
                    </div>
                    <p className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-500">
                      Selfie captured at check-in · {formatTime(attendance.check_in_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ModalSection>

          {/* ── Edit Reason ── */}
          <ModalSection title="Edit Reason" icon={FileText}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reason for Edit <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this attendance needs to be edited..."
                className={clsx(inputCls, 'resize-none leading-relaxed')}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                This reason is permanently stored in the audit log and cannot be deleted.
              </p>
            </div>
          </ModalSection>

          {/* ── Attachments ── */}
          <ModalSection title="Attachments" icon={Paperclip}>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={addFiles}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-5 text-sm font-semibold text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10 dark:hover:text-emerald-400"
            >
              <Upload size={17} />
              Upload Screenshot / Approval Document
            </button>
            <p className="mt-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
              Supports: JPG, PNG, PDF, DOC · Max 10 MB each
            </p>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <FileText size={14} className="text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ModalSection>

          {/* ── Edit History / Timeline ── */}
          <ModalSection title="Edit History" icon={History}>
            {history.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-400 dark:text-slate-500">No edit history recorded.</p>
            ) : (
              <div className="space-y-0">
                {history.map((log, i) => (
                  <div key={log.id || i} className="relative flex gap-3 pb-5 last:pb-0">
                    {/* Vertical line */}
                    <div className="flex flex-col items-center">
                      <div className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 ring-4 ring-white dark:bg-emerald-900/40 dark:ring-slate-900">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      {i < history.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" />
                      )}
                    </div>

                    {/* Log content */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{log.action}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {log.editor || 'System'}
                        </span>
                      </div>
                      {(log.reason || log.sub) && (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{log.reason || log.sub}</p>
                      )}
                      {(log.old || log.new || log.value) && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          {log.old && (
                            <span className="rounded bg-red-50 px-1.5 py-0.5 font-mono text-red-600 line-through dark:bg-red-950/30 dark:text-red-400">
                              {formatTime(log.old)}
                            </span>
                          )}
                          {log.old && log.new && <span className="text-slate-400">→</span>}
                          {(log.new || log.value) && (
                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                              {formatTime(log.new || log.value)}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                        {formatTime(log.ts || log.timestamp || log.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalSection>

          {/* ── Security warning ── */}
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <Shield size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Security Notice</p>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                All attendance edits are permanently logged and cannot be deleted. Only authorized administrators may modify attendance records. Unauthorized changes may result in disciplinary action.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
              <XCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ── Sticky footer ── */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <ShieldCheck size={13} className="text-emerald-500" />
              Changes are audit logged
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving
                  ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  : <><CheckCircle2 size={15} /> Save Changes</>
                }
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ModalSection({ title, icon: Icon, children }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2.5">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
          <Icon size={14} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/30 sm:p-4">
        {children}
      </div>
    </div>
  )
}

function Field({ label, required = false, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-0.5 text-red-500"> *</span>}
      </label>
      {children}
    </div>
  )
}

const GPS_COLORS = {
  emerald: {
    wrap: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    val:  'text-emerald-700 dark:text-emerald-400',
  },
  blue: {
    wrap: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    val:  'text-blue-700 dark:text-blue-400',
  },
  slate: {
    wrap: 'bg-slate-50 dark:bg-slate-800',
    icon: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
    val:  'text-slate-600 dark:text-slate-400',
  },
}

function GpsCard({ icon: Icon, label, value, sub, color }) {
  const c = GPS_COLORS[color] || GPS_COLORS.slate
  return (
    <div className={clsx('rounded-xl p-3 sm:min-h-24', c.wrap)}>
      <div className={clsx('grid h-8 w-8 place-items-center rounded-lg', c.icon)}>
        <Icon size={15} />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className={clsx('truncate text-sm font-bold', c.val)}>{value}</p>
      <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>
    </div>
  )
}
