import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} from './api';
import { toast } from 'react-hot-toast';
import { MenuCategoryFormValues } from './validator';
import { ApiError } from '@/types';
export const useCreateMenuCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuCategoryFormValues) => createMenuCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      toast.success('Danh mục menu đã được tạo thành công');
    },
    onError: (error) => {
      toast.error('Không thể tạo danh mục menu');
      console.error(error);
    },
  });
};

export const useUpdateMenuCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MenuCategoryFormValues }) =>
      updateMenuCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-category', id] });
      toast.success('Danh mục menu đã được cập nhật thành công');
    },
    onError: (error) => {
      toast.error('Không thể cập nhật danh mục menu');
      console.error(error);
    },
  });
};

export const useDeleteMenuCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMenuCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      toast.success('Danh mục menu đã được xóa thành công');
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'Không thể xóa danh mục menu';
      toast.error(errorMessage);
      console.error(error);
    },
  });
};
