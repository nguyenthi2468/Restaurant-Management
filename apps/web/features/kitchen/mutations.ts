import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createKitchenTicket,
  updateKitchenTicket,
  deleteKitchenTicket,
  acceptKitchenTicket,
  completeKitchenTicket,
  updateKitchenTicketItemStatus,
} from './api';
import {
  CreateKitchenTicketData,
  UpdateKitchenTicketData,
  KitchenItemStatus,
} from './types';

export const useCreateKitchenTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKitchenTicketData) => createKitchenTicket(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
      queryClient.invalidateQueries({
        queryKey: ['kitchen-ticket', data.id],
      });
    },
  });
};

export const useUpdateKitchenTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKitchenTicketData }) =>
      updateKitchenTicket(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-ticket', id] });
    },
  });
};

export const useDeleteKitchenTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKitchenTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
    },
  });
};

export const useAcceptKitchenTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptKitchenTicket(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-ticket', data.id] });
    },
  });
};

export const useCompleteKitchenTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeKitchenTicket(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-ticket', data.id] });
    },
  });
};

export const useUpdateKitchenTicketItemStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      status,
    }: {
      itemId: string;
      status: KitchenItemStatus;
    }) => updateKitchenTicketItemStatus(itemId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
      queryClient.invalidateQueries({
        queryKey: ['kitchen-ticket', data.id],
      });
    },
  });
};
