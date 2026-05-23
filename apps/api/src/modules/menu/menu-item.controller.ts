import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Action } from '../auth/decorator/action.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from '../image/image.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Menu Items Management')
@ApiBearerAuth()
@Controller('menu-items')
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @Action('menu-item:create')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Tạo món ăn mới' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        categoryId: { type: 'string' },
        imageId: { type: 'string' },
        position: { type: 'number' },
        isAvailable: { type: 'boolean' },
        isVegetarian: { type: 'boolean' },
        isVegan: { type: 'boolean' },
        isGlutenFree: { type: 'boolean' },
        isSpicy: { type: 'boolean' },
        preparationTime: { type: 'number' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ingredientName: { type: 'string' },
              quantity: { type: 'number' },
              unit: { type: 'string' },
              isAllergen: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Món ăn đã được tạo thành công',
    type: CreateMenuItemDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Lấy danh sách món ăn theo danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách món ăn của danh mục',
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Danh mục không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.menuItemService.findByCategory(categoryId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả món ăn có sẵn' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách món ăn',
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.menuItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy món ăn theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết món ăn',
  })
  @ApiResponse({ status: 404, description: 'Món ăn không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.menuItemService.findOne(id);
  }

  @Patch(':id')
  @Action('menu-item:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Cập nhật món ăn' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        categoryId: { type: 'string' },
        imageId: { type: 'string' },
        position: { type: 'number' },
        isAvailable: { type: 'boolean' },
        isVegetarian: { type: 'boolean' },
        isVegan: { type: 'boolean' },
        isGlutenFree: { type: 'boolean' },
        isSpicy: { type: 'boolean' },
        preparationTime: { type: 'number' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ingredientName: { type: 'string' },
              quantity: { type: 'number' },
              unit: { type: 'string' },
              isAllergen: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Món ăn đã được cập nhật',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Món ăn không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @Action('menu-item:delete')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({ summary: 'Xóa món ăn' })
  @ApiResponse({
    status: 200,
    description: 'Món ăn đã được xóa (soft delete)',
  })
  @ApiResponse({ status: 404, description: 'Món ăn không tìm thấy' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(id);
  }
}
