import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import {
  KitchenTicket,
  CreateKitchenTicketData,
  UpdateKitchenTicketData,
  KitchenItemStatus,
  KitchenTicketItem,
} from './types';

export const getKitchenTickets = async (status?: string) => {
  const response = await api.get<KitchenTicket[]>(
    status
      ? `${API_ENDPOINTS.KITCHEN_TICKETS.BASE}?status=${status}`
      : API_ENDPOINTS.KITCHEN_TICKETS.BASE,
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

export const getKitchenTicketsByOrderId = async (orderId: number) => {
  const response = await api.get<KitchenTicket[]>(
    API_ENDPOINTS.KITCHEN_TICKETS.BY_ORDER(orderId),
  );
  return response.data;
};

export const getKitchenTicketItemsByStatus = async (status?: string) => {
  const response = await api.get<KitchenTicketItem[]>(
    status
      ? `${API_ENDPOINTS.KITCHEN_TICKETS.BASE}/items?status=${status}`
      : `${API_ENDPOINTS.KITCHEN_TICKETS.BASE}/items`,
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
