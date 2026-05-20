import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMenuItem, updateMenuItem, deleteMenuItem } from './api';
import { toast } from 'react-hot-toast';
import { MenuItemFormValues } from './validator';

export const useCreateMenuItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuItemFormValues) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Món ăn đã được tạo thành công');
    },
    onError: (error) => {
      toast.error('Không thể tạo món ăn');
      console.error(error);
    },
  });
};

export const useUpdateMenuItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuItemFormValues }) =>
      updateMenuItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-item', id] });
      toast.success('Món ăn đã được cập nhật thành công');
    },
    onError: (error) => {
      toast.error('Không thể cập nhật món ăn');
      console.error(error);
    },
  });
};

export const useDeleteMenuItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Món ăn đã được xóa thành công');
    },
    onError: (error) => {
      toast.error('Không thể xóa món ăn');
      console.error(error);
    },
  });
};
