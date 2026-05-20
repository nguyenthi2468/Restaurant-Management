import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { Order, CreateOrderData, UpdateOrderData } from "./types";

export const getOrders = async () => {
  const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS.BASE);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get<Order>(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
  return response.data;
};

export const createOrder = async (data: CreateOrderData) => {
  const response = await api.post<Order>(API_ENDPOINTS.ORDERS.BASE, data);
  return response.data;
};

export const updateOrder = async (id: string, data: UpdateOrderData) => {
  const response = await api.patch<Order>(`${API_ENDPOINTS.ORDERS.BASE}/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
  return response.data;
};
