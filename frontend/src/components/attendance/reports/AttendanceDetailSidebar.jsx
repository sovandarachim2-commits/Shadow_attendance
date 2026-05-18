import { MapPin, X } from 'lucide-react'
import clsx from 'clsx'
import {
  GpsBadge, StatusBadge, TIMELINE_TONE, formatWorkHours,
} from './attendanceReportShared'

export default function AttendanceDetailSidebar({ record, onClose, onEdit, canEdit }) {
  if (!record) return null

  const timeline = record.timeline || []
  const mapUrl = record.check_in_latitude != null
    ? `https://www.google.com/maps?q=${record.check_in_latitude},${record.check_in_longitude}`
    : null

  const bonusEligible = record.bonus_eligible ?? (
    record.status === 'present' && !(record.late_minutes > 0) && record.display_status !== 'absent'
  )

  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:w-[340px] xl:w-[380px]">
      <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white">
            {(record.employee_name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{record.employee_name}</p>
            <p className="text-xs text-slate-500">{record.employee_code}</p>
            <p className="text-xs text-slate-400">{record.position || record.department || 'Employee'}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Attendance Timeline</p>
        <div className="relative border-l-2 border-slate-200 pl-5 dark:border-slate-700">
          {timeline.map((ev) => (
            <div key={ev.key} className="relative pb-5 last:pb-0">
              <span className={clsx(
                'absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900',
                ev.tone === 'green' && 'bg-emerald-500',
                ev.tone === 'orange' && 'bg-amber-500',
                ev.tone === 'red' && 'bg-rose-500',
                ev.tone === 'blue' && 'bg-sky-500',
              )} />
              <div className={clsx('rounded-lg border-l-4 p-3', TIMELINE_TONE[ev.tone] || TIMELINE_TONE.green)}>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ev.label}</p>
                <p className="text-base font-semibold tabular-nums">{ev.time}</p>
                {ev.note && <p className="mt-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">{ev.note}</p>}
              </div>
            </div>
          ))}
        </div>

        <dl className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-800">
          <DetailRow label="Total Working Hours" value={formatWorkHours(record.work_minutes)} />
          <DetailRow label="Late Minutes" value={`${record.late_minutes ?? 0} min`} />
          <DetailRow label="Overtime" value={record.overtime_minutes ? formatWorkHours(record.overtime_minutes) : '—'} />
          <DetailRow label="Attendance Type" value={<span className="capitalize">{record.type || 'office'}</span>} />
          <DetailRow label="GPS Status" value={<GpsBadge status={record.gps_status} />} />
          <DetailRow label="Location" value={record.location || '—'} />
          <DetailRow label="Status" value={<StatusBadge status={record.display_status || record.status} />} />
          <DetailRow label="Deduction" value={record.deduction_amount != null ? `$${Number(record.deduction_amount).toFixed(2)}` : '$0.00'} />
          <DetailRow
            label="Bonus Eligibility"
            value={
              <span className={clsx(
                'rounded-full px-2 py-0.5 text-xs font-bold',
                bonusEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
              )}>
                {bonusEligible ? 'Eligible' : 'Not Eligible'}
              </span>
            }
          />
        </dl>
      </div>

      {mapUrl && (
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
          >
            <MapPin size={16} />
            View on Map
          </a>
        </div>
      )}
      {canEdit && onEdit && (
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <button type="button" onClick={() => onEdit(record)} className="w-full rounded-xl border border-emerald-200 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/30">
            Edit Attendance
          </button>
        </div>
      )}
    </aside>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}
