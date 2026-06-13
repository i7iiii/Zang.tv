import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalChannels, totalCategories, activeChannels, premiumUsers, todayViews] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.channel.count(),
      this.prisma.category.count(),
      this.prisma.channel.count({ where: { status: 'active' } }),
      this.prisma.user.count({ where: { plan: 'premium' } }),
      this.prisma.watchSession.count({ where: { startedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
    ])
    return { totalUsers, totalChannels, totalCategories, activeChannels, premiumUsers, todayViews }
  }

  async getTopChannels(limit = 10) {
    return this.prisma.watchSession.groupBy({
      by: ['channelId'],
      _count: { channelId: true },
      orderBy: { _count: { channelId: 'desc' } },
      take: limit,
    })
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' },
        select: { id:true, name:true, email:true, role:true, plan:true, isBanned:true, createdAt:true } }),
      this.prisma.user.count(),
    ])
    return { users, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async banUser(userId: string, ban: boolean) {
    return this.prisma.user.update({ where: { id: userId }, data: { isBanned: ban } })
  }

  async setUserRole(userId: string, role: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { role: role as any } })
  }

  async getRecentViews(limit = 50) {
    return this.prisma.watchSession.findMany({
      take: limit,
      orderBy: { startedAt: 'desc' },
      include: { channel: { select: { nameKu: true, slug: true } } },
    })
  }
}
