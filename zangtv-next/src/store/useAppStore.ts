// =========================================================
//  ZangTV — Global State (Zustand)
// =========================================================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Channel, User, Language } from '@/types'

// ─── App Store ────────────────────────────────────────────
interface AppStore {
  // UI
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void

  // Language
  lang: Language
  setLang: (lang: Language) => void
  dir: 'rtl' | 'ltr'

  // Current watching
  currentChannel: Channel | null
  setCurrentChannel: (ch: Channel | null) => void

  // Favorites (local cache)
  favoriteIds: Set<string>
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  // Search
  searchQuery: string
  setSearchQuery: (q: string) => void

  // Active category filter
  activeCategory: string
  setActiveCategory: (slug: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── UI ──────────────────────────────────────────────
      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // ── Language ────────────────────────────────────────
      lang: 'ku',
      dir: 'rtl',
      setLang: (lang) => set({
        lang,
        dir: lang === 'en' ? 'ltr' : 'rtl',
      }),

      // ── Current Channel ─────────────────────────────────
      currentChannel: null,
      setCurrentChannel: (ch) => set({ currentChannel: ch }),

      // ── Favorites ───────────────────────────────────────
      favoriteIds: new Set(),
      toggleFavorite: (id) => set((s) => {
        const next = new Set(s.favoriteIds)
        next.has(id) ? next.delete(id) : next.add(id)
        return { favoriteIds: next }
      }),
      isFavorite: (id) => get().favoriteIds.has(id),

      // ── Search ──────────────────────────────────────────
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ── Category Filter ─────────────────────────────────
      activeCategory: 'all',
      setActiveCategory: (slug) => set({ activeCategory: slug }),
    }),
    {
      name: 'zangtv-store',
      partialize: (s) => ({
        lang: s.lang,
        dir: s.dir,
        // Set serialization
        favoriteIds: [...s.favoriteIds],
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        favoriteIds: new Set(persisted?.favoriteIds ?? []),
      }),
    }
  )
)

// ─── Auth Store ───────────────────────────────────────────
interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (v: boolean) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token })
        if (token) localStorage.setItem('zangtv_token', token)
        else localStorage.removeItem('zangtv_token')
      },
      setLoading: (v) => set({ isLoading: v }),
      logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem('zangtv_token')
      },
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'zangtv-auth',
      partialize: (s) => ({ token: s.token }),
    }
  )
)

// ─── Player Store ─────────────────────────────────────────
interface PlayerStore {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  isFullscreen: boolean
  isPiP: boolean
  isBuffering: boolean
  quality: string
  error: string | null

  setPlaying: (v: boolean) => void
  setMuted: (v: boolean) => void
  setVolume: (v: number) => void
  setFullscreen: (v: boolean) => void
  setPiP: (v: boolean) => void
  setBuffering: (v: boolean) => void
  setQuality: (q: string) => void
  setError: (e: string | null) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  isMuted: false,
  volume: 0.8,
  isFullscreen: false,
  isPiP: false,
  isBuffering: true,
  quality: 'auto',
  error: null,

  setPlaying:    (v) => set({ isPlaying: v }),
  setMuted:      (v) => set({ isMuted: v }),
  setVolume:     (v) => set({ volume: v }),
  setFullscreen: (v) => set({ isFullscreen: v }),
  setPiP:        (v) => set({ isPiP: v }),
  setBuffering:  (v) => set({ isBuffering: v }),
  setQuality:    (q) => set({ quality: q }),
  setError:      (e) => set({ error: e }),
  reset: () => set({
    isPlaying: false, isBuffering: true, error: null,
    isFullscreen: false, isPiP: false,
  }),
}))
