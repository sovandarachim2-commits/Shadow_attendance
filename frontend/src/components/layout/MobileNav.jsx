import clsx from 'clsx'
import { CalendarCheck, CheckCircle2, FileCheck2, Hand, Home, Menu, UserRound } from 'lucide-react'
import { canAccess } from '../../utils/format'

export default function MobileNav({ active, setActive, user, onAttendanceAction, todayAttendance, onOpenMenu }) {
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

  const slotItems = [
    {
      key: 'menu',
      label: 'Menu',
      icon: Menu,
      isActive: false,
      show: Boolean(onOpenMenu),
      onClick: onOpenMenu,
    },
    {
      key: 'home',
      label: 'Home',
      target: 'Dashboard',
      icon: Home,
      isActive: active === 'Dashboard',
      show: canAccess(user, ['dashboard.admin', 'dashboard.employee']),
      onClick: () => setActive('Dashboard'),
    },
    {
      key: 'attendance',
      label: 'Attendance',
      target: 'My Attendance Reports',
      icon: CalendarCheck,
      isActive: isAttendanceActive,
      show: canAccess(user, ['reports.attendance.view_own', 'attendance.view_own']),
      onClick: () => setActive('My Attendance Reports'),
    },
    null,
    {
      key: 'requests',
      label: 'Requests',
      target: 'Permission Requests',
      icon: FileCheck2,
      isActive: active === 'Permission Requests',
      show: canAccess(user, ['requests.view_all', 'requests.view_own', 'requests.create', 'requests.approve']),
      onClick: () => setActive('Permission Requests'),
    },
    {
      key: 'profile',
      label: 'Profile',
      target: 'Profile',
      icon: UserRound,
      isActive: active === 'Profile',
      show: canAccess(user, ['profile.update_own', 'profile.update_all', 'dashboard.admin', 'dashboard.employee']),
      onClick: () => setActive('Profile'),
    },
  ]

  const leftSlots = [slotItems[0], slotItems[1], slotItems[2]]
  const rightSlots = [slotItems[4], slotItems[5]]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden" aria-label="Mobile navigation">
      <div className="rounded-t-[28px] border-t border-slate-100 bg-white/95 shadow-[0_-8px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/95">
        <div
          className="grid grid-cols-5 items-end gap-0 px-1 pt-2"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          {leftSlots.map((item, i) => (
            <NavSlot key={item?.key || `left-empty-${i}`} item={item} />
          ))}

          <div className="flex flex-col items-center justify-end pb-1">
            <button
              type="button"
              disabled={completed}
              onClick={() => !completed && onAttendanceAction(nextAction)}
              className="flex flex-col items-center gap-1 disabled:opacity-60"
              aria-label={centerLabel}
            >
              <span
                className={clsx(
                  'grid h-[56px] w-[56px] -translate-y-4 place-items-center rounded-full text-white ring-4 ring-white transition-all duration-200 active:scale-95 dark:ring-slate-900 sm:h-[60px] sm:w-[60px] sm:-translate-y-5',
                  'shadow-[0_8px_28px_-4px]',
                  fabClass,
                )}
              >
                {completed ? <CheckCircle2 size={24} strokeWidth={2} /> : <Hand size={24} strokeWidth={1.6} />}
              </span>
              <span className={clsx('mt-[-12px] text-[10px] font-bold tracking-wide sm:mt-[-14px]', fabLabelColor)}>
                {centerLabel}
              </span>
            </button>
          </div>

          {rightSlots.map((item, i) => (
            <NavSlot key={item?.key || `right-empty-${i}`} item={item} />
          ))}
        </div>
      </div>
    </nav>
  )
}

function NavSlot({ item }) {
  if (!item?.show) {
    return <div className="min-h-[52px]" aria-hidden />
  }

  return <NavItem item={item} onClick={item.onClick} />
}

function NavItem({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full flex-col items-center gap-1 px-0.5 pb-1 pt-3 transition-all duration-150 active:scale-95"
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
