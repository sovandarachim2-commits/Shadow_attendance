import clsx from 'clsx'
import { PERMISSION_REQUEST_TYPES } from '../../constants/permissionRequestTypes'

/**
 * Vertical request-type list (matches HR dropdown mockup).
 */
export default function RequestTypePicker({ value, onChange, compact = false }) {
  const selected = PERMISSION_REQUEST_TYPES.find((t) => t.id === value) || PERMISSION_REQUEST_TYPES[0]

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700">
      <div
        className={clsx(
          'bg-blue-600 px-4 py-2.5 text-sm font-bold text-white',
          compact ? 'py-2 text-xs' : '',
        )}
      >
        {selected.id}
      </div>
      <ul className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
        {PERMISSION_REQUEST_TYPES.map((type) => {
          const active = type.id === value
          const Icon = type.icon
          return (
            <li key={type.id}>
              <button
                type="button"
                onClick={() => onChange(type.id)}
                className={clsx(
                  'flex w-full items-center gap-3 px-4 text-left text-sm font-medium transition',
                  compact ? 'py-2.5' : 'py-3',
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-800 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-blue-950/40',
                )}
              >
                <Icon
                  size={compact ? 16 : 18}
                  className={clsx('shrink-0', active ? 'text-white' : 'text-slate-400')}
                />
                <span className="flex-1">{type.id}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
