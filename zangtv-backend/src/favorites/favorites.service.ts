import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}
  getAll(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { channel: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }
  async add(userId: string, channelId: string) {
    const exists = await this.prisma.favorite.findUnique({ where: { userId_channelId: { userId, channelId } } })
    if (exists) throw new ConflictException('پێشتر زیادکراوە')
    return this.prisma.favorite.create({ data: { userId, channelId } })
  }
  async remove(userId: string, channelId: string) {
    const fav = await this.prisma.favorite.findUnique({ where: { userId_channelId: { userId, channelId } } })
    if (!fav) throw new NotFoundException('نەدۆزرایەوە')
    return this.prisma.favorite.delete({ where: { id: fav.id } })
  }
}
