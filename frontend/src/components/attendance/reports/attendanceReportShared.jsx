import clsx from 'clsx'

export const STATUS_META = {
  present: { label: 'Present', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400', dot: 'bg-emerald-500' },
  late: { label: 'Late', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400', dot: 'bg-amber-500' },
  absent: { label: 'Absent', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400', dot: 'bg-rose-500' },
  on_leave: { label: 'Leave', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400', dot: 'bg-sky-500' },
  half_day: { label: 'Half Day', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400', dot: 'bg-sky-500' },
  missing_checkout: { label: 'Missing Check Out', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400', dot: 'bg-violet-500' },
  leave: { label: 'Leave', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400', dot: 'bg-sky-500' },
}

export const GPS_META = {
  verified: { label: 'Verified', cls: 'bg-emerald-100 text-emerald-700' },
  partial: { label: 'Partial', cls: 'bg-amber-100 text-amber-700' },
  unverified: { label: 'Unverified', cls: 'bg-slate-100 text-slate-600' },
}

export const TIMELINE_TONE = {
  green: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  orange: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
  red: 'border-rose-500 bg-rose-50 dark:bg-rose-950/30',
  blue: 'border-sky-500 bg-sky-50 dark:bg-sky-950/30',
}

export const inputCls = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'

export function formatWorkHours(minutes) {
  if (minutes == null || minutes === '') return '–'
  const h = Math.floor(Number(minutes) / 60)
  const m = Number(minutes) % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export function formatLateDuration(minutes) {
  if (!minutes || Number(minutes) <= 0) return null
  const h = Math.floor(Number(minutes) / 60)
  const m = Number(minutes) % 60
  if (h > 0 && m > 0) return `Late by ${h}h ${m}m`
  if (h > 0) return `Late by ${h}h`
  return `Late by ${m}m`
}

export function formatLateShort(minutes) {
  if (!minutes || Number(minutes) <= 0) return null
  const h = Math.floor(Number(minutes) / 60)
  const m = Number(minutes) % 60
  if (h > 0 && m > 0) return `Late ${h}h ${m}m`
  if (h > 0) return `Late ${h}h`
  return `Late ${m}m`
}

export function formatMobileDate(value) {
  if (!value) return '–'
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatWeekday(value) {
  if (!value) return ''
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { weekday: 'long' })
}

export function formatMonthLabel(monthValue) {
  if (!monthValue) return ''
  const d = new Date(`${monthValue.length === 7 ? `${monthValue}-01` : monthValue}T12:00:00`)
  if (Number.isNaN(d.getTime())) return monthValue
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function formatHoursCompact(minutes) {
  if (minutes == null || minutes === '') return '0h'
  const h = Math.floor(Number(minutes) / 60)
  const m = Number(minutes) % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatDateWithDay(value) {
  if (!value) return '–'
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatPeriodLabel(from, to) {
  const fmt = (v) => {
    const d = new Date(`${v}T12:00:00`)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return `${fmt(from)} – ${fmt(to)}`
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function monthStartStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize', meta.cls)}>
      <span className={clsx('h-1.5 w-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}

export function GpsBadge({ status }) {
  const meta = GPS_META[status] || GPS_META.unverified
  return <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-bold', meta.cls)}>{meta.label}</span>
}

export function TypeBadge({ type }) {
  const isOutdoor = type === 'outdoor'
  return (
    <span className={clsx(
      'rounded-full px-2.5 py-0.5 text-xs font-bold capitalize',
      isOutdoor ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    )}>
      {isOutdoor ? 'Outdoor' : 'Office'}
    </span>
  )
}

const SUMMARY_TONE_LABEL = {
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  rose: 'text-rose-600',
  sky: 'text-sky-600',
  violet: 'text-violet-600',
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  teal: 'text-teal-600',
  red: 'text-rose-600',
}

export function SummaryStat({ label, value, tone = 'emerald', help }) {
  return (
    <div className="px-2 py-4 text-center">
      <p className={clsx('text-xs font-bold', SUMMARY_TONE_LABEL[tone] || SUMMARY_TONE_LABEL.emerald)}>{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      {help != null && help !== '' && (
        <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{help}</p>
      )}
    </div>
  )
}

export function DashboardSummaryCard({ title, subtitle, stats, headerRight, columns = 4 }) {
  const colClass = {
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5',
  }[columns] || 'grid-cols-2 sm:grid-cols-4'

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-white">
        <div>
          <p className="text-lg font-bold">{title}</p>
          {subtitle && <p className="text-sm text-emerald-100">{subtitle}</p>}
        </div>
        {headerRight}
      </div>
      <div className={clsx('grid divide-x divide-slate-100 dark:divide-slate-800', colClass)}>
        {stats.map((s) => (
          <SummaryStat key={s.label} label={s.label} value={s.value} tone={s.tone} help={s.help} />
        ))}
      </div>
    </article>
  )
}

export function SummaryCard({ label, value, pct, trend, icon: Icon, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    violet: 'bg-violet-100 text-violet-600',
    sky: 'bg-sky-100 text-sky-600',
    slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={clsx('grid h-11 w-11 place-items-center rounded-xl', tones[tone] || tones.emerald)}>
        {Icon && <Icon size={22} />}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
        {pct != null && <span className="ml-1 text-base font-semibold text-slate-400">({pct})</span>}
      </p>
      {trend && <p className="mt-1 text-xs font-semibold text-slate-500">{trend}</p>}
    </div>
  )
}

