export enum KitchenTicketStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

export enum KitchenItemStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

export interface KitchenTicketItem {
  id: string;
  ticketId: string;
  orderItemId: string;
  quantity: number;
  status: KitchenItemStatus;
  note?: string | null;
  completedAt?: string | null;
  orderItem?: {
    id: string;
    order: {
      id: number;
    };
    menuItem: {
      id: string;
      name: string;
      price: number;
    };
  };
}

export interface KitchenTicket {
  id: string;
  orderId: number;
  order?: {
    id: number;
    status: string;
    total: number;
    note?: string;
    customerName?: string;
    customerPhone?: string;
  };
  status: KitchenTicketStatus;
  priority: number;
  note?: string | null;
  sentAt?: string | null;
  acceptedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: KitchenTicketItem[];
}

export interface CreateKitchenTicketItemData {
  orderItemId: string;
  quantity: number;
  note?: string;
}

export interface CreateKitchenTicketData {
  orderId: number;
  priority?: number;
  note?: string;
  items?: CreateKitchenTicketItemData[];
}

export interface UpdateKitchenTicketData {
  priority?: number;
  note?: string;
  items?: CreateKitchenTicketItemData[];
}

export interface KitchenTicketQueryParams {
  status?: KitchenTicketStatus;
  page?: number;
  limit?: number;
}
