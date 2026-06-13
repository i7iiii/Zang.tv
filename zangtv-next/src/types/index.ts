// =========================================================
//  ZangTV — TypeScript Types
// =========================================================

// ─── Channel ─────────────────────────────────────────────
export interface Channel {
  id: string
  slug: string
  name_ku: string
  name_ar?: string
  name_en?: string
  logo_url?: string
  banner_url?: string
  stream_url: string
  backup_url?: string
  website_url?: string
  category_id?: string
  category?: Category
  country?: string
  language?: string
  quality?: 'SD' | 'HD' | 'FHD' | '4K'
  status: 'active' | 'inactive' | 'testing'
  is_featured?: boolean
  sort_order?: number
  tags?: string[]
  // Real-time (Redis)
  live_viewers?: number
  is_live?: boolean
}

// ─── Category ────────────────────────────────────────────
export interface Category {
  id: string
  slug: string
  name_ku: string
  name_ar: string
  name_en: string
  icon?: string
  color?: string
  sort_order?: number
  channel_count?: number
}

// ─── User ────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  role: 'user' | 'moderator' | 'admin'
  plan: 'free' | 'premium'
  plan_expires_at?: string
  lang_pref: 'ku' | 'ar' | 'en'
  created_at: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string
  expires_in: number
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

// ─── API Response ─────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// ─── Watch Session ────────────────────────────────────────
export interface WatchSession {
  channel_id: string
  started_at: string
}

// ─── Player ──────────────────────────────────────────────
export type PlayerQuality = 'auto' | '240p' | '480p' | '720p' | '1080p' | '4K'

export interface PlayerState {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  quality: PlayerQuality
  isFullscreen: boolean
  isPiP: boolean
  isBuffering: boolean
  error: string | null
}

// ─── App State ────────────────────────────────────────────
export type Language = 'ku' | 'ar' | 'en'
export type Direction = 'rtl' | 'ltr'

export interface AppState {
  lang: Language
  dir: Direction
  sidebarOpen: boolean
  currentChannel: Channel | null
}
