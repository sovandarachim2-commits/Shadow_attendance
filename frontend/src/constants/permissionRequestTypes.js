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
    desc: 'Request approval to check in after the scheduled start time.',
    icon: LogIn,
    color: 'sky',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Provide the reason for the late check-in request...',
  },
  {
    id: 'Early Check Out',
    shortLabel: 'Early out',
    desc: 'Request approval to check out before the scheduled end time.',
    icon: LogOut,
    color: 'amber',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Provide the reason for the early check-out request...',
  },
  {
    id: 'Day Off',
    shortLabel: 'Day off',
    desc: 'Request approval for planned leave or time away from work.',
    icon: CalendarX,
    color: 'violet',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Provide the reason for the day-off request...',
  },
  {
    id: 'Missing Check In',
    shortLabel: 'Missing in',
    desc: 'Request correction for a missing check-in record.',
    icon: AlertCircle,
    color: 'violet',
    showTime: false,
    showDateRange: false,
    reasonPlaceholder: 'Explain why the check-in record is missing...',
  },
  {
    id: 'Missing Check Out',
    shortLabel: 'Missing out',
    desc: 'Request correction for a missing check-out record.',
    icon: AlertCircle,
    color: 'fuchsia',
    showTime: false,
    showDateRange: false,
    reasonPlaceholder: 'Explain why the check-out record is missing...',
  },
  {
    id: 'Personal Leave',
    shortLabel: 'Leave',
    desc: 'Request approval for a personal absence or personal time.',
    icon: Shield,
    color: 'orange',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Provide the reason for the personal leave request...',
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
  const durationType = ['Late Check In', 'Early Check Out'].includes(typeId)
    ? 'hours'
    : 'single_day'
  return {
    type: typeId,
    replacementEmployeeId: '',
    reasonType: '',
    durationType,
    date: today,
    dateEnd: today,
    returnDate: today,
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
  'Attendance Requests': ['Late Check In', 'Early Check Out', 'Missing Check In', 'Missing Check Out'],
  'Day Off': ['Day Off'],
  'Leave Requests': ['Personal Leave'],
}
