'use client'
// =========================================================
//  ZangTV — Channel Page Components
// =========================================================
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { channelsApi, categoriesApi } from '@/lib/api/client'
import { useAppStore } from '@/store/useAppStore'
import { ChannelCard } from './ChannelCard'
import type { Channel, Category } from '@/types'

// ─── Mock data بۆ Development ─────────────────────────────
const MOCK_CHANNELS: Channel[] = [
  { id:'1', slug:'kurdsat-hd',     name_ku:'Kurdsat HD',     stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:1240, category:{ id:'1',slug:'kurdish',name_ku:'کوردی',name_ar:'',name_en:'Kurdish' } },
  { id:'2', slug:'rudaw-tv',       name_ku:'Rudaw TV',       stream_url:'', quality:'FHD', country:'IQ', status:'active', is_live:true, live_viewers:890  },
  { id:'3', slug:'kurdistan-24',   name_ku:'Kurdistan 24',   stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:654  },
  { id:'4', slug:'nrt-tv',         name_ku:'NRT TV',         stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:421  },
  { id:'5', slug:'gali-tv',        name_ku:'GaliTV',         stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:287  },
  { id:'6', slug:'speda-tv',       name_ku:'Spēda TV',       stream_url:'', quality:'SD',  country:'TR', status:'active', is_live:true, live_viewers:198  },
  { id:'7', slug:'bein-sports-1',  name_ku:'beIN Sports 1',  stream_url:'', quality:'FHD', country:'QA', status:'active', is_live:true, live_viewers:5100, category:{ id:'3',slug:'sports',name_ku:'وەرزش',name_ar:'',name_en:'Sports' } },
  { id:'8', slug:'ssc-sports',     name_ku:'SSC Sports',     stream_url:'', quality:'HD',  country:'SA', status:'active', is_live:true, live_viewers:3800 },
  { id:'9', slug:'al-jazeera',     name_ku:'Al Jazeera',     stream_url:'', quality:'FHD', country:'QA', status:'active', is_live:true, live_viewers:2100, category:{ id:'2',slug:'news',name_ku:'هەواڵ',name_ar:'',name_en:'News' } },
  { id:'10',slug:'france-24-ar',   name_ku:'France 24',      stream_url:'', quality:'HD',  country:'FR', status:'active', is_live:true, live_viewers:980  },
]

const MOCK_CATS: Category[] = [
  { id:'0',  slug:'all',      name_ku:'هەمووی',   name_ar:'الكل',     name_en:'All',       icon:'🌟', color:'#7C5CFF' },
  { id:'1',  slug:'kurdish',  name_ku:'کوردی',    name_ar:'الكردية',  name_en:'Kurdish',   icon:'🟡', color:'#FF6B35' },
  { id:'2',  slug:'news',     name_ku:'هەواڵ',    name_ar:'الأخبار',  name_en:'News',      icon:'📰', color:'#2196F3' },
  { id:'3',  slug:'sports',   name_ku:'وەرزش',   name_ar:'الرياضة',  name_en:'Sports',    icon:'⚽', color:'#4CAF50' },
  { id:'4',  slug:'children', name_ku:'منداڵان',  name_ar:'أطفال',    name_en:'Children',  icon:'🧒', color:'#FF9800' },
  { id:'5',  slug:'movies',   name_ku:'فیلم',     name_ar:'أفلام',    name_en:'Movies',    icon:'🎬', color:'#F44336' },
  { id:'6',  slug:'arabic',   name_ku:'عەرەبی',   name_ar:'عربية',    name_en:'Arabic',    icon:'🌍', color:'#00BCD4' },
  { id:'7',  slug:'music',    name_ku:'موزیک',    name_ar:'موسيقى',  name_en:'Music',     icon:'🎵', color:'#E91E63' },
]

// ─── Hero Section ─────────────────────────────────────────
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
    <div
      className="relative rounded-xl overflow-hidden mb-7"
      style={{
        background: 'linear-gradient(135deg,#1A0F3C 0%,#0D1A3C 50%,#1A0F2E 100%)',
        border: '1px solid var(--border-2)',
        height: '200px',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(124,92,255,0.2),transparent 70%)',
        left: -60, top: -80, pointerEvents: 'none',
      }} />

      <div className="relative flex h-full">
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center p-7 animate-fade-in" key={ch.id}>
          <div className="badge-live mb-3" style={{ alignSelf: 'flex-start' }}>
            <span className="live-dot" /> {lang === 'en' ? 'LIVE NOW' : 'زیندوو دەپەخشێت'}
          </div>
          <h1 className="text-xl font-bold mb-1.5" style={{ color: 'var(--text-1)' }}>{ch.name_ku}</h1>
          <p className="text-xs mb-5" style={{ color: 'var(--text-2)' }}>
            {lang === 'en' ? 'Kurdish Live TV · HD Quality' : 'کەناڵی کوردی · کوالیتی بەرز'}
            {ch.live_viewers && ` · 👁 ${ch.live_viewers.toLocaleString()}`}
          </p>
          <Link
            href={`/watch/${ch.slug}`}
            className="btn-primary self-start text-xs"
            style={{ padding: '8px 18px' }}
          >
            ▶ {lang === 'en' ? 'Watch Now' : 'بینینی ئێستا'}
          </Link>
        </div>

        {/* Thumb */}
        <div className="w-44 flex items-center justify-center text-6xl"
          style={{ borderRight: '1px solid var(--border)', flexShrink: 0 }}>
          📺
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="rounded-full transition-all"
            style={{
              width: i === slide ? 24 : 16, height: 3,
              background: i === slide ? 'var(--accent)' : 'var(--text-3)',
              border: 'none', cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Category Tabs ────────────────────────────────────────
export function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useAppStore()

  return (
    <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
      {MOCK_CATS.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setActiveCategory(cat.slug)}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: activeCategory === cat.slug ? 'var(--accent)' : 'transparent',
            border: `1px solid ${activeCategory === cat.slug ? 'var(--accent)' : 'var(--border-2)'}`,
            color: activeCategory === cat.slug ? 'white' : 'var(--text-2)',
            fontFamily: 'Readex Pro, sans-serif',
          }}
        >
          <span>{cat.icon}</span>
          <span>{cat.name_ku}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Channel Section ──────────────────────────────────────
interface ChannelSectionProps {
  title: string
  icon: string
  categorySlug: string
}

export function ChannelSection({ title, icon, categorySlug }: ChannelSectionProps) {
  const { activeCategory } = useAppStore()

  // Filter by active category or section slug
  const channels = MOCK_CHANNELS.filter((ch) => {
    if (activeCategory !== 'all') return ch.category?.slug === activeCategory
    if (categorySlug === 'featured') return ch.is_live
    return ch.category?.slug === categorySlug
  })

  if (channels.length === 0 && activeCategory !== 'all') return null

  const displayChannels = channels.length > 0
    ? channels
    : MOCK_CHANNELS.slice(0, 6) // fallback

  return (
    <div className="mb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="section-title">
          <span>{icon}</span>
          {title}
        </h2>
        <Link
          href={`/category/${categorySlug}`}
          className="text-xs transition-opacity hover:opacity-100"
          style={{ color: 'var(--accent)', opacity: 0.8 }}
        >
          {/* RTL arrow */}
          هەمووی ببینە ←
        </Link>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
      }}>
        {displayChannels.slice(0, 12).map((ch) => (
          <ChannelCard key={ch.id} channel={ch} />
        ))}
      </div>
    </div>
  )
}
