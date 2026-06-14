'use client'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { ChannelCard } from './ChannelCard'
import type { Channel } from '@/types'

const MOCK_CHANNELS: Channel[] = [
  { id:'1', slug:'kurdsat-hd',    name_ku:'Kurdsat HD',   stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:1240, category:{ id:'1',slug:'kurdish',name_ku:'کوردی',name_ar:'',name_en:'Kurdish' } },
  { id:'2', slug:'rudaw-tv',      name_ku:'Rudaw TV',     stream_url:'', quality:'FHD', country:'IQ', status:'active', is_live:true, live_viewers:890  },
  { id:'3', slug:'kurdistan-24',  name_ku:'Kurdistan 24', stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:654  },
  { id:'4', slug:'nrt-tv',        name_ku:'NRT TV',       stream_url:'', quality:'HD',  country:'IQ', status:'active', is_live:true, live_viewers:421  },
  { id:'5', slug:'bein-sports-1', name_ku:'beIN Sports',  stream_url:'', quality:'FHD', country:'QA', status:'active', is_live:true, live_viewers:5100, category:{ id:'3',slug:'sports',name_ku:'وەرزش',name_ar:'',name_en:'Sports' } },
  { id:'6', slug:'al-jazeera',    name_ku:'Al Jazeera',   stream_url:'', quality:'FHD', country:'QA', status:'active', is_live:true, live_viewers:2100, category:{ id:'2',slug:'news',name_ku:'هەواڵ',name_ar:'',name_en:'News' } },
]

interface ChannelSectionProps {
  title: string
  icon: string
  categorySlug: string
}

export function ChannelSection({ title, icon, categorySlug }: ChannelSectionProps) {
  const { activeCategory } = useAppStore()
  const channels = MOCK_CHANNELS.filter((ch) => {
    if (activeCategory !== 'all') return ch.category?.slug === activeCategory
    if (categorySlug === 'featured') return ch.is_live
    return ch.category?.slug === categorySlug || categorySlug === 'featured'
  })
  const displayChannels = channels.length > 0 ? channels : MOCK_CHANNELS.slice(0, 6)
  return (
    <div style={{ marginBottom:'32px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <h2 style={{ fontSize:'15px', fontWeight:600, color:'#F0EEF8', display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ display:'block', width:'3px', height:'16px', background:'linear-gradient(180deg,#7C5CFF,#FF5CAA)', borderRadius:'2px' }}></span>
          {icon} {title}
        </h2>
        <Link href={`/category/${categorySlug}`} style={{ fontSize:'12px', color:'#7C5CFF', opacity:0.8 }}>
          هەمووی ببینە ←
        </Link>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'12px' }}>
        {displayChannels.slice(0, 12).map((ch) => (
          <ChannelCard key={ch.id} channel={ch} />
        ))}
      </div>
    </div>
  )
}
