import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Clock, Loader2, LogOut, MapPin, Navigation, X, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { attendanceService } from '../../services/api'
import { reverseGeocode } from '../../utils/geocode'
import { coordsFromPosition, geolocationErrorMessage, isGeolocationSupported, isSecureGeolocationContext, requestCurrentPosition } from '../../utils/geolocation'
import NoticeAlertCard from '../shared/NoticeAlertCard'

export default function AttendanceActionModal({ action, onClose, onSaved }) {
  const locationAlertShownRef = useRef(false)
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [coords, setCoords] = useState(null)
  const [address, setAddress] = useState('')
  const [addressLoading, setAddressLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  const isCheckIn = action === 'check-in'
  const canSubmit = gpsStatus === 'granted' && !submitting && !notice

  const openNotice = (variant, title, message, onConfirm) => {
    setNotice({ variant, title, message, onConfirm })
  }

  const closeNotice = () => {
    setNotice((current) => {
      current?.onConfirm?.()
      return null
    })
  }

  const requestGps = () => {
    if (!isGeolocationSupported()) {
      setGpsStatus('denied')
      setError(geolocationErrorMessage({ code: 'UNSUPPORTED' }))
      return
    }
    if (!isSecureGeolocationContext()) {
      setGpsStatus('denied')
      setError(geolocationErrorMessage({}))
      return
    }
    if (gpsStatus === 'requesting') return

    setGpsStatus('requesting')
    setError('')

    requestCurrentPosition()
      .then(async (pos) => {
        const nextCoords = coordsFromPosition(pos)
        setCoords(nextCoords)
        setGpsStatus('granted')
        setAddressLoading(true)
        setAddress('')
        try {
          const label = await reverseGeocode(nextCoords.latitude, nextCoords.longitude)
          setAddress(label)
        } catch {
          setAddress(`${nextCoords.latitude.toFixed(6)}, ${nextCoords.longitude.toFixed(6)}`)
        } finally {
          setAddressLoading(false)
        }
      })
      .catch((err) => {
        setGpsStatus('denied')
        const message = geolocationErrorMessage(err)
        setError(message)
        if (!locationAlertShownRef.current) {
          locationAlertShownRef.current = true
          openNotice('warning', 'Location required', message)
        }
      })
  }

  useEffect(() => {
    requestGps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showNoticeError = (message, title) => {
    if (!message) return
    const lines = Array.isArray(message) ? message : [message]
    openNotice('error', title || (isCheckIn ? 'Check-in failed' : 'Check-out not allowed'), lines)
    setError(lines.join(' '))
  }

  const submitAttendance = async () => {
    if (!coords) {
      openNotice('warning', 'Location required', 'Location is required before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    const fd = new FormData()
    fd.append('latitude', coords.latitude)
    fd.append('longitude', coords.longitude)
    fd.append('accuracy', coords.accuracy || '')
    fd.append('speed', coords.speed || 0)
    if (address) fd.append('address', address)

    if (isCheckIn) {
      fd.append('type', 'office')
      fd.append('notes', 'Submitted from web attendance.')
    }

    try {
      if (isCheckIn) {
        await attendanceService.checkIn(fd)
        openNotice('success', 'Check-in saved', '', () => onSaved({ action, warnings: [] }))
      } else {
        await attendanceService.checkOut(fd)
        openNotice('success', 'Check-out saved', '', () => onSaved({ action, warnings: [] }))
      }
    } catch (ex) {
      const errs = ex.response?.data?.errors
      const msg = ex.response?.data?.message
      const lines = errs ? Object.values(errs).flat() : msg ? [msg] : ['Attendance submission failed.']
      showNoticeError(lines)
    } finally {
      setSubmitting(false)
    }
  }

  const accentClass = isCheckIn
    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <NoticeAlertCard
          open={Boolean(notice)}
          variant={notice?.variant}
          title={notice?.title}
          message={notice?.message}
          onConfirm={closeNotice}
        />
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={clsx('grid h-10 w-10 place-items-center rounded-xl',
              isCheckIn ? 'bg-emerald-100 dark:bg-emerald-950/50' : 'bg-amber-100 dark:bg-amber-950/50')}>
              {isCheckIn ? <Clock size={20} className="text-emerald-600" /> : <LogOut size={20} className="text-amber-600" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{isCheckIn ? 'Check In' : 'Check Out'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your live location is required</p>
            </div>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <PermissionCard
            icon={MapPin}
            label="Current Location"
            status={gpsStatus}
            desc={
              gpsStatus === 'granted' && addressLoading ? 'Getting address...'
                : gpsStatus === 'granted' && address ? 'Address ready'
                  : gpsStatus === 'granted' ? 'Location captured'
                    : gpsStatus === 'denied' ? 'Tap to try again'
                      : gpsStatus === 'requesting' ? 'Allow location when asked...'
                        : 'Starting current location...'
            }
            onTap={gpsStatus !== 'granted' && gpsStatus !== 'requesting' ? requestGps : undefined}
          />

          {gpsStatus === 'denied' && <LocationHelpCard error={error} onRetry={requestGps} />}

          {coords && (
            <div className="rounded-lg bg-emerald-50 px-3 py-3 text-xs dark:bg-emerald-950/20">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Current location</p>
                  {addressLoading ? (
                    <p className="mt-1 text-emerald-700 dark:text-emerald-400">Looking up your address...</p>
                  ) : (
                    <p className="mt-1 leading-relaxed text-emerald-700 dark:text-emerald-400">{address || 'Address unavailable'}</p>
                  )}
                  <p className="mt-2 font-mono text-[10px] text-emerald-600/80 dark:text-emerald-500">
                    {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)} - +/-{Math.round(coords.accuracy || 0)} m
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={submitAttendance}
              disabled={!canSubmit}
              title={isCheckIn ? 'Submit Check In' : 'Submit Check Out'}
              className={clsx(
                'grid h-16 w-16 place-items-center rounded-full text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50',
                accentClass,
              )}
            >
              {submitting
                ? <Loader2 size={24} className="animate-spin" />
                : <CheckCircle2 size={24} />
              }
            </button>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isCheckIn ? 'Submit Check In' : 'Submit Check Out'}
            </span>
          </div>

          {error && gpsStatus !== 'denied' && !notice && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LocationHelpCard({ error, onRetry }) {
  const openLocationSettings = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isEdge = userAgent.includes('edg/')
    const isChrome = userAgent.includes('chrome') || userAgent.includes('crios')
    const settingsUrl = isEdge ? 'edge://settings/content/location' : isChrome ? 'chrome://settings/content/location' : null

    if (settingsUrl) {
      window.open(settingsUrl, '_blank')
      return
    }

    alert('Open your browser settings and allow Location permission for this site.')
  }

  const steps = [
    'Chrome / Edge: tap the lock icon beside the address, set Location to Allow, then refresh.',
    'Android: Settings > Location on, then App permissions > browser > Allow location.',
    'iPhone: Settings > Privacy & Security > Location Services on, then Safari/Chrome > Allow.',
  ]

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          <Navigation size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold">Turn on location to continue</p>
          <p className="mt-1 text-sm leading-5 text-amber-800 dark:text-amber-200/90">
            {error || 'Location permission is blocked for this site.'}
          </p>
          <div className="mt-3 space-y-2 text-xs leading-5 text-amber-800 dark:text-amber-100/90">
            {steps.map((step) => (
              <p key={step} className="rounded-lg bg-white/60 px-3 py-2 dark:bg-slate-950/25">{step}</p>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openLocationSettings}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <Navigation size={15} />
              Open Location Settings
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white/70 px-4 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-white dark:bg-slate-950/20 dark:text-amber-100"
            >
              <MapPin size={15} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PermissionCard({ icon: Icon, label, desc, status, onTap }) {
  const style = {
    granted: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400',
    denied: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400',
    requesting: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400',
    idle: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  }[status] || ''

  return (
    <button type="button" onClick={onTap} disabled={!onTap} className={clsx('rounded-xl border p-4 text-left transition', style, onTap && 'hover:scale-[1.01]')}>
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <div>
          <p className="text-sm font-bold">{label}</p>
          <p className="text-xs opacity-80">{desc}</p>
        </div>
      </div>
    </button>
  )
}
