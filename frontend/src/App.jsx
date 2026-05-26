import { useCallback, useEffect, useRef, useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock,
  FileText,
  Home,
  Image,
  LogOut,
  MapPinned,
  Menu,
  Moon,
  User,
  Settings as SettingsIcon,
  ShoppingBag,
  Sun,
  Users,
  UserRound,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { api, attendanceService, authService, bootstrapService } from './services/api'
import DashboardPage from './pages/DashboardPage'
import AttendancePage from './pages/AttendancePage'
import EmployeesPage from './pages/EmployeesPage'
import BranchesPage from './pages/BranchesPage'
import DepartmentsPage from './pages/DepartmentsPage'
import PositionsPage from './pages/PositionsPage'
import UsersRolesPage from './pages/UsersRolesPage'
import OutdoorSalesPage from './pages/OutdoorSalesPage'
import CustomerVisitsPage from './pages/CustomerVisitsPage'
import ReportsPage from './pages/ReportsPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import SecurityPage from './pages/SecurityPage'
import BrandingPage from './pages/BrandingPage'
import PermissionRequestsPage from './pages/PermissionRequestsPage'
import AttendanceHistoryPage from './pages/AttendanceHistoryPage'
import AdminAttendanceReportsPage from './pages/AdminAttendanceReportsPage'
import MyAttendanceReportsPage from './pages/MyAttendanceReportsPage'
import LoginPage from './pages/LoginPage'
import MobileNav from './components/layout/MobileNav'
import AttendanceActionModal from './components/attendance/AttendanceActionModal'
import EmployeeModal from './components/employees/EmployeeModal'
import VisitModal from './components/visits/VisitModal'
import ReportModal from './components/reports/ReportModal'
import { FloatingSpinner, LoadingScreen, SummaryRow } from './components/shared/UI'
import { applyDocumentBranding } from './utils/branding'
import { canAccess, formatTime, userDisplayName } from './utils/format'

const sidebarMainItems = [
  { label: 'Dashboard', target: 'Dashboard', icon: Home, permissions: ['dashboard.admin', 'dashboard.employee'] },
  { label: 'Customer Visits', target: 'Customer Visits', icon: ShoppingBag, permissions: ['visits.view', 'visits.create', 'visits.manage'] },
  { label: 'Reports', target: 'Reports', icon: FileText, permissions: ['reports.create', 'reports.view_own', 'reports.view_all', 'reports.export'] },
  { label: 'Route Map', target: 'Route Map', icon: MapPinned, permissions: ['gps.view', 'gps.live', 'gps.history'] },
  { label: 'Profile', target: 'Profile', icon: UserRound, permissions: ['profile.update_own', 'profile.update_all', 'dashboard.admin', 'dashboard.employee'] },
  { label: 'Notifications', target: 'Notifications', icon: Bell, permissions: ['notifications.view', 'notifications.manage'] },
]

const attendanceSubItems = [
  { label: 'All Attendance', target: 'Attendance History', activeTargets: ['Attendance History'], permissions: ['attendance.view_all'] },
  { label: 'Attendance Reports', target: 'Admin Attendance Reports', activeTargets: ['Admin Attendance Reports'], permissions: ['reports.attendance.view_all', 'attendance.view_all'] },
  { label: 'My Attendance Reports', target: 'My Attendance Reports', activeTargets: ['My Attendance Reports'], permissions: ['reports.attendance.view_own', 'attendance.view_own'] },
  { label: 'Attendance Requests', target: 'Permission Requests', activeTargets: ['Permission Requests'], permissions: ['requests.view_all', 'requests.view_own', 'requests.create', 'requests.approve'] },
]

const ATTENDANCE_TARGETS = new Set(['Check In / Out', 'Attendance History', 'Admin Attendance Reports', 'My Attendance Reports', 'Permission Requests'])

const rolePermissionSubItems = [
  { label: 'Set Permissions', target: 'Roles & Permissions', activeTargets: ['Roles & Permissions', 'Users & Roles'], permissions: ['roles.manage', 'permissions.manage'] },
  { label: 'Roles', target: 'Roles', activeTargets: ['Roles'], permissions: ['roles.manage'] },
  { label: 'Permissions', target: 'Permissions', activeTargets: ['Permissions'], permissions: ['permissions.manage'] },
  { label: 'IP Access', target: 'IP Access', activeTargets: ['IP Access'], permissions: ['roles.manage'] },
]

const ROLE_PERMISSION_TARGETS = new Set(['Roles & Permissions', 'Users & Roles', 'Roles', 'Permissions', 'IP Access'])

const sidebarManageItems = [
  { label: 'Employees', target: 'Employees', icon: Users, permissions: ['employees.view'] },
  { label: 'Branches', target: 'Branches', icon: Building2, permissions: ['departments.manage'] },
  { label: 'Departments', target: 'Departments', icon: Building2, permissions: ['departments.view', 'departments.manage'] },
  { label: 'Positions', target: 'Positions', icon: BriefcaseBusiness, permissions: ['positions.view', 'positions.manage'] },
  { label: 'Outdoor Sales', target: 'Outdoor Sales', icon: MapPinned, permissions: ['sales.view', 'sales.manage'] },
  { label: 'Website Branding', target: 'Website Branding', icon: Image, permissions: ['settings.manage'] },
  { label: 'Roles & Permissions', target: 'Roles & Permissions', icon: Users, permissions: ['roles.manage', 'permissions.manage'] },
  { label: 'Settings', target: 'Settings', icon: SettingsIcon, permissions: ['settings.view', 'settings.security', 'settings.api', 'settings.manage', 'settings.schedules', 'roles.manage'] },
]

function GoogleMapsApp({ apiKey, initialBranding }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  })

  return <AppShell isLoaded={isLoaded} initialBranding={initialBranding} />
}

function AppShell({ isLoaded, initialBranding = {} }) {
  const [active, setActive] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [rolesOpen, setRolesOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('attendance_theme') === 'dark')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem('attendance_token')))
  const [attendanceAction, setAttendanceAction] = useState(null)
  const [pendingRequestType, setPendingRequestType] = useState(null)
  const [modal, setModal] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const bootstrapRequestRef = useRef(null)
  const [data, setData] = useState({
    dashboard: null,
    todayAttendance: null,
    attendance: [],
    employees: [],
    visits: [],
    reports: [],
    notifications: [],
    appSettings: initialBranding,
    loading: false,
  })

  const loadRealData = useCallback(async (account) => {
    setData((current) => ({ ...current, loading: true }))

    try {
      if (!bootstrapRequestRef.current) {
        bootstrapRequestRef.current = bootstrapService.load().finally(() => {
          bootstrapRequestRef.current = null
        })
      }

      const payload = await bootstrapRequestRef.current
      setData({
        dashboard: payload.dashboard ?? null,
        todayAttendance: payload.todayAttendance ?? null,
        attendance: payload.attendance ?? [],
        employees: payload.employees ?? [],
        visits: payload.visits ?? [],
        reports: payload.reports ?? [],
        notifications: payload.notifications ?? [],
        appSettings: payload.appSettings ?? {},
        loading: false,
      })
    } catch (error) {
      setData((current) => ({ ...current, loading: false }))
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('attendance_token')) return

    let mounted = true

    authService
      .me()
      .then((account) => {
        if (!mounted) return
        setUser(account)
        loadRealData(account)
      })
      .catch(() => localStorage.removeItem('attendance_token'))
      .finally(() => {
        if (mounted) setAuthLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [loadRealData])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('attendance_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    applyDocumentBranding(data.appSettings || {})
  }, [data.appSettings?.company_icon_url, data.appSettings?.company_logo_url, data.appSettings?.company_name, data.appSettings?.site_title])

  useEffect(() => {
    if (!userMenuOpen) return

    const close = () => setUserMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [userMenuOpen])

  const handleLogin = (account) => {
    setUser(account)
    loadRealData(account)
  }

  const refreshUser = useCallback(async () => {
    const account = await authService.me()
    setUser(account)
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
    setActive('Dashboard')
  }

  const toggleTheme = () => {
    setDark((value) => !value)
  }

  const openAttendanceAction = (type) => {
    setAttendanceAction(type)
  }

  const openPermissionRequest = (type) => {
    setPendingRequestType(type)
    setActive('Permission Requests')
  }

  const props = {
    appData: data,
    isLoaded,
    refresh: () => loadRealData(user),
    user,
    onAttendanceAction: openAttendanceAction,
    openPermissionRequest,
    pendingRequestType,
    onClearPendingRequest: () => setPendingRequestType(null),
    setActive,
    setModal,
    setEditingEmployee,
    onLogout: handleLogout,
    onProfileUpdated: refreshUser,
  }
  const filteredAttendanceSubItems = attendanceSubItems.filter((item) => canAccess(user, item.permissions))
  const isAttendanceExpanded = attendanceOpen || ATTENDANCE_TARGETS.has(active)
  const filteredRolePermissionSubItems = rolePermissionSubItems.filter((item) => canAccess(user, item.permissions))
  const isRolesExpanded = rolesOpen || ROLE_PERMISSION_TARGETS.has(active)
  const pages = {
    Dashboard: <DashboardPage {...props} />,
    'Check In / Out': <AttendancePage {...props} />,
    'Customer Visits': <CustomerVisitsPage user={user} appData={data} setModal={setModal} />,
    'Daily Reports': <ReportsPage {...props} />,
    'My Reports': <ReportsPage {...props} />,
    'Permission Requests': <PermissionRequestsPage {...props} />,
    'Route Map': <OutdoorSalesPage {...props} />,
    'Outdoor Check In': <AttendancePage {...props} />,
    'Outdoor Check Out': <AttendancePage {...props} />,
    Notifications: <NotificationsPage {...props} />,
    Profile: <ProfilePage {...props} />,
    'Website Branding': <BrandingPage {...props} />,
    Settings: <SecurityPage refresh={() => loadRealData(user)} />,
    'Help & Support': <SecurityPage refresh={() => loadRealData(user)} />,
    'Attendance History': <AttendanceHistoryPage {...props} viewMode="all" />,
    'Admin Attendance Reports': <AdminAttendanceReportsPage {...props} />,
    'My Attendance Reports': <MyAttendanceReportsPage {...props} />,
    Employees: <EmployeesPage {...props} />,
    Branches: <BranchesPage />,
    Departments: <DepartmentsPage />,
    Positions: <PositionsPage />,
    'Users & Roles': <UsersRolesPage initialTab="assign" />,
    'Roles & Permissions': <UsersRolesPage initialTab="assign" />,
    Roles: <UsersRolesPage initialTab="roles" />,
    Permissions: <UsersRolesPage initialTab="permissions" />,
    'IP Access': <UsersRolesPage initialTab="ip" />,
    'Outdoor Sales': <OutdoorSalesPage {...props} />,
    Reports: <ReportsPage {...props} />,
    Security: <SecurityPage refresh={() => loadRealData(user)} />,
  }

  if (authLoading) return <LoadingScreen />
  if (!user) return <LoginPage dark={dark} onToggleDark={toggleTheme} onLogin={handleLogin} />

  const employee = user.employee
  const displayName = userDisplayName(user)
  const roleName = employee?.position?.name || user.role?.name || 'Employee'
  const pageTitle = active === 'Outdoor Sales' ? 'Outdoor Sales Tracking' : active
  const unreadCount = data.notifications.filter((item) => !item.read_at).length
  const mainSidebarItems = sidebarMainItems.filter((item) => canAccess(user, item.permissions))
  const manageSidebarItems = sidebarManageItems.filter((item) => canAccess(user, item.permissions))
  const canSeeNotifications = canAccess(user, ['notifications.view', 'notifications.manage'])
  const today = data.todayAttendance
  const companyName = data.appSettings?.company_name || 'SalesTrack'
  const companyLogoUrl = data.appSettings?.company_logo_url || ''

  return (
    <div className={clsx(dark && 'dark')}>
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto bg-[#071927] text-white shadow-xl transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0',
        )}>
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt={companyName} className="h-12 w-12 rounded-lg object-cover shadow-lg" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-950/25">
                  <Activity size={22} />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight">{companyName}</h1>
                <p className="text-xs text-slate-300">Employee Panel</p>
              </div>
            </div>
            <button className="rounded-lg p-2 text-slate-300 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-4 pb-5">
            {mainSidebarItems.map((item) => (
              <SidebarButton
                key={item.target}
                item={item}
                active={active}
                unreadCount={unreadCount}
                onClick={() => {
                  setActive(item.target)
                  setSidebarOpen(false)
                }}
              />
            ))}

            {filteredAttendanceSubItems.length > 0 && (
              <SidebarAccordion
                label="Attendance"
                icon={Clock}
                isOpen={isAttendanceExpanded}
                onToggle={() => setAttendanceOpen((v) => !v)}
              >
                {filteredAttendanceSubItems.map((item) => (
                  <SidebarGroupItem
                    key={item.label}
                    label={item.label}
                    isActive={item.activeTargets.includes(active)}
                    onClick={() => {
                      if (item.requestType) {
                        openPermissionRequest(item.requestType)
                      } else {
                        setActive(item.target)
                      }
                      setSidebarOpen(false)
                    }}
                  />
                ))}
              </SidebarAccordion>
            )}

            {manageSidebarItems.length > 0 && <div className="my-4 border-t border-white/10" />}

            {manageSidebarItems.map((item) => (
              item.target === 'Roles & Permissions' && filteredRolePermissionSubItems.length > 0 ? (
                <SidebarAccordion
                  key={item.target}
                  label="Roles & Permissions"
                  icon={Users}
                  isOpen={isRolesExpanded}
                  onToggle={() => setRolesOpen((v) => !v)}
                >
                  {filteredRolePermissionSubItems.map((subItem) => (
                    <SidebarGroupItem
                      key={subItem.target}
                      label={subItem.label}
                      isActive={subItem.activeTargets.includes(active)}
                      onClick={() => {
                        setActive(subItem.target)
                        setRolesOpen(true)
                        setSidebarOpen(false)
                      }}
                    />
                  ))}
                </SidebarAccordion>
              ) : (
                <SidebarButton
                  key={item.target}
                  item={item}
                  active={active}
                  withChevron={false}
                  onClick={() => {
                    setActive(item.target)
                    setSidebarOpen(false)
                  }}
                />
              )
            ))}
          </nav>

          <div className="px-4 pb-5">
            <div className="rounded-lg bg-white/8 p-4 text-sm shadow-inner shadow-white/5">
              <p className="font-bold">Today's Summary</p>
              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <SummaryRow label="Check In" value={formatTime(today?.check_in_at)} />
                <SummaryRow label="Check Out" value={formatTime(today?.check_out_at)} />
                <SummaryRow label="Total Visits" value={String(data.visits.length)} />
                <SummaryRow label="Working Minutes" value={today?.work_minutes ? `${today.work_minutes} min` : '-'} />
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className={clsx('transition-all duration-300', sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72')}>
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-200/30 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <button className="rounded-lg p-2 text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu size={22} />
                </button>
                <button className="hidden rounded-lg p-2 text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900 lg:block" onClick={() => setSidebarCollapsed((v) => !v)} title="Toggle sidebar">
                  <Menu size={22} />
                </button>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-slate-950 dark:text-white">{pageTitle}</h2>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {canSeeNotifications && (
                  <button className="relative grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" onClick={() => setActive('Notifications')}>
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">{unreadCount}</span>}
                  </button>
                )}
                <button
                  className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={toggleTheme}
                  type="button"
                  title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                  aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {dark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative hidden sm:block">
                  <button
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={(event) => {
                      event.stopPropagation()
                      setUserMenuOpen((value) => !value)
                    }}
                    type="button"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <UserAvatar name={displayName} photo={employee?.photo_url} />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-950 dark:text-white">{displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{roleName}</p>
                    </div>
                    <ChevronDown size={18} className={clsx('text-slate-500 transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-900"
                      onClick={(event) => event.stopPropagation()}
                      role="menu"
                    >
                      <div className="px-5 py-4">
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">{displayName}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{roleName}</p>
                      </div>
                      <div className="border-t border-slate-200 py-2 dark:border-slate-800">
                        <button
                          className="flex w-full items-center gap-4 px-5 py-3 text-left text-lg text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                          onClick={() => {
                            setActive('Profile')
                            setUserMenuOpen(false)
                          }}
                          type="button"
                          role="menuitem"
                        >
                          <User size={22} />
                          Profile
                        </button>
                        <button
                          className="flex w-full items-center gap-4 px-5 py-3 text-left text-lg text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                          onClick={handleLogout}
                          type="button"
                          role="menuitem"
                        >
                          <LogOut size={22} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-6 p-4 pb-24 sm:p-8 lg:pb-8">
            {data.loading && <FloatingSpinner message="Refreshing live data..." />}
            {pages[active]}
          </section>
          <MobileNav active={active} setActive={setActive} user={user} onAttendanceAction={openAttendanceAction} todayAttendance={data.todayAttendance} />
        </main>
      </div>

      {modal === 'employee' && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setModal(null)
            setEditingEmployee(null)
          }}
          onSaved={(options = {}) => {
            if (!options.keepOpen) {
              setModal(null)
              setEditingEmployee(null)
            }
            loadRealData(user)
          }}
        />
      )}
      {modal === 'visit' && <VisitModal onClose={() => setModal(null)} onSaved={() => { setModal(null); loadRealData(user) }} />}
      {modal === 'report' && <ReportModal onClose={() => setModal(null)} onSaved={() => { setModal(null); loadRealData(user) }} />}
      {attendanceAction && (
        <AttendanceActionModal
          action={attendanceAction}
          user={user}
          onClose={() => setAttendanceAction(null)}
          openPermissionRequest={openPermissionRequest}
          onSaved={() => {
            setAttendanceAction(null)
            loadRealData(user)
          }}
        />
      )}
    </div>
  )
}

function App({ initialBranding = {} }) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()

  if (!googleMapsApiKey) {
    return <AppShell isLoaded={false} initialBranding={initialBranding} />
  }

  return <GoogleMapsApp apiKey={googleMapsApiKey} initialBranding={initialBranding} />
}

function SidebarButton({ item, active, unreadCount = 0, withChevron = false, onClick }) {
  const isActive = active === item.target

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition',
        isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/25' : 'text-slate-200 hover:bg-white/10 hover:text-white',
      )}
    >
      <span className="flex items-center gap-3">
        <item.icon size={18} />
        {item.label}
      </span>
      {item.label === 'Notifications' && unreadCount > 0 ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[11px] font-bold text-white">{unreadCount}</span>
      ) : withChevron ? (
        <ChevronDown size={15} className="text-slate-400" />
      ) : null}
    </button>
  )
}

function SidebarAccordion({ label, icon: Icon, isOpen, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {label}
        </span>
        <ChevronDown size={15} className={clsx('text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="ml-7 mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

function SidebarGroupItem({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition',
        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200',
      )}
    >
      <span className={clsx('h-2 w-2 shrink-0 rounded-full', isActive ? 'bg-emerald-400' : 'bg-slate-500')} />
      {label}
    </button>
  )
}

function UserAvatar({ name, photo, size = 'md' }) {
  const initialsText = String(name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const sizeClass = size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm'

  return (
    <div className={clsx('relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-white ring-2 ring-white/10', sizeClass)}>
      {photo ? <img className="h-full w-full object-cover" src={photo} alt={name} /> : initialsText}
      <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
    </div>
  )
}

export default App
