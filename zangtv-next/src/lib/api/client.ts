// =========================================================
//  ZangTV — API Client (Axios + Auto Token Refresh)
// =========================================================
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true, // Refresh token cookie
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor — Access Token زیاد کردن ────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('zangtv_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// ─── Response Interceptor — Auto Refresh Token ────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post<{ access_token: string }>('/auth/refresh')
        const newToken = data.access_token
        localStorage.setItem('zangtv_token', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('zangtv_token')
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ─── Channel API ──────────────────────────────────────────
export const channelsApi = {
  getAll: (params?: { category?: string; country?: string; lang?: string; q?: string }) =>
    api.get('/channels', { params }),

  getBySlug: (slug: string) =>
    api.get(`/channels/${slug}`),

  getFeatured: () =>
    api.get('/channels/featured'),

  getByCategory: (categorySlug: string) =>
    api.get(`/channels/category/${categorySlug}`),

  getLiveViewers: (channelId: string) =>
    api.get(`/channels/${channelId}/viewers`),

  recordView: (channelId: string) =>
    api.post(`/channels/${channelId}/view`),
}

// ─── Categories API ───────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
}

// ─── Auth API ─────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/auth/me'),

  googleUrl: () =>
    api.get('/auth/google'),
}

// ─── Favorites API ────────────────────────────────────────
export const favoritesApi = {
  getAll: () => api.get('/favorites'),
  add: (channelId: string) => api.post('/favorites', { channel_id: channelId }),
  remove: (channelId: string) => api.delete(`/favorites/${channelId}`),
}

// ─── Stream Proxy URL builder ─────────────────────────────
export function buildProxyUrl(streamUrl: string): string {
  const proxy = process.env.NEXT_PUBLIC_STREAM_PROXY || ''
  if (!proxy) return streamUrl
  return `${proxy}/proxy/m3u8?url=${encodeURIComponent(streamUrl)}`
}
