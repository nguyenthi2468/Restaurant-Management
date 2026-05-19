export interface ImageAsset {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemIngredient {
  id: string;
  menuItemId: string;
  ingredientName: string;
  quantity: number; // Decimal in Prisma, but number in JS/TS
  unit: string;
  isAllergen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemOptionValue {
  id: string;
  optionId: string;
  name: string;
  description: string | null;
  priceAdjustment: number; // Decimal in Prisma, but number in JS/TS
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemOption {
  id: string;
  menuItemId: string;
  name: string;
  description: string | null;
  group: string | null;
  isRequired: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  values: MenuItemOptionValue[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number; // Decimal in Prisma, but number in JS/TS
  categoryId: string;
  imageId: string | null;
  image: ImageAsset | null;
  position: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  preparationTime: number | null;
  createdAt: string;
  updatedAt: string;
  ingredients: MenuItemIngredient[];
  options: MenuItemOption[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  imageId: string | null;
  image: ImageAsset | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  menuItems: MenuItem[];
}

// DTOs for API requests
export interface CreateMenuCategoryDto {
  name: string;
  description?: string;
  imageId?: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateMenuCategoryDto {
  name?: string;
  description?: string;
  imageId?: string;
  position?: number;
  isActive?: boolean;
}
