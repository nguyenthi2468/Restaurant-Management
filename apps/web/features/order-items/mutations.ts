import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrderItem, updateOrderItem, deleteOrderItem } from './api';
import { CreateOrderItemData, UpdateOrderItemData } from './types';
import toast from 'react-hot-toast';
import { ApiError } from '@/types';

export const useCreateOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderItemData) => createOrderItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', 'served', variables.orderId] });
    },
  });
};

export const useUpdateOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderItemData }) =>
      updateOrderItem(id, data),
    onSuccess: (_, { data }) => {
      if (data.orderId) {
        queryClient.invalidateQueries({
          queryKey: ['order-items', 'order', data.orderId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      }
    });
};

export const useDeleteOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrderItem(id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["order-items"] });
      // queryClient.invalidateQueries({ queryKey: ["order-item"] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Món ăn đã được xóa');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Xóa món ăn thất bại');
    },
  });
};
