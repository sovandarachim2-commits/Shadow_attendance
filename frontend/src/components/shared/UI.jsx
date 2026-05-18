/* eslint-disable no-unused-vars */
import clsx from 'clsx'
import {
  Activity, Bell, BriefcaseBusiness, Building2, CalendarCheck, Camera, CheckCircle2, ChevronDown, Clock, Cloud, Download, Eye, EyeOff, FileText, FileSpreadsheet, Fingerprint, Folder, Home, KeyRound, List, Loader2, LocateFixed, LogOut, Mail, MapPinned, Menu, Moon, Phone, Send, ShieldCheck, ShoppingBag, Sun, UploadCloud, UserPlus, Users, UserRound, X,
} from 'lucide-react'
import { initials } from '../../utils/format'

export function SimpleModal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
          <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-700" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}


export function FormInput({ label, value, onChange, type = 'text', required = false }) {
  return (
    <>
      <label className="text-sm font-semibold">{label}</label>
      <input className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </>
  )
}


export function FormSelect({ label, value, onChange, required = false, children }) {
  return (
    <>
      <label className="text-sm font-semibold">{label}</label>
      <select className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        {children}
      </select>
    </>
  )
}


export function FormTextarea({ label, value, onChange, required = false }) {
  return (
    <>
      <label className="text-sm font-semibold">{label}</label>
      <textarea className="min-h-24 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </>
  )
}


export function SubmitButton({ saving, label }) {
  return <LoadingButton loading={saving} type="submit" loadingText="Saving...">{label}</LoadingButton>
}


export function ErrorText({ text }) {
  return <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{text}</p>
}


export function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={disabled ? undefined : onChange}
      className={clsx(
        'relative inline-flex h-6 w-14 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
      )}
    >
      <span className={clsx(
        'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-[33px]' : 'translate-x-0.5',
      )} />
      <span className={clsx(
        'absolute text-[9px] font-bold',
        checked ? 'left-1.5 text-white' : 'right-1.5 text-slate-500 dark:text-slate-300',
      )}>
        {checked ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}


export function StatusPill({ status }) {
  const styles = {
    Present: 'bg-emerald-100 text-emerald-700',
    Late: 'bg-amber-100 text-amber-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Open: 'bg-blue-100 text-blue-700',
    Closed: 'bg-slate-100 text-slate-600',
    Submitted: 'bg-emerald-100 text-emerald-700',
    Reviewed: 'bg-violet-100 text-violet-700',
    Unread: 'bg-red-100 text-red-700',
    Read: 'bg-slate-100 text-slate-600',
    'Not Checked In': 'bg-slate-100 text-slate-600',
  }
  return <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', styles[status] || 'bg-slate-100 text-slate-600')}>{status}</span>
}


export function InfoCard({ label, value, help }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{help}</p>
    </div>
  )
}


export function InfoLine({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold">{value ?? '-'}</p>
    </div>
  )
}


export function SummaryRow({ label, value }) {
  return <div className="flex justify-between"><span>{label}</span><span>{value || '-'}</span></div>
}


export function EmptyState({ text }) {
  return <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">{text}</div>
}


export function Avatar({ name }) {
  return <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500 font-bold text-white ring-2 ring-white/15">{initials(name)}</div>
}


export function LoadingScreen() {
  const messages = ['Loading dashboard...', 'Preparing attendance data...', 'Initializing GPS services...']

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 via-emerald-50/60 to-white p-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="w-full max-w-sm rounded-lg border border-white/70 bg-white/85 p-7 text-center shadow-2xl shadow-emerald-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/25">
          <Activity className="animate-pulse" size={30} />
        </div>
        <div className="mx-auto mt-5 h-9 w-9 rounded-full border-4 border-emerald-100 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-400 animate-spin" />
        <p className="mt-5 text-base font-bold">Loading secure session</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{messages[new Date().getSeconds() % messages.length]}</p>
        <div className="mt-6 grid gap-2">
          <SkeletonLine className="mx-auto h-2 w-44" />
          <SkeletonLine className="mx-auto h-2 w-32" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonBlock({ className = '' }) {
  return (
    <span
      className={clsx(
        'relative block overflow-hidden rounded-lg bg-slate-200/80 dark:bg-slate-800',
        'after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent after:animate-[loading-shimmer_1.5s_infinite]',
        'dark:after:via-white/10',
        className,
      )}
    />
  )
}

export function SkeletonLine({ className = '' }) {
  return <SkeletonBlock className={clsx('h-3 rounded-full', className)} />
}

export function CardSkeleton({ variant = 'dashboard' }) {
  if (variant === 'profile') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <SkeletonLine className="w-40" />
            <SkeletonLine className="w-28" />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <SkeletonLine className="w-28" />
          <SkeletonLine className="h-7 w-20" />
        </div>
        <SkeletonBlock className="h-12 w-12 rounded-full" />
      </div>
      <SkeletonLine className="mt-5 w-full" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 5, showAvatar = true }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <SkeletonLine className="w-52" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid min-w-[680px] grid-cols-[1.5fr_repeat(4,1fr)_80px] items-center gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              {showAvatar && <SkeletonBlock className="h-10 w-10 rounded-full" />}
              <div className="flex-1 space-y-2">
                <SkeletonLine className="w-32" />
                <SkeletonLine className="w-20" />
              </div>
            </div>
            {Array.from({ length: Math.max(columns - 2, 1) }).map((__, colIndex) => (
              <SkeletonLine key={colIndex} className="w-full" />
            ))}
            <div className="flex gap-2">
              <SkeletonBlock className="h-8 w-8" />
              <SkeletonBlock className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <aside className="hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:block">
        <SkeletonLine className="mb-5 w-28" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => <SkeletonLine key={index} className="h-10" />)}
        </div>
      </aside>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <SkeletonLine className="w-44" />
            <SkeletonBlock className="mt-5 h-72" />
          </div>
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
        <TableSkeleton />
      </div>
    </div>
  )
}

export function LoadingButton({
  loading = false,
  children,
  loadingText = 'Loading...',
  className = '',
  type = 'button',
  icon: Icon,
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={17} className="animate-spin" /> : Icon ? <Icon size={17} /> : null}
      {loading ? loadingText : children}
    </button>
  )
}

export function FormLoadingOverlay({ show, message = 'Saving changes...' }) {
  if (!show) return null

  return (
    <div className="absolute inset-0 z-20 grid place-items-center rounded-lg bg-white/70 backdrop-blur-sm dark:bg-slate-950/60">
      <div className="rounded-lg border border-white/70 bg-white px-5 py-4 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <Loader2 className="mx-auto animate-spin text-emerald-600" size={26} />
        <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{message}</p>
      </div>
    </div>
  )
}

export function MapLoading({ message = 'Getting GPS location...' }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-center">
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/20" />
          <span className="absolute h-14 w-14 animate-pulse rounded-full bg-emerald-400/20" />
          <MapPinned className="relative text-emerald-600" size={34} />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">{message}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Verifying office radius and route data.</p>
        <SkeletonBlock className="mt-5 h-28 w-full min-w-72" />
      </div>
    </div>
  )
}

export function ImageUploadLoading({ progress = 0, message = 'Uploading selfie...', preview }) {
  const pct = Math.max(0, Math.min(100, Number(progress) || 0))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          {preview && <img src={preview} alt="" className="h-full w-full object-cover blur-[2px]" />}
          <UploadCloud className="absolute animate-bounce text-emerald-600" size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{message}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Syncing to secure storage.</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs font-semibold text-emerald-600">{pct}%</p>
        </div>
      </div>
    </div>
  )
}

export function ExportLoadingModal({ show, message = 'Generating Excel report...' }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-white/60 bg-white p-6 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
          <FileSpreadsheet className="animate-pulse" size={30} />
        </div>
        <div className="mx-auto mt-5 h-10 w-10 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin dark:border-slate-800 dark:border-t-emerald-400" />
        <p className="mt-4 text-base font-bold text-slate-900 dark:text-white">{message}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Preparing a clean file for download.</p>
      </div>
    </div>
  )
}

export function TelegramTestLoading({ status = 'loading', message = 'Sending Telegram Message...' }) {
  const ok = status === 'success'
  const error = status === 'error'

  return (
    <div className={clsx(
      'rounded-lg border p-4 shadow-sm',
      ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-sky-200 bg-sky-50 text-sky-800',
    )}>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/80">
          {ok ? <CheckCircle2 size={22} /> : error ? <X size={22} /> : <Send className="animate-pulse" size={21} />}
        </div>
        <div>
          <p className="text-sm font-bold">{message}</p>
          <p className="text-xs opacity-80">{ok ? 'Message sent successfully.' : error ? 'Please check bot token and chat ID.' : 'Verifying bot connection.'}</p>
        </div>
        {!ok && !error && <Loader2 className="ml-auto animate-spin" size={18} />}
      </div>
    </div>
  )
}

export function MobileLoadingSheet({ show = true, message = 'Refreshing data...' }) {
  if (!show) return null

  return (
    <div className="fixed inset-x-3 bottom-20 z-40 rounded-lg border border-white/70 bg-white/90 p-4 shadow-2xl backdrop-blur sm:hidden dark:border-slate-700 dark:bg-slate-900/90">
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={20} />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{message}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pull-to-refresh state ready.</p>
        </div>
      </div>
    </div>
  )
}

export function FloatingSpinner({ message = 'Loading...' }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <Loader2 size={14} className="animate-spin text-emerald-600" />
      {message}
    </div>
  )
}


export function PanelHeader({ title, subtitle, actionLabel = 'Add New', onAction }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {onAction && actionLabel && (
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  )
}


export function DataPanel({ title, subtitle, columns, rows, actionLabel = 'Add New', onAction }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <PanelHeader title={title} subtitle={subtitle} actionLabel={actionLabel} onAction={onAction} />
      {rows.length === 0 ? <EmptyState text="No real records found yet." /> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>{columns.map((column) => <th key={column} className="px-5 py-3">{column}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row) => (
                <tr key={row.join('-')} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  {row.map((cell, index) => <td key={`${cell}-${index}`} className="px-5 py-4">{index === row.length - 1 ? <StatusPill status={String(cell)} /> : cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
