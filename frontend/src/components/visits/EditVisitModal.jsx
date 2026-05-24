import { useEffect, useState } from 'react'
import { Loader2, Pencil, X } from 'lucide-react'
import { api } from '../../services/api'

export default function EditVisitModal({ visit, onClose, onSaved }) {
  const [provinces, setProvinces] = useState([])
  const [form, setForm] = useState({
    customer_name: visit.customer_name || '',
    store_name:    visit.store_name    || '',
    phone:         visit.phone         || '',
    address:       visit.address       || '',
    province:      visit.province      || '',
    notes:         visit.notes         || '',
  })
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    api.get('/customer-visits/provinces')
      .then((r) => setProvinces(r.data || []))
      .catch(() => {})
  }, [])

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const { data } = await api.patch(`/customer-visits/${visit.id}`, form)
      onSaved(data)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40">
              <Pencil size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Edit Visit</h3>
              <p className="text-xs text-slate-500">{visit.customer_name}</p>
            </div>
          </div>
          <button
            type="button" onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer Name" required error={errors.customer_name?.[0]}>
              <input
                value={form.customer_name}
                onChange={(e) => set('customer_name', e.target.value)}
                className={inputCls(errors.customer_name)}
                placeholder="Customer name"
              />
            </Field>

            <Field label="Phone" required error={errors.phone?.[0]}>
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className={inputCls(errors.phone)}
                placeholder="Phone number"
              />
            </Field>

            <Field label="Store Name" error={errors.store_name?.[0]}>
              <input
                value={form.store_name}
                onChange={(e) => set('store_name', e.target.value)}
                className={inputCls(errors.store_name)}
                placeholder="Store / shop name"
              />
            </Field>

            <Field label="Province" error={errors.province?.[0]}>
              <select
                value={form.province}
                onChange={(e) => set('province', e.target.value)}
                className={inputCls(errors.province)}
              >
                <option value="">— Select province —</option>
                {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                {form.province && !provinces.includes(form.province) && (
                  <option value={form.province}>{form.province}</option>
                )}
              </select>
            </Field>
          </div>

          <Field label="Address" required error={errors.address?.[0]}>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className={inputCls(errors.address) + ' resize-none'}
              placeholder="Full address"
            />
          </Field>

          <Field label="Notes" error={errors.notes?.[0]}>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className={inputCls(errors.notes) + ' resize-none'}
              placeholder="Optional notes…"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button" onClick={onClose}
              className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function inputCls(err) {
  return [
    'w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition',
    'focus:ring-2 focus:ring-blue-400/20 dark:bg-slate-800 dark:text-white',
    err
      ? 'border-rose-400 focus:border-rose-400'
      : 'border-slate-200 focus:border-blue-400 dark:border-slate-700',
  ].join(' ')
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-400">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  )
}
