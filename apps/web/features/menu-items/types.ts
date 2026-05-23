import { GalleryImages } from '../gallery';
import { MenuCategory } from '../menu-categories';

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
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
}

export interface MenuItemIngredient {
  id: string;
  menuItemId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  isAllergen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemQueryParams {
  menuCategoryId?: string;
  search?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedMenuItem {
  data: MenuItem[];
  meta: PaginationMeta;
}
