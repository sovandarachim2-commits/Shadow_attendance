import { Hand } from 'lucide-react'
import clsx from 'clsx'

/**
 * Large circular attendance action — green for check-in, amber for check-out.
 */
export default function AttendanceCircleButton({
  checkedIn = false,
  completed = false,
  disabled = false,
  dayOff = false,
  onClick,
  size = 'lg',
  className,
}) {
  const label = completed
    ? 'Done'
    : checkedIn
      ? 'Check Out'
      : dayOff
        ? 'Day Off'
        : 'Check In'

  const dim = size === 'sm' ? 'h-[60px] w-[60px]' : size === 'md' ? 'h-36 w-36' : 'h-40 w-40'
  const iconSize = size === 'sm' ? 26 : size === 'md' ? 40 : 46
  const textClass = size === 'sm' ? 'sr-only' : 'mt-2 text-[15px] font-bold text-white'

  return (
    <div className={clsx('relative flex items-center justify-center', className)}>
      {checkedIn && !completed && size !== 'sm' && (
        <div
          className={clsx(
            'pointer-events-none absolute animate-spin rounded-full border-[5px] border-amber-300 border-l-transparent border-t-transparent',
            size === 'md' ? 'h-[152px] w-[152px]' : 'h-[176px] w-[176px]',
          )}
          aria-hidden
        />
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || completed}
        title={label}
        className={clsx(
          'relative z-10 flex flex-col items-center justify-center rounded-full text-white shadow-2xl transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60',
          dim,
          completed && 'bg-slate-300 shadow-slate-300/40 dark:bg-slate-600',
          !completed && checkedIn && 'bg-amber-500 shadow-amber-500/50 hover:bg-amber-600',
          !completed && !checkedIn && !disabled && 'bg-emerald-500 shadow-emerald-500/50 hover:bg-emerald-600',
          !completed && !checkedIn && disabled && 'bg-slate-300 shadow-slate-300/30',
        )}
      >
        <Hand size={iconSize} stroke="white" strokeWidth={1.6} />
        {size !== 'sm' && <span className={textClass}>{label}</span>}
      </button>
    </div>
  )
}
