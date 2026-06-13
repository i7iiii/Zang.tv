import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private svc: FavoritesService) {}
  @Get()    getAll(@Req() req: any) { return this.svc.getAll(req.user.id) }
  @Post()   add(@Req() req: any, @Body('channel_id') cid: string) { return this.svc.add(req.user.id, cid) }
  @Delete(':channelId') remove(@Req() req: any, @Param('channelId') cid: string) { return this.svc.remove(req.user.id, cid) }
}
