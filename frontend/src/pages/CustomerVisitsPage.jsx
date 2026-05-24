import { useEffect, useState } from 'react'
import {
  Calendar, Camera, CheckCircle2, ChevronLeft, ChevronRight,
  ExternalLink, Eye, FileDown, Filter, Loader2, MapPin, Pencil, Phone,
  Printer, RefreshCw, Search, ShoppingBag, Store, User, Users, X, ZoomIn,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { canAccess, employeeFullName, formatDate, formatTime } from '../utils/format'
import EditVisitModal from '../components/visits/EditVisitModal'

// ── helpers ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10)
const clean = (f) => Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''))

const STATUS = {
  open:      { label: 'In Progress', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  closed:    { label: 'Completed',   cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  cancelled: { label: 'Cancelled',   cls: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' },
}

// ── small reusable pieces ─────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.open
  return <span className={clsx('rounded-full px-2.5 py-0.5 text-[11px] font-bold', s.cls)}>{s.label}</span>
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  const bg   = { emerald: 'from-emerald-50 dark:from-emerald-950/20', blue: 'from-blue-50 dark:from-blue-950/20', violet: 'from-violet-50 dark:from-violet-950/20', amber: 'from-amber-50 dark:from-amber-950/20' }
  const icon = { emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40', blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40', violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40', amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' }
  const sub_ = { emerald: 'text-emerald-600 dark:text-emerald-400', blue: 'text-blue-600 dark:text-blue-400', violet: 'text-violet-600 dark:text-violet-400', amber: 'text-amber-600 dark:text-amber-400' }
  return (
    <div className={clsx('rounded-2xl border border-slate-100 bg-gradient-to-br to-white p-5 shadow-sm dark:border-slate-800 dark:to-slate-900', bg[color])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{value?.toLocaleString() ?? '—'}</p>
          <p className={clsx('mt-1 text-xs font-semibold', sub_[color])}>{sub}</p>
        </div>
        <div className={clsx('grid h-11 w-11 shrink-0 place-items-center rounded-xl', icon[color])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function PhotoThumb({ url, title, onClick }) {
  if (!url) return <span className="text-[10px] text-slate-300 dark:text-slate-600">—</span>
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick({ url, title }) }}
      className="group relative overflow-hidden rounded-lg"
    >
      <img src={url} alt={title} className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200 transition group-hover:opacity-75 dark:ring-slate-700" />
      <div className="absolute inset-0 grid place-items-center rounded-lg opacity-0 transition group-hover:opacity-100">
        <ZoomIn size={11} className="text-white drop-shadow" />
      </div>
    </button>
  )
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="border-b border-slate-50 px-4 py-3.5 dark:border-slate-800">
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={11} className="mt-0.5 shrink-0 text-slate-400" />
      <span className="w-16 shrink-0 text-xs text-slate-400">{label}</span>
      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{value || '—'}</span>
    </div>
  )
}

function EmptyPhoto({ label }) {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-100 text-slate-300 dark:border-slate-700 dark:text-slate-600">
      <Camera size={18} />
      <span className="text-xs">{label}</span>
    </div>
  )
}

function DetailPanel({ visit, onClose, onPhotoClick }) {
  const mapUrl = visit.map_url || (visit.latitude && visit.longitude
    ? `https://maps.google.com/?q=${visit.latitude},${visit.longitude}` : null)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
          <Store size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{visit.customer_name}</p>
          <p className="truncate text-xs text-slate-500">{visit.store_name || 'No store name'}</p>
        </div>
        <button onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X size={15} />
        </button>
      </div>

      {/* status + time strip */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-50 px-4 py-2 dark:border-slate-800">
        <StatusBadge status={visit.status} />
        <span className="text-xs text-slate-400">{formatDate(visit.check_in_at)} · {formatTime(visit.check_in_at)}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section title="Customer">
          <InfoRow icon={User}  label="Name"  value={visit.customer_name} />
          <InfoRow icon={Phone} label="Phone" value={visit.phone} />
          <InfoRow icon={Store} label="Store" value={visit.store_name} />
        </Section>

        <Section title="Visit">
          <InfoRow icon={User}     label="Seller"    value={employeeFullName(visit.employee)} />
          <InfoRow icon={Calendar} label="Check In"  value={`${formatDate(visit.check_in_at)} ${formatTime(visit.check_in_at)}`} />
          {visit.check_out_at && <InfoRow icon={Calendar} label="Check Out" value={`${formatDate(visit.check_out_at)} ${formatTime(visit.check_out_at)}`} />}
          {visit.duration_minutes > 0 && <InfoRow icon={Calendar} label="Duration" value={`${visit.duration_minutes} min`} />}
        </Section>

        <Section title="Location">
          {visit.province && (
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <MapPin size={11} className="shrink-0" /> {visit.province}
            </div>
          )}
          {visit.address && (
            <div className="mb-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <MapPin size={11} className="mr-1 inline text-emerald-500" />{visit.address}
            </div>
          )}
          {visit.latitude && visit.longitude && (
            <p className="mb-2 font-mono text-[10px] text-slate-400">
              {Number(visit.latitude).toFixed(6)}, {Number(visit.longitude).toFixed(6)}
            </p>
          )}
          {mapUrl && (
            <a
              href={mapUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              <ExternalLink size={12} /> 🛰 Open Google Maps
            </a>
          )}
        </Section>

        <Section title="Photos">
          <div className="grid grid-cols-2 gap-2.5">
            {visit.selfie_url ? (
              <button
                type="button" onClick={() => onPhotoClick({ url: visit.selfie_url, title: '🤳 Selfie' })}
                className="overflow-hidden rounded-xl border border-slate-100 transition hover:opacity-80 dark:border-slate-700"
              >
                <img src={visit.selfie_url} alt="Selfie" className="h-28 w-full object-cover" />
                <p className="py-1.5 text-center text-[11px] font-semibold text-slate-500">🤳 Selfie</p>
              </button>
            ) : <EmptyPhoto label="🤳 Selfie" />}

            {visit.store_photo_url ? (
              <button
                type="button" onClick={() => onPhotoClick({ url: visit.store_photo_url, title: '🏬 Store Photo' })}
                className="overflow-hidden rounded-xl border border-slate-100 transition hover:opacity-80 dark:border-slate-700"
              >
                <img src={visit.store_photo_url} alt="Store" className="h-28 w-full object-cover" />
                <p className="py-1.5 text-center text-[11px] font-semibold text-slate-500">🏬 Store</p>
              </button>
            ) : <EmptyPhoto label="🏬 Store" />}
          </div>
        </Section>
      </div>
    </div>
  )
}

// ── Photo Lightbox ────────────────────────────────────────────────────────────
function PhotoLightbox({ photo, onClose }) {
  if (!photo) return null
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4" onClick={onClose}>
      <div className="relative max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100"
        >
          <X size={15} />
        </button>
        <img src={photo.url} alt={photo.title} className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
        <p className="mt-3 text-center text-sm font-semibold text-white/70">{photo.title}</p>
      </div>
    </div>
  )
}

// ── Mobile Visit Card ─────────────────────────────────────────────────────────
function MobileVisitCard({ visit, onView, onEdit, onPhotoClick }) {
  const mapUrl = visit.map_url || (visit.latitude && visit.longitude
    ? `https://maps.google.com/?q=${visit.latitude},${visit.longitude}` : null)
  const hasPhotos = visit.selfie_url || visit.store_photo_url

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
          <Store size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900 dark:text-white">{visit.customer_name}</p>
              <p className="truncate text-xs text-slate-500">{visit.store_name || '—'}</p>
            </div>
            <StatusBadge status={visit.status} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 truncate"><User size={10} className="shrink-0" />{employeeFullName(visit.employee)}</span>
            <span className="flex items-center gap-1"><Phone size={10} className="shrink-0" />{visit.phone || '—'}</span>
            <span className="col-span-2 flex items-center gap-1 truncate"><MapPin size={10} className="shrink-0" />{visit.address || '—'}</span>
            {visit.province && <span className="flex items-center gap-1 truncate"><MapPin size={10} className="shrink-0 text-emerald-500" />{visit.province}</span>}
            <span className="flex items-center gap-1"><Calendar size={10} className="shrink-0" />{formatTime(visit.check_in_at)}</span>
          </div>
        </div>
      </div>

      {hasPhotos && (
        <div className="flex gap-2 border-t border-slate-50 px-4 py-2.5 dark:border-slate-800">
          {visit.selfie_url && (
            <button type="button" onClick={() => onPhotoClick({ url: visit.selfie_url, title: '🤳 Selfie' })}>
              <img src={visit.selfie_url} alt="selfie" className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
            </button>
          )}
          {visit.store_photo_url && (
            <button type="button" onClick={() => onPhotoClick({ url: visit.store_photo_url, title: '🏬 Store' })}>
              <img src={visit.store_photo_url} alt="store" className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-slate-50 px-4 py-2.5 dark:border-slate-800">
        <button
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          <Eye size={12} /> View
        </button>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            <Pencil size={12} /> Edit
          </button>
        )}
        {mapUrl && (
          <a
            href={mapUrl} target="_blank" rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            <MapPin size={12} /> Map
          </a>
        )}
        {hasPhotos && (
          <button
            onClick={() => onPhotoClick({ url: visit.selfie_url || visit.store_photo_url, title: 'Photo' })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            <Camera size={12} /> Photos
          </button>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const INIT_DATE = todayStr()
const INIT_FILTERS = { date_from: INIT_DATE, date_to: INIT_DATE, employee_id: '', customer_name: '', province: '', status: '' }

export default function CustomerVisitsPage({ user, appData, setModal }) {
  const canViewAll = canAccess(user, ['visits.view', 'visits.manage'])
  const canEdit    = canAccess(user, ['visits.update', 'visits.manage', 'visits.create'])
  const employees  = canViewAll ? (appData.employees || []) : []

  const [visits,    setVisits]    = useState([])
  const [summary,   setSummary]   = useState({ total: 0, completed: 0, open: 0, unique_customers: 0, active_staff: 0 })
  const [meta,      setMeta]      = useState({ current_page: 1, last_page: 1, total: 0 })
  const [provinces, setProvinces] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [selected,    setSelected]    = useState(null)
  const [editVisit,   setEditVisit]   = useState(null)
  const [photoModal,  setPhotoModal]  = useState(null)
  const [filterOpen,  setFilterOpen]  = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)

  const [filters, setFilters] = useState(INIT_FILTERS)
  const [applied, setApplied] = useState(INIT_FILTERS)
  const [page,    setPage]    = useState(1)

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }))

  // ── Fetch provinces once (and refresh when data changes) ──────────────────
  useEffect(() => {
    api.get('/customer-visits/provinces')
      .then((r) => setProvinces(r.data || []))
      .catch(() => {})
  }, [refreshTick])

  // ── Fetch visits + summary ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = { page, per_page: 15, ...clean(applied) }

    Promise.all([
      api.get('/customer-visits',         { params }),
      api.get('/customer-visits/summary', { params: clean(applied) }),
    ])
      .then(([vr, sr]) => {
        if (cancelled) return
        setVisits(vr.data.data || [])
        setMeta({
          current_page: vr.data.current_page ?? 1,
          last_page:    vr.data.last_page    ?? 1,
          total:        vr.data.total        ?? 0,
        })
        setSummary(sr.data || {})
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [page, applied, refreshTick])

  // ── Actions ────────────────────────────────────────────────────────────────
  const applyFilters = () => { setApplied({ ...filters }); setPage(1); setFilterOpen(false) }
  const resetFilters = () => { setFilters(INIT_FILTERS); setApplied(INIT_FILTERS); setPage(1) }

  const handleEditSaved = (updated) => {
    setVisits((vs) => vs.map((v) => v.id === updated.id ? { ...v, ...updated } : v))
    if (selected?.id === updated.id) setSelected((s) => ({ ...s, ...updated }))
    setEditVisit(null)
  }

  const exportCsv = () => {
    const headers = ['#', 'Visit Time', 'Employee', 'Customer', 'Phone', 'Store', 'Address', 'Status', 'Duration']
    const rows = visits.map((v, i) => [
      i + 1,
      `${formatDate(v.check_in_at)} ${formatTime(v.check_in_at)}`,
      employeeFullName(v.employee),
      v.customer_name,
      v.phone || '',
      v.store_name || '',
      v.address || '',
      v.status,
      v.duration_minutes ? `${v.duration_minutes} min` : '',
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `customer-visits-${INIT_DATE}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const completionPct = summary.total > 0
    ? `${Math.round((summary.completed / summary.total) * 100)}% completion`
    : 'No data yet'

  // ── Filter Fields (shared desktop/mobile) ──────────────────────────────────
  const filterFields = (
    <>
      <div>
        <label className="mb-1 block text-[11px] font-bold text-slate-500">From</label>
        <input type="date" value={filters.date_from} onChange={(e) => setFilter('date_from', e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-bold text-slate-500">To</label>
        <input type="date" value={filters.date_to} onChange={(e) => setFilter('date_to', e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
      </div>
      {canViewAll && employees.length > 0 && (
        <div>
          <label className="mb-1 block text-[11px] font-bold text-slate-500">Employee</label>
          <select value={filters.employee_id} onChange={(e) => setFilter('employee_id', e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <option value="">All Employees</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{employeeFullName(e)}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="mb-1 block text-[11px] font-bold text-slate-500">Customer</label>
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={filters.customer_name} onChange={(e) => setFilter('customer_name', e.target.value)}
            placeholder="Search name…"
            className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-3 text-xs text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-bold text-slate-500">Province</label>
        <select
          value={filters.province}
          onChange={(e) => setFilter('province', e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="">All Provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-bold text-slate-500">Status</label>
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          <option value="">All Status</option>
          <option value="open">In Progress</option>
          <option value="closed">Completed</option>
        </select>
      </div>
    </>
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Visits Report</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Track and manage outdoor customer visits.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRefreshTick((t) => t + 1)} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCw size={12} className={clsx(loading && 'animate-spin')} /> Refresh
          </button>
          {canViewAll && (
            <>
              <button onClick={exportCsv}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <FileDown size={12} /> Export CSV
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <Printer size={12} /> Print
              </button>
            </>
          )}
          {canAccess(user, ['visits.create', 'visits.manage']) && (
            <button
              onClick={() => setModal('visit')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + New Visit
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard icon={ShoppingBag}  label="Total Visits"      value={summary.total}            sub={`${summary.open ?? 0} in progress`} color="emerald" />
        <KpiCard icon={CheckCircle2} label="Completed"         value={summary.completed}        sub={completionPct}                      color="blue"    />
        <KpiCard icon={User}         label="Unique Customers"  value={summary.unique_customers} sub="Distinct customers visited"         color="violet"  />
        <KpiCard icon={Users}        label="Active Staff"      value={summary.active_staff}     sub="Outdoor sales staff"                color="amber"   />
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Desktop: inline */}
        <div className="hidden items-end gap-3 lg:flex lg:flex-wrap">
          {filterFields}
          <div className="flex gap-2">
            <button onClick={applyFilters}
              className="h-9 rounded-xl bg-emerald-600 px-5 text-xs font-bold text-white transition hover:bg-emerald-700">
              Apply
            </button>
            <button onClick={resetFilters}
              className="h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">
              Reset
            </button>
          </div>
        </div>

        {/* Mobile: toggle drawer */}
        <div className="lg:hidden">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex w-full items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <span className="flex items-center gap-2">
              <Filter size={14} /> Filters
              {Object.values(applied).some((v) => v !== '') && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Active</span>
              )}
            </span>
            <span className="text-xs text-slate-400">{filterOpen ? 'Hide' : 'Show'}</span>
          </button>

          {filterOpen && (
            <div className="mt-3 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">{filterFields}</div>
              <div className="flex gap-2">
                <button onClick={applyFilters} className="h-9 flex-1 rounded-xl bg-emerald-600 text-xs font-bold text-white">Apply</button>
                <button onClick={resetFilters} className="h-9 flex-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">Reset</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main: Table + Detail Panel (side by side on xl) */}
      <div className={clsx('grid gap-4 items-start', selected ? 'xl:grid-cols-[1fr_360px]' : '')}>

        {/* Table / Cards */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Table header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Visit Records</h3>
              <p className="text-xs text-slate-500">{meta.total.toLocaleString()} total found</p>
            </div>
            {loading && <Loader2 size={15} className="animate-spin text-emerald-500" />}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Visit Time', 'Employee', 'Customer', 'Phone', 'Store', 'Province', 'Status', 'Photos', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 dark:text-slate-500">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && visits.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center"><Loader2 size={20} className="mx-auto animate-spin text-emerald-500" /></td></tr>
                )}
                {!loading && visits.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-sm text-slate-400">No visits found for the selected filters.</td></tr>
                )}
                {visits.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelected((s) => s?.id === v.id ? null : v)}
                    className={clsx(
                      'cursor-pointer border-b border-slate-50 transition hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-950',
                      selected?.id === v.id && 'bg-emerald-50/60 dark:bg-emerald-950/20',
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold">{formatDate(v.check_in_at)}</p>
                      <p className="text-xs text-slate-400">{formatTime(v.check_in_at)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold">{employeeFullName(v.employee)}</p>
                      <p className="text-[10px] text-slate-400">{v.employee?.employee_code || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{v.customer_name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{v.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{v.store_name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{v.province || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <PhotoThumb url={v.selfie_url}      title="🤳 Selfie"      onClick={setPhotoModal} />
                        <PhotoThumb url={v.store_photo_url} title="🏬 Store Photo" onClick={setPhotoModal} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          type="button" onClick={(e) => { e.stopPropagation(); setSelected(v) }}
                          className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400"
                        >
                          View
                        </button>
                        {canEdit && (
                          <button
                            type="button" onClick={(e) => { e.stopPropagation(); setEditVisit(v) }}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                            title="Edit visit"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                        {v.map_url && (
                          <a
                            href={v.map_url} target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400"
                          >
                            Map
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {loading && visits.length === 0 && (
              <div className="py-10 text-center"><Loader2 size={22} className="mx-auto animate-spin text-emerald-500" /></div>
            )}
            {!loading && visits.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">No visits found.</p>
            )}
            {visits.map((v) => (
              <MobileVisitCard
                key={v.id}
                visit={v}
                onView={() => setSelected(v)}
                onEdit={canEdit ? () => setEditVisit(v) : undefined}
                onPhotoClick={setPhotoModal}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <p className="text-xs text-slate-500">
                Page {meta.current_page} of {meta.last_page} · {meta.total.toLocaleString()} records
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page <= 1}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={meta.current_page >= meta.last_page}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Detail Panel (sticky) */}
        {selected && (
          <div className="sticky top-4 hidden max-h-[calc(100vh-6rem)] xl:block">
            <DetailPanel visit={selected} onClose={() => setSelected(null)} onPhotoClick={setPhotoModal} />
          </div>
        )}
      </div>

      {/* Mobile Detail Bottom Sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 overflow-hidden">
              <DetailPanel visit={selected} onClose={() => setSelected(null)} onPhotoClick={setPhotoModal} />
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      <PhotoLightbox photo={photoModal} onClose={() => setPhotoModal(null)} />

      {/* Edit Modal */}
      {editVisit && (
        <EditVisitModal
          visit={editVisit}
          onClose={() => setEditVisit(null)}
          onSaved={handleEditSaved}
        />
      )}
    </div>
  )
}
