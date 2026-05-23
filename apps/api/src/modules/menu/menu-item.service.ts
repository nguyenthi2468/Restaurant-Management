import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    // First, check if category exists
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: createMenuItemDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Menu category with ID ${createMenuItemDto.categoryId} not found`,
      );
    }

    // Start a transaction to create menu item, ingredients, and options
    return this.prisma.$transaction(async (tx) => {
      // Create menu item
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

      // Create ingredients if provided
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

      // Create options and their values if provided
      if (createMenuItemDto.options && createMenuItemDto.options.length > 0) {
        for (const opt of createMenuItemDto.options) {
          // Create option
          const option = await tx.menuItemOption.create({
            data: {
              menuItemId: menuItem.id,
              name: opt.name,
              description: opt.description,
              group: opt.group,
              isRequired: opt.isRequired ?? false,
              position: 0, // We'll update position later if needed, but for simplicity set to 0
            },
          });

          // Create option values
          if (opt.values && opt.values.length > 0) {
            await tx.menuItemOptionValue.createMany({
              data: opt.values.map((val) => ({
                optionId: option.id,
                name: val.name,
                description: val.description,
                priceAdjustment: val.priceAdjustment,
                position: 0, // Similarly, set to 0 for simplicity
              })),
            });
          }
        }
      }

      return menuItem;
    });
  }

  async findByCategory(categoryId: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Menu category with ID ${categoryId} not found`,
      );
    }

    return this.prisma.menuItem.findMany({
      where: {
        categoryId,
        isAvailable: true,
      },
      include: {
        category: true,
        image: true,
        ingredients: true,
        options: {
          include: {
            values: true,
          },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
        image: true,
        ingredients: true,
        options: {
          include: {
            values: true,
          },
          orderBy: { position: 'asc' },
        },
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
        options: {
          include: {
            values: true,
          },
          orderBy: { position: 'asc' },
        },
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
        options: {
          include: {
            values: true,
          },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    // If categoryId is being updated, check if new category exists
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

    // Filter out undefined values from the DTO, excluding 'ingredients' and 'options'
    const updateData: Record<string, any> = {};
    Object.entries(updateMenuItemDto).forEach(([key, value]) => {
      if (value !== undefined && key !== 'ingredients' && key !== 'options') {
        updateData[key] = value;
      }
    });

    // Start a transaction to update menu item, ingredients, and options
    return this.prisma.$transaction(async (tx) => {
      // Update menu item with filtered data
      const updatedMenuItem = await tx.menuItem.update({
        where: { id },
        data: updateData as any,
      });

      // Handle ingredients: delete existing and create new if provided
      if (updateMenuItemDto.ingredients !== undefined) {
        // Delete existing ingredients
        await tx.menuItemIngredient.deleteMany({
          where: { menuItemId: id },
        });

        // Create new ingredients if provided
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

      // Handle options: delete existing and create new if provided
      if (updateMenuItemDto.options !== undefined) {
        // Delete existing options (which will also delete their values due to cascade)
        await tx.menuItemOption.deleteMany({
          where: { menuItemId: id },
        });

        // Create new options if provided
        if (updateMenuItemDto.options && updateMenuItemDto.options.length > 0) {
          for (const opt of updateMenuItemDto.options) {
            // Create option
            const option = await tx.menuItemOption.create({
              data: {
                menuItemId: id,
                name: opt.name,
                description: opt.description,
                group: opt.group,
                isRequired: opt.isRequired ?? false,
                position: 0,
              },
            });

            // Create option values
            if (opt.values && opt.values.length > 0) {
              await tx.menuItemOptionValue.createMany({
                data: opt.values.map((val) => ({
                  optionId: option.id,
                  name: val.name,
                  description: val.description,
                  priceAdjustment: val.priceAdjustment,
                  position: 0,
                })),
              });
            }
          }
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

    // Soft delete: set isAvailable to false
    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false },
    });
  }
}
