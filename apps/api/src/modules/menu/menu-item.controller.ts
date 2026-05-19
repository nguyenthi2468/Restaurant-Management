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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
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

@ApiTags('menu-items')
@ApiBearerAuth()
@Controller('menu-items')
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
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
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              group: { type: 'string' },
              isRequired: { type: 'boolean' },
              values: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    priceAdjustment: { type: 'number' },
                  },
                },
              },
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
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    const imageId = image
      ? (
          await this.imageService.uploadImage(image, {
            folder: 'menu-items',
          })
        ).publicId
      : undefined;

    return this.menuItemService.create({
      ...createMenuItemDto,
      imageId,
    });
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
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
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
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              group: { type: 'string' },
              isRequired: { type: 'boolean' },
              values: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    priceAdjustment: { type: 'number' },
                  },
                },
              },
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
    @UploadedFile() image: Express.Multer.File,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    const imageId = image
      ? (
          await this.imageService.uploadImage(image, {
            folder: 'menu-items',
          })
        ).publicId
      : undefined;

    return this.menuItemService.update(id, {
      ...updateMenuItemDto,
      imageId,
    });
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
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
