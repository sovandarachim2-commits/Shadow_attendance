import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { applyDocumentBranding } from './utils/branding'

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { Accept: 'application/json' },
})

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
