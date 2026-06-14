'use client'
import { useAppStore } from '@/store/useAppStore'

const MOCK_CATS = [
  { slug: 'all',      name_ku: 'هەمووی',   icon: '🌟' },
  { slug: 'kurdish',  name_ku: 'کوردی',    icon: '🟡' },
  { slug: 'news',     name_ku: 'هەواڵ',    icon: '📰' },
  { slug: 'sports',   name_ku: 'وەرزش',   icon: '⚽' },
  { slug: 'children', name_ku: 'منداڵان',  icon: '🧒' },
  { slug: 'movies',   name_ku: 'فیلم',     icon: '🎬' },
  { slug: 'arabic',   name_ku: 'عەرەبی',   icon: '🌍' },
  { slug: 'music',    name_ku: 'موزیک',    icon: '🎵' },
]

export function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useAppStore()
  return (
    <div style={{ display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto' }}>
      {MOCK_CATS.map((cat) => (
        <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)}
          style={{
            flexShrink: 0, padding: '7px 16px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            background: activeCategory === cat.slug ? '#7C5CFF' : 'transparent',
            border: `1px solid ${activeCategory === cat.slug ? '#7C5CFF' : 'rgba(255,255,255,0.12)'}`,
            color: activeCategory === cat.slug ? 'white' : '#9E9CB8',
            fontFamily: 'Readex Pro, sans-serif',
          }}>
          {cat.icon} {cat.name_ku}
        </button>
      ))}
    </div>
  )
}
