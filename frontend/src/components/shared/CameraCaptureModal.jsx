import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2, Lightbulb, Loader2, ScanFace, ShieldCheck, X } from 'lucide-react'
import clsx from 'clsx'
import { detectFaceInLiveFrame } from '../../utils/faceDetection'
import { detectPhonePhotoSpoofInVideo } from '../../utils/selfieSpoofDetection'

const CAMERA_VIDEO_CONSTRAINTS = {
  width: { ideal: 1280, max: 1280 },
  height: { ideal: 960, max: 960 },
}

const MAX_CAPTURE_SIDE = 960
const LIVE_FACE_SAMPLE_MS = 450
const ACTION_MOVE_X = 0.07
const ACTION_MOVE_Y = 0.06
const ACTION_SIZE_CHANGE = 0.18
const CENTER_MIN_X = 0.34
const CENTER_MAX_X = 0.66
const CENTER_MIN_Y = 0.28
const CENTER_MAX_Y = 0.68

const TIPS = [
  'ដាក់មុខឱ្យចំកណ្តាលកាមេរ៉ា។',
  'ត្រូវប្រាកដថាមុខមានពន្លឺគ្រប់គ្រាន់ពីខាងមុខ។',
  'កុំប្រើរូបមុខពីទូរស័ព្ទ ឬអេក្រង់ផ្សេង។',
  'ដកវ៉ែនតាខ្មៅ ឬមួកដែលបាំងមុខចេញ។',
  'កាន់ទូរស័ព្ទឱ្យនឹងនៅកម្រិតភ្នែក។',
]

const SCAN_STYLES = `
  @keyframes faceScan {
    0%   { top: 2%;  opacity: 0; }
    8%   { opacity: 1; }
    50%  { top: 96%; }
    92%  { opacity: 1; }
    100% { top: 96%; opacity: 0; }
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
  .face-scan-line  { animation: faceScan  2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
  .live-dot        { animation: livePulse 1.4s ease-in-out infinite; }
`

function isFaceCentered(metrics) {
  return metrics
    && metrics.centerX >= CENTER_MIN_X
    && metrics.centerX <= CENTER_MAX_X
    && metrics.centerY >= CENTER_MIN_Y
    && metrics.centerY <= CENTER_MAX_Y
}

export default function CameraCaptureModal({
  title = 'Verify Your Face',
  subtitle = 'Look at the camera',
  facingMode = 'user',
  autoCaptureOnFace = false,
  onClose,
  onCapture,
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const liveFaceBusyRef = useRef(false)
  const liveFaceStartRef = useRef(null)
  const autoCaptureDoneRef = useRef(false)
  const [status, setStatus] = useState('starting')
  const [liveFaceStatus, setLiveFaceStatus] = useState(autoCaptureOnFace ? 'checking' : 'idle')
  const [liveFaceMessage, setLiveFaceMessage] = useState(autoCaptureOnFace ? 'ដាក់មុខឱ្យចំកណ្តាលកាមេរ៉ា។' : 'Position your face in the frame')
  const [error, setError] = useState('')
  const [showTips, setShowTips] = useState(false)
  const isFront = facingMode === 'user'
  const canCapture = status === 'ready' && !autoCaptureOnFace

  const capture = useCallback(async (force = false) => {
    const video = videoRef.current
    if (!video || (!force && !canCapture)) return

    const canvas = document.createElement('canvas')
    const sw = video.videoWidth || 1280
    const sh = video.videoHeight || 960
    const scale = Math.min(1, MAX_CAPTURE_SIDE / Math.max(sw, sh))
    canvas.width = Math.max(1, Math.round(sw * scale))
    canvas.height = Math.max(1, Math.round(sh * scale))

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (isFront) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    if (!blob) return

    onCapture(new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg', lastModified: Date.now() }))
  }, [canCapture, isFront, onCapture])

  useEffect(() => {
    let cancelled = false
    autoCaptureDoneRef.current = false
    liveFaceStartRef.current = null

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('error')
        setError('Camera is not available in this browser.')
        return
      }

      streamRef.current?.getTracks().forEach((t) => t.stop())

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, ...CAMERA_VIDEO_CONSTRAINTS },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        if (autoCaptureOnFace) {
          setLiveFaceStatus('checking')
          setLiveFaceMessage('ដាក់មុខឱ្យចំកណ្តាល រួចផ្លាស់ទីមុខបន្តិច។')
        }
        setStatus('ready')
      } catch (ex) {
        setStatus('error')
        setError(ex?.message || 'Camera permission was blocked.')
      }
    }

    startCamera()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [autoCaptureOnFace, facingMode])

  useEffect(() => {
    if (!autoCaptureOnFace || status !== 'ready' || autoCaptureDoneRef.current) return undefined

    let cancelled = false

    const checkFace = async () => {
      if (cancelled || liveFaceBusyRef.current || autoCaptureDoneRef.current) return

      const video = videoRef.current
      if (!video || video.readyState < 2) return

      liveFaceBusyRef.current = true
      try {
        const result = await detectFaceInLiveFrame(video)
        if (cancelled || autoCaptureDoneRef.current) return

        if (!result.detected) {
          liveFaceStartRef.current = null
          setLiveFaceStatus('checking')
          setLiveFaceMessage(result.reason === 'multiple_faces' ? 'អនុញ្ញាតតែមុខមនុស្សម្នាក់ប៉ុណ្ណោះ។' : 'ដាក់មុខឱ្យចំកណ្តាលកាមេរ៉ា។')
          return
        }

        if (!result.metrics) {
          setLiveFaceStatus('checking')
          setLiveFaceMessage('ដាក់មុខឱ្យច្បាស់ក្នុងស៊ុម។')
          return
        }

        if (!isFaceCentered(result.metrics)) {
          liveFaceStartRef.current = null
          setLiveFaceStatus('checking')
          setLiveFaceMessage('សូមដាក់មុខឱ្យចំកណ្តាលស៊ុមកាមេរ៉ា។')
          return
        }

        const spoofResult = detectPhonePhotoSpoofInVideo(video)
        if (spoofResult.suspicious) {
          liveFaceStartRef.current = null
          setLiveFaceStatus('checking')
          setLiveFaceMessage('កុំប្រើរូបមុខពីទូរស័ព្ទ ឬអេក្រង់ផ្សេង។')
          return
        }

        if (!liveFaceStartRef.current) {
          liveFaceStartRef.current = result.metrics
          setLiveFaceStatus('checking')
          setLiveFaceMessage('បានរកឃើញមុខ។ សូមផ្លាស់ទីមុខបន្តិច។')
          return
        }

        const start = liveFaceStartRef.current
        const movedX = Math.abs(result.metrics.centerX - start.centerX) >= ACTION_MOVE_X
        const movedY = Math.abs(result.metrics.centerY - start.centerY) >= ACTION_MOVE_Y
        const sizeChanged = Math.abs(result.metrics.boxRatio - start.boxRatio) / Math.max(start.boxRatio, 0.01) >= ACTION_SIZE_CHANGE
        if (!movedX && !movedY && !sizeChanged) {
          setLiveFaceStatus('checking')
          setLiveFaceMessage('សូមផ្លាស់ទីមុខបន្តិច ដើម្បីបញ្ជាក់ថាជាមនុស្សផ្ទាល់។')
          return
        }

        setLiveFaceStatus('passed')
        setLiveFaceMessage('បានបញ្ជាក់សកម្មភាពមនុស្ស។ កំពុងថតស្វ័យប្រវត្តិ...')
        autoCaptureDoneRef.current = true
        window.setTimeout(() => {
          if (!cancelled) capture(true)
        }, 300)
      } finally {
        liveFaceBusyRef.current = false
      }
    }

    const interval = window.setInterval(checkFace, LIVE_FACE_SAMPLE_MS)
    checkFace()

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [autoCaptureOnFace, capture, status])

  const statusIcon = autoCaptureOnFace
    ? liveFaceStatus === 'passed'
      ? <CheckCircle2 size={14} className="shrink-0 text-emerald-300" />
      : <ScanFace size={14} className="shrink-0 opacity-80" />
    : <ScanFace size={14} className="shrink-0 opacity-80" />

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <style>{SCAN_STYLES}</style>

      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ScanFace size={26} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <X size={17} />
          </button>
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
          {status !== 'error' && (
            <video
              ref={videoRef}
              className={clsx(
                'h-full w-full object-cover transition-opacity duration-500',
                isFront && '-scale-x-100',
                status !== 'ready' ? 'opacity-20' : 'opacity-100',
              )}
              playsInline
              muted
            />
          )}

          {status === 'ready' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[60%] w-[65%] rounded-[3rem] shadow-[0_0_0_9999px_rgba(0,0,0,0.48)]" />
              <div className="relative h-[60%] w-[65%]">
                <span className="absolute left-0 top-0 block h-12 w-12 rounded-tl-[2.6rem] border-l-[3px] border-t-[3px] border-emerald-400" />
                <span className="absolute right-0 top-0 block h-12 w-12 rounded-tr-[2.6rem] border-r-[3px] border-t-[3px] border-emerald-400" />
                <span className="absolute bottom-0 left-0 block h-12 w-12 rounded-bl-[2.6rem] border-b-[3px] border-l-[3px] border-emerald-400" />
                <span className="absolute bottom-0 right-0 block h-12 w-12 rounded-br-[2.6rem] border-b-[3px] border-r-[3px] border-emerald-400" />
                {(!autoCaptureOnFace || liveFaceStatus !== 'passed') && (
                  <div className="face-scan-line absolute inset-x-5 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                )}
              </div>
            </div>
          )}

          {status === 'ready' && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
              <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live</span>
            </div>
          )}

          {status === 'ready' && (
            <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              Front
            </div>
          )}

          {status === 'ready' && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <span className="flex max-w-[92%] items-center gap-2 rounded-full bg-black/55 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {statusIcon}
                <span className="truncate">{autoCaptureOnFace ? liveFaceMessage : 'Position your face in the frame'}</span>
              </span>
            </div>
          )}

          {status === 'starting' && (
            <div className="absolute inset-0 grid place-items-center text-white">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Loader2 size={28} className="animate-spin text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-white/90">Opening camera...</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="grid h-full place-items-center bg-slate-950 p-6 text-center">
              <div>
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-rose-500/20">
                  <Camera size={28} className="text-rose-400" />
                </div>
                <p className="font-semibold text-white">Could not open camera</p>
                <p className="mt-2 text-sm text-white/60">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="h-16 w-16" aria-hidden="true" />

            {autoCaptureOnFace ? (
              <div
                aria-live="polite"
                className={clsx(
                  'grid h-20 w-20 place-items-center rounded-full text-white shadow-lg transition',
                  liveFaceStatus === 'passed'
                    ? 'bg-emerald-500 shadow-emerald-500/40'
                    : 'bg-slate-700 shadow-slate-900/30',
                )}
              >
                {status === 'starting'
                  ? <Loader2 size={28} className="animate-spin" />
                  : liveFaceStatus === 'passed' ? <CheckCircle2 size={28} /> : <ScanFace size={28} />
                }
              </div>
            ) : (
              <button
                type="button"
                onClick={() => capture()}
                disabled={!canCapture}
                title="Capture selfie"
                className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
              >
                {status === 'starting'
                  ? <Loader2 size={28} className="animate-spin" />
                  : <Camera size={28} />
                }
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowTips((v) => !v)}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={clsx(
                'grid h-12 w-12 place-items-center rounded-full transition',
                showTips
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
              )}>
                <Lightbulb size={20} />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Tips</span>
            </button>
          </div>

          {showTips && (
            <ul className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={15} />
            Your photo is used only for verification
          </div>
        </div>
      </div>
    </div>
  )
}
