import { CalendarDays, CalendarX, FileText, LogIn, LogOut, MapPin, Pencil, Shield, Stethoscope, Zap } from 'lucide-react'

export const PERMISSION_REQUEST_TYPES = [
  {
    id: 'Leave Request',
    shortLabel: 'Leave',
    desc: 'Request time off for vacation, personal or other reasons.',
    icon: CalendarDays,
    color: 'emerald',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Reason for leave (vacation, personal, family, etc.)…',
  },
  {
    id: 'Sick Leave',
    shortLabel: 'Sick',
    desc: 'Request sick leave due to illness or medical appointment.',
    icon: Stethoscope,
    color: 'rose',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Describe your illness or medical reason…',
  },
  {
    id: 'Request Permission',
    shortLabel: 'Permission',
    desc: 'Request permission for a period — select from date to date.',
    icon: Shield,
    color: 'orange',
    showTime: true,
    showDateRange: true,
    reasonPlaceholder: 'Reason for permission request…',
  },
  {
    id: 'Outdoor Work',
    shortLabel: 'Outdoor',
    desc: 'Request to work from an outdoor or field location.',
    icon: MapPin,
    color: 'blue',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Customer, site, or route for outdoor work…',
  },
  {
    id: 'Early Leave',
    shortLabel: 'Early out',
    desc: 'Leave before work end — submit before you check out.',
    icon: FileText,
    color: 'amber',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Why you need to leave before scheduled end time…',
  },
  {
    id: 'Attendance Edit',
    shortLabel: 'Edit',
    desc: 'Correct wrong check-in or check-out on the selected dates.',
    icon: Pencil,
    color: 'violet',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Which dates/times should be corrected…',
  },
  {
    id: 'Manual Check In',
    shortLabel: 'Manual in',
    desc: 'Request admin approval for a missed or failed check-in.',
    icon: LogIn,
    color: 'sky',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Why manual check-in is needed...',
  },
  {
    id: 'Missing Check Out',
    shortLabel: 'Missing out',
    desc: 'Request admin approval when you forgot to check out.',
    icon: LogOut,
    color: 'amber',
    showTime: true,
    showDateRange: false,
    reasonPlaceholder: 'Why check-out was missed...',
  },
  {
    id: 'Day Off',
    shortLabel: 'Day off',
    desc: 'Request scheduled days off (from date to date).',
    icon: CalendarX,
    color: 'violet',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Reason for day off (personal, holiday, etc.)…',
  },
  {
    id: 'Custom Request',
    shortLabel: 'Custom',
    desc: 'Request for other types that are not listed above.',
    icon: Zap,
    color: 'slate',
    showTime: false,
    showDateRange: true,
    reasonPlaceholder: 'Describe your request in detail…',
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

export function newRequestForm(typeId = 'Leave Request') {
  const today = new Date().toISOString().slice(0, 10)
  return {
    type: typeId,
    date: today,
    dateEnd: today,
    time: defaultRequestTime(typeId),
    reason: '',
    gps: '',
    emergency: false,
  }
}

// Stats category groupings
export const REQUEST_CATEGORIES = {
  'Leave Requests': ['Leave Request', 'Day Off'],
  'Permission Requests': ['Request Permission', 'Early Leave', 'Attendance Edit', 'Manual Check In', 'Missing Check Out', 'Custom Request'],
  'Outdoor Work': ['Outdoor Work'],
  'Sick Leave': ['Sick Leave'],
}
