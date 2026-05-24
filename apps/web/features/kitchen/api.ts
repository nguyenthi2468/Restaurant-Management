import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import {
  KitchenTicket,
  CreateKitchenTicketData,
  UpdateKitchenTicketData,
  KitchenItemStatus,
} from './types';

export const getKitchenTickets = async () => {
  const response = await api.get<KitchenTicket[]>(
    API_ENDPOINTS.KITCHEN_TICKETS.BASE,
  );
  return response.data;
};

export const getKitchenTicketById = async (id: string) => {
  const response = await api.get<KitchenTicket>(
    `${API_ENDPOINTS.KITCHEN_TICKETS.BASE}/${id}`,
  );
  return response.data;
};

export const createKitchenTicket = async (data: CreateKitchenTicketData) => {
  const response = await api.post<KitchenTicket>(
    API_ENDPOINTS.KITCHEN_TICKETS.BASE,
    data,
  );
  return response.data;
};

export const updateKitchenTicket = async (
  id: string,
  data: UpdateKitchenTicketData,
) => {
  const response = await api.patch<KitchenTicket>(
    `${API_ENDPOINTS.KITCHEN_TICKETS.BASE}/${id}`,
    data,
  );
  return response.data;
};

export const deleteKitchenTicket = async (id: string) => {
  const response = await api.delete(
    `${API_ENDPOINTS.KITCHEN_TICKETS.BASE}/${id}`,
  );
  return response.data;
};

export const acceptKitchenTicket = async (id: string) => {
  const response = await api.patch<KitchenTicket>(
    API_ENDPOINTS.KITCHEN_TICKETS.ACCEPT(id),
  );
  return response.data;
};

export const completeKitchenTicket = async (id: string) => {
  const response = await api.patch<KitchenTicket>(
    API_ENDPOINTS.KITCHEN_TICKETS.COMPLETE(id),
  );
  return response.data;
};

export const getKitchenTicketsByStatus = async (status: string) => {
  const response = await api.get<KitchenTicket[]>(
    API_ENDPOINTS.KITCHEN_TICKETS.BY_STATUS(status),
  );
  return response.data;
};

export const updateKitchenTicketItemStatus = async (
  itemId: string,
  status: KitchenItemStatus,
) => {
  const response = await api.patch<KitchenTicket>(
    API_ENDPOINTS.KITCHEN_TICKETS.ITEM_STATUS(itemId),
    { status },
  );
  return response.data;
};
