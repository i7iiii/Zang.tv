import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── ZangTV Color System ───────────────────────
      colors: {
        void:    '#07060F',
        deep:    '#0D0C1A',
        surface: '#141328',
        card:    '#1A1930',
        hover:   '#1F1E38',

        accent: {
          DEFAULT: '#7C5CFF',
          hover:   '#6A4AEE',
          glow:    'rgba(124,92,255,0.25)',
        },
        pink: {
          DEFAULT: '#FF5CAA',
          hover:   '#EE4A99',
        },
        live:  '#FF3B5C',
        gold:  '#FFB830',

        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong:  'rgba(255,255,255,0.12)',
        },
        text: {
          1: '#F0EEF8',
          2: '#9E9CB8',
          3: '#5A587A',
        },
      },

      // ─── Typography ────────────────────────────────
      fontFamily: {
        ku:  ['Readex Pro', 'Noto Sans Arabic', 'sans-serif'],
        en:  ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // ─── Border Radius ─────────────────────────────
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },

      // ─── Animations ────────────────────────────────
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(0.7)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'live-pulse': 'pulse 1.5s ease-in-out infinite',
        shimmer:      'shimmer 2s linear infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
      },

      backgroundImage: {
        'gradient-void': 'linear-gradient(135deg, #07060F 0%, #0D0C1A 100%)',
        'gradient-accent': 'linear-gradient(90deg, #7C5CFF, #FF5CAA)',
        'gradient-card': 'linear-gradient(135deg, #1A1930, #141328)',
      },
    },
  },
  plugins: [],
}

export default config
