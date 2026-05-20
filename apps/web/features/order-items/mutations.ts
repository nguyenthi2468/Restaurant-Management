import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderItem, updateOrderItem, deleteOrderItem } from "./api";
import { CreateOrderItemData, UpdateOrderItemData } from "./types";

export const useCreateOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderItemData) => createOrderItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order-items"] });
      queryClient.invalidateQueries({ queryKey: ["order-items", "order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderItemData }) =>
      updateOrderItem(id, data),
    onSuccess: (_, { data }) => {
      queryClient.invalidateQueries({ queryKey: ["order-items"] });
      queryClient.invalidateQueries({ queryKey: ["order-item"] });
      if (data.orderId) {
        queryClient.invalidateQueries({ queryKey: ["order-items", "order", data.orderId] });
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrderItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-items"] });
      queryClient.invalidateQueries({ queryKey: ["order-item"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
