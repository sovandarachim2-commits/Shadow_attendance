/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Globe,
  Laptop,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Smartphone,
  User,
  Users,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { userActivityService } from '../services/api'
import { EmptyState, FloatingSpinner } from '../components/shared/UI'

const MODULE_OPTIONS = [
  { value: '', label: 'All Modules' },
  { value: 'auth', label: 'Authentication' },
  { value: 'employee', label: 'Employee' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'leave', label: 'Leave & Requests' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'administration', label: 'Administration' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'warning', label: 'Warning' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'hr_staff', label: 'HR Staff' },
  { value: 'manager', label: 'Manager' },
  { value: 'office_staff', label: 'Office Staff' },
  { value: 'outdoor_sales', label: 'Outdoor Sales' },
]

function parseBrowserDevice(userAgent) {
  if (!userAgent) return { device: 'Unknown', browser: 'Unknown', isMobile: false }
  const ua = userAgent.toLowerCase()
  const isMobile = /mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)
  const isTablet = /ipad|android(?!.*mobile)/i.test(ua)

  let device = 'Desktop'
  if (isMobile) device = 'Mobile'
  else if (isTablet) device = 'Tablet'

  let browser = 'Browser'
  if (ua.includes('edg/')) browser = 'Edge'
  else if (ua.includes('chrome/')) browser = 'Chrome'
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari'
  else if (ua.includes('firefox/')) browser = 'Firefox'
  else if (ua.includes('opera/') || ua.includes('opr/')) browser = 'Opera'

  return { device, browser, isMobile: isMobile || isTablet }
}

function formatModule(module) {
  switch (module) {
    case 'auth': return { label: 'Auth', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' }
    case 'employee': return { label: 'Employee', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' }
    case 'attendance': return { label: 'Attendance', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' }
    case 'leave': return { label: 'Leave', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' }
    case 'payroll': return { label: 'Payroll', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' }
    case 'administration': return { label: 'Admin', color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800' }
    default: return { label: module || 'General', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
  }
}

function formatStatus(status) {
  switch (status) {
    case 'success':
      return {
        label: 'Success',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      }
    case 'failed':
      return {
        label: 'Failed',
        badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
      }
    case 'warning':
      return {
        label: 'Warning',
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
      }
    default:
      return {
        label: status || 'Info',
        badge: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
      }
  }
}

export default function UserActivityPage() {
  const [activities, setActivities] = useState([])
  const [summary, setSummary] = useState({
    total_today: 0,
    active_users_today: 0,
    successful_logins: 0,
    failed_logins: 0,
    security_events: 0,
  })
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  // Pagination state
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [totalRecords, setTotalRecords] = useState(0)
  const [lastPage, setLastPage] = useState(1)

  // Filter state
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Drawer detail modal state
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Load KPI Summary
  const loadSummary = useCallback(async () => {
    try {
      setSummaryLoading(true)
      const data = await userActivityService.summary()
      setSummary(data)
    } catch (e) {
      console.error('Failed to load activity summary', e)
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  // Load Activity List
  const loadActivities = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const params = {
        page,
        per_page: perPage,
        search: search.trim() || undefined,
        role: selectedRole || undefined,
        module: selectedModule || undefined,
        status: selectedStatus || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }

      const res = await userActivityService.list(params)
      setActivities(res.data || [])
      setTotalRecords(res.total || 0)
      setLastPage(res.last_page || 1)
    } catch (e) {
      console.error('Failed to load user activities', e)
      if (e.response?.status === 403) {
        setError('403 Forbidden: Only Super Admin is authorized to access User Activity audit logs.')
      } else {
        setError(e.response?.data?.message || 'Failed to load user activity records.')
      }
    } finally {
      setLoading(false)
    }
  }, [page, perPage, search, selectedRole, selectedModule, selectedStatus, dateFrom, dateTo])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  // Handle Export CSV
  const handleExport = async () => {
    try {
      setExporting(true)
      const params = {
        search: search.trim() || undefined,
        role: selectedRole || undefined,
        module: selectedModule || undefined,
        status: selectedStatus || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }
      const blob = await userActivityService.export(params)
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv;charset=utf-8;' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `user_activities_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to export activity records', e)
      alert(e.response?.data?.message || 'Failed to export CSV. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  // Handle Clear Filters
  const handleResetFilters = () => {
    setSearch('')
    setSelectedRole('')
    setSelectedModule('')
    setSelectedStatus('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const hasActiveFilters = Boolean(
    search || selectedRole || selectedModule || selectedStatus || dateFrom || dateTo
  )

  const openDrawer = (activity) => {
    setSelectedActivity(activity)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedActivity(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-600/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                User Activity & Audit Logs
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Super Admin exclusive security and operational activity monitoring
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loadSummary()
              loadActivities()
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            title="Refresh logs"
          >
            <RefreshCw className={clsx('h-3.5 w-3.5', loading && 'animate-spin')} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExport}
            disabled={exporting || totalRecords === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-50"
          >
            <Download className={clsx('h-3.5 w-3.5', exporting && 'animate-bounce')} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertOctagon className="h-5 w-5 shrink-0 text-rose-600" />
          <p className="flex-1 font-medium">{error}</p>
          <button
            onClick={loadActivities}
            className="rounded border border-rose-300 px-2 py-1 text-xs font-semibold hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/50"
          >
            Retry
          </button>
        </div>
      )}

      {/* 5 KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Total Activities Today */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Today</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {summaryLoading ? '...' : Number(summary.total_today).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">System actions recorded</p>
        </div>

        {/* Active Users Today */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Users</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {summaryLoading ? '...' : Number(summary.active_users_today).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Distinct active users today</p>
        </div>

        {/* Successful Logins */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Successful Logins</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {summaryLoading ? '...' : Number(summary.successful_logins).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Authenticated sessions</p>
        </div>

        {/* Failed Login Attempts */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Failed Logins</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className={clsx(
            'mt-2 text-2xl font-bold tracking-tight',
            summary.failed_logins > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
          )}>
            {summaryLoading ? '...' : Number(summary.failed_logins).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Invalid attempts</p>
        </div>

        {/* Security Events */}
        <div className="col-span-2 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:col-span-1 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Security Events</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </div>
          <p className={clsx(
            'mt-2 text-2xl font-bold tracking-tight',
            summary.security_events > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
          )}>
            {summaryLoading ? '...' : Number(summary.security_events).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Warnings & role modifications</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, description, IP address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-violet-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setPage(1)
                }}
                className="bg-transparent text-xs text-slate-700 outline-none dark:text-slate-200"
                title="From Date"
              />
              <span className="text-slate-300 dark:text-slate-600">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setPage(1)
                }}
                className="bg-transparent text-xs text-slate-700 outline-none dark:text-slate-200"
                title="To Date"
              />
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Activity Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="py-3 pl-4 pr-2 w-12 text-center">No.</th>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-3 min-w-[200px]">Description</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3">Device / Browser</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 pl-2 pr-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="11" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-violet-600" />
                      <span className="text-xs font-medium">Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Activity className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        No activity records found
                      </span>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters ? 'Try adjusting your search filters.' : 'System activities will appear here as users perform actions.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((item, idx) => {
                  const mod = formatModule(item.module)
                  const st = formatStatus(item.status)
                  const client = parseBrowserDevice(item.user_agent)
                  const rowNumber = (page - 1) * perPage + idx + 1

                  return (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* No. */}
                      <td className="py-3 pl-4 pr-2 text-center font-mono text-[11px] text-slate-400">
                        {rowNumber}
                      </td>

                      {/* User */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.user ? (
                              item.user.name.slice(0, 2).toUpperCase()
                            ) : (
                              <User className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {item.user?.name || 'System / Guest'}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {item.user?.email || (item.user_id ? `User #${item.user_id}` : '-')}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {item.user?.role?.name || (item.user_id ? 'Standard' : 'System')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          {item.action}
                        </span>
                      </td>

                      {/* Module */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
                          mod.color
                        )}>
                          {mod.label}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3">
                        <p className="max-w-md truncate text-slate-600 dark:text-slate-300" title={item.description}>
                          {item.description}
                        </p>
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {item.ip_address || '-'}
                      </td>

                      {/* Device / Browser */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5" title={item.user_agent}>
                          {client.isMobile ? (
                            <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <Laptop className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          <span className="text-[11px]">
                            {client.browser} · {client.device}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={clsx(
                          'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                          st.badge
                        )}>
                          <span className={clsx('h-1.5 w-1.5 rounded-full', st.dot)} />
                          {st.label}
                        </span>
                      </td>

                      {/* Details Button */}
                      <td className="py-3 pl-2 pr-4 text-right">
                        <button
                          onClick={() => openDrawer(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:flex-row dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Rows per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value))
                setPage(1)
              }}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>
              Showing {activities.length > 0 ? (page - 1) * perPage + 1 : 0} to{' '}
              {Math.min(page * perPage, totalRecords)} of {totalRecords.toLocaleString()} entries
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              Page {page} of {lastPage || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Activity Detail Drawer */}
      {drawerOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity">
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl dark:bg-slate-900 flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Activity Details #{selectedActivity.id}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {selectedActivity.action}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeDrawer}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Status banner */}
                <div className={clsx(
                  'flex items-center justify-between rounded-xl border p-3 text-xs',
                  formatStatus(selectedActivity.status).badge
                )}>
                  <div className="flex items-center gap-2">
                    <span className={clsx('h-2 w-2 rounded-full', formatStatus(selectedActivity.status).dot)} />
                    <span className="font-semibold uppercase tracking-wider">
                      Status: {selectedActivity.status}
                    </span>
                  </div>
                  <span className="font-mono text-[11px]">
                    {selectedActivity.created_at ? new Date(selectedActivity.created_at).toLocaleString() : '-'}
                  </span>
                </div>

                {/* Actor Info Card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Actor Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px]">User Name</span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {selectedActivity.user?.name || 'System / Unauthenticated'}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px]">Role</span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {selectedActivity.user?.role?.name || (selectedActivity.user_id ? 'Standard User' : 'System')}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px]">Email</span>
                      <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                        {selectedActivity.user?.email || '-'}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px]">User ID</span>
                      <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                        {selectedActivity.user_id ?? 'None'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Details Card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Event Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px]">Module</span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {selectedActivity.module}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px]">Action</span>
                      <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                        {selectedActivity.action}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px]">Record Target</span>
                      <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                        {selectedActivity.record_type ? `${selectedActivity.record_type} #${selectedActivity.record_id || ''}` : '-'}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px]">IP Address</span>
                      <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                        {selectedActivity.ip_address || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[11px]">Description</span>
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      {selectedActivity.description}
                    </p>
                  </div>

                  {selectedActivity.user_agent && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 text-[11px]">Client User Agent</span>
                      <p className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                        {selectedActivity.user_agent}
                      </p>
                    </div>
                  )}
                </div>

                {/* Diff / Value Inspection */}
                {(selectedActivity.old_values || selectedActivity.new_values) && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Data Changes & State Diffs
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* Old Values */}
                      <div>
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                          Previous Values (Old)
                        </span>
                        <div className="mt-1.5 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          {selectedActivity.old_values ? (
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(selectedActivity.old_values, null, 2)}
                            </pre>
                          ) : (
                            <span className="italic text-slate-400">No previous state recorded</span>
                          )}
                        </div>
                      </div>

                      {/* New Values */}
                      <div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Updated Values (New)
                        </span>
                        <div className="mt-1.5 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          {selectedActivity.new_values ? (
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(selectedActivity.new_values, null, 2)}
                            </pre>
                          ) : (
                            <span className="italic text-slate-400">No new state recorded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 flex justify-end">
                <button
                  onClick={closeDrawer}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
