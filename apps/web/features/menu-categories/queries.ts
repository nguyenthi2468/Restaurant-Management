import { useQuery } from '@tanstack/react-query';
import { getMenuCategories, getMenuCategoriesWithMenuItems, getMenuCategoryById } from './api';

export const useMenuCategoriesQuery = () => {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: () => getMenuCategories(),
  });
};

// Get all menu categories with menu items
export const useMenuCategoriesWithMenuItemsQuery = () => {
  return useQuery({
    queryKey: ['menu-categories-with-menu-items'],
    queryFn: () => getMenuCategoriesWithMenuItems(),
  });
};

export const useMenuCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: ['menu-category', id],
    queryFn: () => getMenuCategoryById(id),
    enabled: !!id,
  });
};
