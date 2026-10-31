import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { warmupBackendShield } from './services/api'
import { applyDocumentBranding } from './utils/branding'

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
