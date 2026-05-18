import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle, CalendarDays, CheckCircle2, ChevronDown, Clock,
  Pencil, Plus, Save, Star, Trash2, UserCheck, X,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'

const DAYS = [
  { key: 'monday',    label: 'Monday' },
  { key: 'tuesday',   label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday',  label: 'Thursday' },
  { key: 'friday',    label: 'Friday' },
  { key: 'saturday',  label: 'Saturday' },
  { key: 'sunday',    label: 'Sunday' },
]

const EMPTY_SCHEDULE = {
  schedule_name: '',
  monday_start: '08:00', monday_end: '17:00',
  tuesday_start: '08:00', tuesday_end: '17:00',
  wednesday_start: '08:00', wednesday_end: '17:00',
  thursday_start: '08:00', thursday_end: '17:00',
  friday_start: '08:00', friday_end: '17:00',
  saturday_start: null, saturday_end: null,
  sunday_start: null, sunday_end: null,
  break_time_minutes: 60,
  is_default: false,
}

export default function WorkScheduleSettings() {
  const [schedules, setSchedules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState({ text: '', ok: true })
  const [modal, setModal] = useState(null) // null | { mode: 'add'|'edit', schedule: {} }
  const EMPTY_ASSIGN_FORM = { id: null, employee_id: '', schedule_id: '', effective_date: '' }
  const [assignForm, setAssignForm] = useState(EMPTY_ASSIGN_FORM)
  const [assignSaving, setAssignSaving] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  const isEditingAssignment = Boolean(assignForm.id)

  const showNotice = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3200)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, aRes] = await Promise.all([
        api.get('/work-schedules'),
        api.get('/work-schedules/assignments'),
      ])
      setSchedules(sRes.data || [])
      setAssignments(aRes.data?.assignments ?? (Array.isArray(aRes.data) ? aRes.data : []))
      setEmployees(aRes.data?.employees ?? [])
    } catch {
      showNotice('Could not load work schedules.', false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => setModal({ mode: 'add', schedule: { ...EMPTY_SCHEDULE } })
  const openEdit = (s) => setModal({ mode: 'edit', schedule: { ...EMPTY_SCHEDULE, ...s } })
  const closeModal = () => setModal(null)

  const setField = (key, val) => setModal((m) => ({ ...m, schedule: { ...m.schedule, [key]: val } }))

  const toggleDay = (dayKey) => {
    const startKey = `${dayKey}_start`
    const endKey = `${dayKey}_end`
    const isOn = modal.schedule[startKey] !== null
    setModal((m) => ({
      ...m,
      schedule: {
        ...m.schedule,
        [startKey]: isOn ? null : '08:00',
        [endKey]: isOn ? null : '17:00',
      },
    }))
  }

  const saveSchedule = async () => {
    if (!modal.schedule.schedule_name.trim()) {
      showNotice('Schedule name is required.', false)
      return
    }
    setSaving(true)
    try {
      if (modal.mode === 'add') {
        await api.post('/work-schedules', modal.schedule)
        showNotice('Work schedule created.')
      } else {
        await api.put(`/work-schedules/${modal.schedule.id}`, modal.schedule)
        showNotice('Work schedule updated.')
      }
      closeModal()
      await load()
    } catch {
      showNotice('Failed to save schedule.', false)
    } finally {
      setSaving(false)
    }
  }

  const deleteSchedule = async (s) => {
    if (!confirm(`Delete "${s.schedule_name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/work-schedules/${s.id}`)
      showNotice('Schedule deleted.')
      await load()
    } catch {
      showNotice('Could not delete schedule.', false)
    }
  }

  const resetAssignForm = () => setAssignForm(EMPTY_ASSIGN_FORM)

  const startEditAssignment = (row) => {
    const date = row.effective_date
    const dateStr = typeof date === 'string' ? date.slice(0, 10) : ''
    setAssignForm({
      id: row.id,
      employee_id: String(row.employee_id),
      schedule_id: String(row.schedule_id),
      effective_date: dateStr,
    })
    setShowAssign(true)
  }

  const saveAssignment = async () => {
    if (!assignForm.employee_id || !assignForm.schedule_id || !assignForm.effective_date) {
      showNotice('All assignment fields are required.', false)
      return
    }
    setAssignSaving(true)
    try {
      const payload = {
        employee_id: assignForm.employee_id,
        schedule_id: assignForm.schedule_id,
        effective_date: assignForm.effective_date,
      }
      if (isEditingAssignment) {
        await api.put(`/work-schedules/assignments/${assignForm.id}`, payload)
        showNotice('Assignment updated.')
      } else {
        await api.post('/work-schedules/assign', payload)
        showNotice('Employee schedule assigned.')
      }
      resetAssignForm()
      await load()
    } catch (ex) {
      showNotice(ex.response?.data?.message || 'Could not save assignment.', false)
    } finally {
      setAssignSaving(false)
    }
  }

  const deleteAssignment = async (row) => {
    const name = row.employee?.full_name
      || [row.employee?.first_name, row.employee?.last_name].filter(Boolean).join(' ')
      || 'this employee'
    if (!window.confirm(`Remove schedule assignment for ${name}? They will use the default schedule.`)) return
    try {
      await api.delete(`/work-schedules/assignments/${row.id}`)
      if (assignForm.id === row.id) resetAssignForm()
      showNotice('Assignment removed.')
      await load()
    } catch {
      showNotice('Could not delete assignment.', false)
    }
  }

  if (loading) return <p className="py-8 text-center text-sm text-slate-400">Loading work schedules…</p>

  return (
    <div className="space-y-5">
      {/* Notice */}
      {notice.text && (
        <div className={clsx('flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold',
          notice.ok
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
            : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200',
        )}>
          {notice.ok ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {notice.text}
        </div>
      )}

      {/* Schedule list header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Work Schedules</h4>
          <p className="text-xs text-slate-400">{schedules.length} schedule{schedules.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <Plus size={16} />
          Add Schedule
        </button>
      </div>

      {/* Schedule cards */}
      {schedules.length === 0 ? (
        <div className="grid place-items-center rounded-xl border-2 border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
          <CalendarDays size={32} className="text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">No schedules yet</p>
          <button type="button" onClick={openAdd} className="mt-3 text-sm font-bold text-emerald-600 hover:underline">Create your first schedule</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((s) => (
            <ScheduleCard key={s.id} schedule={s} onEdit={() => openEdit(s)} onDelete={() => deleteSchedule(s)} />
          ))}
        </div>
      )}

      {/* Employee Assignment */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setShowAssign((v) => !v)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <UserCheck size={18} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white">Employee Schedule Assignment</p>
            <p className="text-xs text-slate-400">
              Assign each employee to the right schedule. Day off (e.g. Sunday) blocks check-in for that employee only.
            </p>
          </div>
          <ChevronDown size={18} className={clsx('shrink-0 text-slate-400 transition-transform duration-200', showAssign && 'rotate-180')} />
        </button>

        {showAssign && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800">
            {isEditingAssignment && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200">
                <span>Editing assignment — update the fields below, then save.</span>
                <button
                  type="button"
                  onClick={resetAssignForm}
                  className="shrink-0 text-xs font-bold text-sky-700 hover:underline dark:text-sky-300"
                >
                  Cancel edit
                </button>
              </div>
            )}

            {/* Assignment form */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">Employee</p>
                <select
                  className={selectCls}
                  value={assignForm.employee_id}
                  onChange={(e) => setAssignForm((f) => ({ ...f, employee_id: e.target.value }))}
                >
                  <option value="">Select employee…</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name || [e.first_name, e.last_name].filter(Boolean).join(' ') || e.employee_code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">Schedule</p>
                <select
                  className={selectCls}
                  value={assignForm.schedule_id}
                  onChange={(e) => setAssignForm((f) => ({ ...f, schedule_id: e.target.value }))}
                >
                  <option value="">Select schedule…</option>
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>{s.schedule_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">Effective Date</p>
                <input
                  type="date"
                  className={selectCls}
                  value={assignForm.effective_date}
                  onChange={(e) => setAssignForm((f) => ({ ...f, effective_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveAssignment}
                disabled={assignSaving}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <UserCheck size={15} />
                {assignSaving
                  ? 'Saving…'
                  : isEditingAssignment
                    ? 'Save Changes'
                    : 'Assign Schedule'}
              </button>
              {isEditingAssignment && (
                <button
                  type="button"
                  onClick={resetAssignForm}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Assignments list */}
            {assignments.length > 0 && (
              <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    <tr>
                      {['Employee', 'Department', 'Schedule', 'Effective', 'Action'].map((h) => (
                        <th key={h} className="px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {assignments.map((a) => (
                      <tr
                        key={a.id}
                        className={clsx(
                          'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                          assignForm.id === a.id && 'bg-sky-50/80 dark:bg-sky-950/20',
                        )}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{a.employee?.full_name || '—'}</td>
                        <td className="px-4 py-3 text-slate-500">{a.employee?.department?.name || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CalendarDays size={11} />
                            {a.schedule?.schedule_name || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{a.effective_date ? new Date(a.effective_date).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => startEditAssignment(a)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                              <Pencil size={13} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAssignment(a)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline dark:text-rose-400"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ScheduleModal
          modal={modal}
          setField={setField}
          toggleDay={toggleDay}
          onSave={saveSchedule}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </div>
  )
}

/* ─── Schedule Card ─────────────────────────────────────────────── */

function ScheduleCard({ schedule: s, onEdit, onDelete }) {
  const activeDays = DAYS.filter((d) => s[`${d.key}_start`])
  const dayLabels = activeDays.map((d) => d.label.slice(0, 3)).join(', ')

  return (
    <div className={clsx(
      'relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900',
      s.is_default ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800',
    )}>
      {s.is_default && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
          <Star size={10} />
          Default
        </span>
      )}
      <div className="mb-4 flex items-start gap-3 pr-20">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CalendarDays size={19} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 dark:text-white">{s.schedule_name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{activeDays.length} working day{activeDays.length !== 1 ? 's' : ''} · {dayLabels || 'No days set'}</p>
        </div>
      </div>

      {/* Day grid */}
      <div className="mb-4 grid grid-cols-7 gap-1">
        {DAYS.map((d) => {
          const on = Boolean(s[`${d.key}_start`])
          return (
            <div key={d.key} className={clsx(
              'rounded-md py-1.5 text-center text-xs font-bold',
              on ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                 : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600',
            )}>
              {d.label.slice(0, 1)}
            </div>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500">
        {activeDays[0] && (
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            {s[`${activeDays[0].key}_start`]?.slice(0, 5)} – {s[`${activeDays[0].key}_end`]?.slice(0, 5)}
          </span>
        )}
        {s.break_time_minutes > 0 && (
          <span>{s.break_time_minutes} min break</span>
        )}
        <span>{s.employee_schedules_count ?? 0} employee{s.employee_schedules_count !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/20"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

/* ─── Schedule Modal ────────────────────────────────────────────── */

function ScheduleModal({ modal, setField, toggleDay, onSave, onClose, saving }) {
  const { mode, schedule: s } = modal

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <CalendarDays size={19} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {mode === 'add' ? 'New Work Schedule' : 'Edit Schedule'}
              </h3>
              <p className="text-xs text-slate-400">Configure per-day working hours</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">

          {/* Name + default */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">Schedule Name</p>
              <input
                className={inputCls}
                placeholder="e.g. Standard Mon–Fri"
                value={s.schedule_name}
                onChange={(e) => setField('schedule_name', e.target.value)}
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">Break Time</p>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950">
                <input
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none dark:text-white"
                  type="number"
                  min={0}
                  max={480}
                  value={s.break_time_minutes ?? 60}
                  onChange={(e) => setField('break_time_minutes', Number(e.target.value))}
                />
                <span className="grid place-items-center border-l border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900">min</span>
              </div>
            </div>
          </div>

          {/* Default toggle */}
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Set as Default Schedule</p>
              <p className="mt-0.5 text-xs text-slate-400">Employees without an assigned schedule use this one.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(s.is_default)}
              onClick={() => setField('is_default', !s.is_default)}
              className={clsx(
                'relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
                s.is_default ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
              )}
            >
              <span className={clsx(
                'absolute h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
                s.is_default ? 'translate-x-[22px]' : 'translate-x-0.5',
              )} />
            </button>
          </label>

          {/* Day grid */}
          <div>
            <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Daily Working Hours</p>
            <p className="mb-3 text-xs text-slate-400">
              Turn a day off for employees on this schedule — they cannot check in that day.
              Turn it on with start/end times for employees who work that day (e.g. Sunday shift).
              Use separate schedules and assign employees below.
            </p>
            <div className="space-y-2">
              {DAYS.map((d) => {
                const startKey = `${d.key}_start`
                const endKey = `${d.key}_end`
                const isOn = s[startKey] !== null && s[startKey] !== undefined
                return (
                  <div
                    key={d.key}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg border px-4 py-3 transition',
                      isOn ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'
                           : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDay(d.key)}
                      className={clsx(
                        'relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
                        isOn ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
                      )}
                    >
                      <span className={clsx(
                        'absolute h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
                        isOn ? 'translate-x-[22px]' : 'translate-x-0.5',
                      )} />
                    </button>
                    <span className={clsx(
                      'w-24 shrink-0 text-sm font-semibold',
                      isOn ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600',
                    )}>
                      {d.label}
                    </span>
                    {isOn ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="time"
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          value={s[startKey]?.slice(0, 5) || '08:00'}
                          onChange={(e) => setField(startKey, e.target.value)}
                        />
                        <span className="text-xs text-slate-400">to</span>
                        <input
                          type="time"
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          value={s[endKey]?.slice(0, 5) || '17:00'}
                          onChange={(e) => setField(endKey, e.target.value)}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Day off</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Saving…' : mode === 'add' ? 'Create Schedule' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared styles ─────────────────────────────────────────────── */

const inputCls = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const selectCls = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
