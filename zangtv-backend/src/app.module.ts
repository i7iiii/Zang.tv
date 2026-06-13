import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ChannelsModule } from './channels/channels.module'
import { CategoriesModule } from './categories/categories.module'
import { FavoritesModule } from './favorites/favorites.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    // Config — .env فایل
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate Limiting — 100 req/min per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: 'memory', // لە production Redis بەکاربهێنە
        ttl: 30,
      }),
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    ChannelsModule,
    CategoriesModule,
    FavoritesModule,
    AdminModule,
  ],
})
export class AppModule {}
