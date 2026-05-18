import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import clsx from 'clsx'

const STYLES = {
  success: {
    icon: CheckCircle2,
    iconWrap: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
  },
  error: {
    icon: AlertTriangle,
    iconWrap: 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-900/50',
    btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25',
  },
  warning: {
    icon: Info,
    iconWrap: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
    btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25',
  },
}

/** In-app alert card (replaces browser alert). */
export default function NoticeAlertCard({
  open,
  variant = 'error',
  title,
  message,
  confirmLabel = 'OK',
  onConfirm,
}) {
  if (!open) return null

  const style = STYLES[variant] || STYLES.error
  const Icon = style.icon
  const lines = Array.isArray(message)
    ? message.filter(Boolean)
    : String(message || '')
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)

  return (
    <div
      className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-slate-950/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-alert-title"
    >
      <div
        className={clsx(
          'w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-slate-900',
          style.border,
        )}
      >
        <div className="p-5">
          <div className="flex flex-col items-center text-center">
            <div className={clsx('mb-4 grid h-14 w-14 place-items-center rounded-2xl', style.iconWrap)}>
              <Icon size={28} strokeWidth={2} />
            </div>
            <h4 id="notice-alert-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h4>
            {lines.length > 0 && (
              <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className={clsx(
              'mt-6 w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition active:scale-[0.99]',
              style.btn,
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
