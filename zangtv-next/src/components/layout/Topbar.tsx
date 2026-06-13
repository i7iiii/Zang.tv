'use client'
// =========================================================
//  ZangTV — Topbar
// =========================================================
import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore, useAuthStore } from '@/store/useAppStore'
import { authApi } from '@/lib/api/client'
import toast from 'react-hot-toast'
import type { Language } from '@/types'

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'ku', label: 'کوردی', flag: '🟡' },
  { code: 'ar', label: 'عربي',  flag: '🌍' },
  { code: 'en', label: 'EN',    flag: '🌐' },
]

export function Topbar() {
  const router = useRouter()
  const { lang, setLang, setSearchQuery, toggleSidebar } = useAppStore()
  const { user, logout } = useAuthStore()

  const [query, setQuery]           = useState('')
  const [showLang, setShowLang]     = useState(false)
  const [showUser, setShowUser]     = useState(false)
  const searchRef                   = useRef<HTMLInputElement>(null)

  // Debounced search
  const handleSearch = (val: string) => {
    setQuery(val)
    const t = setTimeout(() => setSearchQuery(val), 300)
    return () => clearTimeout(t)
  }

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    logout()
    toast.success(lang === 'en' ? 'Logged out' : 'چووتە دەرەوە')
    router.push('/')
    setShowUser(false)
  }

  return (
    <header
      className="flex items-center gap-3 flex-shrink-0 px-5"
      style={{
        height: '56px',
        background: 'var(--bg-deep)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
        style={{ color: 'var(--text-2)' }}
        aria-label="toggle sidebar"
      >
        ☰
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <span
          className="absolute top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: 'var(--text-3)', ...(lang !== 'en' ? { left: 'auto', right: '12px' } : { left: '12px' }) }}
        >
          🔍
        </span>
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && router.push(`/search?q=${query}`)}
          placeholder={lang === 'en' ? 'Search channels…' : 'گەڕان لە کەناڵەکان...'}
          className="input text-xs"
          style={{
            paddingRight: lang !== 'en' ? '36px' : '14px',
            paddingLeft:  lang !== 'en' ? '14px'  : '36px',
            borderRadius: '24px',
          }}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Language Switcher */}
      <div className="relative">
        <button
          onClick={() => { setShowLang(!showLang); setShowUser(false) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-2)',
            color: 'var(--text-2)',
          }}
        >
          🌐 {LANGS.find(l => l.code === lang)?.label} ▾
        </button>
        {showLang && (
          <div
            className="absolute top-full mt-2 rounded-xl overflow-hidden shadow-lg z-50 animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-2)',
              minWidth: '120px',
              ...(lang !== 'en' ? { left: 0 } : { right: 0 }),
            }}
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setShowLang(false) }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-right transition-colors"
                style={{
                  color: lang === l.code ? 'var(--accent)' : 'var(--text-2)',
                  background: lang === l.code ? 'rgba(124,92,255,0.1)' : 'transparent',
                  fontFamily: 'Readex Pro, sans-serif',
                }}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <button
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
      >
        🔔
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border"
          style={{ background: 'var(--live)', borderColor: 'var(--bg-deep)' }}
        />
      </button>

      {/* Auth */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowLang(false) }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
          {showUser && (
            <div
              className="absolute top-full mt-2 rounded-xl overflow-hidden shadow-lg z-50 animate-fade-in"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-2)',
                minWidth: '160px',
                ...(lang !== 'en' ? { left: 0 } : { right: 0 }),
              }}
            >
              <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>{user.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>{user.email}</p>
              </div>
              <Link href="/profile" onClick={() => setShowUser(false)} className="flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[--bg-hover]" style={{ color: 'var(--text-2)' }}>
                👤 {lang === 'en' ? 'Profile' : 'پرۆفایل'}
              </Link>
              <Link href="/favorites" onClick={() => setShowUser(false)} className="flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[--bg-hover]" style={{ color: 'var(--text-2)' }}>
                ❤️ {lang === 'en' ? 'Favorites' : 'خوازراو'}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors hover:bg-[--bg-hover]" style={{ color: 'var(--live)' }}>
                🚪 {lang === 'en' ? 'Logout' : 'چوونە دەرەوە'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="btn-primary text-xs px-4 py-2">
          {lang === 'en' ? 'Sign In' : 'چوونەژوورەوە'}
        </Link>
      )}
    </header>
  )
}
