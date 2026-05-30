import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';
import { PaginatedMenuItemResponseDto } from './dto/paginated-menu-item-response.dto';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: createMenuItemDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Menu category with ID ${createMenuItemDto.categoryId} not found`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const menuItem = await tx.menuItem.create({
        data: {
          name: createMenuItemDto.name,
          description: createMenuItemDto.description,
          price: createMenuItemDto.price,
          categoryId: createMenuItemDto.categoryId,
          imageId: createMenuItemDto.imageId,
          position: createMenuItemDto.position ?? 0,
          isAvailable: createMenuItemDto.isAvailable ?? true,
          isVegetarian: createMenuItemDto.isVegetarian ?? false,
          isVegan: createMenuItemDto.isVegan ?? false,
          isGlutenFree: createMenuItemDto.isGlutenFree ?? false,
          isSpicy: createMenuItemDto.isSpicy ?? false,
          preparationTime: createMenuItemDto.preparationTime,
        },
      });

      if (
        createMenuItemDto.ingredients &&
        createMenuItemDto.ingredients.length > 0
      ) {
        await tx.menuItemIngredient.createMany({
          data: createMenuItemDto.ingredients.map((ing) => ({
            menuItemId: menuItem.id,
            ingredientName: ing.ingredientName,
            quantity: ing.quantity,
            unit: ing.unit,
            isAllergen: ing.isAllergen ?? false,
          })),
        });
      }

      return menuItem;
    });
  }

  async findAllWithPagination(
    queryDto: QueryMenuItemDto,
  ): Promise<PaginatedMenuItemResponseDto> {
    const {
      search,
      isAvailable,
      menuCategoryId,
      isFeature,
      page = 1,
      limit = 10,
    } = queryDto;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    if (isFeature !== undefined) {
      where.isFeature = isFeature;
    }

    if (menuCategoryId) {
      where.categoryId = menuCategoryId;
    }

    const skip = (page - 1) * limit;

    const [menuItems, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          image: true,
          ingredients: true,
        },
        orderBy: { position: 'asc' },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: menuItems as any,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findAll() {
    return this.prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        image: true,
        ingredients: true,
      },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        image: true,
        ingredients: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return menuItem;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        ingredients: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    if (updateMenuItemDto.categoryId) {
      const category = await this.prisma.menuCategory.findUnique({
        where: { id: updateMenuItemDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Menu category with ID ${updateMenuItemDto.categoryId} not found`,
        );
      }
    }

    const updateData: Record<string, any> = {};
    Object.entries(updateMenuItemDto).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== 'ingredients' &&
        key !== 'categoryId' &&
        key !== 'imageId'
      ) {
        updateData[key] = value;
      }
    });

    if (updateMenuItemDto.categoryId !== undefined) {
      updateData.category = {
        connect: { id: updateMenuItemDto.categoryId },
      };
    }

    if (updateMenuItemDto.imageId !== undefined) {
      if (updateMenuItemDto.imageId === null) {
        updateData.image = {
          disconnect: true,
        };
      } else {
        updateData.image = {
          connect: { id: updateMenuItemDto.imageId },
        };
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedMenuItem = await tx.menuItem.update({
        where: { id },
        data: updateData as any,
      });

      if (updateMenuItemDto.ingredients !== undefined) {
        await tx.menuItemIngredient.deleteMany({
          where: { menuItemId: id },
        });

        if (
          updateMenuItemDto.ingredients &&
          updateMenuItemDto.ingredients.length > 0
        ) {
          await tx.menuItemIngredient.createMany({
            data: updateMenuItemDto.ingredients.map((ing) => ({
              menuItemId: id,
              ingredientName: ing.ingredientName,
              quantity: ing.quantity,
              unit: ing.unit,
              isAllergen: ing.isAllergen ?? false,
            })),
          });
        }
      }

      return updatedMenuItem;
    });
  }

  async remove(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    const hasOrderItems = await this.prisma.orderItem.count({
      where: { menuItemId: id },
    });

    const hasBookingItems = await this.prisma.bookingMenuItem.count({
      where: { menuItemId: id },
    });

    if (hasOrderItems > 0 || hasBookingItems > 0) {
      throw new ConflictException(
        'Cannot delete menu item. It is referenced in orders or bookings.',
      );
    }

    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
