import { useMemo, useState } from 'react'
import { Download, FileText, Plus, Search } from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { EmptyState, InfoCard, StatusPill } from '../components/shared/UI'
import { canAccess, employeeFullName, formatDate, formatTime, titleCase } from '../utils/format'

const reportTypes = [
  { value: '', label: 'All Types' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'visit', label: 'Visit' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'reviewed', label: 'Reviewed' },
]

export default function ReportsPage({ appData, setModal, user }) {
  const [filters, setFilters] = useState({ date: '', type: '', status: '', search: '' })
  const [exporting, setExporting] = useState(false)

  const canSubmitReport   = canAccess(user, ['reports.create'])
  const canExportReports  = canAccess(user, ['reports.export'])
  const canViewAllReports = canAccess(user, ['reports.view_all'])

  const reports = appData.reports || []

  const filteredReports = useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return reports.filter((report) => {
      if (filters.date && report.report_date?.slice(0, 10) !== filters.date) return false
      if (filters.type && report.type !== filters.type) return false
      if (filters.status && report.status !== filters.status) return false
      if (search) {
        const haystack = [
          report.title,
          report.content,
          report.type,
          report.status,
          employeeFullName(report.employee, ''),
          report.employee?.employee_code,
        ].join(' ').toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [reports, filters])

  const totals = useMemo(() => ({
    reports: filteredReports.length,
    submitted: filteredReports.filter((item) => item.status === 'submitted').length,
    orders: filteredReports.reduce((total, report) => total + Number(report.metrics?.orders_collected || 0), 0),
  }), [filteredReports])

  const resetFilters = () => setFilters({ date: '', type: '', status: '', search: '' })

  const exportReports = async () => {
    setExporting(true)
    try {
      const params = {}
      if (filters.date) params.date = filters.date
      if (filters.type) params.type = filters.type
      if (filters.status) params.status = filters.status

      const response = await api.get('/reports/export', { params, responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `reports-${filters.date || 'all'}.csv`,
      })
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Reports</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {canViewAllReports ? 'Review employee daily, weekly, monthly, and visit reports.' : 'Submit and review your own work reports.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canExportReports && (
            <button
              onClick={exportReports}
              disabled={exporting}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-400"
            >
              <Download size={16} />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          )}
          {canSubmitReport && (
            <button
              onClick={() => setModal('report')}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={16} />
              Add Report
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Reports" value={totals.reports} help="Filtered report records" />
        <InfoCard label="Submitted" value={totals.submitted} help="Waiting for review" />
        <InfoCard label="Orders Collected" value={totals.orders} help="From report metrics" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_170px_170px_170px_auto]">
          <label className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Search employee, title, or content..."
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            />
          </label>
          <input
            type="date"
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={filters.date}
            onChange={(event) => setFilters({ ...filters, date: event.target.value })}
          />
          <select
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={filters.type}
            onChange={(event) => setFilters({ ...filters, type: event.target.value })}
          >
            {reportTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <select
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          >
            {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
          <button
            onClick={resetFilters}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">Report Submissions</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Reports are saved from employee submissions and filtered by your view permission.
          </p>
        </div>

        {filteredReports.length === 0 ? (
          <EmptyState text="No reports found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  {['Date', 'Employee', 'Type', 'Title / Content', 'Orders', 'Submitted', 'Status'].map((column) => (
                    <th key={column} className="px-5 py-3">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200">{formatDate(report.report_date)}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{employeeFullName(report.employee)}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{report.employee?.employee_code || '-'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={clsx('rounded-full px-3 py-1 text-xs font-bold', report.type === 'visit' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700')}>
                        {titleCase(report.type)}
                      </span>
                    </td>
                    <td className="max-w-[420px] px-5 py-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{report.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{report.content}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-100">{Number(report.metrics?.orders_collected || 0)}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatTime(report.submitted_at)}</td>
                    <td className="px-5 py-4"><StatusPill status={titleCase(report.status)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
