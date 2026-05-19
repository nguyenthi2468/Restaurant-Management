import { useQuery } from '@tanstack/react-query';
import { getMenuCategories, getMenuCategoryById } from './api';

export const useMenuCategoriesQuery = () => {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: () => getMenuCategories(),
  });
};

export const useMenuCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: ['menu-category', id],
    queryFn: () => getMenuCategoryById(id),
    enabled: !!id,
  });
};
