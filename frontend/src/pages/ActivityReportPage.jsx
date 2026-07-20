import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Clock, Download, ExternalLink, Hotel, MapPin, Navigation, Search, Utensils } from 'lucide-react'
import { EmptyState, InfoCard, StatusPill } from '../components/shared/UI'
import { employeeFullName, formatDate, formatTime, titleCase } from '../utils/format'

const configs = {
  place: {
    title: 'Place Visit Report',
    subtitle: 'Outdoor place visits started from the Daily Activity Flow.',
    icon: MapPin,
    empty: 'No place visits found.',
    records: (appData) => appData.placeVisits || [],
    dateValue: (row) => row.started_at,
    searchValues: (row) => [row.start_address, row.end_address, row.status, employeeFullName(row.employee, ''), row.employee?.employee_code],
    columns: ['Date', 'Employee', 'Start Place', 'End / Live Location', 'Map Record', 'Duration', 'Status'],
    cells: (row) => [
      formatDate(row.started_at),
      <EmployeeCell key="employee" employee={row.employee} />,
      <LocationCell
        key="start"
        address={row.start_address}
        latitude={row.start_latitude}
        longitude={row.start_longitude}
        time={row.started_at}
      />,
      <LocationCell
        key="end"
        address={row.status === 'open' ? row.start_address : row.end_address}
        latitude={row.status === 'open' ? row.start_latitude : row.end_latitude}
        longitude={row.status === 'open' ? row.start_longitude : row.end_longitude}
        time={row.status === 'open' ? row.started_at : row.ended_at}
        live={row.status === 'open'}
      />,
      <MapRecordCell key="map" row={row} />,
      formatDuration(row.duration_minutes),
      <StatusPill key="status" status={titleCase(row.status || 'Open')} />,
    ],
    totals: (rows) => ({
      primary: rows.length,
      secondary: rows.filter((row) => row.status === 'open').length,
      minutes: rows.reduce((total, row) => total + Number(row.duration_minutes || 0), 0),
    }),
    cards: (totals) => [
      ['Place Visits', totals.primary, 'Filtered records'],
      ['Open', totals.secondary, 'Currently active'],
      ['Total Duration', formatDuration(totals.minutes), 'Saved visit time'],
    ],
  },
  meal: {
    title: 'Meal Report',
    subtitle: 'Meal records for outdoor sale workdays.',
    icon: Utensils,
    empty: 'No meal records found.',
    records: (appData) => appData.mealRecords || [],
    dateValue: (row) => row.recorded_at,
    searchValues: (row) => [row.meal_type, row.notes, employeeFullName(row.employee, '')],
    columns: ['No', 'Employee', 'Meal', 'Date', 'Time', 'Location', 'Photo', 'Status'],
    cells: (row, index) => [
      index + 1,
      <EmployeeCell key="employee" employee={row.employee} />,
      titleCase(row.meal_type),
      formatDate(row.recorded_at),
      formatTime(row.recorded_at),
      <MealLocationCell key="location" row={row} />,
      row.photo_url ? <PhotoLink key="photo" href={row.photo_url} /> : '-',
      <StatusPill key="status" status="Recorded" />,
    ],
    totals: (rows) => ({ primary: rows.length, secondary: 0, minutes: 0 }),
    cards: (totals) => [
      ['Meals', totals.primary, 'Filtered records'],
      ['Locations', totals.primary, 'GPS saved'],
      ['Today', totals.primary, 'Visible meal entries'],
    ],
  },
  hotel: {
    title: 'Hotel Report',
    subtitle: 'Overnight stay check-in and check-out records.',
    icon: Hotel,
    empty: 'No hotel stays found.',
    records: (appData) => appData.hotelStays || [],
    dateValue: (row) => row.check_in_at,
    searchValues: (row) => [row.check_in_address, row.check_out_address, row.status, employeeFullName(row.employee, '')],
    columns: ['No', 'Employee', 'Check-In Time', 'Check-Out Time', 'Car KM (In)', 'Car KM (Out)', 'Total KM', 'Location (Check-In)', 'Location (Check-Out)', 'Photo (In)', 'Photo (Out)', 'Note', 'Status'],
    cells: (row, index) => [
      index + 1,
      <EmployeeCell key="employee" employee={row.employee} />,
      <DateTimeCell key="in-time" value={row.check_in_at} />,
      row.check_out_at ? <DateTimeCell key="out-time" value={row.check_out_at} /> : '-',
      row.check_in_km ?? '-',
      row.check_out_km ?? '-',
      row.total_km ?? '-',
      <AddressMapCell key="in-loc" address={row.check_in_address} latitude={row.check_in_latitude} longitude={row.check_in_longitude} />,
      row.check_out_address ? <AddressMapCell key="out-loc" address={row.check_out_address} latitude={row.check_out_latitude} longitude={row.check_out_longitude} /> : '-',
      row.check_in_photo_url ? <PhotoLink key="in-photo" href={row.check_in_photo_url} /> : '-',
      row.check_out_photo_url ? <PhotoLink key="out-photo" href={row.check_out_photo_url} /> : '-',
      row.check_out_notes || row.check_in_notes || '-',
      <StatusPill key="status" status={row.status === 'completed' ? 'Completed' : 'Checked-In'} />,
    ],
    totals: (rows) => ({ primary: rows.length, secondary: rows.filter((row) => row.status === 'open').length, minutes: 0 }),
    cards: (totals) => [
      ['Hotel Stays', totals.primary, 'Filtered records'],
      ['Open', totals.secondary, 'Not checked out'],
      ['Expenses', '-', 'Coming with hotel capture'],
    ],
  },
}

export default function ActivityReportPage({ appData, type = 'place' }) {
  const config = configs[type] || configs.place
  const Icon = config.icon
  const [filters, setFilters] = useState({ date: '', search: '' })
  const records = config.records(appData)

  const filteredRecords = useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return records.filter((row) => {
      const date = config.dateValue(row)?.slice?.(0, 10)
      if (filters.date && date !== filters.date) return false
      if (search) {
        const haystack = config.searchValues(row).filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [config, filters, records])

  const totals = config.totals(filteredRecords)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Icon size={22} />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{config.title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{config.subtitle}</p>
          </div>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {config.cards(totals).map(([label, value, help]) => (
          <InfoCard key={label} label={label} value={value} help={help} />
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <label className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Search report..."
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            />
          </label>
          <label className="relative">
            <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={filters.date}
              onChange={(event) => setFilters({ ...filters, date: event.target.value })}
            />
          </label>
          <button
            onClick={() => setFilters({ date: '', search: '' })}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {filteredRecords.length === 0 ? (
          <EmptyState text={config.empty} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  {config.columns.map((column) => <th key={column} className="px-5 py-3">{column}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map((row, rowIndex) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    {config.cells(row, rowIndex).map((cell, index) => (
                      <td key={index} className="px-5 py-4 text-slate-700 dark:text-slate-200">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function EmployeeCell({ employee }) {
  return (
    <div>
      <p className="font-bold text-slate-900 dark:text-slate-100">{employeeFullName(employee)}</p>
      <p className="mt-0.5 text-xs text-slate-400">{employee?.employee_code || '-'}</p>
    </div>
  )
}

function DateTimeCell({ value }) {
  return (
    <div>
      <p className="font-semibold">{formatDate(value)}</p>
      <p className="mt-0.5 text-xs text-slate-400">{formatTime(value)}</p>
    </div>
  )
}

function AddressMapCell({ address, latitude, longitude }) {
  const mapUrl = mapLink(latitude, longitude)

  return (
    <div className="max-w-[280px]">
      <p className="line-clamp-2 font-semibold">{address || '-'}</p>
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex w-max items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300"
        >
          <MapPin size={12} />
          View
        </a>
      )}
    </div>
  )
}

function LocationCell({ address, latitude, longitude, time, live = false }) {
  const mapUrl = mapLink(latitude, longitude)

  return (
    <div className="max-w-[320px]">
      <div className="flex items-start gap-2">
        {live && <span className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />}
        <div className="min-w-0">
          <p className="line-clamp-2 font-semibold">{address || '-'}</p>
          {latitude && longitude && (
            <p className="mt-0.5 text-xs text-slate-400">{Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}</p>
          )}
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            {live ? 'Live now' : formatTime(time)}
          </p>
        </div>
      </div>
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
        >
          <Navigation size={12} />
          Open Map
        </a>
      )}
    </div>
  )
}

function MapRecordCell({ row }) {
  const startUrl = mapLink(row.start_latitude, row.start_longitude)
  const endUrl = mapLink(row.end_latitude, row.end_longitude)
  const liveUrl = row.status === 'open' ? startUrl : null

  return (
    <div className="flex flex-col gap-2">
      {startUrl && <MapButton href={startUrl} label="Start Map" />}
      {liveUrl && <MapButton href={liveUrl} label="Live Location" tone="live" />}
      {endUrl && <MapButton href={endUrl} label="End Map" />}
      {!startUrl && !endUrl && <span className="text-sm text-slate-400">-</span>}
    </div>
  )
}

function MapButton({ href, label, tone = 'default' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={tone === 'live'
        ? 'inline-flex w-max items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300'
        : 'inline-flex w-max items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
      }
    >
      <ExternalLink size={12} />
      {label}
    </a>
  )
}

function PhotoLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-max items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
    >
      <ExternalLink size={12} />
      View Photo
    </a>
  )
}

function MealLocationCell({ row }) {
  const [address, setAddress] = useState(row.address || '')
  const [resolving, setResolving] = useState(isCoordinateText(row.address) && row.latitude && row.longitude)
  const mapUrl = mapLink(row.latitude, row.longitude)

  useEffect(() => {
    if (!isCoordinateText(row.address) || !row.latitude || !row.longitude) return

    let mounted = true
    reverseGeocode(Number(row.latitude), Number(row.longitude)).then((resolved) => {
      if (!mounted) return
      if (resolved) setAddress(resolved)
      setResolving(false)
    })

    return () => {
      mounted = false
    }
  }, [row.address, row.latitude, row.longitude])

  return (
    <div className="max-w-[360px]">
      <p className="line-clamp-2 font-semibold">
        {resolving ? 'Getting address...' : address || '-'}
      </p>
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex w-max items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300"
        >
          <MapPin size={12} />
          View
        </a>
      )}
    </div>
  )
}

function mapLink(latitude, longitude) {
  if (!latitude || !longitude) return ''
  return `https://maps.google.com/?q=${latitude},${longitude}`
}

function isCoordinateText(value = '') {
  return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(String(value).trim())
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

function formatDuration(minutes) {
  const total = Number(minutes || 0)
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
