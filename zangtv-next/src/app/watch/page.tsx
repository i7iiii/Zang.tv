'use client'
// =========================================================
//  ZangTV — Watch Page /watch/[slug]
// =========================================================
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HLSPlayer }   from '@/components/player/HLSPlayer'
import { ChannelCard } from '@/components/channels/ChannelCard'
import { Sidebar }     from '@/components/layout/Sidebar'
import { Topbar }      from '@/components/layout/Topbar'
import { useAppStore, useAuthStore } from '@/store/useAppStore'
import { channelsApi } from '@/lib/api/client'
import toast from 'react-hot-toast'
import type { Channel } from '@/types'

// Mock data تا API ئامادە بکەیت
const MOCK: Record<string, Channel> = {
  'kurdsat-hd': {
    id: '1', slug: 'kurdsat-hd', name_ku: 'Kurdsat HD', name_en: 'Kurdsat HD',
    stream_url: 'https://ottott.us/live/iptv_IQKRDKRDST1/iptv_IQKRDKRDST1/index.m3u8',
    quality: 'HD', country: 'IQ', status: 'active', is_live: true, live_viewers: 1240,
    category: { id:'1', slug:'kurdish', name_ku:'کوردی', name_ar:'', name_en:'Kurdish' },
  },
  'rudaw-tv': {
    id: '2', slug: 'rudaw-tv', name_ku: 'Rudaw TV', name_en: 'Rudaw TV',
    stream_url: 'https://rudawlive.net/livekurd/smil:rudawkurd.smil/playlist.m3u8',
    quality: 'FHD', country: 'IQ', status: 'active', is_live: true, live_viewers: 890,
  },
}

const RELATED: Channel[] = Object.values(MOCK)

export default function WatchPage() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const { lang, isFavorite, toggleFavorite } = useAppStore()
  const { user } = useAuthStore()

  const [channel, setChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API call بکە — ئێستا mock بەکاردەهێنیت
    const ch = MOCK[slug]
    if (ch) {
      setChannel(ch)
      // Record view
      channelsApi.recordView(ch.id).catch(() => {})
    } else {
      toast.error('کەناڵەکە نەدۆزرایەوە')
      router.push('/')
    }
    setLoading(false)
  }, [slug, router])

  const handleFav = async () => {
    if (!user) { toast.error('تکایە یەکەم چوونەژوورەوە'); return }
    if (!channel) return
    toggleFavorite(channel.id)
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-void)' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(124,92,255,0.3)', borderTopColor: '#7C5CFF' }} />
    </div>
  )

  if (!channel) return null

  const fav = isFavorite(channel.id)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />

        <main className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: 'var(--text-3)' }}>
            <Link href="/" className="hover:text-[--accent] transition-colors">
              {lang === 'en' ? 'Home' : 'سەرەکی'}
            </Link>
            <span>/</span>
            <Link href={`/category/${channel.category?.slug}`} className="hover:text-[--accent] transition-colors">
              {channel.category?.name_ku}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--text-2)' }}>{channel.name_ku}</span>
          </div>

          {/* Layout: Player + Sidebar */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

            {/* ── Left: Player + Info ─────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Player */}
              <HLSPlayer
                channel={channel}
                className="mb-4"
              />

              {/* Channel Info */}
              <div
                className="flex items-center gap-4 p-4 rounded-xl mb-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div className="text-4xl w-14 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'var(--bg-surface)' }}>
                  📺
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-bold mb-1" style={{ color: 'var(--text-1)' }}>
                    {channel.name_ku}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: 'var(--text-2)' }}>
                    {channel.is_live && (
                      <span className="badge-live">
                        <span className="live-dot scale-75" /> LIVE
                      </span>
                    )}
                    {channel.live_viewers && <span>👁 {channel.live_viewers.toLocaleString()}</span>}
                    {channel.country && <span>🌍 {channel.country}</span>}
                    {channel.quality && <span>📶 {channel.quality}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleFav} className="btn-secondary text-xs px-3 py-1.5">
                    {fav ? '❤️' : '♡'} {lang === 'en' ? 'Favorite' : 'خوازراو'}
                  </button>
                  <button
                    onClick={() => {
                      navigator.share?.({ title: channel.name_ku, url: window.location.href })
                        .catch(() => navigator.clipboard.writeText(window.location.href)
                          .then(() => toast.success(lang === 'en' ? 'Link copied!' : 'لینک کۆپی کرا!')))
                    }}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    🔗 {lang === 'en' ? 'Share' : 'بەشداری'}
                  </button>
                </div>
              </div>

              {/* Mobile related (hidden on desktop) */}
              <div className="md:hidden">
                <p className="section-title mb-3">
                  {lang === 'en' ? 'Related Channels' : 'کەناڵە هاوشێوەکان'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {RELATED.filter(r => r.slug !== slug).map(r => (
                    <ChannelCard key={r.id} channel={r} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Related Channels Sidebar ────── */}
            <aside
              className="hidden md:flex flex-col flex-shrink-0"
              style={{ width: '260px' }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-1)' }}>
                {lang === 'en' ? 'Related Channels' : 'کەناڵە هاوشێوەکان'}
              </p>
              <div className="flex flex-col gap-1">
                {RELATED.filter(r => r.slug !== slug).map(r => (
                  <ChannelCard key={r.id} channel={r} compact />
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
