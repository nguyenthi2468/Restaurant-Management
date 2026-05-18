import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Req,
  UseGuards,
  Headers,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LogoutDto } from '../auth/dto/logout.dto';
import { RefreshDto } from '../auth/dto/refresh.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';
import { minutes, Throttle } from '@nestjs/throttler';
import type { Response, Request } from 'express';
import { AuthProvider } from '@prisma/client';
import { ResendEmailDto } from '../auth/dto/resend-email.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiCreatedResponse({ description: 'Người dùng đã được đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Xác thực email' })
  @ApiResponse({ status: 200, description: 'Email đã được xác thực' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc hết hạn' })
  async verify(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body.token);
  }
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  @ApiCreatedResponse({
    description: 'Đăng nhập thành công, trả về access token và jti',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        jti: 'uuid-here',
        tokenType: 'Bearer',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: any,
  ) {
    const user = await this.authService.validateUserByEmailPassword(
      dto.email,
      dto.password,
    );
    const { accessToken, refreshToken, jti } =
      await this.authService.issueTokens(user.id, {
        ua: req.headers['user-agent'],
        ip,
        provider: AuthProvider.LOCAL,
      });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { accessToken, jti, tokenType: 'Bearer' };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Làm mới access token bằng refresh token' })
  @ApiCreatedResponse({
    description: 'Đã làm mới token thành công',
    schema: {
      example: {
        accessToken: 'new-access-token',
        jti: 'new-jti',
        tokenType: 'Bearer',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token không hợp lệ hoặc hết hạn',
  })
  async refresh(
    @Req() req: any,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const old = req.cookies?.['refresh_token'];
    console.log(old);
    const { accessToken, refreshToken, jti } =
      await this.authService.rotateRefreshToken(
        old,
        req.headers['user-agent'],
        ip,
      );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { accessToken, jti, tokenType: 'Bearer' };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @ApiOperation({ summary: 'Đăng xuất (xóa phiên hiện tại)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Đã đăng xuất thành công' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Body() dto: LogoutDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    // const jti = dto.jti ?? req.user?.jti;
    // if (jti) {
    //   await this.authService.revokeSessionByJti(
    //     jti,
    //     req.user?.sub,
    //     'user logout',
    //   );
    // }
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return;
  }

  @Post('logout-all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng xuất khỏi tất cả các phiên' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Đã đăng xuất khỏi tất cả các phiên',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logoutAll(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeAllUserSessions(
      req.user.sub,
      'User logout all',
    );

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { ok: true };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu bằng token' })
  @ApiResponse({ status: 200, description: 'Mật khẩu đã được đặt lại' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc hết hạn' })
  async resetPassword(
    @Body()
    body: ResetPasswordDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    await this.authService.resetPassword(body.token, body.newPassword, ip, ua);
    return { ok: true };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Bắt đầu quy trình đăng nhập bằng Google' })
  @ApiResponse({ status: 302, description: 'Chuyển hướng tới Google' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback từ Google sau xác thực' })
  @ApiResponse({
    status: 302,
    description: 'Chuyển hướng trở lại ứng dụng web với access token',
  })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginWithGoogle(req.user as any, {
        ip: req.ip,
        userAgent: req.headers['user-agent'] ?? '',
      });

    const web = process.env.PUBLIC_WEB_URL!;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 ngày
    });
    return res.redirect(
      `${web}/auth/callback#access_token=${encodeURIComponent(accessToken)}`,
    );
  }

  @Get('sessions')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lấy danh sách các phiên hiện tại của người dùng' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Danh sách các phiên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async mySessions(@Req() req: any) {
    const userId = req.user.id;
    const sessions = await this.authService.getSessions(userId);
    return { items: sessions };
  }

  @Throttle({ default: { limit: 5, ttl: minutes(10) } })
  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi lại email xác thực' })
  @ApiResponse({
    status: 200,
    description: 'Nếu email tồn tại và chưa xác thực, link đã được gửi',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ' })
  async resend(@Body() dto: ResendEmailDto) {
    await this.authService.resendVerificationEmail(dto.email);
    return {
      message:
        'If this email exists and is not verified, a link has been sent.',
    };
  }

  @Throttle({ default: { limit: 5, ttl: minutes(10) } })
  @Post('forgot-password')
  @HttpCode(202)
  @ApiOperation({ summary: 'Gửi email đặt lại mật khẩu' })
  @ApiResponse({
    status: 202,
    description: 'Email đã được gửi (nếu email tồn tại)',
  })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body.email);
    return { oke: true };
  }
}
