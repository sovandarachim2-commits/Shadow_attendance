import clsx from 'clsx'
import { CalendarCheck, CheckCircle2, FileCheck2, Hand, Home, UserRound } from 'lucide-react'
import { canAccess } from '../../utils/format'

export default function MobileNav({ active, setActive, user, onAttendanceAction, todayAttendance }) {
  const checkedIn = Boolean(todayAttendance?.check_in_at)
  const completed = Boolean(todayAttendance?.check_out_at)
  const nextAction = checkedIn && !completed ? 'check-out' : 'check-in'
  const centerLabel = completed ? 'Done' : checkedIn ? 'Check Out' : 'Check In'

  const fabClass = completed
    ? 'bg-slate-400 shadow-slate-400/40'
    : checkedIn
      ? 'bg-amber-500 shadow-amber-500/50'
      : 'bg-emerald-500 shadow-emerald-500/50'

  const fabLabelColor = completed
    ? 'text-slate-400'
    : checkedIn
    ? 'text-amber-500'
    : 'text-emerald-600'

  const isAttendanceActive = active === 'My Attendance Reports'

  const leftItems = [
    { label: 'Home',       target: 'Dashboard',          icon: Home,          isActive: active === 'Dashboard',          permissions: ['dashboard.admin', 'dashboard.employee'] },
    { label: 'Attendance', target: 'My Attendance Reports', icon: CalendarCheck, isActive: isAttendanceActive,             permissions: ['reports.attendance.view_own', 'attendance.view_own'] },
  ].filter((item) => canAccess(user, item.permissions))

  const rightItems = [
    { label: 'Requests', target: 'Permission Requests', icon: FileCheck2, isActive: active === 'Permission Requests', permissions: ['requests.view_all', 'requests.view_own', 'requests.create', 'requests.approve'] },
    { label: 'Profile',  target: 'Profile',             icon: UserRound,  isActive: active === 'Profile',             permissions: ['profile.update_own', 'profile.update_all', 'dashboard.admin', 'dashboard.employee'] },
  ].filter((item) => canAccess(user, item.permissions))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <div className="rounded-t-[28px] border-t border-slate-100 bg-white/95 shadow-[0_-8px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/95">
        <div className="flex items-end px-4 pb-6">

          {/* Left items */}
          {leftItems.map((item) => (
            <NavItem key={item.label} item={item} onClick={() => setActive(item.target)} />
          ))}

          {/* Center FAB — floats up via negative margin */}
          <button
            disabled={completed}
            onClick={() => !completed && onAttendanceAction(nextAction)}
            className="mx-auto flex flex-col items-center gap-1.5 pb-1 disabled:opacity-60"
          >
            <span className={clsx(
              'grid h-[60px] w-[60px] -translate-y-5 place-items-center rounded-full text-white ring-4 ring-white transition-all duration-200 active:scale-95 dark:ring-slate-900',
              'shadow-[0_8px_28px_-4px]',
              fabClass,
            )}>
              {completed ? <CheckCircle2 size={26} strokeWidth={2} /> : <Hand size={26} strokeWidth={1.6} />}
            </span>
            <span className={clsx('mt-[-14px] text-[10px] font-bold tracking-wide', fabLabelColor)}>
              {centerLabel}
            </span>
          </button>

          {/* Right items */}
          {rightItems.map((item) => (
            <NavItem key={item.label} item={item} onClick={() => setActive(item.target)} />
          ))}

        </div>
      </div>
    </nav>
  )
}

function NavItem({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-1 flex-col items-center gap-1 px-1 pb-1 pt-4 transition-all duration-150 active:scale-95"
    >
      {/* top active indicator */}
      <span className={clsx(
        'absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full transition-all duration-200',
        item.isActive ? 'bg-emerald-500 opacity-100' : 'opacity-0',
      )} />

      {/* icon */}
      <item.icon
        size={22}
        strokeWidth={item.isActive ? 2.3 : 1.8}
        className={clsx(
          'transition-colors duration-150',
          item.isActive ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500',
        )}
      />

      {/* label */}
      <span className={clsx(
        'text-[10px] font-semibold tracking-tight transition-colors duration-150',
        item.isActive ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500',
      )}>
        {item.label}
      </span>
    </button>
  )
}
