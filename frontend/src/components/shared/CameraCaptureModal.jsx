import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, SwitchCamera, X } from 'lucide-react'
import clsx from 'clsx'

export default function CameraCaptureModal({ title = 'Take Photo', facingMode = 'user', onClose, onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [activeFacing, setActiveFacing] = useState(facingMode)
  const [status, setStatus] = useState('starting')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setStatus('starting')
    setError('')

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('error')
        setError('Camera is not available in this browser.')
        return
      }

      // Stop any previous stream before starting new one
      streamRef.current?.getTracks().forEach((track) => track.stop())

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: activeFacing,
            width:  { ideal: 3840, min: 640 },
            height: { ideal: 2160, min: 480 },
          },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setStatus('ready')
      } catch (exception) {
        setStatus('error')
        setError(exception?.message || 'Camera permission was blocked.')
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [activeFacing])

  const flipCamera = () => {
    setActiveFacing((f) => (f === 'user' ? 'environment' : 'user'))
  }

  const capture = async () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1920
    canvas.height = video.videoHeight || 1080

    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.95)
    })

    if (!blob) return

    onCapture(new File([blob], `camera-${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    }))
  }

  const isFront = activeFacing === 'user'

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFront ? '🤳 Front camera' : '📷 Rear camera'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={flipCamera}
              disabled={status === 'error'}
              title="Switch camera"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <SwitchCamera size={17} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              aria-label="Close camera"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="relative aspect-[3/4] max-h-[58vh] overflow-hidden rounded-xl bg-slate-950 sm:aspect-square">
            {status !== 'error' && (
              <video
                ref={videoRef}
                className={clsx('h-full w-full object-contain', isFront && '-scale-x-100', status !== 'ready' && 'opacity-40')}
                playsInline
                muted
              />
            )}
            {status === 'starting' && (
              <div className="absolute inset-0 grid place-items-center text-white">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Loader2 size={18} className="animate-spin" />
                  Opening camera...
                </div>
              </div>
            )}
            {status === 'error' && (
              <div className="grid h-full place-items-center p-6 text-center text-sm text-white">
                <div>
                  <Camera size={34} className="mx-auto mb-3 opacity-80" />
                  <p className="font-semibold">Could not open camera</p>
                  <p className="mt-2 text-white/70">{error}</p>
                </div>
              </div>
            )}

            {/* Flip button overlay on the video (mobile-friendly) */}
            {status === 'ready' && (
              <button
                type="button"
                onClick={flipCamera}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 active:scale-90"
                title="Switch camera"
              >
                <SwitchCamera size={17} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={capture}
            disabled={status !== 'ready'}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
          >
            <Camera size={16} />
            Take Photo
          </button>
        </div>
      </div>
    </div>
  )
}
