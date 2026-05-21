import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFloor, updateFloor, deleteFloor } from './api';
import { toast } from 'react-hot-toast';
import { FloorFormValues } from './validator';

export const useCreateFloorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FloorFormValues) => createFloor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Tầng đã được tạo thành công');
    },
    onError: (error) => {
      toast.error('Không thể tạo tầng');
      console.error(error);
    },
  });
};

export const useUpdateFloorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FloorFormValues }) =>
      updateFloor(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      queryClient.invalidateQueries({ queryKey: ['floor', id] });
      toast.success('Tầng đã được cập nhật thành công');
    },
    onError: (error) => {
      toast.error('Không thể cập nhật tầng');
      console.error(error);
    },
  });
};

export const useDeleteFloorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFloor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      toast.success('Tầng đã được xóa thành công');
    },
    onError: (error) => {
      toast.error('Không thể xóa tầng');
      console.error(error);
    },
  });
};
