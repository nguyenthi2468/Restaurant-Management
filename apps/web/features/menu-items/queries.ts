import { useQuery } from '@tanstack/react-query';
import { getMenuItems, getMenuItemById } from './api';

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
