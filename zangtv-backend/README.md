# ZangTV — Backend API (NestJS)

## دەستپێکردن

```bash
# 1. پاکێجەکان دامەزراندن
npm install

# 2. ژینگەکان ڕێکخستن
cp .env.example .env

# 3. داتابەیس ئامادەکردن
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed — داتای سەرەتایی
npm run db:seed

# 5. سێرڤەر دەستپێکردن
npm run start:dev
```

API: http://localhost:3001  
Swagger Docs: http://localhost:3001/api/docs

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /auth/register | تۆمارکردن |
| POST | /auth/login | چوونەژوورەوە |
| POST | /auth/refresh | نوێکردنەوەی Token |
| POST | /auth/logout | چوونەدەرەوە |
| GET  | /auth/me | بەکارهێنەری ئێستا |
| GET  | /auth/google | Google OAuth |

### Channels
| Method | URL | Description |
|--------|-----|-------------|
| GET | /channels | هەموو کەناڵەکان |
| GET | /channels?category=kurdish | بە جۆر |
| GET | /channels?q=rudaw | گەڕان |
| GET | /channels/featured | کەناڵە تایبەتەکان |
| GET | /channels/:slug | کەناڵێکی دیاریکراو |
| POST | /channels/:id/view | تۆمارکردنی بینین |
| POST | /channels (Admin) | زیادکردنی کەناڵ |
| PUT | /channels/:id (Admin) | دەستکاریکردن |
| DELETE | /channels/:id (Admin) | سڕینەوە |

### Favorites
| Method | URL | Description |
|--------|-----|-------------|
| GET | /favorites | خوازراوەکانم |
| POST | /favorites | زیادکردن |
| DELETE | /favorites/:channelId | سڕینەوە |

### Admin (Admin only)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /admin/stats | ئامارەکان |
| GET | /admin/users | هەموو بەکارهێنەران |
| GET | /admin/top-channels | باشترین کەناڵەکان |
| PUT | /admin/users/:id/ban | بلۆک/کردنەوە |
| PUT | /admin/users/:id/role | گۆڕینی ڕۆڵ |

## Admin Login
- Email: admin@zangtv.com  
- Password: Admin@ZangTV2026!

## Tech Stack
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- Redis Cache
- JWT + Google OAuth
- Swagger API Docs
