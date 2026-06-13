'use client'
// =========================================================
//  ZangTV — Sidebar
// =========================================================
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore, useAuthStore } from '@/store/useAppStore'
import { clsx } from 'clsx'

const NAV_MAIN = [
  { href: '/',          icon: '🏠', label_ku: 'سەرەکی',    label_en: 'Home' },
  { href: '/live',      icon: '📡', label_ku: 'زیندوو',    label_en: 'Live', badge: 'LIVE' },
  { href: '/favorites', icon: '❤️', label_ku: 'خوازراو',   label_en: 'Favorites' },
  { href: '/history',   icon: '🕐', label_ku: 'مێژوو',     label_en: 'History' },
]

const NAV_CATS = [
  { href: '/category/kurdish',   icon: '🟡', label_ku: 'کوردی',    color: '#FF6B35' },
  { href: '/category/news',      icon: '📰', label_ku: 'هەواڵ',    color: '#2196F3' },
  { href: '/category/sports',    icon: '⚽', label_ku: 'وەرزش',   color: '#4CAF50' },
  { href: '/category/children',  icon: '🧒', label_ku: 'منداڵان',  color: '#FF9800' },
  { href: '/category/movies',    icon: '🎬', label_ku: 'فیلم',     color: '#F44336' },
  { href: '/category/arabic',    icon: '🌍', label_ku: 'عەرەبی',   color: '#00BCD4' },
  { href: '/category/music',     icon: '🎵', label_ku: 'موزیک',    color: '#E91E63' },
  { href: '/category/religious', icon: '⭐', label_ku: 'دینی',     color: '#9C27B0' },
]

export function Sidebar() {
  const pathname   = usePathname()
  const { lang, sidebarOpen } = useAppStore()
  const { user }   = useAuthStore()

  if (!sidebarOpen) return null

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-y-auto no-scrollbar"
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--bg-deep)',
        borderLeft: '1px solid var(--border)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <Link href="/" className="flex items-center gap-2.5 p-5 pb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C5CFF, #FF5CAA)' }}
        >
          📺
        </div>
        <span
          className="text-xl font-bold"
          style={{
            fontFamily: 'Space Grotesk',
            background: 'linear-gradient(90deg, #7C5CFF, #FF5CAA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ZangTV
        </span>
      </Link>

      {/* ── Main Nav ─────────────────────────────────── */}
      <div className="px-2.5 mb-1">
        {NAV_MAIN.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx('nav-item', pathname === item.href && 'active')}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{lang === 'en' ? item.label_en : item.label_ku}</span>
            {item.badge && (
              <span
                className="mr-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--live)', color: 'white', letterSpacing: '0.04em' }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 10px' }} />

      {/* ── Categories ───────────────────────────────── */}
      <p className="px-5 pt-1 pb-1.5 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
        {lang === 'en' ? 'Channels' : 'کەناڵەکان'}
      </p>
      <div className="px-2.5 mb-1">
        {NAV_CATS.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={clsx('nav-item', pathname === cat.href && 'active')}
          >
            <span className="text-base w-5 text-center">{cat.icon}</span>
            <span>{cat.label_ku}</span>
          </Link>
        ))}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 10px' }} />

      {/* ── Account ──────────────────────────────────── */}
      <p className="px-5 pt-1 pb-1.5 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
        {lang === 'en' ? 'Account' : 'هەژمار'}
      </p>
      <div className="px-2.5 mb-2">
        <Link href="/profile" className={clsx('nav-item', pathname === '/profile' && 'active')}>
          <span className="text-base w-5 text-center">👤</span>
          <span>{lang === 'en' ? 'Profile' : 'پرۆفایل'}</span>
        </Link>
        {user?.role === 'admin' && (
          <Link href="/admin" className={clsx('nav-item', pathname.startsWith('/admin') && 'active')}>
            <span className="text-base w-5 text-center">🛠</span>
            <span>Admin</span>
          </Link>
        )}
        <Link href="/settings" className={clsx('nav-item', pathname === '/settings' && 'active')}>
          <span className="text-base w-5 text-center">⚙️</span>
          <span>{lang === 'en' ? 'Settings' : 'ڕێکخستن'}</span>
        </Link>
      </div>

      {/* ── Premium Promo ─────────────────────────────── */}
      {user?.plan !== 'premium' && (
        <div className="mx-2.5 mb-4 p-3.5 rounded-xl" style={{
          background: 'linear-gradient(135deg,rgba(124,92,255,0.12),rgba(255,92,170,0.08))',
          border: '1px solid rgba(124,92,255,0.2)',
        }}>
          <p className="text-xs font-semibold mb-1">⭐ {lang === 'en' ? 'Go Premium' : 'Premium بکە'}</p>
          <p className="text-[11px] mb-2.5" style={{ color: 'var(--text-2)' }}>
            {lang === 'en' ? 'No ads · 4K · PiP' : 'بێ ڕیکلام · 4K · PiP'}
          </p>
          <Link
            href="/premium"
            className="block text-center text-[11px] font-bold text-white rounded-full py-1.5"
            style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent-2))' }}
          >
            $4.99/{lang === 'en' ? 'mo' : 'مانگ'}
          </Link>
        </div>
      )}
    </aside>
  )
}
