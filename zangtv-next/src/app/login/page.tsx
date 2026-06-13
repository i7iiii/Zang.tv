'use client'
// =========================================================
//  ZangTV — Login Page
// =========================================================
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/client'
import { useAuthStore, useAppStore } from '@/store/useAppStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const { lang } = useAppStore()

  const [tab, setTab]           = useState<'login' | 'register'>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { toast.error(lang === 'en' ? 'Fill all fields' : 'هەموو خانەکان پڕ بکەوە'); return }
    setLoading(true)
    try {
      if (tab === 'login') {
        const { data } = await authApi.login(email, password)
        setToken(data.access_token)
        const { data: me } = await authApi.me()
        setUser(me)
        toast.success(lang === 'en' ? 'Welcome back!' : 'بەخێربێیت!')
        router.push('/')
      } else {
        if (!name) { toast.error(lang === 'en' ? 'Enter your name' : 'ناوەکەت بنووسە'); setLoading(false); return }
        const { data } = await authApi.register(name, email, password)
        setToken(data.access_token)
        const { data: me } = await authApi.me()
        setUser(me)
        toast.success(lang === 'en' ? 'Account created!' : 'هەژمارەکەت دروست کرا!')
        router.push('/')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(msg || (lang === 'en' ? 'Something went wrong' : 'کێشەیەک هەیە'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-void)' }}>

      {/* Card */}
      <div className="w-full max-w-sm animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: 'linear-gradient(135deg,#7C5CFF,#FF5CAA)' }}>
            📺
          </div>
          <h1 className="text-2xl font-bold text-gradient" style={{ fontFamily: 'Space Grotesk' }}>ZangTV</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            {lang === 'en' ? 'Kurdish & World TV' : 'کەناڵە کوردی و جیهانییەکان'}
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-2)' }}>

          {/* Tabs */}
          <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-xs font-semibold transition-all"
                style={{
                  background: tab === t ? 'var(--accent)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-2)',
                  fontFamily: 'Readex Pro, sans-serif',
                }}
              >
                {t === 'login'
                  ? (lang === 'en' ? 'Sign In' : 'چوونەژوورەوە')
                  : (lang === 'en' ? 'Register' : 'تۆمارکردن')}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3 mb-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-2)' }}>
                  {lang === 'en' ? 'Full Name' : 'ناوی تەواو'}
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={lang === 'en' ? 'Your name' : 'ناوەکەت'}
                  className="input"
                />
              </div>
            )}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-2)' }}>
                {lang === 'en' ? 'Email' : 'ئیمەیڵ'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="you@email.com"
                className="input"
                style={{ direction: 'ltr' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-2)' }}>
                {lang === 'en' ? 'Password' : 'تێپەڕەوشە'}
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="input"
                  style={{ direction: 'ltr', paddingLeft: '36px' }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: 'var(--text-3)' }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {tab === 'login' && (
                <Link href="/forgot-password" className="block text-[11px] mt-1.5 text-right transition-colors hover:text-[--accent]"
                  style={{ color: 'var(--text-3)' }}>
                  {lang === 'en' ? 'Forgot password?' : 'تێپەڕەوشەت لەیادچووە؟'}
                </Link>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-2.5 mb-4 text-sm"
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading
              ? '⏳ ...'
              : tab === 'login'
                ? (lang === 'en' ? 'Sign In' : 'چوونەژوورەوە')
                : (lang === 'en' ? 'Create Account' : 'دروستکردنی هەژمار')
            }
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border-2)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              {lang === 'en' ? 'or continue with' : 'یان بەم ڕێگایە'}
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-2)' }} />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            className="btn-secondary w-full py-2.5 text-sm gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {lang === 'en' ? 'Continue with Google' : 'بەرێگای Google'}
          </button>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>
          {lang === 'en' ? 'By signing in, you agree to our ' : 'بە چوونەژوورەوە، '}
          <Link href="/terms" className="hover:text-[--accent] transition-colors" style={{ color: 'var(--text-2)' }}>
            {lang === 'en' ? 'Terms of Service' : 'مەرجەکانمان'}
          </Link>
        </p>
      </div>
    </div>
  )
}
