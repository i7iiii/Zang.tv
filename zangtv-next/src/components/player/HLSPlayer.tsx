'use client'
// =========================================================
//  ZangTV — HLS Player (hls.js + CORS Proxy)
//  گرنگترین کۆمپۆنێنتی پڕۆژەکە
// =========================================================
import { useEffect, useRef, useCallback, useState } from 'react'
import Hls from 'hls.js'
import { usePlayerStore } from '@/store/useAppStore'
import { buildProxyUrl } from '@/lib/api/client'
import type { Channel } from '@/types'
import { clsx } from 'clsx'

interface HLSPlayerProps {
  channel: Channel
  autoPlay?: boolean
  className?: string
}

export function HLSPlayer({ channel, autoPlay = true, className }: HLSPlayerProps) {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const hlsRef     = useRef<Hls | null>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const {
    isPlaying, isMuted, volume, isBuffering, quality, error,
    setPlaying, setMuted, setVolume, setBuffering, setError, setFullscreen, setPiP, reset,
  } = usePlayerStore()

  const [showControls, setShowControls] = useState(true)
  const [retries, setRetries]           = useState(0)
  const [currentTime, setCurrentTime]   = useState('LIVE')

  // ─── Show controls on mouse move ──────────────────────
  const revealControls = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }, [isPlaying])

  // ─── Init HLS ────────────────────────────────────────
  const initPlayer = useCallback(() => {
    const video = videoRef.current
    if (!video || !channel.stream_url) return

    // Clean up previous
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    reset()
    setError(null)

    // Build proxied URL
    const src = buildProxyUrl(channel.stream_url)

    // ── Native HLS (Safari, iOS) ───────────────────────
    if (!Hls.isSupported()) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
        video.addEventListener('loadedmetadata', () => {
          if (autoPlay) video.play().catch(() => {})
        })
      } else {
        setError('ببوورە، ئەم بروزەر پشتیوانی ڤیدیۆ ناکات.')
      }
      return
    }

    // ── hls.js ────────────────────────────────────────
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
      maxBufferLength: 60,
      maxMaxBufferLength: 120,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 10,
      xhrSetup: (xhr) => {
        xhr.setRequestHeader('Origin', window.location.origin)
      },
    })

    hlsRef.current = hls

    hls.loadSource(src)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setBuffering(false)
      if (autoPlay) {
        video.play().catch(() => {
          // Autoplay blocked — show play button
          setPlaying(false)
        })
      }
    })

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      setBuffering(true)
    })

    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            if (retries < 3) {
              setTimeout(() => {
                hls.startLoad()
                setRetries(r => r + 1)
              }, 2000)
            } else {
              setError('پەیوەندی نەمایەوە. تکایە پاشان هەوڵ بدەرەوە.')
            }
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError()
            break
          default:
            setError('کێشەیەک هەیە لە بارکردنی کەناڵەکە.')
            break
        }
      }
    })

    // Video events
    video.onplaying  = () => { setPlaying(true); setBuffering(false) }
    video.onpause    = () => setPlaying(false)
    video.onwaiting  = () => setBuffering(true)
    video.oncanplay  = () => setBuffering(false)
    video.onerror    = () => setError('کەناڵەکە ئێستا بەردەست نییە.')
  }, [channel.stream_url, autoPlay, retries, reset, setBuffering, setError, setPlaying])

  useEffect(() => {
    initPlayer()
    return () => {
      hlsRef.current?.destroy()
      clearTimeout(hideTimerRef.current)
    }
  }, [channel.id])

  // Sync volume & mute
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume
    v.muted  = isMuted
  }, [volume, isMuted])

  // ─── Controls ─────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    isPlaying ? v.pause() : v.play().catch(() => {})
  }

  const toggleMute = () => setMuted(!isMuted)

  const toggleFullscreen = () => {
    const el = wrapRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setFullscreen(false))
    }
  }

  const togglePiP = async () => {
    const v = videoRef.current
    if (!v) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setPiP(false)
      } else {
        await v.requestPictureInPicture()
        setPiP(true)
      }
    } catch {}
  }

  const reload = () => {
    setRetries(0)
    initPlayer()
  }

  return (
    <div
      ref={wrapRef}
      className={clsx('relative rounded-lg overflow-hidden select-none group', className)}
      style={{ background: '#000', aspectRatio: '16/9' }}
      onMouseMove={revealControls}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={revealControls}
    >
      {/* ── Video Element ──────────────────────────────── */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        style={{ cursor: 'pointer' }}
      />

      {/* ── Buffering Spinner ───────────────────────────── */}
      {isBuffering && !error && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(124,92,255,0.3)', borderTopColor: '#7C5CFF' }}
            />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              بارکردن...
            </p>
          </div>
        </div>
      )}

      {/* ── Error State ─────────────────────────────────── */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <span className="text-4xl">📡</span>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>{error}</p>
            <button onClick={reload} className="btn-primary text-xs px-4 py-2">
              🔄 هەوڵدانەوە
            </button>
          </div>
        </div>
      )}

      {/* ── LIVE Badge ──────────────────────────────────── */}
      <div
        className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
        style={{ background: 'rgba(255,59,92,0.9)', letterSpacing: '0.06em' }}
      >
        <span className="live-dot" />
        LIVE
      </div>

      {/* ── Controls Overlay ────────────────────────────── */}
      <div
        className={clsx(
          'absolute inset-0 flex flex-col justify-end transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{
          background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.85) 100%)',
        }}
      >
        {/* Channel name in player */}
        <div className="px-4 pb-1">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {channel.name_ku}
          </p>
        </div>

        {/* Control Bar */}
        <div className="flex items-center gap-2 px-3 pb-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base text-black font-bold flex-shrink-0 transition-transform active:scale-95"
            style={{ background: 'white' }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Volume Slider */}
          <input
            type="range" min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(+e.target.value); if (+e.target.value > 0) setMuted(false) }}
            className="w-16 h-1 appearance-none rounded-full cursor-pointer"
            style={{ accentColor: '#7C5CFF' }}
          />

          <div className="flex-1" />

          {/* Quality */}
          <span
            className="text-[10px] px-2 py-0.5 rounded-full cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
          >
            {channel.quality || 'HD'}
          </span>

          {/* PiP */}
          <button
            onClick={togglePiP}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
            title="Picture in Picture"
          >
            ⧉
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  )
}
