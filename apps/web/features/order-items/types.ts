import { MenuItem } from "../menu-items";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: string | number;
  createdAt: string;
  updatedAt: string;
  notes: string;
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
