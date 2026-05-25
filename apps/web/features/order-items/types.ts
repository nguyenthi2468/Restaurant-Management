import { MenuItem } from "../menu-items";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  note?: string;
  menuItem?: MenuItem;
}

export interface CreateOrderItemData {
  orderId: number;
  menuItemId: string;
  quantity: number;
  price: number;
  note?: string;
}

export interface UpdateOrderItemData {
  orderId?: string;
  menuItemId?: string;
  quantity?: number;
  price?: number;
  note?: string;
}

export interface UpdateNoteData {
  note?: string;
}
