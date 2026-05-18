export function isGeolocationSupported() {
  return typeof navigator !== 'undefined' && !!navigator.geolocation
}

export function isSecureGeolocationContext() {
  return typeof window !== 'undefined' && window.isSecureContext
}

export function coordsFromPosition(pos) {
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    speed: pos.coords.speed || 0,
  }
}

/** Low-accuracy first (faster on desktop), then high-accuracy fallback. */
export function requestCurrentPosition() {
  if (!isGeolocationSupported()) {
    return Promise.reject({ code: 'UNSUPPORTED' })
  }

  const attempt = (options) =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })

  const fast = { enableHighAccuracy: false, timeout: 20000, maximumAge: 300000 }
  const precise = { enableHighAccuracy: true, timeout: 25000, maximumAge: 60000 }

  return attempt(fast).catch(() => attempt(precise))
}

export function geolocationErrorMessage(err) {
  if (err?.code === 'UNSUPPORTED') {
    return 'This browser does not support location. Please use Chrome or Edge.'
  }
  if (!isSecureGeolocationContext()) {
    return 'Location requires a secure connection (HTTPS). Open the app with https:// in the address bar.'
  }
  if (err?.code === 1) {
    return 'Location blocked. Click the lock icon beside the address, set Location to Allow, then refresh.'
  }
  if (err?.code === 3) {
    return 'Location timed out. Turn on device location (Windows: Settings → Privacy → Location), then tap Retry.'
  }
  return 'Could not get your location. Turn on Location Services, allow this site, and tap Retry.'
}
