// =========================================================
//  ZangTV — Home Page (Server Component + Client sections)
// =========================================================
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HeroSection }     from '@/components/channels/HeroSection'
import { CategoryTabs }    from '@/components/channels/CategoryTabs'
import { ChannelSection }  from '@/components/channels/ChannelSection'
import { Sidebar }         from '@/components/layout/Sidebar'
import { Topbar }          from '@/components/layout/Topbar'

export const metadata: Metadata = {
  title: 'ZangTV — کەناڵە زیندووەکان',
}

export default function HomePage() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main
          className="no-scrollbar"
          style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 80px' }}
        >
          {/* Hero */}
          <Suspense fallback={<div className="skeleton rounded-xl mb-7" style={{ height: '200px' }} />}>
            <HeroSection />
          </Suspense>

          {/* Category Tabs */}
          <CategoryTabs />

          {/* Kurdish Channels */}
          <Suspense fallback={<ChannelSkeleton />}>
            <ChannelSection
              title="کەناڵە کوردییەکان"
              categorySlug="kurdish"
              icon="🟡"
            />
          </Suspense>

          {/* Featured / Live Now */}
          <Suspense fallback={<ChannelSkeleton />}>
            <ChannelSection
              title="زیندوو ئێستا"
              categorySlug="featured"
              icon="📡"
            />
          </Suspense>

          {/* Sports */}
          <Suspense fallback={<ChannelSkeleton />}>
            <ChannelSection
              title="وەرزش"
              categorySlug="sports"
              icon="⚽"
            />
          </Suspense>

          {/* News */}
          <Suspense fallback={<ChannelSkeleton />}>
            <ChannelSection
              title="هەواڵ"
              categorySlug="news"
              icon="📰"
            />
          </Suspense>

          {/* Children */}
          <Suspense fallback={<ChannelSkeleton />}>
            <ChannelSection
              title="منداڵان"
              categorySlug="children"
              icon="🧒"
            />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function ChannelSkeleton() {
  return (
    <div className="mb-8">
      <div className="skeleton rounded mb-3" style={{ height: '20px', width: '140px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '12px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl" style={{ height: '140px' }} />
        ))}
      </div>
    </div>
  )
}
