import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import type { MenuCategory } from './types';
import type {
  MenuCategoryFormValues,
} from './validator';

// Get all menu categories
export const getMenuCategories = async () => {
  const response = await api.get<MenuCategory[]>(API_ENDPOINTS.MENU_CATEGORIES);
  return response.data;
};

// Get menu category by ID
export const getMenuCategoryById = async (id: string) => {
  const response = await api.get<MenuCategory>(
    `${API_ENDPOINTS.MENU_CATEGORIES}/${id}`,
  );
  return response.data;
};

// Create new menu category
export const createMenuCategory = async (
  data: MenuCategoryFormValues,
) => {
  const response = await api.post<MenuCategory>(API_ENDPOINTS.MENU_CATEGORIES, data);
  return response.data;
};

// Update menu category
export const updateMenuCategory = async (
  id: string,
  data: MenuCategoryFormValues,
) => {
  const response = await api.patch<MenuCategory>(
    `${API_ENDPOINTS.MENU_CATEGORIES}/${id}`,
    data,
  );
  return response.data;
};

// Delete menu category (soft delete)
export const deleteMenuCategory = async (id: string) => {
  const response = await api.delete<MenuCategory>(
    `${API_ENDPOINTS.MENU_CATEGORIES}/${id}`,
  );
  return response.data;
};
