let manifestBlobUrl = null

function imageTypeFromUrl(url) {
  const lower = url.toLowerCase()
  if (lower.includes('.svg')) return 'image/svg+xml'
  if (lower.includes('.webp')) return 'image/webp'
  if (lower.includes('.jpg') || lower.includes('.jpeg')) return 'image/jpeg'
  return 'image/png'
}

function ensureLink(rel) {
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  return link
}

/** Apply company logo/icon to browser tab and Add to Home Screen. */
export function applyDocumentBranding(settings = {}) {
  const title = (settings.site_title || settings.company_name || 'SalesTrack').trim()
  const iconUrl = (settings.company_icon_url || settings.company_logo_url || '').trim()

  if (title) {
    document.title = title
  }

  let appTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]')
  if (!appTitle) {
    appTitle = document.createElement('meta')
    appTitle.name = 'apple-mobile-web-app-title'
    document.head.appendChild(appTitle)
  }
  appTitle.content = (settings.company_name || title || 'SalesTrack').trim()

  if (!iconUrl) return

  const favicon = ensureLink('icon')
  favicon.href = iconUrl
  favicon.type = imageTypeFromUrl(iconUrl)

  ensureLink('apple-touch-icon').href = iconUrl
  ensureLink('apple-touch-icon-precomposed').href = iconUrl

  if (manifestBlobUrl) {
    URL.revokeObjectURL(manifestBlobUrl)
    manifestBlobUrl = null
  }

  const manifest = {
    name: title || 'SalesTrack',
    short_name: (settings.company_name || title || 'SalesTrack').slice(0, 12),
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
    icons: [
      { src: iconUrl, sizes: '192x192', type: imageTypeFromUrl(iconUrl), purpose: 'any' },
      { src: iconUrl, sizes: '512x512', type: imageTypeFromUrl(iconUrl), purpose: 'any maskable' },
    ],
  }

  manifestBlobUrl = URL.createObjectURL(
    new Blob([JSON.stringify(manifest)], { type: 'application/json' }),
  )
  ensureLink('manifest').href = manifestBlobUrl
}
