'use client'
// =========================================================
//  ZangTV — Channel Card
// =========================================================
import Link from 'next/link'
import Image from 'next/image'
import { useAppStore } from '@/store/useAppStore'
import { favoritesApi } from '@/lib/api/client'
import { useAuthStore } from '@/store/useAppStore'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import type { Channel } from '@/types'

const QUALITY_COLOR: Record<string, string> = {
  '4K':  '#FFB830',
  'FHD': '#7C5CFF',
  'HD':  '#4CAF50',
  'SD':  '#9E9CB8',
}

const CATEGORY_GRAD: Record<string, string> = {
  kurdish:   'linear-gradient(135deg,#1A0F3C,#0D1A3C)',
  news:      'linear-gradient(135deg,#0A1A2A,#0D1520)',
  sports:    'linear-gradient(135deg,#0A2A0A,#1A3A1A)',
  children:  'linear-gradient(135deg,#2A1A0A,#3A280A)',
  movies:    'linear-gradient(135deg,#2A0A0A,#3A1010)',
  arabic:    'linear-gradient(135deg,#0A1A2A,#0A2A3A)',
  music:     'linear-gradient(135deg,#2A0A1A,#1A0A20)',
  religious: 'linear-gradient(135deg,#1A0A2A,#200A30)',
}

interface ChannelCardProps {
  channel: Channel
  compact?: boolean
}

export function ChannelCard({ channel, compact = false }: ChannelCardProps) {
  const { isFavorite, toggleFavorite } = useAppStore()
  const { user } = useAuthStore()
  const fav = isFavorite(channel.id)
  const grad = CATEGORY_GRAD[channel.category?.slug ?? ''] ?? 'linear-gradient(135deg,#1A1930,#0D0C1A)'

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { toast.error('تکایە یەکەم چوونەژوورەوە'); return }
    toggleFavorite(channel.id)
    try {
      fav
        ? await favoritesApi.remove(channel.id)
        : await favoritesApi.add(channel.id)
    } catch {
      toggleFavorite(channel.id) // revert on error
    }
  }

  if (compact) {
    return (
      <Link href={`/watch/${channel.slug}`}
        className="flex items-center gap-2.5 p-2.5 rounded-lg transition-all cursor-pointer hover:bg-[--bg-hover] border border-transparent hover:border-[--border-2]"
      >
        <div className="w-11 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: grad }}>
          {channel.logo_url
            ? <Image src={channel.logo_url} alt={channel.name_ku} width={32} height={32} className="rounded" />
            : '📺'}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-1)' }}>{channel.name_ku}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            {channel.is_live !== false && <span className="text-[var(--live)] font-semibold">● LIVE</span>}
            {channel.live_viewers && ` · ${channel.live_viewers.toLocaleString()}`}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/watch/${channel.slug}`}
      className="card-hover block rounded-xl overflow-hidden border cursor-pointer"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: '88px', background: grad }}>
        {channel.logo_url && (
          <Image
            src={channel.logo_url}
            alt={channel.name_ku}
            fill
            className="object-contain p-3 opacity-90"
          />
        )}
        {!channel.logo_url && (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-60">📺</div>
        )}

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(124,92,255,0.7)' }}>
          <span className="text-2xl text-white">▶</span>
        </div>

        {/* LIVE badge */}
        {channel.is_live !== false && (
          <div className="absolute top-1.5 right-1.5 badge-live">
            <span className="live-dot scale-75" />
            LIVE
          </div>
        )}

        {/* Viewers */}
        {channel.live_viewers != null && (
          <div className="absolute bottom-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1"
            style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--text-2)' }}>
            👁 {channel.live_viewers.toLocaleString()}
          </div>
        )}

        {/* Fav button */}
        <button
          onClick={handleFav}
          className={clsx(
            'absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all',
            fav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-2)' }}
        >
          {fav ? '❤️' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 pb-3">
        <p className="text-xs font-semibold mb-1 line-clamp-1" style={{ color: 'var(--text-1)' }}>
          {channel.name_ku}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {channel.country && (
            <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
              {channel.country === 'IQ' ? '🇮🇶' : channel.country === 'TR' ? '🇹🇷' : channel.country === 'IR' ? '🇮🇷' : '🌍'}
            </span>
          )}
          {channel.quality && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-2)',
                color: QUALITY_COLOR[channel.quality] ?? 'var(--text-3)',
                fontFamily: 'Space Grotesk',
              }}
            >
              {channel.quality}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
