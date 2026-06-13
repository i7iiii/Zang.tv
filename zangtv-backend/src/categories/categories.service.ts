import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { channels: { where: { status: 'active' } } } } },
    })
  }
}
