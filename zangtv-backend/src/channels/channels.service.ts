import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import * as crypto from 'crypto'

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAll(query: { category?: string; country?: string; lang?: string; q?: string; featured?: boolean }) {
    const cacheKey = `channels:${JSON.stringify(query)}`
    const cached = await this.cache.get(cacheKey)
    if (cached) return cached

    const where: any = { status: 'active' }
    if (query.category) where.category = { slug: query.category }
    if (query.country)  where.country  = query.country
    if (query.lang)     where.language = query.lang
    if (query.featured) where.isFeatured = true
    if (query.q) {
      where.OR = [
        { nameKu: { contains: query.q, mode: 'insensitive' } },
        { nameAr: { contains: query.q, mode: 'insensitive' } },
        { nameEn: { contains: query.q, mode: 'insensitive' } },
      ]
    }

    const channels = await this.prisma.channel.findMany({
      where,
      include: { category: { select: { slug: true, nameKu: true, nameEn: true, icon: true, color: true } } },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { nameKu: 'asc' }],
    })

    await this.cache.set(cacheKey, channels, 30)
    return channels
  }

  async findBySlug(slug: string) {
    const ch = await this.prisma.channel.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!ch) throw new NotFoundException(`کەناڵی ${slug} نەدۆزرایەوە`)
    return ch
  }

  async getFeatured() {
    return this.findAll({ featured: true })
  }

  async getByCategory(slug: string) {
    return this.findAll({ category: slug })
  }

  async recordView(channelId: string, userId?: string, ipHash?: string, userAgent?: string) {
    return this.prisma.watchSession.create({
      data: { channelId, userId: userId || null, ipHash, userAgent },
    })
  }

  async getLiveViewers(channelId: string): Promise<number> {
    // لە production ئەمە Redis counter دەبێت
    const recent = await this.prisma.watchSession.count({
      where: { channelId, startedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
    })
    return recent + Math.floor(Math.random() * 50) // simulate
  }

  // ─── Admin CRUD ────────────────────────────────────────
  async create(data: any) {
    return this.prisma.channel.create({ data })
  }
  async update(id: string, data: any) {
    return this.prisma.channel.update({ where: { id }, data })
  }
  async remove(id: string) {
    return this.prisma.channel.delete({ where: { id } })
  }
}
