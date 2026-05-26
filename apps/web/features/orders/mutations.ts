import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrder,
  updateOrder,
  deleteOrder,
  cancelOrder,
  updateOrderNote,
} from './api';
import { CreateOrderData, UpdateOrderData } from './types';
import toast from 'react-hot-toast';
import { ApiError } from '@/types';

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: (data) => {
      if (data.orderTables?.length) {
        data.orderTables.forEach((orderTable) => {
          queryClient.invalidateQueries({
            queryKey: ['order', 'served', orderTable.tableId],
            exact: true,
          });
        });
      }
      queryClient.invalidateQueries({ queryKey: ['tables', 'with-bookings'] });
    },
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderData }) =>
      updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tables', 'with-bookings'] });
      queryClient.invalidateQueries({
        queryKey: ['order', 'served', data.tableId],
      });
    },
  });
};

export const useUpdateOrderNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note: string }) =>
      updateOrderNote(id, note),
    onSuccess: (data) => {
      if (data.orderTables?.length) {
        data.orderTables.forEach((orderTable) => {
          queryClient.invalidateQueries({
            queryKey: ['order', 'served', orderTable.tableId],
            exact: true,
          });
        });
      }
      toast.success('Note updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Note update failed');
    },
  });
};
