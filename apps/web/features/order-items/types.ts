import { MenuItem } from "../menu-items";
import { Order } from "../orders";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: string | number;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  menuItem?: MenuItem;
}

export interface CreateOrderItemData {
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderItemData {
  orderId?: string;
  menuItemId?: string;
  quantity?: number;
  price?: number;
}
