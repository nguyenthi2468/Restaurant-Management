import { useQuery } from '@tanstack/react-query';
import {
  getKitchenTickets,
  getKitchenTicketById,
  getKitchenTicketsByOrderId,
} from './api';

export const useGetKitchenTicketsQuery = (status?: string) => {
  return useQuery({
    queryKey: ['kitchen-tickets', status],
    queryFn: () => getKitchenTickets(status),
    enabled: true,
  });
};

export const useGetKitchenTicketByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['kitchen-ticket', id],
    queryFn: () => getKitchenTicketById(id),
    enabled: !!id,
  });
};

export const useGetKitchenTicketsByOrderIdQuery = (orderId: number) => {
  return useQuery({
    queryKey: ['kitchen-tickets', 'order', orderId],
    queryFn: () => getKitchenTicketsByOrderId(orderId),
    enabled: !!orderId,
  });
};
