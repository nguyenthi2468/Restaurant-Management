import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { Request } from 'express';
import { ListUsersQuery } from '../users/dto/list-users.query';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { UpdateMeDto } from '../users/dto/update-me.dto';
import { Action } from '../auth/decorator/action.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
// ✅ gọn: dùng chung cho cả controller
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('me/change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu người dùng hiện tại' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Đã đổi mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    await this.users.changePassword(req.user.id, body);
    return { ok: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng',
    type: PublicUserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.users.me(user.id);
    return {
      data: plainToInstance(PublicUserDto, data, {
        groups: ['private'],
        excludeExtraneousValues: true,
      }),
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng hiện tại' })
  @ApiBody({ type: UpdateMeDto })
  @ApiResponse({
    status: 200,
    description: 'Đã cập nhật thông tin người dùng',
    type: PublicUserDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateMe(@Req() req: Request, @Body() dto: UpdateMeDto) {
    const user = req.user as any;
    const data = await this.users.updateMe(user.id, dto);
    return plainToInstance(PublicUserDto, data, {
      groups: ['private'],
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin công khai của người dùng theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin công khai của người dùng',
    type: PublicUserDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getById(@Req() req: Request, @Param('id') id: string) {
    const requesterId = (req.user as any).id;
    const data = await this.users.getPublicProfile(requesterId, id);
    const groups = data.email ? ['private'] : [];
    return plainToInstance(PublicUserDto, data, {
      groups,
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @Action('users.list')
  @ApiOperation({
    summary: 'Lấy danh sách người dùng với bộ lọc và phân trang',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách người dùng',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(@Query() query: ListUsersQuery) {
    const { items, meta } = await this.users.listUsers(query);
    return {
      data: items.map((u) =>
        plainToInstance(PublicUserDto, u, {
          groups: ['private'],
          excludeExtraneousValues: true,
        }),
      ),
      meta,
    };
  }
}
