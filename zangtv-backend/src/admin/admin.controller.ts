import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get('stats')             stats() { return this.svc.getDashboardStats() }
  @Get('top-channels')      topChannels(@Query('limit') l = 10) { return this.svc.getTopChannels(+l) }
  @Get('users')             users(@Query('page') p = 1, @Query('limit') l = 20) { return this.svc.getAllUsers(+p, +l) }
  @Get('recent-views')      recentViews() { return this.svc.getRecentViews() }
  @Put('users/:id/ban')     banUser(@Param('id') id: string, @Body('ban') ban: boolean) { return this.svc.banUser(id, ban) }
  @Put('users/:id/role')    setRole(@Param('id') id: string, @Body('role') role: string) { return this.svc.setUserRole(id, role) }
}
