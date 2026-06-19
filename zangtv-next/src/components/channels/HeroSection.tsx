'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'

// ─── کەناڵی تاقیکردنەوە — بەردەوام کاردار (Public Test Streams) ──
const MOCK_CHANNELS = [
  { id:'1', slug:'big-buck-bunny',  name_ku:'تاقیکردنەوە ١ — Big Buck Bunny', stream_url:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', quality:'HD',  country:'US', status:'active', is_live:true, live_viewers:1240, category:{ id:'1',slug:'kurdish',name_ku:'تاقیکردنەوە',name_ar:'',name_en:'Test' } },
  { id:'2', slug:'apple-test',      name_ku:'تاقیکردنەوە ٢ — Apple HLS',     stream_url:'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8', quality:'FHD', country:'US', status:'active', is_live:true, live_viewers:890 },
  { id:'3', slug:'sintel',          name_ku:'تاقیکردنەوە ٣ — Sintel',        stream_url:'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', quality:'HD', country:'DE', status:'active', is_live:true, live_viewers:654 },
  { id:'4', slug:'akamai-test',     name_ku:'تاقیکردنەوە ٤ — Akamai',        stream_url:'https://multiplatform-f.akaste.net/i/multi/refresh/2025/akashic/hls/akashic_v3,/master.m3u8', quality:'HD', country:'US', status:'active', is_live:true, live_viewers:421 },
  { id:'5', slug:'bein-test',       name_ku:'تاقیکردنەوە ٥ — Sports Demo',   stream_url:'https://test-streams.mux.dev/test_001/stream.m3u8', quality:'FHD', country:'QA', status:'active', is_live:true, live_viewers:5100, category:{ id:'3',slug:'sports',name_ku:'وەرزش',name_ar:'',name_en:'Sports' } },
  { id:'6', slug:'news-test',       name_ku:'تاقیکردنەوە ٦ — News Demo',     stream_url:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', quality:'FHD', country:'QA', status:'active', is_live:true, live_viewers:2100, category:{ id:'2',slug:'news',name_ku:'هەواڵ',name_ar:'',name_en:'News' } },
]

const MOCK_CATS = [
  { slug:'all',      name_ku:'هەمووی',   icon:'🌟' },
  { slug:'kurdish',  name_ku:'تاقیکردنەوە', icon:'🟡' },
  { slug:'news',     name_ku:'هەواڵ',    icon:'📰' },
  { slug:'sports',   name_ku:'وەرزش',   icon:'⚽' },
]

export function HeroSection() {
  const { lang } = useAppStore()
  const [slide, setSlide] = useState(0)
  const featured = MOCK_CHANNELS.filter(c => c.is_live).slice(0, 3)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % featured.length), 5000)
    return () => clearInterval(t)
  }, [featured.length])

  const ch = featured[slide]
  if (!ch) return null

  return (
    <div className="relative rounded-xl overflow-hidden mb-7"
      style={{ background: 'linear-gradient(135deg,#1A0F3C 0%,#0D1A3C 50%,#1A0F2E 100%)', border: '1px solid rgba(255,255,255,0.12)', height: '200px' }}>
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,92,255,0.2),transparent 70%)', left:-60, top:-80 }} />
      <div className="relative flex h-full">
        <div className="flex-1 flex flex-col justify-center p-7" key={ch.id}>
          <div className="badge-live mb-3" style={{ alignSelf:'flex-start' }}>
            <span className="live-dot" /> زیندوو دەپەخشێت
          </div>
          <h1 className="text-xl font-bold mb-1.5" style={{ color:'#F0EEF8' }}>{ch.name_ku}</h1>
          <p className="text-xs mb-5" style={{ color:'#9E9CB8' }}>
            کەناڵی تاقیکردنەوە · کوالیتی بەرز · 👁 {ch.live_viewers?.toLocaleString()}
          </p>
          <Link href={`/watch/${ch.slug}`} className="btn-primary self-start text-xs" style={{ padding:'8px 18px' }}>
            ▶ بینینی ئێستا
          </Link>
        </div>
        <div className="w-44 flex items-center justify-center text-6xl" style={{ borderRight:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>📺</div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {featured.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{ width: i===slide?24:16, height:3, borderRadius:'2px', background: i===slide?'#7C5CFF':'#5A587A', border:'none', cursor:'pointer' }} />
        ))}
      </div>
    </div>
  )
}

export function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useAppStore()
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
      {MOCK_CATS.map((cat) => (
        <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: activeCategory === cat.slug ? '#7C5CFF' : 'transparent',
            border: `1px solid ${activeCategory === cat.slug ? '#7C5CFF' : 'rgba(255,255,255,0.12)'}`,
            color: activeCategory === cat.slug ? 'white' : '#9E9CB8',
          }}>
          <span>{cat.icon}</span><span>{cat.name_ku}</span>
        </button>
      ))}
    </div>
  )
}

export function ChannelSection({ title, icon, categorySlug }: { title:string; icon:string; categorySlug:string }) {
  const { activeCategory } = useAppStore()
  const { ChannelCard } = require('./ChannelCard')
  const channels = MOCK_CHANNELS.filter((ch) => {
    if (activeCategory !== 'all') return ch.category?.slug === activeCategory
    if (categorySlug === 'featured') return ch.is_live
    return ch.category?.slug === categorySlug || categorySlug === 'featured'
  })
  const displayChannels = channels.length > 0 ? channels : MOCK_CHANNELS.slice(0, 6)
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="section-title"><span>{icon}</span>{title}</h2>
        <Link href={`/category/${categorySlug}`} className="text-xs" style={{ color:'#7C5CFF', opacity:0.8 }}>هەمووی ببینە ←</Link>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'12px' }}>
        {displayChannels.slice(0, 12).map((ch) => (<ChannelCard key={ch.id} channel={ch} />))}
      </div>
    </div>
  )
}
