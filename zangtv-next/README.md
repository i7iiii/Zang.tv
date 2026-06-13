# ZangTV — Frontend (Next.js 14)

Kurdish & World TV Streaming Platform

## 🚀 دەستپێکردن

```bash
# 1. پاکێجەکان دامەزراندن
npm install

# 2. ژینگەکان ڕێکخستن
cp .env.example .env.local
# .env.local دەستکاری بکە

# 3. سێرڤیسەکانی پشتەوە دەستپێبکە (لە zangtv/ فۆڵدەر)
docker compose up -d postgres redis

# 4. سایتەکە دەستپێبکە
npm run dev
```

🌐 http://localhost:3000

## 📁 پێکهاتەی فایلەکان

```
src/
├── app/
│   ├── layout.tsx          ← Root layout
│   ├── page.tsx            ← Home page
│   ├── globals.css         ← Design tokens
│   ├── login/page.tsx      ← Login & Register
│   └── watch/page.tsx      ← Watch page
│
├── components/
│   ├── layout/
│   │   ├── Providers.tsx   ← QueryClient, Toaster
│   │   ├── Sidebar.tsx     ← Navigation sidebar
│   │   └── Topbar.tsx      ← Header bar
│   ├── channels/
│   │   ├── ChannelCard.tsx ← Channel card UI
│   │   └── HeroSection.tsx ← Hero + Categories + Sections
│   └── player/
│       └── HLSPlayer.tsx   ← ★ گرنگترین کۆمپۆنێنت
│
├── store/
│   └── useAppStore.ts      ← Zustand (App + Auth + Player)
│
├── lib/
│   └── api/
│       └── client.ts       ← Axios + interceptors + APIs
│
└── types/
    └── index.ts            ← TypeScript types
```

## ⚙️ Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STREAM_PROXY=http://localhost:8080
NEXT_PUBLIC_SITE_URL=https://zangtv.com
```

## 🔑 تایبەتمەندییە گرنگەکان

### HLS Player
- hls.js بۆ پشتیوانی HLS
- خۆکارانە CORS Proxy بەکاردەهێنێت
- Auto retry کاتێک stream قطع ببێت
- Picture-in-Picture پشتیوانی
- Fullscreen
- Volume control

### State Management
- **Zustand** بۆ global state
- **LocalStorage** persist بۆ lang + favorites
- **React Query** بۆ server state

### I18n (زمان)
- کوردی (RTL) — default
- عەرەبی (RTL)
- ئینگلیزی (LTR)

## 🎨 Design System

رەنگەکان لە CSS variables:
- `--bg-void` #07060F
- `--accent`  #7C5CFF
- `--live`    #FF3B5C

## 📦 لە GitHub Push کردن

```bash
git add .
git commit -m "feat: Next.js frontend - HLS Player, Auth, Home Page"
git push origin main
```
