import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import {
  Order,
  CreateOrderData,
  UpdateOrderData,
  CompleteOrderData,
} from './types';
import { VnpayPaymentResponse } from '../booking';

export const getOrders = async () => {
  const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS.BASE);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get<Order>(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
  return response.data;
};

export const getServedOrderByTableId = async (tableId: string) => {
  const response = await api.get<Order>(
    `${API_ENDPOINTS.ORDERS.BASE}/table/${tableId}/served`,
  );
  return response.data;
};

export const createOrder = async (data: CreateOrderData) => {
  const response = await api.post<Order>(API_ENDPOINTS.ORDERS.BASE, data);
  return response.data;
};

export const updateOrder = async (id: string, data: UpdateOrderData) => {
  const response = await api.patch<Order>(
    `${API_ENDPOINTS.ORDERS.BASE}/${id}`,
    data,
  );
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
  return response.data;
};

export const cancelOrder = async (id: number) => {
  const response = await api.patch<Order>(
    `${API_ENDPOINTS.ORDERS.BASE}/${id}/cancel`,
  );
  return response.data;
};

export const updateOrderNote = async (id: number, note: string) => {
  const response = await api.patch<Order>(
    `${API_ENDPOINTS.ORDERS.BASE}/${id}/note`,
    { note },
  );
  return response.data;
};

export const completeOrder = async (id: number, data: CompleteOrderData) => {
  const response = await api.patch<Order>(
    `${API_ENDPOINTS.ORDERS.BASE}/${id}/complete`,
    data,
  );
  return response.data;
};

export const createOrderPayment = async (id: number) => {
  const response = await api.post<VnpayPaymentResponse>(
    `${API_ENDPOINTS.ORDERS.BASE}/${id}/pay`,
  );
  return response.data;
};
