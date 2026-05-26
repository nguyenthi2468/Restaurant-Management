export enum PaymentMethod {
  CASH = 'CASH',
  VNPAY = 'VNPAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Payment {
  id: string;
  orderId: number;
  bookingId: string;
  transactionCode: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}
