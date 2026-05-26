import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrderById, getServedOrderByTableId } from './api';
import { GetOrdersQueryParams } from './types';

export const useGetOrdersQuery = (params?: GetOrdersQueryParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
};

export const useGetOrderByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useGetServedOrderByTableIdQuery = (tableId: string) => {
  return useQuery({
    queryKey: ['order', 'served', tableId],
    queryFn: () => getServedOrderByTableId(tableId),
    enabled: !!tableId,
  });
};
