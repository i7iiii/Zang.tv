'use client'
// =========================================================
//  ZangTV — Providers (Client wrapper)
// =========================================================
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const { lang, dir } = useAppStore()
  const [mounted, setMounted] = useState(false)

  // Sync lang/dir to <html>
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir  = dir
    setMounted(true)
  }, [lang, dir])

  return (
    <QueryClientProvider client={queryClient}>
      {mounted ? children : (
        // ── جلووگری hydration mismatch ─────────────────
        <div style={{ visibility: 'hidden' }}>{children}</div>
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1A1930',
            color: '#F0EEF8',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            fontFamily: 'Readex Pro, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#7C5CFF', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#FF3B5C', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  )
}
