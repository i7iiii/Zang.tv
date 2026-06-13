import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─── Validate password (LocalStrategy) ──────────────
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) throw new UnauthorizedException('ئیمەیڵ یان تێپەڕەوشە هەڵەیە')
    if (user.isBanned) throw new UnauthorizedException('هەژمارەکەت بلۆک کراوە')
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new UnauthorizedException('ئیمەیڵ یان تێپەڕەوشە هەڵەیە')
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
    return user
  }

  // ─── Register ────────────────────────────────────────
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('ئەم ئیمەیڵە پێشتر تۆمارکراوە')
    if (dto.password.length < 8) throw new BadRequestException('تێپەڕەوشە دەبێت لانیکەم 8 پیت بێت')
    const hash = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, passwordHash: hash },
    })
    return this.generateTokens(user)
  }

  // ─── Login ────────────────────────────────────────────
  async login(user: any) {
    return this.generateTokens(user)
  }

  // ─── Google OAuth ─────────────────────────────────────
  async googleLogin(profile: any) {
    const email = profile.emails?.[0]?.value
    if (!email) throw new BadRequestException('Google هەژمارت ئیمەیڵ نییە')
    let user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: profile.displayName || 'User',
          email,
          provider: 'google',
          providerId: profile.id,
          avatarUrl: profile.photos?.[0]?.value,
          isVerified: true,
        },
      })
    }
    return this.generateTokens(user)
  }

  // ─── Refresh Token ────────────────────────────────────
  async refresh(userId: string, tokenHash: string) {
    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId, tokenHash, isRevoked: false, expiresAt: { gt: new Date() } },
    })
    if (!stored) throw new UnauthorizedException('Token کۆنەیە — دووبارە بچۆ ژوورەوە')
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    return this.generateTokens(user)
  }

  // ─── Logout ───────────────────────────────────────────
  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    })
    return { message: 'چووتە دەرەوە' }
  }

  // ─── Generate Access + Refresh Tokens ─────────────────
  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    const access_token = this.jwt.sign(payload)

    // Refresh token (30 days)
    const raw = crypto.randomBytes(40).toString('hex')
    const hash = crypto.createHash('sha256').update(raw).digest('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await this.prisma.refreshToken.create({ data: { userId: user.id, tokenHash: hash, expiresAt } })

    return {
      access_token,
      refresh_token: raw,
      expires_in: 900, // 15 min
      user: { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan, avatarUrl: user.avatarUrl },
    }
  }

  // ─── Get Me ───────────────────────────────────────────
  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id:true, name:true, email:true, avatarUrl:true, role:true, plan:true, langPref:true, createdAt:true },
    })
  }
}
