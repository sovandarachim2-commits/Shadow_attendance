import { CalendarX, FileText, LogIn, LogOut, MapPin, Pencil, Shield } from 'lucide-react'

/** Active permission request types (employee menu). */
export const PERMISSION_REQUEST_TYPES = [
  {
    id: 'Early Leave',
    shortLabel: 'Early out',
    desc: 'Leave before work end — submit before you check out.',
    icon: FileText,
    showTime: true,
    reasonPlaceholder: 'Why you need to leave before scheduled end time…',
  },
  {
    id: 'Attendance Edit',
    shortLabel: 'Edit',
    desc: 'Correct wrong check-in or check-out on the selected dates.',
    icon: Pencil,
    showTime: true,
    reasonPlaceholder: 'Which dates/times should be corrected…',
  },
  {
    id: 'Manual Check In',
    shortLabel: 'Manual in',
    desc: 'Request admin approval for a missed or failed check-in.',
    icon: LogIn,
    showTime: true,
    reasonPlaceholder: 'Why manual check-in is needed...',
  },
  {
    id: 'Missing Check Out',
    shortLabel: 'Missing out',
    desc: 'Request admin approval when you forgot to check out.',
    icon: LogOut,
    showTime: true,
    reasonPlaceholder: 'Why check-out was missed...',
  },
  {
    id: 'Day Off',
    shortLabel: 'Day off',
    desc: 'Request scheduled days off (from date to date).',
    icon: CalendarX,
    showTime: false,
    reasonPlaceholder: 'Reason for day off (personal, holiday, etc.)…',
  },
  {
    id: 'Outdoor Work',
    shortLabel: 'Outdoor',
    desc: 'Field work outside the office for the selected period.',
    icon: MapPin,
    showTime: false,
    reasonPlaceholder: 'Customer, site, or route for outdoor work…',
  },
  {
    id: 'Request Permission',
    shortLabel: 'Permission',
    desc: 'Request permission for a period — select from date to date.',
    icon: Shield,
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Reason for permission request…',
  },
]

export const REQUEST_TYPE_IDS = PERMISSION_REQUEST_TYPES.map((t) => t.id)

export function requestTypeMeta(typeId) {
  return PERMISSION_REQUEST_TYPES.find((t) => t.id === typeId) || PERMISSION_REQUEST_TYPES[0]
}

export function defaultRequestTime(typeId) {
  const meta = requestTypeMeta(typeId)
  if (!meta.showTime) {
    return ''
  }
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function newRequestForm(typeId = 'Early Leave') {
  const today = new Date().toISOString().slice(0, 10)
  return {
    type: typeId,
    date: today,
    dateEnd: today,
    time: defaultRequestTime(typeId),
    reason: '',
    attachment: '',
    gps: '',
    emergency: false,
  }
}
