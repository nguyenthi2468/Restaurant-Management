import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrderById } from "./api";

export const useGetOrdersQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });
};

export const useGetOrderByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};
