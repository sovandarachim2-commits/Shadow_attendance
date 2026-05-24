import { useRef, useState } from 'react'
import {
  Camera, CheckCircle2, FolderOpen, Image, Loader2,
  MapPin, Navigation, Store, User, X,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'
import { apiError } from '../../utils/format'

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

export default function VisitModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ customer_name: '', phone: '', store_name: '' })
  const [location, setLocation] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [selfie, setSelfie] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState('')
  const [storePhoto, setStorePhoto] = useState(null)
  const [storePreview, setStorePreview] = useState('')
  const [photoAction, setPhotoAction] = useState(null) // null | 'selfie' | 'store'
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Native file inputs — camera and gallery for each photo slot
  const selfieCamRef  = useRef(null)
  const selfieGalRef  = useRef(null)
  const storeCamRef   = useRef(null)
  const storeGalRef   = useRef(null)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // ── GPS ──────────────────────────────────────────────────────────────────────
  const getLocation = () => {
    if (!navigator.geolocation) { setError('GPS not supported on this device.'); return }
    setGpsStatus('requesting')
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setGpsStatus('geocoding')
        let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        let province = ''
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'en' } },
          )
          const data = await res.json()
          if (data.display_name) address = data.display_name
          const a = data.address || {}
          province = a.state || a.province || a.county || a.city || ''
        } catch { /* keep coordinate fallback */ }
        setLocation({ lat, lng, address, province, url: `https://maps.google.com/?q=${lat},${lng}` })
        setGpsStatus('granted')
      },
      () => {
        setGpsStatus('denied')
        setError('Cannot read GPS. Please allow location permission and try again.')
      },
      { enableHighAccuracy: true },
    )
  }

  const resetLocation = () => { setLocation(null); setGpsStatus('idle') }

  // ── Photo handlers ───────────────────────────────────────────────────────────
  const applyFile = (type, file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    if (type === 'selfie') {
      if (selfiePreview?.startsWith('blob:')) URL.revokeObjectURL(selfiePreview)
      setSelfie(file)
      setSelfiePreview(url)
    } else {
      if (storePreview?.startsWith('blob:')) URL.revokeObjectURL(storePreview)
      setStorePhoto(file)
      setStorePreview(url)
    }
    setPhotoAction(null)
  }

  const clearSelfie = () => {
    if (selfiePreview?.startsWith('blob:')) URL.revokeObjectURL(selfiePreview)
    setSelfie(null); setSelfiePreview('')
  }
  const clearStore = () => {
    if (storePreview?.startsWith('blob:')) URL.revokeObjectURL(storePreview)
    setStorePhoto(null); setStorePreview('')
  }

  // Reset native input value so re-selecting same file works
  const triggerInput = (ref) => {
    if (ref.current) { ref.current.value = ''; ref.current.click() }
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault()
    if (!form.customer_name.trim()) { setError('Customer name is required.'); return }
    if (!form.phone.trim()) { setError('Phone number is required.'); return }
    if (!location) { setError('Please get your GPS location first.'); return }
    if (!selfie) { setError('Selfie photo is required.'); return }
    if (!storePhoto) { setError('Store photo is required.'); return }

    setSaving(true)
    setError('')
    const body = new FormData()
    body.append('customer_name', form.customer_name.trim())
    body.append('phone', form.phone.trim())
    if (form.store_name.trim()) body.append('store_name', form.store_name.trim())
    body.append('address', location.address)
    if (location.province) body.append('province', location.province)
    body.append('latitude', String(location.lat))
    body.append('longitude', String(location.lng))
    body.append('selfie', selfie)
    body.append('store_photo', storePhoto)

    try {
      await api.post('/customer-visits', body)
      onSaved()
    } catch (ex) {
      setError(apiError(ex))
    } finally {
      setSaving(false)
    }
  }

  const isGpsLoading = gpsStatus === 'requesting' || gpsStatus === 'geocoding'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/70 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-lg flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 sm:my-auto sm:h-auto sm:max-h-[96vh] sm:rounded-3xl sm:shadow-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-emerald-600 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
              <Store size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">🏪 Customer Visit</h3>
              <p className="text-xs text-emerald-100">Complete in under 1 minute</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <form className="space-y-3 p-4 pb-8" onSubmit={submit}>

            {/* ── Customer Information ── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <User size={14} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Customer Information
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Sokha Chan"
                    value={form.customer_name}
                    onChange={(e) => setField('customer_name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className={inputCls}
                    type="tel"
                    placeholder="e.g. 012 345 678"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
                    Store Name
                    <span className="ml-1 font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Lakamo Shop"
                    value={form.store_name}
                    onChange={(e) => setField('store_name', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ── Location ── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <MapPin size={14} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Location <span className="text-rose-500">*</span>
                </span>
                {gpsStatus === 'granted' && (
                  <span className="ml-auto text-xs font-bold text-emerald-600">✅ Captured</span>
                )}
              </div>
              <div className="p-4">
                {gpsStatus !== 'granted' ? (
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={isGpsLoading}
                    className={clsx(
                      'flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-sm font-bold transition',
                      gpsStatus === 'denied'
                        ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-400'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70',
                    )}
                  >
                    {isGpsLoading ? (
                      <><Loader2 size={18} className="animate-spin" />{gpsStatus === 'geocoding' ? 'Getting Address…' : 'Getting GPS…'}</>
                    ) : (
                      <><Navigation size={18} />{gpsStatus === 'denied' ? '🔁 Retry GPS Location' : '📍 Get Current Location'}</>
                    )}
                  </button>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <div className="mb-3 flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <p className="text-sm leading-snug text-slate-700 dark:text-slate-200">{location.address}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <a
                        href={location.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
                      >
                        🛰 Open Map
                      </a>
                      <button type="button" onClick={resetLocation} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Reset</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Photos ── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <Camera size={14} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Photos</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4">
                {/* Selfie slot */}
                <PhotoSlot
                  label="🤳 Selfie"
                  required
                  hint="Front camera"
                  preview={selfiePreview}
                  onTake={() => setPhotoAction('selfie')}
                  onRemove={clearSelfie}
                />

                {/* Store photo slot */}
                <PhotoSlot
                  label="🏬 Store Photo"
                  required
                  hint="Rear camera"
                  preview={storePreview}
                  onTake={() => setPhotoAction('store')}
                  onRemove={clearStore}
                />
              </div>

              {/* Checklist row */}
              <div className="flex items-center gap-5 border-t border-slate-100 px-4 py-2.5 dark:border-slate-700">
                <CheckItem done={Boolean(selfie)} label="Selfie Captured" />
                <CheckItem done={Boolean(storePhoto)} label="Store Photo Captured" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Hidden native file inputs ── */}
      <input ref={selfieCamRef} type="file" accept="image/*" capture="user"
        className="hidden" onChange={(e) => applyFile('selfie', e.target.files?.[0])} />
      <input ref={selfieGalRef} type="file" accept="image/*"
        className="hidden" onChange={(e) => applyFile('selfie', e.target.files?.[0])} />
      <input ref={storeCamRef}  type="file" accept="image/*" capture="environment"
        className="hidden" onChange={(e) => applyFile('store', e.target.files?.[0])} />
      <input ref={storeGalRef}  type="file" accept="image/*"
        className="hidden" onChange={(e) => applyFile('store', e.target.files?.[0])} />

      {/* ── Photo Action Sheet ── */}
      {photoAction && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setPhotoAction(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white pb-safe shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Title */}
            <div className="flex items-center justify-between px-5 pt-2 pb-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {photoAction === 'selfie' ? '🤳 Selfie Photo' : '🏬 Store Photo'}
                </p>
                <p className="text-xs text-slate-500">
                  {photoAction === 'selfie' ? 'Take a selfie with the customer' : 'Take a photo of the store'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoAction(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 px-5 pb-8">
              {/* Camera button */}
              <button
                type="button"
                onClick={() => {
                  if (photoAction === 'selfie') triggerInput(selfieCamRef)
                  else triggerInput(storeCamRef)
                }}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 py-6 text-emerald-700 transition active:scale-95 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
                  <Camera size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">Open Camera</p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                    {photoAction === 'selfie' ? 'Front camera' : 'Rear camera'}
                  </p>
                </div>
              </button>

              {/* Gallery button */}
              <button
                type="button"
                onClick={() => {
                  if (photoAction === 'selfie') triggerInput(selfieGalRef)
                  else triggerInput(storeGalRef)
                }}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 py-6 text-slate-600 transition active:scale-95 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-600 text-white shadow-lg shadow-slate-600/30">
                  <Image size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">Choose Photo</p>
                  <p className="text-xs text-slate-400">From gallery</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Small reusable pieces ─────────────────────────────────────────────────────

function PhotoSlot({ label, required, hint, preview, onTake, onRemove }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-slate-600 dark:text-slate-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </p>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl">
          <img src={preview} alt={label} className="h-36 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-3 bg-gradient-to-t from-black/70 pb-2.5 pt-6">
            <button type="button" onClick={onTake} className="text-xs font-bold text-white">Retake</button>
            <button type="button" onClick={onRemove} className="text-xs font-bold text-rose-300">Remove</button>
          </div>
          <div className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            ✓ Ready
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onTake}
          className="flex h-36 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 dark:border-slate-700 dark:bg-slate-900"
        >
          <Camera size={26} />
          <span className="text-xs font-semibold">Take Photo</span>
          <span className="text-[10px] text-slate-400">{hint}</span>
        </button>
      )}
    </div>
  )
}

function CheckItem({ done, label }) {
  return (
    <span className={clsx('flex items-center gap-1.5 text-xs font-semibold', done ? 'text-emerald-600' : 'text-slate-400')}>
      {done
        ? <CheckCircle2 size={13} />
        : <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />}
      {label}
    </span>
  )
}
