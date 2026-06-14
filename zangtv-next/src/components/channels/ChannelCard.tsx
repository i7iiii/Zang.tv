'use client'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import type { Channel } from '@/types'

export function ChannelCard({ channel, compact = false }: { channel: Channel; compact?: boolean }) {
  const { isFavorite, toggleFavorite } = useAppStore()
  const fav = isFavorite(channel.id)

  const grads: Record<string, string> = {
    kurdish: 'linear-gradient(135deg,#1A0F3C,#0D1A3C)',
    sports:  'linear-gradient(135deg,#0A2A0A,#1A3A1A)',
    news:    'linear-gradient(135deg,#0A1A2A,#0D1520)',
    default: 'linear-gradient(135deg,#1A1930,#0D0C1A)',
  }
  const bg = grads[channel.category?.slug ?? ''] ?? grads.default

  if (compact) {
    return (
      <Link href={`/watch/${channel.slug}`}
        style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'8px', cursor:'pointer', textDecoration:'none', border:'1px solid transparent' }}>
        <div style={{ width:'44px', height:'38px', borderRadius:'8px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>📺</div>
        <div>
          <div style={{ fontSize:'12px', fontWeight:500, color:'#F0EEF8', marginBottom:'2px' }}>{channel.name_ku}</div>
          <div style={{ fontSize:'10px', color:'#FF3B5C', fontWeight:600 }}>● LIVE {channel.live_viewers && `· ${channel.live_viewers.toLocaleString()}`}</div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/watch/${channel.slug}`} style={{ textDecoration:'none' }}>
      <div style={{ background:'#1A1930', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', overflow:'hidden', cursor:'pointer' }}>
        <div style={{ height:'88px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', position:'relative' }}>
          📺
          {channel.is_live !== false && (
            <div style={{ position:'absolute', top:'7px', right:'7px', background:'#FF3B5C', color:'white', fontSize:'9px', padding:'2px 7px', borderRadius:'8px', fontWeight:700 }}>LIVE</div>
          )}
          {channel.live_viewers && (
            <div style={{ position:'absolute', bottom:'6px', left:'6px', background:'rgba(0,0,0,0.6)', color:'#9E9CB8', fontSize:'9px', padding:'2px 6px', borderRadius:'6px' }}>
              👁 {channel.live_viewers.toLocaleString()}
            </div>
          )}
          <button onClick={(e) => { e.preventDefault(); toggleFavorite(channel.id) }}
            style={{ position:'absolute', top:'7px', left:'7px', width:'24px', height:'24px', borderRadius:'50%', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', cursor:'pointer' }}>
            {fav ? '❤️' : '♡'}
          </button>
        </div>
        <div style={{ padding:'10px' }}>
          <div style={{ fontSize:'12px', fontWeight:600, color:'#F0EEF8', marginBottom:'3px' }}>{channel.name_ku}</div>
          <div style={{ fontSize:'10px', color:'#5A587A', display:'flex', alignItems:'center', gap:'4px' }}>
            {channel.country === 'IQ' ? '🇮🇶' : channel.country === 'QA' ? '🇶🇦' : '🌍'}
            {channel.quality && (
              <span style={{ fontSize:'9px', background:'#141328', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'4px', padding:'1px 5px', color:'#FFB830', fontFamily:'monospace' }}>
                {channel.quality}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
