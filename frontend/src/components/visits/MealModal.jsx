import { useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Clock, Loader2, MapPin, Moon, Soup, Sunrise, X } from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'
import { apiError } from '../../utils/format'

const mealOptions = [
  { value: 'breakfast', label: 'Breakfast', icon: Sunrise, tone: 'emerald' },
  { value: 'lunch', label: 'Lunch', icon: Soup, tone: 'orange' },
  { value: 'dinner', label: 'Dinner', icon: Moon, tone: 'violet' },
]

const tones = {
  emerald: {
    active: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300',
    idle: 'border-emerald-100 bg-white text-slate-950 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-slate-900 dark:text-white dark:hover:bg-emerald-950/20',
    icon: 'text-emerald-600',
    idleIcon: 'text-emerald-500',
    arrow: 'text-emerald-500',
    check: 'bg-emerald-600 text-white',
  },
  orange: {
    active: 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300',
    idle: 'border-orange-100 bg-white text-slate-950 hover:bg-orange-50 dark:border-orange-900/50 dark:bg-slate-900 dark:text-white dark:hover:bg-orange-950/20',
    icon: 'text-orange-500',
    idleIcon: 'text-orange-500',
    arrow: 'text-orange-500',
    check: 'bg-orange-500 text-white',
  },
  violet: {
    active: 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300',
    idle: 'border-violet-100 bg-white text-slate-950 hover:bg-violet-50 dark:border-violet-900/50 dark:bg-slate-900 dark:text-white dark:hover:bg-violet-950/20',
    icon: 'text-violet-600',
    idleIcon: 'text-violet-500',
    arrow: 'text-violet-500',
    check: 'bg-violet-600 text-white',
  },
}

export default function MealModal({ mealRecords = [], onClose, onSaved }) {
  const [selected, setSelected] = useState('breakfast')
  const [coords, setCoords] = useState(null)
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedRecord, setSavedRecord] = useState(null)
  const todayKey = dateToKey(new Date())
  const todayMeals = mealRecords.filter((record) => dateToKey(new Date(record.recorded_at || record.created_at)) === todayKey)
  const completedMealTypes = new Set(todayMeals.map((record) => record.meal_type))

  useEffect(() => {
    requestLocation()
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
        setCoords({
          latitude,
          longitude,
          address: 'Getting address...',
        })
        setGpsStatus('granted')

        reverseGeocode(latitude, longitude).then((address) => {
          setCoords({
            latitude,
            longitude,
            address: address || fallbackAddress,
          })
        })
      },
      () => {
        setGpsStatus('denied')
        setError('Cannot read GPS. Please allow location permission and try again.')
      },
      { enableHighAccuracy: true },
    )
  }

  const submit = async () => {
    if (completedMealTypes.has(selected)) {
      setError(`${mealOptions.find((option) => option.value === selected)?.label || 'Meal'} has already been recorded for today.`)
      return
    }

    if (!coords) {
      setError('Location is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { data } = await api.post('/meal-records', {
        meal_type: selected,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: coords.address,
      })
      setSavedRecord(data)
      onSaved?.({ keepOpen: true })
    } catch (ex) {
      setError(apiError(ex))
    } finally {
      setSaving(false)
    }
  }

  const done = () => {
    onSaved?.()
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 sm:grid sm:place-items-center sm:bg-slate-950/70 sm:p-4 sm:backdrop-blur-sm">
      <div className="flex h-full w-full flex-col bg-white dark:bg-slate-950 sm:h-auto sm:max-h-[94vh] sm:max-w-sm sm:overflow-hidden sm:rounded-3xl sm:shadow-2xl">
        <div className="flex shrink-0 items-center justify-between px-5 py-4">
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-base font-bold text-slate-950 dark:text-white">Meal</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
            <X size={18} />
          </button>
        </div>

        {savedRecord ? (
          <MealSuccess record={savedRecord} selected={selected} onDone={done} />
        ) : (
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
            <p className="text-sm font-bold text-slate-950 dark:text-white">Select Meal Type</p>

            <div className="space-y-4">
              {mealOptions.map((option) => {
                const Icon = option.icon
                const isActive = selected === option.value
                const tone = tones[option.tone]
                const completed = completedMealTypes.has(option.value)

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (!completed) setSelected(option.value)
                    }}
                    disabled={completed}
                    className={clsx(
                      'flex h-20 w-full items-center gap-4 rounded-xl border px-4 text-left shadow-sm transition active:scale-[0.99] disabled:opacity-60',
                      completed
                        ? 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-500'
                        : isActive
                        ? tone.active
                        : tone.idle,
                    )}
                  >
                    <Icon size={32} className={completed ? 'text-slate-400' : isActive ? tone.icon : tone.idleIcon} />
                    <span className="flex-1 text-sm font-bold">{option.label}</span>
                    {completed ? (
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Done
                      </span>
                    ) : isActive ? (
                      <span className={clsx('grid h-6 w-6 place-items-center rounded-full', tone.check)}>
                        <Check size={15} strokeWidth={3} />
                      </span>
                    ) : (
                      <ChevronRight size={20} className={tone.arrow} />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-auto space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Location</span>
                  <button type="button" onClick={requestLocation} className="text-xs font-bold text-emerald-600">
                    {gpsStatus === 'requesting' ? 'Getting...' : 'Auto'}
                  </button>
                </div>
                <p className="mt-1 truncate text-slate-500 dark:text-slate-400">{coords?.address || 'Location required'}</p>
              </div>

              {todayMeals.length > 0 && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Completed today: {todayMeals.map((record) => mealOptions.find((option) => option.value === record.meal_type)?.label || record.meal_type).join(', ')}
                </div>
              )}
              {error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

              <button
                type="button"
                onClick={submit}
                disabled={saving || completedMealTypes.has(selected)}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                Save Meal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MealSuccess({ record, selected, onDone }) {
  const option = mealOptions.find((item) => item.value === selected) || mealOptions[0]
  const Icon = option.icon

  return (
    <div className="flex flex-1 flex-col px-5 pb-5 text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Check size={48} strokeWidth={3} />
        </div>
        <h3 className="mt-6 text-xl font-black text-slate-950 dark:text-white">Meal Recorded!</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your meal has been saved successfully.</p>

        <div className="mt-8 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SuccessRow icon={Icon} label="Meal Type" value={option.label} valueClass="text-emerald-600" />
          <SuccessRow icon={Clock} label="Time" value={new Date(record.recorded_at).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
          <SuccessRow icon={MapPin} label="Location" value={record.address} />
        </div>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  )
}

function SuccessRow({ icon: Icon, label, value, valueClass = 'text-slate-500 dark:text-slate-400' }) {
  return (
    <div className="grid grid-cols-[1fr_1.3fr] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        <Icon size={17} className="text-emerald-600" />
        {label}
      </div>
      <p className={clsx('truncate text-sm font-semibold', valueClass)}>{value}</p>
    </div>
  )
}

function dateToKey(date) {
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function reverseGeocode(latitude, longitude) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.Geocoder) {
      resolve('')
      return
    }

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results?.[0]?.formatted_address) {
        resolve(results[0].formatted_address)
        return
      }
      resolve('')
    })
  })
}
