import { GalleryImages } from "../gallery";
import { MenuCategory } from "../menu-categories";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number; // Decimal in Prisma, but number in JS/TS
  categoryId: string;
  category: MenuCategory | null;
  imageId: string | null;
  image: GalleryImages | null;
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
