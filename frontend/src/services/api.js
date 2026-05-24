import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendance_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('attendance_token', data.token)
    return data
  },
  me: () => api.get('/auth/me').then((response) => response.data),
  logout: () => api.post('/auth/logout').finally(() => localStorage.removeItem('attendance_token')),
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
  create: (payload) => api.post('/permission-requests', payload).then((response) => response.data),
  update: (id, payload) => api.patch(`/permission-requests/${id}`, payload).then((response) => response.data),
  updateStatus: (id, payload) => api.patch(`/permission-requests/${id}/status`, payload).then((response) => response.data),
  remove: (id) => api.delete(`/permission-requests/${id}`),
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
