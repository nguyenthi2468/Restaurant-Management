import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getKitchenTickets,
  getKitchenTicketById,
  getKitchenTicketsByStatus,
} from './api';

export const useGetKitchenTicketsQuery = () => {
  return useQuery({
    queryKey: ['kitchen-tickets'],
    queryFn: () => getKitchenTickets(),
  });
};

export const useGetKitchenTicketByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['kitchen-ticket', id],
    queryFn: () => getKitchenTicketById(id),
    enabled: !!id,
  });
};

export const useGetKitchenTicketsByStatusQuery = (status: string) => {
  return useQuery({
    queryKey: ['kitchen-tickets', 'status', status],
    queryFn: () => getKitchenTicketsByStatus(status),
    enabled: !!status,
  });
};
