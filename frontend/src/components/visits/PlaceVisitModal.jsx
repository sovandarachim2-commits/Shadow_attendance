import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, ChevronLeft, Clock, Loader2, MapPin, Play, Save, Square, X } from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'
import { apiError } from '../../utils/format'
import { compressImageForUpload } from '../../utils/imageCapture'

export default function PlaceVisitModal({ activeVisit, onClose, onSaved }) {
  const isEnding = Boolean(activeVisit)
  const [coords, setCoords] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(new Date())
  const fileRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    requestLocation()
    return () => {
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const duration = useMemo(() => {
    if (!activeVisit?.started_at) return '00:00:00'
    const seconds = Math.max(0, Math.floor((now - new Date(activeVisit.started_at)) / 1000))
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [activeVisit?.started_at, now])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('GPS not supported on this device.')
      setGpsStatus('denied')
      return
    }

    setGpsStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        setCoords({
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        })
        setGpsStatus('granted')
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
    setError('')
    const prepared = await compressImageForUpload(file, {
      fileName: isEnding ? 'place-visit-end' : 'place-visit-start',
    })
    if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhoto(prepared)
    setPhotoPreview(URL.createObjectURL(prepared))
  }

  const submit = async () => {
    if (!coords) {
      setError('Live location is required.')
      return
    }
    if (!photo) {
      setError(`${isEnding ? 'End' : 'Start'} photo is required.`)
      return
    }

    setSaving(true)
    setError('')
    const body = new FormData()
    body.append('latitude', String(coords.latitude))
    body.append('longitude', String(coords.longitude))
    body.append('address', coords.address)
    body.append('photo', photo)
    if (note.trim()) body.append('notes', note.trim())

    try {
      if (isEnding) {
        body.append('_method', 'PATCH')
        await api.post(`/place-visits/${activeVisit.id}/end`, body)
      } else {
        await api.post('/place-visits/start', body)
      }
      onSaved()
    } catch (ex) {
      setError(apiError(ex))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 sm:grid sm:place-items-center sm:bg-slate-950/70 sm:p-4 sm:backdrop-blur-sm">
      <div className="flex h-full w-full flex-col bg-white dark:bg-slate-950 sm:h-auto sm:max-h-[94vh] sm:max-w-md sm:overflow-hidden sm:rounded-3xl sm:shadow-2xl">
        <div className="flex shrink-0 items-center justify-between px-5 py-4">
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{isEnding ? 'End Place Visit' : 'Start Place Visit'}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          {isEnding && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                Visit in progress
              </div>
              <p className="mt-3 text-4xl font-bold tabular-nums text-slate-950 dark:text-white">{duration}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Started at {new Date(activeVisit.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={clsx(
              'flex w-full items-center gap-4 rounded-xl border p-4 text-left shadow-sm',
              isEnding
                ? 'border-violet-200 bg-violet-50/60 dark:border-violet-900 dark:bg-violet-950/20'
                : 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20',
            )}
          >
            <div className={clsx('grid h-14 w-14 shrink-0 place-items-center rounded-xl', isEnding ? 'bg-violet-100 text-violet-600' : 'bg-emerald-100 text-emerald-600')}>
              {photoPreview ? <img src={photoPreview} alt="" className="h-full w-full rounded-xl object-cover" /> : <Camera size={24} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-950 dark:text-white">Photo ({isEnding ? 'End' : 'Start'})</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{photo ? 'Photo ready' : 'Take a photo of the place'}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">Required</p>
            </div>
            <Camera size={18} className="text-slate-400" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="font-bold text-slate-950 dark:text-white">Note ({isEnding ? 'End' : 'Start'})</p>
            <textarea
              className="mt-3 min-h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
              placeholder="Write a note..."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <LiveRow icon={MapPin} label="Current Location" value={coords?.address || (gpsStatus === 'requesting' ? 'Getting location...' : 'Location required')} tone={isEnding ? 'violet' : 'emerald'} onRetry={requestLocation} />
            <LiveRow icon={Clock} label="Current Time" value={now.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} tone={isEnding ? 'violet' : 'emerald'} />
          </div>

          {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className={clsx(
              'flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-60',
              isEnding ? 'bg-red-600 shadow-red-600/20 hover:bg-red-700' : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700',
            )}
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : isEnding ? <Save size={20} /> : <Play size={20} />}
            {isEnding ? 'End Place Visit & Save' : 'Start Place Visit'}
          </button>

          {isEnding && (
            <p className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
              <Square size={12} />
              Live tracking will stop after saving.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function LiveRow({ icon: Icon, label, value, tone, onRetry }) {
  const color = tone === 'violet'
    ? 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300'
    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800">
      <div className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-full', color)}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950 dark:text-white">{label}</p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{value}</p>
      </div>
      <button type="button" onClick={onRetry} className={clsx('rounded-full px-2.5 py-1 text-xs font-bold', color)}>
        LIVE
      </button>
    </div>
  )
}
