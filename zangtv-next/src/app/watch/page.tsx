'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HLSPlayer }   from '@/components/player/HLSPlayer'
import { ChannelCard } from '@/components/channels/ChannelCard'
import { Sidebar }     from '@/components/layout/Sidebar'
import { Topbar }      from '@/components/layout/Topbar'
import { useAppStore, useAuthStore } from '@/store/useAppStore'
import toast from 'react-hot-toast'
import type { Channel } from '@/types'

// ─── کەناڵی تاقیکردنەوە — هەمان لیستی Home ──────────
const MOCK: Record<string, Channel> = {
  'big-buck-bunny': {
    id: '1', slug: 'big-buck-bunny', name_ku: 'تاقیکردنەوە ١ — Big Buck Bunny',
    stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    quality: 'HD', country: 'US', status: 'active', is_live: true, live_viewers: 1240,
  },
  'apple-test': {
    id: '2', slug: 'apple-test', name_ku: 'تاقیکردنەوە ٢ — Apple HLS',
    stream_url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
    quality: 'FHD', country: 'US', status: 'active', is_live: true, live_viewers: 890,
  },
  'sintel': {
    id: '3', slug: 'sintel', name_ku: 'تاقیکردنەوە ٣ — Sintel',
    stream_url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    quality: 'HD', country: 'DE', status: 'active', is_live: true, live_viewers: 654,
  },
  'akamai-test': {
    id: '4', slug: 'akamai-test', name_ku: 'تاقیکردنەوە ٤ — Akamai',
    stream_url: 'https://multiplatform-f.akaste.net/i/multi/refresh/2025/akashic/hls/akashic_v3,/master.m3u8',
    quality: 'HD', country: 'US', status: 'active', is_live: true, live_viewers: 421,
  },
  'bein-test': {
    id: '5', slug: 'bein-test', name_ku: 'تاقیکردنەوە ٥ — Sports Demo',
    stream_url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    quality: 'FHD', country: 'QA', status: 'active', is_live: true, live_viewers: 5100,
  },
  'news-test': {
    id: '6', slug: 'news-test', name_ku: 'تاقیکردنەوە ٦ — News Demo',
    stream_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    quality: 'FHD', country: 'QA', status: 'active', is_live: true, live_viewers: 2100,
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
    const ch = MOCK[slug]
    if (ch) {
      setChannel(ch)
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
    <div className="flex h-screen items-center justify-center" style={{ background: '#07060F' }}>
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
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: '#5A587A' }}>
            <Link href="/">سەرەکی</Link>
            <span>/</span>
            <span style={{ color: '#9E9CB8' }}>{channel.name_ku}</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <HLSPlayer channel={channel} className="mb-4" />

              <div className="flex items-center gap-4 p-4 rounded-xl mb-4"
                style={{ background: '#1A1930', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-4xl w-14 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: '#141328' }}>📺</div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-bold mb-1" style={{ color: '#F0EEF8' }}>{channel.name_ku}</h1>
                  <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: '#9E9CB8' }}>
                    {channel.is_live && <span className="badge-live"><span className="live-dot" /> LIVE</span>}
                    {channel.live_viewers && <span>👁 {channel.live_viewers.toLocaleString()}</span>}
                    {channel.quality && <span>📶 {channel.quality}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleFav} className="btn-secondary text-xs px-3 py-1.5">
                    {fav ? '❤️' : '♡'} خوازراو
                  </button>
                </div>
              </div>
            </div>

            <aside className="flex flex-col flex-shrink-0" style={{ width: '260px' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#F0EEF8' }}>کەناڵە هاوشێوەکان</p>
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
