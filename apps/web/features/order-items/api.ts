import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { OrderItem, CreateOrderItemData, UpdateOrderItemData } from "./types";

export const getOrderItems = async () => {
  const response = await api.get<OrderItem[]>(API_ENDPOINTS.ORDER_ITEMS.BASE);
  return response.data;
};

export const getOrderItemById = async (id: string) => {
  const response = await api.get<OrderItem>(`${API_ENDPOINTS.ORDER_ITEMS.BASE}/${id}`);
  return response.data;
};

export const getOrderItemsByOrderId = async (orderId: string) => {
  const response = await api.get<OrderItem[]>(`${API_ENDPOINTS.ORDER_ITEMS.ORDER}/${orderId}`);
  return response.data;
};

export const createOrderItem = async (data: CreateOrderItemData) => {
  const response = await api.post<OrderItem>(API_ENDPOINTS.ORDER_ITEMS.BASE, data);
  return response.data;
};

export const updateOrderItem = async (id: string, data: UpdateOrderItemData) => {
  const response = await api.patch<OrderItem>(`${API_ENDPOINTS.ORDER_ITEMS.BASE}/${id}`, data);
  return response.data;
};

export const deleteOrderItem = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.ORDER_ITEMS.BASE}/${id}`);
  return response.data;
};
