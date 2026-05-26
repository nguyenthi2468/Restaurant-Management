'use client';

import { useState, useMemo } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { Order } from '@/features/orders';
import { OrderItem } from '@/features/order-items';
import { PaymentMethod } from '@/features/payments';

interface OrderPaymentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  orderItems: OrderItem[];
  totalAmount: number;
  isPending: boolean;
  onConfirmPayment: (paymentData: {
    orderId: number;
    paymentMethod: PaymentMethod;
    totalAmount: number;
  }) => void;
}

export function OrderPaymentDrawer({
  open,
  onOpenChange,
  order,
  orderItems,
  isPending,
  totalAmount,
  onConfirmPayment,
}: OrderPaymentDrawerProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );

  const itemCount = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [orderItems]);

  const handlePayment = () => {
    if (!order) return;

    onConfirmPayment({
      orderId: order.id,
      paymentMethod,
      totalAmount,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-h-[100vh]">
        <DrawerHeader className="border-b border-slate-200 flex-row items-center justify-between">
          <DrawerTitle className="text-base font-semibold">
            Chi tiết giao dịch
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-xs">
              <X size={16} />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex text-xs text-slate-500 mb-1">
                  Khách hàng :
                  <div className="font-medium text-slate-900">
                    {order?.customerName || 'Khách lẻ'}
                  </div>
                </div>

                {order && order.customerPhone && (
                  <div className="text-sm text-slate-600 mt-1">
                    {order.customerPhone}
                  </div>
                )}
              </div>
            }

            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 flex items-center justify-between">
                <span>Chi tiết món ăn</span>
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 px-1.5 text-xs"
                >
                  {itemCount}
                </Badge>
              </div>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">
                        {item.menuItem?.name || 'Món ăn'}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {formatCurrency(Number(item.price))} x {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 ml-3">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tổng tiền hàng</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
                <span className="text-slate-900 font-medium">
                  Khách cần trả
                </span>
                <span className="font-bold text-blue-600 text-base">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    paymentMethod === PaymentMethod.CASH
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === PaymentMethod.CASH
                        ? 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === PaymentMethod.CASH && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      paymentMethod === PaymentMethod.CASH
                        ? 'text-blue-700 font-medium'
                        : 'text-slate-700'
                    }`}
                  >
                    Tiền mặt
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod(PaymentMethod.VNPAY)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    paymentMethod === PaymentMethod.VNPAY
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === PaymentMethod.VNPAY
                        ? 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === PaymentMethod.VNPAY && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      paymentMethod === PaymentMethod.VNPAY
                        ? 'text-blue-700 font-medium'
                        : 'text-slate-700'
                    }`}
                  >
                    Vnpay
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Tổng tiền hàng</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <Button
            disabled={isPending}
            onClick={handlePayment}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              'Thanh toán'
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
