import { useEffect, useRef, useState } from 'react'
import { Building2, Camera, Check, ChevronLeft, ChevronRight, Clock, Hotel, Loader2, LogOut, MapPin, X } from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'
import { apiError } from '../../utils/format'
import { compressImageForUpload } from '../../utils/imageCapture'

export default function HotelModal({ activeStay, onClose, onSaved }) {
  const [mode, setMode] = useState(activeStay ? 'check-out' : 'choose')
  const [savedStay, setSavedStay] = useState(null)

  if (savedStay) {
    return <HotelShell title={savedStay.status === 'completed' ? 'Checked Out' : 'Checked In'} onClose={onClose}>
      <HotelSuccess stay={savedStay} onDone={() => onSaved?.()} />
    </HotelShell>
  }

  if (mode === 'choose') {
    return <HotelShell title="Hotel" onClose={onClose}>
      <div className="flex flex-1 flex-col gap-5 px-5 pb-5">
        <p className="text-sm font-bold text-slate-950 dark:text-white">Select Action</p>
        <ActionCard icon={Hotel} title="Check-In Hotel" sub="Check in to your hotel" active onClick={() => setMode('check-in')} />
        <ActionCard icon={LogOut} title="Check-Out Hotel" sub="Check out from hotel" disabled={!activeStay} onClick={() => setMode('check-out')} tone="orange" />
      </div>
    </HotelShell>
  }

  return <HotelForm mode={mode} stay={activeStay} onClose={onClose} onSaved={(stay) => {
    setSavedStay(stay)
    onSaved?.({ keepOpen: true, stay })
  }} />
}

function HotelShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 sm:grid sm:place-items-center sm:bg-slate-950/70 sm:p-4 sm:backdrop-blur-sm">
      <div className="flex h-full w-full flex-col bg-white dark:bg-slate-950 sm:h-auto sm:max-h-[94vh] sm:max-w-sm sm:overflow-hidden sm:rounded-3xl sm:shadow-2xl">
        <div className="flex shrink-0 items-center justify-between px-5 py-4">
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ActionCard({ icon: Icon, title, sub, active = false, disabled = false, onClick, tone = 'emerald' }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'flex h-24 items-center gap-4 rounded-xl border px-4 text-left shadow-sm transition active:scale-[0.99] disabled:opacity-50',
        active
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
          : tone === 'orange'
            ? 'border-orange-100 bg-white hover:bg-orange-50 dark:border-orange-900/50 dark:bg-slate-900 dark:hover:bg-orange-950/20'
            : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900',
      )}
    >
      <Icon size={32} className={active ? 'text-emerald-600' : tone === 'orange' ? 'text-orange-500' : 'text-slate-500'} />
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-950 dark:text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
      {active ? <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white"><Check size={15} /></span> : <ChevronRight size={20} className="text-slate-400" />}
    </button>
  )
}

function HotelForm({ mode, stay, onClose, onSaved }) {
  const isOut = mode === 'check-out'
  const [carKm, setCarKm] = useState('')
  const [coords, setCoords] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    requestLocation()
    return () => {
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied')
      setError('GPS not supported on this device.')
      return
    }
    setGpsStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        setCoords({ latitude, longitude, address: 'Getting address...' })
        setGpsStatus('granted')
        reverseGeocode(latitude, longitude).then((address) => setCoords({ latitude, longitude, address: address || fallbackAddress }))
      },
      () => {
        setGpsStatus('denied')
        setError('Cannot read GPS. Please allow location permission and try again.')
      },
      { enableHighAccuracy: true },
    )
  }

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const prepared = await compressImageForUpload(file, { fileName: isOut ? 'hotel-check-out' : 'hotel-check-in' })
    if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhoto(prepared)
    setPhotoPreview(URL.createObjectURL(prepared))
  }

  const submit = async () => {
    if (!carKm.trim()) return setError('Car kilometer is required.')
    if (!coords) return setError('Location is required.')
    if (!photo) return setError('Photo is required.')

    setSaving(true)
    setError('')
    const body = new FormData()
    body.append('car_km', carKm.replaceAll(',', ''))
    body.append('latitude', String(coords.latitude))
    body.append('longitude', String(coords.longitude))
    body.append('address', coords.address)
    body.append('photo', photo)
    if (note.trim()) body.append('notes', note.trim())

    try {
      const { data } = isOut
        ? await api.post(`/hotel-stays/${stay.id}/check-out`, body)
        : await api.post('/hotel-stays/check-in', body)
      onSaved(data)
    } catch (ex) {
      setError(apiError(ex))
    } finally {
      setSaving(false)
    }
  }

  return (
    <HotelShell title={isOut ? 'Check-Out Hotel' : 'Check-In Hotel'} onClose={onClose}>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
        <label className="block">
          <span className="text-sm font-bold text-slate-950 dark:text-white">Car Kilometer (KM) *</span>
          <input value={carKm} onChange={(e) => setCarKm(e.target.value)} inputMode="numeric" placeholder={isOut ? '12,785' : '12,450'} className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
        </label>
        <button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-20 w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-emerald-950/20">
          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-slate-950">
            {photoPreview ? <img src={photoPreview} alt="" className="h-full w-full object-cover" /> : <Camera size={24} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-emerald-700 dark:text-emerald-300">{photoPreview ? 'Photo ready' : 'Open Camera'}</span>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Take one photo</span>
          </span>
          <Camera size={18} className="shrink-0 text-slate-400" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (Optional)" className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <InfoRow icon={MapPin} label="Current Location" value={coords?.address || (gpsStatus === 'requesting' ? 'Getting location...' : 'Location required')} action="Auto" onClick={requestLocation} />
          <InfoRow icon={Clock} label="Current Time" value={new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} action="Auto" />
        </div>
        {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div>}
        <button onClick={submit} disabled={saving} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/20 disabled:opacity-60">
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
          {isOut ? 'Check-Out' : 'Check-In'}
        </button>
      </div>
    </HotelShell>
  )
}

function InfoRow({ icon: Icon, label, value, action, onClick }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 p-3 last:border-b-0 dark:border-slate-800">
      <Icon size={20} className="text-emerald-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="truncate text-xs text-slate-500">{value}</p>
      </div>
      <button type="button" onClick={onClick} className="text-xs font-bold text-emerald-600">{action}</button>
    </div>
  )
}

function HotelSuccess({ stay, onDone }) {
  const done = stay.status === 'completed'
  return (
    <div className="flex flex-1 flex-col px-5 pb-5 text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={48} /></div>
        <h3 className="mt-6 text-xl font-black">{done ? 'Checked Out!' : 'Checked-In!'}</h3>
        <p className="mt-2 text-sm text-slate-500">Your hotel stay has been saved successfully.</p>
        <div className="mt-8 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <InfoRow icon={Building2} label="Car Kilometer (KM)" value={done ? stay.check_out_km : stay.check_in_km} />
          <InfoRow icon={Clock} label={done ? 'Check-Out Time' : 'Check-In Time'} value={new Date(done ? stay.check_out_at : stay.check_in_at).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
          <InfoRow icon={MapPin} label="Location" value={done ? stay.check_out_address : stay.check_in_address} />
        </div>
      </div>
      <button type="button" onClick={onDone} className="mt-5 h-14 rounded-xl bg-emerald-600 text-base font-bold text-white">Done</button>
    </div>
  )
}

function reverseGeocode(latitude, longitude) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.Geocoder) return resolve('')
    new window.google.maps.Geocoder().geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      resolve(status === 'OK' && results?.[0]?.formatted_address ? results[0].formatted_address : '')
    })
  })
}
