import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import type { JwtConfig } from '../config';
import { addExpiresIn } from '../common/utils/expires.util';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const customerRole = await this.prisma.role.findUnique({
      where: { name: 'customer' },
    });

    if (!customerRole) {
      throw new BadRequestException('Default role is not configured');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash,
        roles: {
          create: { roleId: customerRole.id },
        },
      },
    });

    // Create email verification token
    const verifyToken = randomUUID();
    const verifyExpiresAt = addExpiresIn(new Date(), '1h'); // 1 hour expiry
    await this.prisma.emailVerificationToken.create({
      data: {
        token: verifyToken,
        userId: user.id,
        expiresAt: verifyExpiresAt,
      },
    });

    // In a real app, send verification email.
    // For development, log the token (in production, remove this)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Email verification token for ${dto.email}: ${verifyToken}`);
    }

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueTokens(user.id, user.email, res);
  }

  async refresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const jwt = this.configService.get<JwtConfig>('jwt')!;

    let payload: { sub: string; email: string; jti: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwt.secret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt < new Date() ||
      stored.userId !== payload.sub
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { jti: payload.jti },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(payload.sub, payload.email, res);
  }

  async logout(refreshToken: string | undefined, res: Response) {
    const jwt = this.configService.get<JwtConfig>('jwt')!;

    if (refreshToken) {
      try {
        const payload = await this.jwtService.verifyAsync<{ jti: string }>(
          refreshToken,
          { secret: jwt.secret },
        );

        await this.prisma.refreshToken.updateMany({
          where: { jti: payload.jti, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      } catch {
        // ignore invalid token on logout
      }
    }

    res.clearCookie(jwt.refreshCookieName, { path: '/' });

    return { message: 'Logged out successfully' };
  }

  private async issueTokens(userId: string, email: string, res: Response) {
    const jwt = this.configService.get<JwtConfig>('jwt')!;
    const jti = randomUUID();
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwt.secret,
      expiresIn: jwt.accessExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti },
      {
        secret: jwt.secret,
        expiresIn: jwt.refreshExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );

    const expiresAt = addExpiresIn(new Date(), jwt.refreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: { jti, userId, expiresAt },
    });

    const maxAgeMs =
      addExpiresIn(new Date(), jwt.refreshExpiresIn).getTime() - Date.now();

    res.cookie(jwt.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeMs,
    });

    return {
      accessToken,
      jti,
      tokenType: 'Bearer',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // For security, do not reveal that email does not exist
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const token = randomUUID();
    const expiresAt = addExpiresIn(new Date(), '1h'); // 1 hour expiry

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // In a real app, send email with reset link.
    // For development, log the token (in production, remove this)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Password reset token for ${email}: ${token}`);
    }

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, password: string, res: Response) {
    const stored = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.usersService.findById(stored.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    // Optionally, issue new tokens and log in the user automatically
    // For security, we just return success and let the user login again
    return { message: 'Password has been reset. Please log in with your new password.' };
  }

  async verifyEmail(token: string) {
    const stored = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.usersService.findById(stored.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Mark email as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    // Mark token as used
    await this.prisma.emailVerificationToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    return { message: 'Email verified successfully' };
  }
}
