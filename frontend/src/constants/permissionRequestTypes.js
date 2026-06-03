import {
  AlertCircle,
  CalendarX,
  LogIn,
  LogOut,
  Shield,
} from 'lucide-react'

export const PERMISSION_REQUEST_TYPES = [
  {
    id: 'Late Check In',
    shortLabel: 'Late in',
    desc: 'Request approval for late arrival.',
    icon: LogIn,
    color: 'sky',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Why late check-in is needed...',
  },
  {
    id: 'Early Check Out',
    shortLabel: 'Early out',
    desc: 'Request approval to leave early.',
    icon: LogOut,
    color: 'amber',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Why early check-out is needed...',
  },
  {
    id: 'Day Off',
    shortLabel: 'Day off',
    desc: 'Request approval for a day off.',
    icon: CalendarX,
    color: 'violet',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Reason for day off...',
  },
  {
    id: 'Missing Check In',
    shortLabel: 'Missing in',
    desc: 'Request approval for a missing check-in.',
    icon: AlertCircle,
    color: 'violet',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Why the check-in is missing...',
  },
  {
    id: 'Personal Request',
    shortLabel: 'Personal',
    desc: 'Request approval for personal matters.',
    icon: Shield,
    color: 'orange',
    showTime: true,
    showDateRange: true,
    reasonPlaceholder: 'Choose a reason and add details if needed...',
  },
]

export const REQUEST_TYPE_IDS = PERMISSION_REQUEST_TYPES.map((t) => t.id)

export function requestTypeMeta(typeId) {
  return PERMISSION_REQUEST_TYPES.find((t) => t.id === typeId) || PERMISSION_REQUEST_TYPES[0]
}

export function defaultRequestTime(typeId) {
  const meta = requestTypeMeta(typeId)
  if (!meta.showTime) return ''
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function newRequestForm(typeId = 'Late Check In') {
  const today = new Date().toISOString().slice(0, 10)
  const time = defaultRequestTime(typeId)
  return {
    type: typeId,
    replacementEmployeeId: '',
    reasonType: '',
    durationType: 'hours',
    date: today,
    dateEnd: today,
    time,
    timeTo: time,
    dayPart: 'Full Day',
    totalDays: 1,
    totalHours: 0,
    reason: '',
    note: '',
    attachment: null,
    gps: '',
    emergency: false,
  }
}

export const REQUEST_CATEGORIES = {
  'Attendance Requests': ['Late Check In', 'Early Check Out', 'Missing Check In'],
  'Day Off': ['Day Off'],
  'Personal Requests': ['Personal Request'],
}
