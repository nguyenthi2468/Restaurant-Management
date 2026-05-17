import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: { sub: string }) {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }
}
