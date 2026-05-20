import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import type { MenuItem } from './types';
import type { MenuItemFormValues } from './validator';

export const getMenuItems = async () => {
  const response = await api.get<MenuItem[]>(API_ENDPOINTS.MENU_ITEMS);
  return response.data;
};

export const getMenuItemById = async (id: string) => {
  const response = await api.get<MenuItem>(`${API_ENDPOINTS.MENU_ITEMS}/${id}`);
  return response.data;
};

export const createMenuItem = async (data: MenuItemFormValues) => {
  const response = await api.post<MenuItem>(API_ENDPOINTS.MENU_ITEMS, data);
  return response.data;
};

export const updateMenuItem = async (id: string, data: MenuItemFormValues) => {
  const response = await api.patch<MenuItem>(
    `${API_ENDPOINTS.MENU_ITEMS}/${id}`,
    data,
  );
  return response.data;
};

export const deleteMenuItem = async (id: string) => {
  const response = await api.delete<MenuItem>(
    `${API_ENDPOINTS.MENU_ITEMS}/${id}`,
  );
  return response.data;
};
