import { useQuery } from '@tanstack/react-query';
import {
  getMenuItems,
  getMenuItemById,
  getMenuItemsWithPagination,
} from './api';
import type { MenuItemQueryParams } from './types';

export const useMenuItemsQuery = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: () => getMenuItems(),
  });
};

export const useMenuItemQuery = (id: string) => {
  return useQuery({
    queryKey: ['menu-item', id],
    queryFn: () => getMenuItemById(id),
    enabled: !!id && id !== 'new',
  });
};

export const useMenuItemsWithPaginationQuery = (
  params?: MenuItemQueryParams,
) => {
  return useQuery({
    queryKey: ['menu-items', 'pagination', params],
    queryFn: () => getMenuItemsWithPagination(params),
  });
};
