import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTable,
  updateTable,
  deleteTable,
} from './api';
import { toast } from 'react-hot-toast';
import { TableFormValues } from './validator';
import { ApiError } from '@/types';

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TableFormValues) => createTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Bàn đã được tạo thành công');
    },
    onError: (error) => {
      toast.error('Không thể tạo bàn');
      console.error(error);
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TableFormValues }) =>
      updateTable(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table', id] });
      toast.success('Bàn đã được cập nhật thành công');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'Không thể cập nhật bàn');
      console.error(error);
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Bàn đã được xóa thành công');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'Không thể xóa bàn');
      console.error(error);
    },
  });
};
