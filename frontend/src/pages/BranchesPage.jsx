import { useCallback, useEffect, useState } from 'react'
import { Building2, MapPin, Pencil, Plus, Trash2, Wifi } from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { DataPanel, EmptyState, ErrorText, FormInput, PanelHeader, SimpleModal, SubmitButton } from '../components/shared/UI'
import { apiError } from '../utils/format'

const EMPTY_FORM = {
  name: '',
  code: '',
  address: '',
  latitude: '',
  longitude: '',
  attendance_radius_meters: 100,
  status: true,
}

export default function BranchesPage() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/branches')
      setBranches(res.data || [])
    } catch {
      setError('Cannot load branches.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  const openEdit = (branch) => {
    setEditing(branch)
    setForm({
      name: branch.name || '',
      code: branch.code || '',
      address: branch.address || '',
      latitude: branch.latitude ?? '',
      longitude: branch.longitude ?? '',
      attendance_radius_meters: branch.attendance_radius_meters ?? 100,
      status: Boolean(branch.status),
    })
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        latitude: form.latitude !== '' ? Number(form.latitude) : null,
        longitude: form.longitude !== '' ? Number(form.longitude) : null,
        attendance_radius_meters: Number(form.attendance_radius_meters) || 100,
      }
      if (editing) {
        await api.put(`/branches/${editing.id}`, payload)
      } else {
        await api.post('/branches', payload)
      }
      closeForm()
      await load()
    } catch (ex) {
      setError(apiError(ex))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (branch) => {
    if (!confirm(`Delete branch "${branch.name}"?`)) return
    try {
      await api.delete(`/branches/${branch.id}`)
      await load()
    } catch {
      setError('Could not delete branch.')
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <PanelHeader
          title="Branch List"
          subtitle="Manage office branches and GPS check-in radius."
          actionLabel="Add Branch"
          onAction={openAdd}
        />

        {loading ? (
          <EmptyState text="Loading branches..." />
        ) : branches.length === 0 ? (
          <EmptyState text="No branches yet. Click Add Branch to create one." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    {['Code', 'Branch Name', 'Address', 'GPS Radius', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {branches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">{branch.code || '—'}</td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{branch.name}</td>
                      <td className="max-w-xs truncate px-5 py-4 text-slate-500 dark:text-slate-400">{branch.address || '—'}</td>
                      <td className="px-5 py-4">
                        {branch.latitude && branch.longitude ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            <Wifi size={13} />
                            {branch.attendance_radius_meters}m
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">No GPS</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge active={Boolean(branch.status)} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(branch)}
                            className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(branch)}
                            className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{branch.name}</p>
                      {branch.code && <p className="mt-0.5 font-mono text-xs text-slate-400">{branch.code}</p>}
                      {branch.address && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} /> {branch.address}
                        </p>
                      )}
                    </div>
                    <StatusBadge active={Boolean(branch.status)} />
                  </div>
                  {branch.latitude && branch.longitude && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <Wifi size={13} /> GPS radius: {branch.attendance_radius_meters}m
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => openEdit(branch)} className="text-xs font-bold text-sky-600">Edit</button>
                    <button type="button" onClick={() => remove(branch)} className="text-xs font-bold text-rose-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <SimpleModal
          title={editing ? 'Edit Branch' : 'Add Branch'}
          subtitle="Set branch name, address and GPS check-in radius."
          onClose={closeForm}
        >
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Branch Name" value={form.name} onChange={(v) => set('name', v)} required />
              <FormInput label="Branch Code" value={form.code} onChange={(v) => set('code', v)} placeholder="e.g. PP-01" />
            </div>
            <FormInput label="Address" value={form.address} onChange={(v) => set('address', v)} placeholder="123 Street, Phnom Penh" />

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">GPS Location <span className="text-xs font-normal text-slate-400">(optional — for check-in radius)</span></p>
              <div className="grid gap-3 sm:grid-cols-3">
                <FormInput label="Latitude" value={form.latitude} onChange={(v) => set('latitude', v)} placeholder="11.5564" type="number" />
                <FormInput label="Longitude" value={form.longitude} onChange={(v) => set('longitude', v)} placeholder="104.9282" type="number" />
                <FormInput label="Radius (meters)" value={form.attendance_radius_meters} onChange={(v) => set('attendance_radius_meters', v)} type="number" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Active</p>
                <p className="text-xs text-slate-500">Inactive branches won't appear in employee assignment.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.status}
                onClick={() => set('status', !form.status)}
                className={clsx('relative h-7 w-12 shrink-0 rounded-full transition-colors', form.status ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')}
              >
                <span className={clsx('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', form.status ? 'left-6' : 'left-1')} />
              </button>
            </div>

            {error && <ErrorText text={error} />}
            <SubmitButton saving={saving} label={editing ? 'Update Branch' : 'Save Branch'} />
          </form>
        </SimpleModal>
      )}
    </>
  )
}

function StatusBadge({ active }) {
  return (
    <span className={clsx(
      'inline-flex rounded-full px-3 py-1 text-xs font-bold',
      active
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    )}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
