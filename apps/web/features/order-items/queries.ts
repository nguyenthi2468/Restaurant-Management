import { useQuery } from "@tanstack/react-query";
import { getOrderItems, getOrderItemById, getOrderItemsByOrderId } from "./api";

export const useGetOrderItemsQuery = () => {
  return useQuery({
    queryKey: ["order-items"],
    queryFn: () => getOrderItems(),
  });
};

export const useGetOrderItemByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["order-item", id],
    queryFn: () => getOrderItemById(id),
    enabled: !!id,
  });
};

export const useGetOrderItemsByOrderIdQuery = (orderId: number) => {
  return useQuery({
    queryKey: ["order-items", "order", orderId],
    queryFn: () => getOrderItemsByOrderId(orderId),
    enabled: !!orderId,
  });
};
