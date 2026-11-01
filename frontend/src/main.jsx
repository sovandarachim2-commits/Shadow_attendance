import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { warmupBackendShield } from './services/api'
import { applyDocumentBranding } from './utils/branding'

// Filter out external/bot-protection script console warnings (e.g. feature_collector.js)
if (typeof window !== 'undefined' && console.warn) {
  const originalWarn = console.warn
  console.warn = function (...args) {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('using deprecated parameters for the initialization function')
    ) {
      return
    }
    originalWarn.apply(console, args)
  }
}

// Prevent accidental pinch zoom on mobile devices while keeping single-finger scroll & interactions 100% native
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault()
  })
  document.addEventListener('gesturechange', (e) => {
    e.preventDefault()
  })
  document.addEventListener('gestureend', (e) => {
    e.preventDefault()
  })
}

const apiBase =
  typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app')
    ? '/api'
    : (import.meta.env.VITE_API_URL || '/api')

const publicApi = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

publicApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    if (config && !error.response && !config._shieldRetried) {
      config._shieldRetried = true
      await warmupBackendShield()
      return publicApi.request(config)
    }
    return Promise.reject(error)
  },
)

async function bootstrap() {
  let initialBranding = {}

  try {
    const { data } = await publicApi.get('/settings/branding')
    initialBranding = data || {}
    applyDocumentBranding(initialBranding)
  } catch {
    // Branding is optional; app still loads with defaults.
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App initialBranding={initialBranding} />
    </StrictMode>,
  )
}

bootstrap()
