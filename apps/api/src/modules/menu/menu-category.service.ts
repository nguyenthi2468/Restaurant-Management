import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';

@Injectable()
export class MenuCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.prisma.menuCategory.create({
      data: createMenuCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.menuCategory.findMany({
      orderBy: { position: 'asc' },
      include: {
        image: {
          select: {
            id: true,
            secureUrl: true,
          },
        },
      },
    });
  }

  async findAllWithMenuItems() {
    return this.prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      include: {
        image: {
          select: {
            id: true,
            secureUrl: true,
          },
        },
        menuItems: {
          include: {
            image: true,
          },
          where: { isAvailable: true },
          orderBy: { position: 'asc' },
          take: 4,
        },
      },
    });
  }

  async findOne(id: string) {
    const menuCategory = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: {
        image: {
          select: {
            id: true,
            secureUrl: true,
          },
        },
        menuItems: {
          where: { isAvailable: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!menuCategory) {
      throw new NotFoundException(`Menu category with ID ${id} not found`);
    }

    return menuCategory;
  }

  async update(id: string, updateMenuCategoryDto: UpdateMenuCategoryDto) {
    const menuCategory = await this.prisma.menuCategory.findUnique({
      where: { id },
    });

    if (!menuCategory) {
      throw new NotFoundException(`Menu category with ID ${id} not found`);
    }

    return this.prisma.menuCategory.update({
      where: { id },
      data: updateMenuCategoryDto,
    });
  }

  async remove(id: string) {
    const menuCategory = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: {
        menuItems: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!menuCategory) {
      throw new NotFoundException(`Menu category with ID ${id} not found`);
    }
    if (menuCategory.menuItems.length > 0) {
      throw new BadRequestException(
        'Không thể xóa danh mục menu có chứa món ăn',
      );
    }
    // Soft delete: set isActive to false
    return this.prisma.menuCategory.delete({
      where: { id },
    });
  }
}
