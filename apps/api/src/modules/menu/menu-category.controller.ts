import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenuCategoryService } from './menu-category.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('menu-categories')
@ApiBearerAuth()
@Controller('menu-categories')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post()
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Tạo danh mục menu mới' })
  @ApiCreatedResponse({
    description: 'Danh mục menu đã được tạo thành công',
    type: CreateMenuCategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuCategoryService.create(createMenuCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục menu' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục menu',
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.menuCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy danh mục menu theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết danh mục menu',
  })
  @ApiResponse({ status: 404, description: 'Danh mục menu không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.menuCategoryService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật danh mục menu' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục menu đã được cập nhật',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Danh mục menu không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    return this.menuCategoryService.update(id, updateMenuCategoryDto);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Xóa danh mục menu' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục menu đã được xóa (soft delete)',
  })
  @ApiResponse({ status: 404, description: 'Danh mục menu không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.menuCategoryService.remove(id);
  }
}
