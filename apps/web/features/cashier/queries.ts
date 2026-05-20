import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, getMenuItems, getOrderByTableId, createOrUpdateOrder } from './api';

export const useCashierTablesQuery = () => {
  return useQuery({
    queryKey: ['cashier', 'tables'],
    queryFn: () => getTables(),
  });
};

export const useCashierMenuItemsQuery = () => {
  return useQuery({
    queryKey: ['cashier', 'menu-items'],
    queryFn: () => getMenuItems(),
  });
};

export const useCashierOrderQuery = (tableId: string) => {
  return useQuery({
    queryKey: ['cashier', 'order', tableId],
    queryFn: () => getOrderByTableId(tableId),
    enabled: !!tableId,
  });
};

export const useSaveOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrUpdateOrder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cashier', 'order', variables.tableId] });
      queryClient.invalidateQueries({ queryKey: ['cashier', 'tables'] });
    },
  });
};
