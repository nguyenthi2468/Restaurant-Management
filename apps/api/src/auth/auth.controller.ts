import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/decorators/public.decorator';
import type { JwtConfig } from '../config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.resetPassword(dto.token, dto.password, res);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = this.configService.get<JwtConfig>('jwt')!;
    return this.authService.refresh(req.cookies?.[jwt.refreshCookieName], res);
  }

  @Public()
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const jwt = this.configService.get<JwtConfig>('jwt')!;
    return this.authService.logout(req.cookies?.[jwt.refreshCookieName], res);
  }
}
