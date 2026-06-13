import { Controller, Post, Get, Body, UseGuards, Req, Res, HttpCode } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private config: ConfigService) {}

  @Post('register')
  @ApiOperation({ summary: 'تۆمارکردنی بەکارهێنەری نوێ' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'چوونەژوورەوە' })
  login(@Req() req: any) {
    return this.auth.login(req.user)
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'نوێکردنەوەی Access Token' })
  refresh(@Req() req: any) {
    const token = req.cookies?.refresh_token || req.body?.refresh_token
    if (!token) throw new Error('Refresh token نییە')
    const hash = crypto.createHash('sha256').update(token).digest('hex')
    // userId لە JWT کۆنەکە دەرببینە
    const decoded = this.auth['jwt'].decode(req.headers.authorization?.split(' ')[1] || '') as any
    return this.auth.refresh(decoded?.sub, hash)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  logout(@Req() req: any) {
    return this.auth.logout(req.user.id)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'زانیاری بەکارهێنەری ئێستا' })
  me(@Req() req: any) {
    return this.auth.getMe(req.user.id)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'چوونەژوورەوە بە Google' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const tokens = await this.auth.googleLogin(req.user)
    const frontend = this.config.get('FRONTEND_URL', 'http://localhost:3000')
    res.redirect(`${frontend}/auth/callback?token=${tokens.access_token}`)
  }
}
