/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import {
  Activity, Bell, BriefcaseBusiness, Building2, CalendarCheck,
  CheckCircle2, ChevronDown, Clock, FileCheck2, FileText, Home, KeyRound,
  MapPinned, Search, Settings, ShieldCheck, ShoppingBag, UserPlus, UserRound, Users, X,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import {
  EmptyState, ErrorText, FormInput, FormTextarea,
  PanelHeader, SimpleModal, StatusPill, SubmitButton, Toggle,
} from '../components/shared/UI'
import { apiError, titleCase } from '../utils/format'

/* ─── IP Restrictions Tab ─────────────────────────────────────── */
function IpRestrictionsTab({ roles }) {
  const [ipData, setIpData] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [newIp, setNewIp] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadIpData = useCallback(async () => {
    const res = await api.get('/ip-restrictions')
    setIpData(res.data || [])
  }, [])

  useEffect(() => { loadIpData().catch(() => {}) }, [loadIpData])
  useEffect(() => {
    if (!selectedRoleId && roles.length) setSelectedRoleId(String(roles[0].id))
  }, [roles, selectedRoleId])

  const selectedRole = roles.find((r) => String(r.id) === selectedRoleId)
  const ipRole = ipData.find((r) => String(r.id) === selectedRoleId)
  const ipList = ipRole?.ip_addresses || []

  const addIp = async () => {
    if (!newIp.trim() || !selectedRoleId) return
    setSaving(true)
    setError('')
    try {
      await api.post('/ip-restrictions', { role_id: selectedRoleId, ip_address: newIp.trim(), label: newLabel.trim() || null })
      setNewIp('')
      setNewLabel('')
      await loadIpData()
    } catch (e) { setError(apiError(e)) } finally { setSaving(false) }
  }

  const removeIp = async (ipId) => {
    const ipEntry = ipList.find((entry) => entry.id === ipId)
    const label = ipEntry?.label ? `${ipEntry.label} (${ipEntry.ip_address})` : ipEntry?.ip_address || 'this IP restriction'
    if (!window.confirm(`Delete ${label}?`)) return
    try { await api.delete(`/ip-restrictions/${ipId}`); await loadIpData() }
    catch (e) { setError(apiError(e)) }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-300">
        <p className="font-semibold">IP Address Restrictions for Attendance</p>
        <p className="mt-1 text-sky-700 dark:text-sky-400">
          Every role <strong>must have at least one allowed IP or Wi-Fi range configured</strong> before its employees can check in or out. For office Wi-Fi, use a CIDR range like <strong>192.168.110.0/24</strong> so phones with different IPs can still check in/out.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Select Role</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
          >
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <div className="mt-4 space-y-2">
            {roles.map((r) => {
              const count = ipData.find((d) => String(d.id) === String(r.id))?.ip_addresses?.length ?? 0
              return (
                <button key={r.id} onClick={() => setSelectedRoleId(String(r.id))}
                  className={clsx('flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition',
                    String(r.id) === selectedRoleId
                      ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
                      : 'border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60',
                  )}>
                  <span className="font-medium">{r.name}</span>
                  <span className={clsx('rounded-full px-2 py-0.5 text-xs font-bold',
                    count > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
                    {count > 0 ? `${count} IP${count > 1 ? 's' : ''}` : 'No IP — Blocked'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {selectedRole && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{selectedRole.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {ipList.length === 0 ? 'No IPs configured — employees in this role cannot check in/out until at least one IP is added.' : `Restricted to ${ipList.length} allowed IP address${ipList.length > 1 ? 'es' : ''}.`}
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ipList.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <MapPinned size={28} className="mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-400">No IPs added — employees in this role are <strong className="text-rose-500">blocked</strong> until at least one IP is configured.</p>
                </div>
              ) : ipList.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">{entry.ip_address}</p>
                    {entry.label && <p className="text-xs text-slate-400">{entry.label}</p>}
                  </div>
                  <button onClick={() => removeIp(entry.id)} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400">Remove</button>
                </div>
              ))}
            </div>
            {selectedRole.slug !== 'super_admin' && (
              <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Add Allowed IP or Wi-Fi Range</p>
                <div className="grid gap-2">
                  <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" placeholder="e.g. 192.168.110.0/24 or 192.168.110.127" value={newIp} onChange={(e) => setNewIp(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addIp()} />
                  <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" placeholder="Label (e.g. Office Wi-Fi, Branch A)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addIp()} />
                  <button disabled={!newIp.trim() || saving} onClick={addIp} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? 'Adding...' : '+ Add IP / Range'}
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Permission modules — one module per sidebar menu item ──── */
const PERMISSION_MODULES = [
  {
    key: 'dashboard',
    label: 'Dashboard', desc: 'Main dashboard and overview statistics',
    Icon: Home, color: 'text-sky-600', iconBg: 'bg-sky-100 dark:bg-sky-950/50',
    rows: [
      { label: 'Admin Dashboard',    desc: 'View admin/manager dashboard',        view: 'dashboard.admin' },
      { label: 'Employee Dashboard', desc: 'View employee self-service dashboard', view: 'dashboard.employee' },
    ],
  },
  {
    key: 'attendance',
    label: 'Attendance', desc: 'Check in/out and view attendance records',
    Icon: Clock, color: 'text-emerald-600', iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    rows: [
      { label: 'View All Attendance', desc: 'View attendance for all employees', view:   'attendance.view_all' },
      { label: 'View Own Attendance', desc: 'View personal attendance records',  view:   'attendance.view_own' },
      { label: 'Check In',            desc: 'Check in (office or outdoor)',       create: 'attendance.check_in' },
      { label: 'Check Out',           desc: 'Check out (office or outdoor)',      update: 'attendance.check_out' },
      { label: 'Edit Attendance',     desc: 'Edit existing attendance records',   update: 'attendance.edit' },
    ],
  },
  {
    key: 'visits',
    label: 'Customer Visits', desc: 'Record and track customer visits',
    Icon: ShoppingBag, color: 'text-rose-600', iconBg: 'bg-rose-100 dark:bg-rose-950/50',
    rows: [
      { label: 'View Visits',   desc: 'View all customer visit records',         view:   'visits.view' },
      { label: 'Add Visit',     desc: 'Log a new customer visit',               create: 'visits.create' },
      { label: 'Edit Visit',    desc: 'Edit an existing customer visit',         update: 'visits.update' },
      { label: 'Manage Visits', desc: 'Full management of all customer visits',  update: 'visits.manage' },
    ],
  },
  {
    key: 'reports',
    label: 'Daily Reports', desc: 'Submit and view daily activity reports',
    Icon: FileText, color: 'text-blue-600', iconBg: 'bg-blue-100 dark:bg-blue-950/50',
    rows: [
      { label: 'View Own Reports', desc: 'View personal submitted reports', view:   'reports.view_own' },
      { label: 'View All Reports', desc: 'View all submitted reports',      view:   'reports.view_all' },
      { label: 'Submit Report',    desc: 'Submit a daily report',           create: 'reports.create' },
      { label: 'Export Reports',   desc: 'Export reports to file',          update: 'reports.export' },
    ],
  },
  {
    key: 'gps',
    label: 'Route Map', desc: 'GPS tracking and live route map',
    Icon: MapPinned, color: 'text-amber-600', iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    rows: [
      { label: 'View GPS Tracking',  desc: 'Access the GPS tracking page',       view:   'gps.view' },
      { label: 'Live Locations',     desc: 'See live employee locations',         view:   'gps.live' },
      { label: 'Route History',      desc: 'View historical route data',          view:   'gps.history' },
      { label: 'Track Own Location', desc: 'Send current location from device',   create: 'gps.track' },
    ],
  },
  {
    key: 'permission_requests',
    label: 'Permission Requests', desc: 'Leave, late arrival, and attendance permission requests',
    Icon: FileCheck2, color: 'text-fuchsia-600', iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-950/50',
    rows: [
      { label: 'View All Requests', desc: 'View and manage every employee request (admin/HR)', view:   'requests.view_all' },
      { label: 'View Own Requests', desc: 'View only personal submitted requests',             view:   'requests.view_own' },
      { label: 'Submit Request',    desc: 'Create a new permission request',                   create: 'requests.create' },
      { label: 'Approve / Reject',  desc: 'Approve or reject pending requests',                update: 'requests.approve' },
    ],
  },
  {
    key: 'profile',
    label: 'Profile', desc: 'View and update personal profile',
    Icon: UserRound, color: 'text-indigo-600', iconBg: 'bg-indigo-100 dark:bg-indigo-950/50',
    rows: [
      { label: 'Update Own Profile',  desc: 'Edit own profile from the Profile page', update: 'profile.update_own' },
      { label: 'Update All Profiles', desc: 'Edit profile fields for any employee',   update: 'profile.update_all' },
    ],
  },
  {
    key: 'notifications',
    label: 'Notifications', desc: 'Receive and manage system notifications',
    Icon: Bell, color: 'text-orange-600', iconBg: 'bg-orange-100 dark:bg-orange-950/50',
    rows: [
      { label: 'View Notifications',   desc: 'Receive system notifications',  view:   'notifications.view' },
      { label: 'Manage Notifications', desc: 'Manage and dismiss all alerts', update: 'notifications.manage' },
    ],
  },
  {
    key: 'employees',
    label: 'Employees', desc: 'View and manage employee records',
    Icon: Users, color: 'text-violet-600', iconBg: 'bg-violet-100 dark:bg-violet-950/50',
    rows: [
      { label: 'View Employees',  desc: 'Show Employees menu and employee list', view:   'employees.view' },
      { label: 'Add Employee',    desc: 'Show "Add Employee" button',            create: 'employees.create' },
      { label: 'Edit Employee',   desc: 'Show "Edit" button per row',            update: 'employees.update' },
      { label: 'Delete Employee', desc: 'Show "Delete" button per row',          delete: 'employees.delete' },
    ],
  },
  {
    key: 'departments',
    label: 'Departments', desc: 'Manage company departments',
    Icon: Building2, color: 'text-teal-600', iconBg: 'bg-teal-100 dark:bg-teal-950/50',
    rows: [
      { label: 'View Departments',   desc: 'View department list',                view:   'departments.view' },
      { label: 'Manage Departments', desc: 'Create, edit and delete departments', update: 'departments.manage' },
    ],
  },
  {
    key: 'positions',
    label: 'Positions', desc: 'Manage job positions',
    Icon: BriefcaseBusiness, color: 'text-cyan-600', iconBg: 'bg-cyan-100 dark:bg-cyan-950/50',
    rows: [
      { label: 'View Positions',   desc: 'View position list',                view:   'positions.view' },
      { label: 'Manage Positions', desc: 'Create, edit and delete positions', update: 'positions.manage' },
    ],
  },
  {
    key: 'outdoor_sales',
    label: 'Outdoor Sales', desc: 'Monitor the outdoor sales team',
    Icon: Activity, color: 'text-pink-600', iconBg: 'bg-pink-100 dark:bg-pink-950/50',
    rows: [
      { label: 'View Sales',   desc: 'View outdoor sales team and data',        view:   'sales.view' },
      { label: 'Manage Sales', desc: 'Edit and manage all customer visits',     update: 'sales.manage' },
    ],
  },
  {
    key: 'roles',
    label: 'Roles & Permissions', desc: 'Manage roles and assign permissions',
    Icon: ShieldCheck, color: 'text-slate-600', iconBg: 'bg-slate-100 dark:bg-slate-800',
    rows: [
      { label: 'Manage Roles',       desc: 'Create and update roles',     update: 'roles.manage' },
      { label: 'Manage Permissions', desc: 'Assign permissions to roles', update: 'permissions.manage' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings', desc: 'System settings, security and API keys',
    Icon: Settings, color: 'text-gray-600', iconBg: 'bg-gray-100 dark:bg-gray-800',
    rows: [
      { label: 'View Settings',    desc: 'Access the settings page',          view:   'settings.view' },
      { label: 'Security Settings', desc: 'Configure security options',       update: 'settings.security' },
      { label: 'API Keys',         desc: 'Manage API keys and integrations',  update: 'settings.api' },
      { label: 'Manage Settings',  desc: 'Full system settings management',   update: 'settings.manage' },
      { label: 'Manage Schedules', desc: 'Configure work schedules',          update: 'settings.schedules' },
    ],
  },
]

const CRUD_COLS = [
  { key: 'view',   label: 'View',   color: 'text-sky-600',     activeBg: 'bg-sky-100 dark:bg-sky-950/40' },
  { key: 'create', label: 'Create', color: 'text-emerald-600', activeBg: 'bg-emerald-100 dark:bg-emerald-950/40' },
  { key: 'update', label: 'Update', color: 'text-amber-600',   activeBg: 'bg-amber-100 dark:bg-amber-950/40' },
  { key: 'delete', label: 'Delete', color: 'text-rose-600',    activeBg: 'bg-rose-100 dark:bg-rose-950/40' },
]

/* ─── Main page ───────────────────────────────────────────────── */
export default function UsersRolesPage({ initialTab = 'assign' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState({})
  const [permissionRows, setPermissionRows] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', permission_ids: [] })
  const [editingPermission, setEditingPermission] = useState(null)
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [permissionForm, setPermissionForm] = useState({ name: '', slug: '', group: 'system' })
  const [assignRoleId, setAssignRoleId] = useState('')
  const [assignPermissionIds, setAssignPermissionIds] = useState([])
  const [permissionSearch, setPermissionSearch] = useState('')
  const [rolePermMap, setRolePermMap] = useState({})
  const [collapsedGroups, setCollapsedGroups] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const loadRoles = useCallback(async () => {
    const [roleRes, permRes, permListRes] = await Promise.all([
      api.get('/roles'),
      api.get('/roles/permissions'),
      api.get('/permissions'),
    ])
    const nextRoles = roleRes.data || []
    setRoles(nextRoles)
    setPermissions(permRes.data || {})
    setPermissionRows(permListRes.data || [])
    const map = {}
    nextRoles.forEach((role) => { map[role.id] = new Set((role.permissions || []).map((p) => p.id)) })
    setRolePermMap(map)
    const defaultAssignRole = nextRoles.find((role) => role.slug !== 'super_admin') || nextRoles[0]
    setAssignRoleId((current) => current || defaultAssignRole?.id || '')
    if (!assignRoleId && defaultAssignRole) {
      setAssignPermissionIds((defaultAssignRole.permissions || []).map((p) => p.id))
    }
    setLoading(false)
  }, [assignRoleId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadRoles().catch(() => {
        setError('Cannot load roles. Login as Super Admin and check API server.')
        setLoading(false)
      })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadRoles])

  const resetForm = () => {
    setEditing(null)
    setShowForm(false)
    setForm({ name: '', slug: '', description: '', permission_ids: [] })
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', permission_ids: [] })
    setShowForm(true)
  }

  const editRole = (role) => {
    setEditing(role)
    setForm({
      name: role.name || '',
      slug: role.slug || '',
      description: role.description || '',
      permission_ids: (role.permissions || []).map((p) => p.id),
    })
    setShowForm(true)
  }

  const togglePermission = (id) => {
    setForm((cur) => ({
      ...cur,
      permission_ids: cur.permission_ids.includes(id)
        ? cur.permission_ids.filter((x) => x !== id)
        : [...cur.permission_ids, id],
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) await api.put(`/roles/${editing.id}`, form)
      else await api.post('/roles', form)
      resetForm()
      await loadRoles()
    } catch (ex) { setError(apiError(ex)) } finally { setSaving(false) }
  }

  const deleteRole = async (role) => {
    if (!confirm(`Delete role ${role.name}?`)) return
    await api.delete(`/roles/${role.id}`)
    await loadRoles()
  }

  const openPermissionCreate = () => {
    setEditingPermission(null)
    setPermissionForm({ name: '', slug: '', group: 'system' })
    setShowPermissionForm(true)
  }

  const editPermission = (p) => {
    setEditingPermission(p)
    setPermissionForm({ name: p.name || '', slug: p.slug || '', group: p.group || 'system' })
    setShowPermissionForm(true)
  }

  const submitPermission = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingPermission) await api.put(`/permissions/${editingPermission.id}`, permissionForm)
      else await api.post('/permissions', permissionForm)
      setShowPermissionForm(false)
      setEditingPermission(null)
      setPermissionForm({ name: '', slug: '', group: 'system' })
      await loadRoles()
    } catch (ex) { setError(apiError(ex)) } finally { setSaving(false) }
  }

  const deletePermission = async (p) => {
    if (!confirm(`Delete permission ${p.name}?`)) return
    await api.delete(`/permissions/${p.id}`)
    await loadRoles()
  }

  const selectAssignRole = (roleId) => {
    const role = roles.find((r) => String(r.id) === String(roleId))
    setAssignRoleId(roleId)
    setAssignPermissionIds((role?.permissions || []).map((p) => p.id))
  }

  const toggleRolePermission = (roleId, permId) => {
    setRolePermMap((prev) => {
      const cur = new Set(prev[roleId] || [])
      if (cur.has(permId)) cur.delete(permId)
      else cur.add(permId)
      return { ...prev, [roleId]: cur }
    })
  }

  const toggleGroup = (group) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  return (
    <>
      {/* Tab bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            ['assign', 'Set Permissions', CheckCircle2],
            ['roles', 'Roles', ShieldCheck],
            ['permissions', 'Permissions', KeyRound],
            ['ip', 'IP Access', MapPinned],
          ].map(([key, label, Icon]) => (
            <button key={key}
              className={clsx('flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition',
                activeTab === key ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Roles tab ── */}
      {activeTab === 'roles' && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <PanelHeader title="Role List" subtitle="Create roles and assign permissions." actionLabel="Add Role" onAction={openCreate} />
          {loading ? <EmptyState text="Loading roles..." /> : roles.length === 0 ? <EmptyState text="No roles found yet." /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <tr>{['Role', 'Slug', 'Permissions', 'Description', 'Actions'].map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-5 py-4 font-semibold">{role.name}</td>
                      <td className="px-5 py-4">{role.slug}</td>
                      <td className="px-5 py-4">{role.permissions_count ?? role.permissions?.length ?? 0}</td>
                      <td className="max-w-xs truncate px-5 py-4 text-slate-500 dark:text-slate-400">{role.description || '-'}</td>
                      <td className="px-5 py-4">
                        <button className="mr-2 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700" onClick={() => editRole(role)}>Edit</button>
                        <button className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={['super_admin', 'admin'].includes(role.slug)} onClick={() => deleteRole(role)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Permissions tab ── */}
      {activeTab === 'permissions' && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <PanelHeader title="Permission List" subtitle="Create, edit, and delete permissions." actionLabel="Add Permission" onAction={openPermissionCreate} />
          {permissionRows.length === 0 ? <EmptyState text="No permissions found." /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <tr>{['Permission', 'Slug', 'Group', 'Actions'].map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {permissionRows.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-5 py-4 font-semibold">{p.name}</td>
                      <td className="px-5 py-4">{p.slug}</td>
                      <td className="px-5 py-4">{p.group}</td>
                      <td className="px-5 py-4">
                        <button className="mr-2 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700" onClick={() => editPermission(p)}>Edit</button>
                        <button className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700" onClick={() => deletePermission(p)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Assign / Set Permissions tab ── */}
      {activeTab === 'assign' && (() => {
        const selectedRole = roles.find((r) => String(r.id) === String(assignRoleId))
        const selectedPerms = rolePermMap[assignRoleId] || new Set()

        const slugToId = (slug) => permissionRows.find((p) => p.slug === slug)?.id
        const isOn = (slug) => { const id = slugToId(slug); return id != null && selectedPerms.has(id) }
        const toggleSlug = (slug) => { const id = slugToId(slug); if (id != null) toggleRolePermission(assignRoleId, id) }
        const modSlugs = (mod, col) => mod.rows.map((r) => r[col]).filter(Boolean)

        const toggleModuleAll = (mod) => {
          const allSlugs = CRUD_COLS.flatMap((c) => modSlugs(mod, c.key))
          const allOn = allSlugs.length > 0 && allSlugs.every(isOn)
          setRolePermMap((prev) => {
            const cur = new Set(prev[assignRoleId] || [])
            allSlugs.forEach((slug) => {
              const id = slugToId(slug)
              if (id == null) return
              if (allOn) cur.delete(id)
              else cur.add(id)
            })
            return { ...prev, [assignRoleId]: cur }
          })
        }

        const toggleColAll = (mod, col) => {
          const slugs = modSlugs(mod, col)
          const allOn = slugs.length > 0 && slugs.every(isOn)
          setRolePermMap((prev) => {
            const cur = new Set(prev[assignRoleId] || [])
            slugs.forEach((slug) => {
              const id = slugToId(slug)
              if (id == null) return
              if (allOn) cur.delete(id)
              else cur.add(id)
            })
            return { ...prev, [assignRoleId]: cur }
          })
        }

        const originalPerms = new Set((roles.find((r) => String(r.id) === String(assignRoleId))?.permissions || []).map((p) => p.id))
        const hasChanges = selectedPerms.size !== originalPerms.size || [...selectedPerms].some((id) => !originalPerms.has(id))

        const resetPermissions = () => {
          const original = roles.find((r) => String(r.id) === String(assignRoleId))
          if (!original) return
          setRolePermMap((prev) => ({ ...prev, [assignRoleId]: new Set((original.permissions || []).map((p) => p.id)) }))
        }

        const searchText = permissionSearch.trim().toLowerCase()
        const visibleModules = PERMISSION_MODULES.map((mod) => {
          const moduleMatches = mod.label.toLowerCase().includes(searchText) || mod.desc.toLowerCase().includes(searchText)
          const rows = !searchText
            ? mod.rows
            : mod.rows.filter((row) => (
                moduleMatches
                || row.label.toLowerCase().includes(searchText)
                || row.desc.toLowerCase().includes(searchText)
                || CRUD_COLS.some((col) => String(row[col.key] || '').toLowerCase().includes(searchText))
              ))

          return { ...mod, rows }
        }).filter((mod) => mod.rows.length > 0)

        const saveSelectedRole = async () => {
          if (!selectedRole || selectedRole.slug === 'super_admin') return
          setSaving(true)
          setError('')
          try {
            await api.put(`/roles/${selectedRole.id}`, {
              name: selectedRole.name,
              slug: selectedRole.slug,
              description: selectedRole.description || '',
              permission_ids: [...selectedPerms],
            })
            await loadRoles()
          } catch (ex) { setError(apiError(ex)) } finally { setSaving(false) }
        }

        return (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <span>Dashboard</span>
                  <ChevronDown size={14} className="-rotate-90" />
                  <span>Users & Roles</span>
                  <ChevronDown size={14} className="-rotate-90" />
                  <span className="text-slate-950 dark:text-white">Roles & Permissions</span>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">Roles & Permissions</h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Assign permissions to roles. Toggle ON to allow, OFF to deny.</p>
              </div>

              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <label className="relative min-w-[260px] flex-1 sm:max-w-sm">
                  <span className="sr-only">Search permission</span>
                  <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Search permission..."
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                  />
                </label>
                <button onClick={openCreate} className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700">
                  <UserPlus size={17} /> Add Role
                </button>
                <button onClick={openPermissionCreate} className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
                  <KeyRound size={17} /> Add Permission
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Role</label>
              <select
                className="h-11 min-w-[260px] rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={assignRoleId}
                onChange={(e) => selectAssignRole(e.target.value)}
              >
                {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
              <button onClick={() => setActiveTab('roles')} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Users size={16} /> Manage Roles
              </button>
            </div>

            {!selectedRole ? (
              <EmptyState text="Select a role to manage permissions." />
            ) : (
              <>
                {selectedRole.slug === 'super_admin' && (
                  <div className="border-b border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-300">
                    Super Admin has unrestricted access. Permission switches are shown for reference.
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-white text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                      <tr>
                        <th className="w-[28%] px-5 py-4">Module / Permission</th>
                        <th className="w-[28%] px-5 py-4">Description</th>
                        {CRUD_COLS.map((col) => <th key={col.key} className="w-[11%] px-5 py-4 text-center">{col.label}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {visibleModules.map((mod) => [
                        <tr key={`h-${mod.key}`} className="bg-emerald-50/35 dark:bg-emerald-950/15">
                          <td colSpan={6} className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <span className={clsx('grid h-8 w-8 place-items-center rounded-lg', mod.iconBg)}>
                                <mod.Icon size={17} className={mod.color} />
                              </span>
                              <span className="text-sm font-extrabold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">{mod.label}</span>
                            </div>
                          </td>
                        </tr>,
                        ...mod.rows.map((row, ri) => (
                          <tr key={`r-${mod.key}-${ri}`} className="bg-white hover:bg-slate-50/70 dark:bg-slate-900 dark:hover:bg-slate-800/40">
                            <td className="px-5 py-3.5 pl-14 font-bold text-slate-800 dark:text-slate-100">{row.label}</td>
                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{row.desc}</td>
                            {CRUD_COLS.map((col) => {
                              const slug = row[col.key]
                              const canToggle = Boolean(slug) && selectedRole.slug !== 'super_admin'
                              return (
                                <td key={col.key} className="px-5 py-3.5 text-center">
                                  {slug ? (
                                    <Toggle checked={isOn(slug)} disabled={!canToggle} onChange={() => toggleSlug(slug)} />
                                  ) : (
                                    <Toggle checked={false} disabled />
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        )),
                      ])}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2"><Toggle checked onChange={() => {}} /> ON = Allowed</span>
                    <span className="flex items-center gap-2"><Toggle checked={false} onChange={() => {}} /> OFF = Denied</span>
                    {hasChanges && <span className="text-amber-600 dark:text-amber-400">Unsaved changes</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={resetPermissions} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <X size={16} /> Reset All
                    </button>
                    <button
                      onClick={saveSelectedRole}
                      disabled={saving || !hasChanges || selectedRole.slug === 'super_admin'}
                      className={clsx('inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-bold text-white shadow-sm transition disabled:opacity-60',
                        hasChanges ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 dark:bg-slate-600')}
                    >
                      <CheckCircle2 size={16} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
                {error && <div className="border-t border-slate-200 p-4 dark:border-slate-800"><ErrorText text={error} /></div>}
              </>
            )}
          </div>
        )
      })()}

      {activeTab === 'ip' && <IpRestrictionsTab roles={roles} />}

      {/* Add / Edit Role modal */}
      {showForm && (
        <SimpleModal title={editing ? 'Edit Role' : 'Add Role'} subtitle="Select permissions for this role." onClose={resetForm}>
          <form className="grid gap-3" onSubmit={submit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput label="Role Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <FormInput label="Role Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required={Boolean(editing)} />
            </div>
            <FormTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <p className="mb-3 text-sm font-bold">Permissions</p>
              <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                {Object.entries(permissions).map(([group, items]) => (
                  <div key={group}>
                    <p className="mb-2 text-xs font-bold uppercase text-slate-500">{group}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                          <input type="checkbox" checked={form.permission_ids.includes(p.id)} onChange={() => togglePermission(p.id)} />
                          <span>{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {error && <ErrorText text={error} />}
            <SubmitButton saving={saving} label={editing ? 'Update Role' : 'Save Role'} />
          </form>
        </SimpleModal>
      )}

      {/* Add / Edit Permission modal */}
      {showPermissionForm && (
        <SimpleModal title={editingPermission ? 'Edit Permission' : 'Add Permission'} subtitle="Permissions control what each role can access." onClose={() => setShowPermissionForm(false)}>
          <form className="grid gap-3" onSubmit={submitPermission}>
            <FormInput label="Permission Name" value={permissionForm.name} onChange={(v) => setPermissionForm({ ...permissionForm, name: v })} required />
            <FormInput label="Permission Slug" value={permissionForm.slug} onChange={(v) => setPermissionForm({ ...permissionForm, slug: v })} required={Boolean(editingPermission)} />
            <FormInput label="Group" value={permissionForm.group} onChange={(v) => setPermissionForm({ ...permissionForm, group: v })} required />
            {error && <ErrorText text={error} />}
            <SubmitButton saving={saving} label={editingPermission ? 'Update Permission' : 'Save Permission'} />
          </form>
        </SimpleModal>
      )}
    </>
  )
}
