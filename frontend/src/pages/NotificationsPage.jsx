import { useCallback, useEffect, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  RefreshCcw,
  Send,
  Users,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../services/api'
import { EmptyState, StatusPill } from '../components/shared/UI'
import { canAccess, formatRelativeTime, titleCase } from '../utils/format'

export default function NotificationsPage({ appData, refresh, user }) {
  const canViewAll = canAccess(user, ['notifications.manage'])
  const [scope, setScope] = useState('mine')
  const [notifications, setNotifications] = useState(appData.notifications || [])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendForm, setSendForm] = useState({
    user_id: '',
    title: '',
    message: '',
  })
  const [sendError, setSendError] = useState('')

  const recipients = (appData.employees || [])
    .filter((employee) => employee.user?.id)
    .map((employee) => ({
      id: employee.user.id,
      name: [employee.first_name, employee.last_name].filter(Boolean).join(' ') || employee.user.name,
      code: employee.employee_code,
    }))

  const loadNotifications = useCallback(async (nextScope = scope) => {
    setLoading(true)
    try {
      const response = await api.get('/notifications', { params: { scope: nextScope, per_page: 50 } })
      setNotifications(response.data.data || [])
    } finally {
      setLoading(false)
    }
  }, [scope])

  useEffect(() => {
    if (scope === 'mine') {
      setNotifications(appData.notifications || [])
      return
    }

    loadNotifications(scope)
  }, [appData.notifications, loadNotifications, scope])

  const changeScope = (nextScope) => {
    setScope(nextScope)
    loadNotifications(nextScope)
  }

  const markRead = async (notification) => {
    await api.patch(`/notifications/${notification.id}/read`)
    await loadNotifications(scope)
    refresh?.()
  }

  const sendNotification = async (event) => {
    event.preventDefault()
    setSendError('')
    setSending(true)
    try {
      await api.post('/notifications', {
        user_id: sendForm.user_id || null,
        title: sendForm.title.trim(),
        message: sendForm.message.trim(),
        type: 'admin_message',
      })
      setSendForm({ user_id: '', title: '', message: '' })
      await loadNotifications(scope)
      refresh?.()
    } catch (ex) {
      setSendError(ex.response?.data?.message || 'Could not send notification.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Bell size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Notifications</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {scope === 'all' ? 'Viewing every website notification.' : 'Viewing your notifications and shared system alerts.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canViewAll && (
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
              <ScopeButton active={scope === 'mine'} icon={Bell} label="Mine" onClick={() => changeScope('mine')} />
              <ScopeButton active={scope === 'all'} icon={Users} label="All" onClick={() => changeScope('all')} />
            </div>
          )}
          <button
            type="button"
            onClick={() => loadNotifications(scope)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCcw size={16} className={clsx(loading && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      {canViewAll && (
        <form onSubmit={sendNotification} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Send size={19} />
            </div>
            <div>
              <h4 className="font-bold text-slate-950 dark:text-white">Send Website Notification</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Send a private message to one user, or leave recipient empty for all users.</p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Recipient</span>
              <select
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={sendForm.user_id}
                onChange={(event) => setSendForm((current) => ({ ...current, user_id: event.target.value }))}
              >
                <option value="">All users</option>
                {recipients.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>{recipient.name} ({recipient.code})</option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Title</span>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={sendForm.title}
                onChange={(event) => setSendForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Notification title"
                required
              />
            </label>
            <label className="lg:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">Message</span>
              <textarea
                className="min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={sendForm.message}
                onChange={(event) => setSendForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Write notification message..."
                required
              />
            </label>
          </div>
          {sendError && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{sendError}</p>}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <Send size={16} />
              {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {notifications.length === 0 ? <EmptyState text="No notifications found." /> : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                    {scope === 'all' && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {notificationRecipient(item)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">{formatRelativeTime(item.created_at)} · {titleCase(item.type)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill status={item.read_at ? 'Read' : 'Unread'} />
                  {!item.read_at && (
                    <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white" onClick={() => markRead(item)}>
                      <CheckCircle2 size={14} />
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function notificationRecipient(item) {
  if (!item.user_id) return 'All users'
  const employee = item.user?.employee
  const name = employee
    ? [employee.first_name, employee.last_name].filter(Boolean).join(' ')
    : item.user?.name

  return name || `User #${item.user_id}`
}

function ScopeButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition',
        active ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100',
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
