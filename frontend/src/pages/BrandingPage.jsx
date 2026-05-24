import { useEffect, useMemo, useState } from 'react'
import { Globe2, Image, Save, Upload } from 'lucide-react'
import { api } from '../services/api'
import { apiError } from '../utils/format'

export default function BrandingPage({ appData, refresh }) {
  const settings = appData.appSettings || {}
  const [form, setForm] = useState({
    company_name: settings.company_name || 'SalesTrack',
    site_title: settings.site_title || settings.company_name || 'SalesTrack',
    company_logo_url: settings.company_logo_url || '',
    company_icon_url: settings.company_icon_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')
  const [notice, setNotice] = useState({ type: '', text: '' })

  useEffect(() => {
    // Keep the form in sync when fresh settings are loaded after save/upload.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      company_name: settings.company_name || 'SalesTrack',
      site_title: settings.site_title || settings.company_name || 'SalesTrack',
      company_logo_url: settings.company_logo_url || '',
      company_icon_url: settings.company_icon_url || '',
    })
  }, [settings.company_icon_url, settings.company_logo_url, settings.company_name, settings.site_title])

  const previewTitle = useMemo(() => form.site_title.trim() || form.company_name.trim() || 'SalesTrack', [form.company_name, form.site_title])

  const set = (key, value) => {
    setNotice({ type: '', text: '' })
    setForm((current) => ({ ...current, [key]: value }))
  }

  const saveText = async () => {
    setSaving(true)
    setNotice({ type: '', text: '' })
    try {
      await api.put('/settings', {
        settings: {
          company_name: form.company_name.trim(),
          site_title: form.site_title.trim(),
        },
      })
      setNotice({ type: 'success', text: 'Brand title saved.' })
      await refresh?.()
    } catch (error) {
      setNotice({ type: 'error', text: apiError(error) })
    } finally {
      setSaving(false)
    }
  }

  const uploadAsset = async (event, type) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(type)
    setNotice({ type: '', text: '' })
    try {
      const body = new FormData()
      body.append(type, file)
      const response = await api.post(`/settings/${type}`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const key = type === 'logo' ? 'company_logo_url' : 'company_icon_url'
      set(key, response.data[`${type}_url`] || '')
      setNotice({ type: 'success', text: type === 'logo' ? 'Logo uploaded.' : 'Website icon uploaded.' })
      await refresh?.()
    } catch (error) {
      setNotice({ type: 'error', text: apiError(error) })
    } finally {
      setUploading('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Globe2 size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Website Branding</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set the sidebar logo, browser icon, and website title.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={saveText}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Title'}
        </button>
      </div>

      {notice.text && (
        <p className={notice.type === 'error'
          ? 'rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
          : 'rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'}
        >
          {notice.text}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-base font-bold text-slate-950 dark:text-white">Text</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Company Name</span>
                <input
                  value={form.company_name}
                  onChange={(event) => set('company_name', event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Browser Title</span>
                <input
                  value={form.site_title}
                  onChange={(event) => set('site_title', event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <AssetUpload
              title="Website Logo"
              description="Used in the sidebar and app header."
              imageUrl={form.company_logo_url}
              uploading={uploading === 'logo'}
              onChange={(event) => uploadAsset(event, 'logo')}
            />
            <AssetUpload
              title="Website Icon"
              description="Used for the browser tab and phone home screen shortcut. Use a square PNG (192×192 or larger)."
              imageUrl={form.company_icon_url}
              uploading={uploading === 'icon'}
              onChange={(event) => uploadAsset(event, 'icon')}
              compact
            />
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-base font-bold text-slate-950 dark:text-white">Preview</h4>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              {form.company_logo_url ? (
                <img src={form.company_logo_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-600 text-white">
                  <Image size={20} />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-950 dark:text-white">{form.company_name || 'SalesTrack'}</p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">{previewTitle}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
            {form.company_icon_url ? (
              <img src={form.company_icon_url} alt="" className="h-5 w-5 rounded object-cover" />
            ) : (
              <Globe2 size={18} className="text-slate-500" />
            )}
            <span className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{previewTitle}</span>
          </div>
        </section>
      </div>
    </div>
  )
}

function AssetUpload({ title, description, imageUrl, uploading, onChange, compact = false }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h4 className="text-base font-bold text-slate-950 dark:text-white">{title}</h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className={compact ? 'grid h-16 w-16 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950' : 'grid h-24 w-24 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'}>
          {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : <Image size={24} className="text-slate-400" />}
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={uploading} />
        </label>
      </div>
    </section>
  )
}
