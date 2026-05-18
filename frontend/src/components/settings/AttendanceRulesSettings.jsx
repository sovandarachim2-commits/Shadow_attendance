import { useEffect, useState } from 'react'
import {
  AlertTriangle, Bot, Camera, CheckCircle2, ChevronDown, Clock, Fingerprint,
  Locate, LogOut, MapPin, QrCode, Save, Settings, Shield, Smartphone, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { api } from '../../services/api'

const SECTIONS = [
  { id: 'gps',        icon: MapPin,       label: 'Office GPS Settings',    desc: 'Configure office location and attendance radius.' },
  { id: 'checkin',    icon: Clock,        label: 'Check In Settings',       desc: 'Work start time and early check-in.' },
  { id: 'checkout',   icon: LogOut,       label: 'Check Out Settings',      desc: 'Work end time and check-out behavior.' },
  { id: 'outdoor',    icon: Locate,       label: 'Outdoor Attendance',      desc: 'GPS and photo requirements for field staff.' },
  { id: 'selfie',     icon: Camera,       label: 'Selfie Verification',     desc: 'Attendance selfie capture and face matching.' },
  { id: 'qr',         icon: QrCode,       label: 'QR Code Settings',        desc: 'Enable rotating QR codes for office check-in.' },
  { id: 'automation', icon: Bot,          label: 'Automation Settings',     desc: 'Auto-detect, alerts and daily summaries.' },
]

const DEFAULT = {
  office_name: '', office_latitude: '', office_longitude: '', allowed_radius: 100, gps_verification: true,
  work_start_time: '08:00', work_end_time: '17:00', earliest_checkin_time: '07:00',
  allow_early_checkin: true, minimum_work_hours: 8,
  allow_outdoor_checkin: true, require_gps: true, require_customer_photo: false, require_customer_location: false,
  require_selfie: false, save_selfie: true, face_verification: false,
  enable_qr: false, qr_expiration_minutes: 5, dynamic_qr_rotation: false,
  auto_missing_checkout: true, auto_telegram_alerts: false, auto_daily_summary: false,
}

export default function AttendanceRulesSettings() {
  const [rules, setRules] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState({ text: '', ok: true })
  const [open, setOpen] = useState({ gps: true })

  const showNotice = (text, ok = true) => {
    setNotice({ text, ok })
    window.setTimeout(() => setNotice({ text: '', ok: true }), 3000)
  }

  useEffect(() => {
    api.get('/attendance-rules')
      .then((r) => setRules({ ...DEFAULT, ...r.data }))
      .catch(() => showNotice('Could not load attendance rules.', false))
      .finally(() => setLoading(false))
  }, [])

  const set = (key, val) => setRules((p) => ({ ...p, [key]: val }))
  const toggle = (id) => setOpen((p) => ({ ...p, [id]: !p[id] }))

  const save = async () => {
    setSaving(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(rules).map(([key, value]) => {
          if (value === '' || value === null || Number.isNaN(value)) {
            return [key, null]
          }
          return [key, value]
        })
      )

      const r = await api.put('/attendance-rules', payload)
      setRules({ ...DEFAULT, ...r.data })
      showNotice('Attendance rules saved successfully.')
    } catch (error) {
      const message = error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : 'Failed to save attendance rules.')
      showNotice(message, false)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="py-8 text-center text-sm text-slate-400">Loading attendance rules…</p>

  return (
    <div className="space-y-4">
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

      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
        Late arrival rules, grace period, and deductions are configured under{' '}
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">Settings → Late Rules</span>.
      </p>

      {/* Section accordions */}
      {SECTIONS.map((sec) => {
        const Icon = sec.icon
        const isOpen = Boolean(open[sec.id])
        return (
          <div key={sec.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => toggle(sec.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{sec.label}</p>
                <p className="text-xs text-slate-400">{sec.desc}</p>
              </div>
              <ChevronDown size={18} className={clsx('shrink-0 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800">
                {sec.id === 'gps'        && <GpsSection        rules={rules} set={set} />}
                {sec.id === 'checkin'    && <CheckInSection    rules={rules} set={set} />}
                {sec.id === 'checkout'   && <CheckOutSection   rules={rules} set={set} />}
                {sec.id === 'outdoor'    && <OutdoorSection    rules={rules} set={set} />}
                {sec.id === 'selfie'     && <SelfieSection     rules={rules} set={set} />}
                {sec.id === 'qr'         && <QrSection         rules={rules} set={set} />}
                {sec.id === 'automation' && <AutomationSection rules={rules} set={set} />}
              </div>
            )}
          </div>
        )
      })}

      {/* Save button — sticky on mobile */}
      <div className="sticky bottom-4 z-10 sm:static">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:px-8"
        >
          <Save size={17} />
          {saving ? 'Saving…' : 'Save Attendance Rules'}
        </button>
      </div>
    </div>
  )
}

/* ─── Section content ──────────────────────────────────────────── */

function GpsSection({ rules, set }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <RField label="Office Name" placeholder="e.g. Main Office">
          <input className={inputCls} value={rules.office_name || ''} onChange={(e) => set('office_name', e.target.value)} placeholder="e.g. Main Office" />
        </RField>
        <RField label="Allowed Radius" suffix="m">
          <input
            className={inputCls}
            type="number"
            min={10}
            max={10000}
            value={rules.allowed_radius ?? ''}
            onChange={(e) => set('allowed_radius', e.target.value === '' ? null : Number(e.target.value))}
          />
        </RField>
        <RField label="Office Latitude" placeholder="e.g. 11.5564">
          <input
            className={inputCls}
            type="number"
            step="any"
            value={rules.office_latitude || ''}
            onChange={(e) => set('office_latitude', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="e.g. 11.5564"
          />
        </RField>
        <RField label="Office Longitude" placeholder="e.g. 104.9282">
          <input
            className={inputCls}
            type="number"
            step="any"
            value={rules.office_longitude || ''}
            onChange={(e) => set('office_longitude', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="e.g. 104.9282"
          />
        </RField>
      </div>
      <RToggle label="GPS Verification" desc="Require employees to be within radius to check in." checked={rules.gps_verification} onChange={(v) => set('gps_verification', v)} />

      {/* Map preview placeholder */}
      {rules.office_latitude && rules.office_longitude ? (
        <a
          href={`https://maps.google.com/?q=${rules.office_latitude},${rules.office_longitude}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50 py-6 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400"
        >
          <MapPin size={16} />
          View on Google Maps · {Number(rules.office_latitude).toFixed(5)}, {Number(rules.office_longitude).toFixed(5)}
        </a>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-6 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-950">
          <MapPin size={16} /> Enter coordinates above to see location preview
        </div>
      )}
    </div>
  )
}

function CheckInSection({ rules, set }) {
  return (
    <div className="space-y-4">
      <RField label="Work Start Time" className="max-w-[200px]">
        <input className={inputCls} type="time" value={rules.work_start_time?.slice(0, 5) || '08:00'} onChange={(e) => set('work_start_time', e.target.value)} />
      </RField>
      <RToggle label="Allow Early Check In" desc="Let employees check in before work start time." checked={rules.allow_early_checkin} onChange={(v) => set('allow_early_checkin', v)} />
      {rules.allow_early_checkin && (
        <RField label="Earliest Check In Time" className="max-w-[180px]">
          <input className={inputCls} type="time" value={rules.earliest_checkin_time?.slice(0, 5) || '07:00'} onChange={(e) => set('earliest_checkin_time', e.target.value)} />
        </RField>
      )}
    </div>
  )
}

function CheckOutSection({ rules, set }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
        Check-out is blocked if worked time is below minimum hours or if it is before work end time. Submit an Early Leave request in Permission Requests if needed.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <RField label="Work End Time">
          <input className={inputCls} type="time" value={rules.work_end_time?.slice(0, 5) || '17:00'} onChange={(e) => set('work_end_time', e.target.value)} />
        </RField>
        <RField label="Minimum Working Hours" suffix="hrs">
          <input
            className={inputCls}
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={rules.minimum_work_hours ?? ''}
            onChange={(e) => set('minimum_work_hours', e.target.value === '' ? null : Number(e.target.value))}
          />
        </RField>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Work end uses the employee work schedule for that day when assigned; otherwise these defaults apply.
        Telegram check-out uses Settings → Telegram → Check Out Alert and the Daily Attendance group.
      </p>
    </div>
  )
}

function OutdoorSection({ rules, set }) {
  return (
    <div className="space-y-3">
      <RToggle label="Allow Outdoor Check In" desc="Let field staff check in from outside the office radius." checked={rules.allow_outdoor_checkin} onChange={(v) => set('allow_outdoor_checkin', v)} />
      <RToggle label="Require GPS Tracking" desc="Continuously track location during outdoor sessions." checked={rules.require_gps} onChange={(v) => set('require_gps', v)} />
      <RToggle label="Require Customer Photo" desc="Field staff must capture a customer photo during visits." checked={rules.require_customer_photo} onChange={(v) => set('require_customer_photo', v)} />
      <RToggle label="Require Customer Location" desc="Customer GPS coordinates must be logged on each visit." checked={rules.require_customer_location} onChange={(v) => set('require_customer_location', v)} />
    </div>
  )
}

function SelfieSection({ rules, set }) {
  return (
    <div className="space-y-3">
      <RToggle label="Require Attendance Selfie" desc="Employees must take a selfie when checking in or out." checked={rules.require_selfie} onChange={(v) => set('require_selfie', v)} />
      <RToggle label="Save Selfie Image" desc="Store the captured selfie image in cloud storage." checked={rules.save_selfie} onChange={(v) => set('save_selfie', v)} />
      <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <Fingerprint size={20} className="shrink-0 text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Face Verification</p>
          <p className="text-xs text-slate-400">AI face matching — requires cloud integration.</p>
        </div>
        <span className="ml-auto rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">Coming Soon</span>
      </div>
    </div>
  )
}

function QrSection({ rules, set }) {
  return (
    <div className="space-y-4">
      <RToggle label="Enable QR Attendance" desc="Show a rotating QR code in the office for check-in." checked={rules.enable_qr} onChange={(v) => set('enable_qr', v)} />
      {rules.enable_qr && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <RField label="QR Expiration Time" suffix="min">
              <input
              className={inputCls}
              type="number"
              min={1}
              max={60}
              value={rules.qr_expiration_minutes ?? ''}
              onChange={(e) => set('qr_expiration_minutes', e.target.value === '' ? null : Number(e.target.value))}
            />
            </RField>
          </div>
          <RToggle label="Dynamic QR Rotation" desc="Automatically rotate QR code every expiration cycle." checked={rules.dynamic_qr_rotation} onChange={(v) => set('dynamic_qr_rotation', v)} />
        </>
      )}
    </div>
  )
}

function AutomationSection({ rules, set }) {
  return (
    <div className="space-y-3">
      <RToggle label="Auto Detect Missing Check Out" desc="Flag employees who forgot to check out at end of day." checked={rules.auto_missing_checkout} onChange={(v) => set('auto_missing_checkout', v)} />
      <RToggle label="Auto Send Telegram Alerts" desc="Send Telegram messages for attendance events and missing check-outs." checked={rules.auto_telegram_alerts} onChange={(v) => set('auto_telegram_alerts', v)} />
      <RToggle label="Auto Daily Attendance Summary" desc="Send a daily summary report to managers each evening." checked={rules.auto_daily_summary} onChange={(v) => set('auto_daily_summary', v)} />
    </div>
  )
}

/* ─── Shared primitives ────────────────────────────────────────── */

const inputCls = 'h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none dark:text-white'

function RField({ label, suffix, children, className }) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950">
        {children}
        {suffix && <span className="grid place-items-center border-l border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900">{suffix}</span>}
      </div>
    </div>
  )
}

function RToggle({ label, desc, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <span className={clsx(
          'absolute h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )} />
      </button>
    </label>
  )
}
