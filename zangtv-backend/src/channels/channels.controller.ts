import { Controller, Get, Post, Put, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ChannelsService } from './channels.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import * as crypto from 'crypto'

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private svc: ChannelsService) {}

  @Get()
  findAll(@Query() q: any) { return this.svc.findAll(q) }

  @Get('featured')
  featured() { return this.svc.getFeatured() }

  @Get('category/:slug')
  byCategory(@Param('slug') slug: string) { return this.svc.getByCategory(slug) }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.svc.findBySlug(slug) }

  @Get(':id/viewers')
  viewers(@Param('id') id: string) { return this.svc.getLiveViewers(id).then(v => ({ viewers: v })) }

  @Post(':id/view')
  recordView(@Param('id') id: string, @Req() req: any) {
    const ip = req.ip || req.connection.remoteAddress || ''
    const hash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)
    const ua = req.headers['user-agent']?.slice(0, 200)
    return this.svc.recordView(id, req.user?.id, hash, ua)
  }

  // Admin only
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin') @ApiBearerAuth()
  create(@Body() body: any) { return this.svc.create(body) }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin') @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body) }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin') @ApiBearerAuth()
  remove(@Param('id') id: string) { return this.svc.remove(id) }
}
