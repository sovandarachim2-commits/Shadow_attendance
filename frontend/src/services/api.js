import axios from 'axios'

const baseURL =
  typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app')
    ? '/api'
    : (import.meta.env.VITE_API_URL || '/api')

let shieldWarmupPromise = null

export function warmupBackendShield() {
  if (typeof document === 'undefined' || !document.body) {
    return Promise.resolve()
  }
  if (shieldWarmupPromise) {
    return shieldWarmupPromise
  }

  shieldWarmupPromise = new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.style.opacity = '0'
    iframe.style.pointerEvents = 'none'
    iframe.style.left = '-9999px'
    iframe.style.top = '-9999px'
    iframe.setAttribute('aria-hidden', 'true')
    iframe.src = `${baseURL.replace(/\/+$/, '')}/settings/branding?_warmup=${Date.now()}`

    document.body.appendChild(iframe)

    setTimeout(() => {
      try {
        iframe.remove()
      } catch {
        // Ignore cleanup errors
      }
      shieldWarmupPromise = null
      resolve()
    }, 2200)
  })

  return shieldWarmupPromise
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendance_token')
  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      }
    }
  }

  const method = String(config.method || 'get').toLowerCase()
  if (method === 'put' || method === 'patch' || method === 'delete') {
    config.method = 'post'
    config.params = {
      ...(config.params || {}),
      _method: method.toUpperCase(),
    }
  }

  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
  const isBlob = typeof Blob !== 'undefined' && config.data instanceof Blob
  const isSearchParams =
    typeof URLSearchParams !== 'undefined' && config.data instanceof URLSearchParams

  if (
    config.data !== undefined &&
    config.data !== null &&
    !isFormData &&
    !isBlob &&
    !isSearchParams
  ) {
    if (typeof config.data === 'object') {
      config.data = JSON.stringify(config.data)
    }
    if (typeof config.data === 'string') {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Content-Type', 'text/plain;charset=UTF-8')
      } else {
        config.headers = {
          ...(config.headers || {}),
          'Content-Type': 'text/plain;charset=UTF-8',
        }
      }
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    if (config && !error.response && !config._shieldRetried) {
      config._shieldRetried = true
      await warmupBackendShield()
      return api.request(config)
    }
    return Promise.reject(error)
  },
)

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('attendance_token', data.token)
    return data
  },
  me: () => api.get('/auth/me').then((response) => response.data),
  logout: () => api.post('/auth/logout').finally(() => localStorage.removeItem('attendance_token')),
}

export const bootstrapService = {
  load: () => api.get('/bootstrap').then((response) => response.data),
}

export const attendanceService = {
  today: () => api.get('/attendance/today').then((response) => response.data),
  checkIn: (formData) => api.post('/attendance/check-in', formData),
  checkOut: (formData) => api.post('/attendance/check-out', formData),
  history: (params) => api.get('/attendance', { params }).then((response) => response.data),
}

export const dashboardService = {
  overview: () => api.get('/dashboard').then((response) => response.data),
}

export const permissionRequestService = {
  list: () => api.get('/permission-requests').then((response) => response.data.data || []),
  replacements: () => api.get('/permission-requests/replacements').then((response) => response.data.data || []),
  create: (payload) => api.post('/permission-requests', payload).then((response) => response.data),
  update: (id, payload) => {
    if (payload instanceof FormData) {
      payload.append('_method', 'PATCH')
      return api.post(`/permission-requests/${id}`, payload).then((response) => response.data)
    }
    return api.patch(`/permission-requests/${id}`, payload).then((response) => response.data)
  },
  updateStatus: (id, payload) => api.patch(`/permission-requests/${id}/status`, payload).then((response) => response.data),
  remove: (id) => api.delete(`/permission-requests/${id}`),
}

export const employeeMonthlyReportService = {
  fetch: (params) =>
    api.get('/employee-monthly-report', { params }).then((r) => r.data),
  exportExcel: (params) =>
    api.get('/employee-monthly-report/export-excel', { params, responseType: 'blob' }).then((r) => r.data),
  payrollHistory: (params) =>
    api.get('/employee-monthly-report/payroll-history', { params }).then((r) => r.data),
  savePayrollHistory: (payload) =>
    api.post('/employee-monthly-report/payroll-history', payload).then((r) => r.data),
  payrollSecurityStatus: () =>
    api.get('/employee-monthly-report/payroll-security').then((r) => r.data),
  unlockPayrollSecurity: (pin) =>
    api.post('/employee-monthly-report/payroll-security/unlock', { pin }).then((r) => r.data),
  updatePayrollSecurity: (payload) =>
    api.put('/employee-monthly-report/payroll-security', payload).then((r) => r.data),
}

/** Load every employee page from GET /employees (directory, dropdowns, etc.). */
export const employeeService = {
  async fetchAll(params = {}) {
    const perPage = 100
    let page = 1
    let lastPage = 1
    const all = []

    do {
      const { data } = await api.get('/employees', { params: { ...params, page, per_page: perPage } })
      all.push(...(data.data || []))
      lastPage = data.last_page ?? 1
      page += 1
    } while (page <= lastPage)

    return all
  },
}

export const userActivityService = {
  list: (params) => api.get('/user-activities', { params }).then((r) => r.data),
  summary: () => api.get('/user-activities/summary').then((r) => r.data),
  get: (id) => api.get(`/user-activities/${id}`).then((r) => r.data),
  export: (params) =>
    api.get('/user-activities/export', { params, responseType: 'blob' }).then((r) => r.data),
}

