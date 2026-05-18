import { MapPin, X } from 'lucide-react'
import clsx from 'clsx'
import { formatDate } from '../../../utils/format'
import { GpsBadge, StatusBadge, TIMELINE_TONE, formatWorkHours } from './attendanceReportShared'

export default function AttendanceDetailModal({ record, onClose, onEdit, canEdit }) {
  if (!record) return null

  const timeline = record.timeline || []

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/50 p-0 sm:place-items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Attendance Details</h3>
            <p className="text-sm text-slate-500">{record.employee_name} · {formatDate(record.attendance_date)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <SummaryItem label="Working Hours" value={formatWorkHours(record.work_minutes)} />
            <SummaryItem label="Late Minutes" value={record.late_minutes ?? 0} />
            <SummaryItem label="Deduction" value={record.deduction_amount != null ? `$${Number(record.deduction_amount).toFixed(2)}` : '–'} />
            <SummaryItem label="Bonus Eligible" value={record.bonus_eligible ? 'Yes' : 'No'} />
            <SummaryItem label="GPS" value={<GpsBadge status={record.gps_status} />} />
            <SummaryItem label="Status" value={<StatusBadge status={record.display_status || record.status} />} />
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Timeline</p>
            <div className="relative space-y-0 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
              {timeline.map((ev) => (
                <div key={ev.key} className="relative pb-5 last:pb-0">
                  <span className={clsx('absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full border-2 border-white', {
                    'bg-emerald-500': ev.tone === 'green',
                    'bg-amber-500': ev.tone === 'orange',
                    'bg-rose-500': ev.tone === 'red',
                    'bg-sky-500': ev.tone === 'blue',
                  })} />
                  <div className={clsx('rounded-xl border-l-4 p-3', TIMELINE_TONE[ev.tone] || TIMELINE_TONE.green)}>
                    <p className="font-bold text-slate-900 dark:text-white">{ev.label}</p>
                    <p className="text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-200">{ev.time}</p>
                    {ev.note && <p className="mt-1 text-xs font-semibold text-amber-700">{ev.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {record.location && record.location !== '—' && (
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
              <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span className="text-slate-600 dark:text-slate-300">{record.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold">Close</button>
          {canEdit && onEdit && (
            <button type="button" onClick={() => onEdit(record)} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white">Edit Attendance</button>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <div className="mt-1 font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
