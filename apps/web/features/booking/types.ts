import { Floor } from '../floor';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum DepositStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  WAIVED = 'WAIVED',
}

export interface BookingTable {
  id: string;
  bookingId: string;
  tableId: string;
  table?: {
    id: string;
    name: string;
    floor: Floor;
    seats: number;
  };
}

export interface BookingMenuItem {
  id: string;
  bookingId: string;
  menuItemId: string;
  quantity: number;
  price: string | number;
  menuItem?: {
    id: string;
    name: string;
    price: string | number;
  };
}

export interface Booking {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingTime: string;
  endTime: string;
  numberOfGuests: number;
  numberOfChildren: number;
  note?: string | null;
  depositAmount: string | number;
  depositStatus: DepositStatus;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  bookingTables?: BookingTable[];
  preOrderItems?: BookingMenuItem[];
}

export interface CreateBookingTableData {
  tableId: string;
}

export interface CreateBookingMenuItemData {
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface CreateBookingData {
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingTime: Date | string;
  endTime?: Date | string;
  numberOfGuests: number;
  numberOfChildren?: number;
  note?: string;
  depositAmount?: number;
  depositStatus?: DepositStatus;
  status?: BookingStatus;
  tables: CreateBookingTableData[];
  preOrderItems?: CreateBookingMenuItemData[];
}

export interface UpdateBookingData {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  bookingTime?: Date | string;
  endTime?: Date | string;
  numberOfGuests?: number;
  numberOfChildren?: number;
  note?: string;
  depositAmount?: number;
  depositStatus?: DepositStatus;
  status?: BookingStatus;
  tables?: CreateBookingTableData[];
  preOrderItems?: CreateBookingMenuItemData[];
}

export interface VnpayPaymentResponse {
  paymentUrl: string;
}

export interface BookingQueryParams {
  search?: string;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedBookingResponse {
  data: Booking[];
  meta: PaginationMeta;
}
