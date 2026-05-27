import { useState } from 'react';
import { TableStatus, type Table } from '@/features/tables';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutGrid,
  Plus,
  Users,
  MoreHorizontal,
  Bell,
  DollarSign,
  Edit3,
  Phone,
  Printer,
  ClipboardList,
  Loader2,
  X,
  NotepadText,
  CalendarCheck,
} from 'lucide-react';
import { OrderItemRow } from './OrderItemRow';
import { CreateOrderDialog } from '@/components/cashier/CreateOrderDialog';
import { HistoryKitchenTicketDrawer } from '@/components/cashier/HistoryKitchenTicketDrawer';
import {
  Order,
  useCompleteOrderMutation,
  useCreateOrderPaymentMutation,
  useUpdateOrderNoteMutation,
} from '@/features/orders';
import { formatCurrency } from '@/utils/currency';
import { OrderItem } from '@/features/order-items';
import { KitchenTicket } from '@/features/kitchen';
import { NoteOrderDialog } from './NoteOrderDialog';
import { OrderPaymentDrawer } from './OrderPaymentDrawer';
import { PaymentMethod } from '@/features/payments';
import { ReservationTableDrawer } from './ReservationTableDrawer';

interface OrderPanelProps {
  selectedTable: Table | null;
  order: Order | null;
  isLoading: boolean;
  isUpdating: boolean;
  orderItems: OrderItem[];
  tickets: KitchenTicket[];
  isLoadingTickets: boolean;
  isLoadingOrderData: boolean;
  totalAmount: number;
  onUpdateQuantity: (item: OrderItem, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNotify: () => void;
  onCancel: (orderId: number) => void;
}

export function OrderPanel({
  selectedTable,
  order,
  isLoading,
  isUpdating,
  orderItems,
  totalAmount,
  tickets,
  isLoadingTickets,
  isLoadingOrderData,
  onUpdateQuantity,
  onRemoveItem,
  onNotify,
  onCancel,
}: OrderPanelProps) {
  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [reservationDrawerOpen, setReservationDrawerOpen] = useState(false);
  const updateOrderNoteMutation = useUpdateOrderNoteMutation();
  const completeOrderMutation = useCompleteOrderMutation();
  const createOrderPaymentMutation = useCreateOrderPaymentMutation();
  const onEditNote = (note: string) => {
    updateOrderNoteMutation.mutate(
      {
        id: order?.id || 0,
        note,
      },
      {
        onSuccess: () => {
          setNoteDialogOpen(false);
        },
      },
    );
  };

  const handleConfirmPayment = (paymentData: {
    orderId: number;
    paymentMethod: PaymentMethod;
    totalAmount: number;
  }) => {
    if (paymentData.paymentMethod === PaymentMethod.CASH) {
      completeOrderMutation.mutate(
        {
          id: paymentData.orderId,
          data: {
            paymentMethod: paymentData.paymentMethod,
            totalAmount: paymentData.totalAmount,
          },
        },
        {
          onSuccess: () => {
            setPaymentDrawerOpen(false);
          },
        },
      );
      return;
    }
    if (paymentData.paymentMethod === PaymentMethod.VNPAY) {
      createOrderPaymentMutation.mutate(paymentData.orderId);
      return;
    }
  };

  const handlePrintOrder = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Hóa đơn #${order?.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
            }
            .header h1 {
              font-size: 18px;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 12px;
            }
            .info {
              margin-bottom: 15px;
              font-size: 12px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .items {
              margin-bottom: 15px;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 10px 0;
            }
            .item {
              margin-bottom: 10px;
              font-size: 12px;
            }
            .item-name {
              font-weight: bold;
              margin-bottom: 3px;
            }
            .item-details {
              display: flex;
              justify-content: space-between;
              padding-left: 10px;
            }
            .total {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 11px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .note {
              margin-top: 10px;
              padding: 10px;
              background: #f5f5f5;
              border-radius: 4px;
              font-size: 11px;
            }
            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN</h1>
            <p>Nhà hàng</p>
          </div>
          
          <div class="info">
            <div class="info-row">
              <span>Mã đơn:</span>
              <span><strong>#${order?.id}</strong></span>
            </div>
            <div class="info-row">
              <span>Bàn:</span>
              <span><strong>${selectedTable?.name}</strong></span>
            </div>
            <div class="info-row">
              <span>Ngày:</span>
              <span>${new Date().toLocaleString('vi-VN')}</span>
            </div>
            ${
              order?.customerName
                ? `
            <div class="info-row">
              <span>Khách hàng:</span>
              <span>${order.customerName}</span>
            </div>
            `
                : ''
            }
            ${
              order?.customerPhone
                ? `
            <div class="info-row">
              <span>SĐT:</span>
              <span>${order.customerPhone}</span>
            </div>
            `
                : ''
            }
          </div>
          
          <div class="items">
            ${orderItems
              .map(
                (item) => `
              <div class="item">
                <div class="item-name">${item.menuItem?.name || 'Món ăn'}</div>
                <div class="item-details">
                  <span>${item.quantity} x ${formatCurrency(Number(item.price))}</span>
                  <span><strong>${formatCurrency(Number(item.price) * item.quantity)}</strong></span>
                </div>
                ${item.note ? `<div style="padding-left: 10px; font-size: 10px; color: #666; margin-top: 2px;">Ghi chú: ${item.note}</div>` : ''}
              </div>
            `,
              )
              .join('')}
          </div>
          
          <div class="total">
            <div class="total-row">
              <span>TỔNG CỘNG:</span>
              <span>${formatCurrency(totalAmount)}</span>
            </div>
            ${
              order?.depositAmount && order.depositAmount > 0
                ? `
            <div class="info-row" style="font-size: 12px; font-weight: normal; color: #16a34a;">
              <span>Tiền đặt cọc:</span>
              <span>-${formatCurrency(order.depositAmount)}</span>
            </div>
            <div class="total-row" style="font-size: 13px; color: #2563eb; border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px;">
              <span>Khách cần trả:</span>
              <span>${formatCurrency(totalAmount - order.depositAmount)}</span>
            </div>
            `
                : ''
            }
            <div class="info-row" style="font-size: 12px; font-weight: normal;">
              <span>Số lượng món:</span>
              <span>${orderItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </div>
          </div>
          
          ${
            order?.note
              ? `
          <div class="note">
            <strong>Ghi chú đơn hàng:</strong><br/>
            ${order.note}
          </div>
          `
              : ''
          }
          
          <div class="footer">
            <p>Cảm ơn quý khách!</p>
            <p>Hẹn gặp lại!</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (!selectedTable) {
    return (
      <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col">
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <LayoutGrid size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chọn bàn để xem chi tiết đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTable.status === TableStatus.AVAILABLE) {
    return (
      <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
            <LayoutGrid size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Bàn trống - {selectedTable.name}
            </h3>
            <p className="text-sm text-slate-500">
              {selectedTable.seats > 0
                ? `${selectedTable.seats} người`
                : 'Không giới hạn'}
            </p>
          </div>
          <Button
            onClick={() => setCreateOrderDialogOpen(true)}
            className="w-full"
            size="lg"
          >
            <ClipboardList size={16} className="mr-2" />
            Tạo đơn cho bàn này
          </Button>
          <Button
            onClick={() => {
              setReservationDrawerOpen(true);
            }}
            className="w-full"
            size="lg"
          >
            <CalendarCheck size={16} className="mr-2" />
            Lịch đặt bàn của bàn này
          </Button>
        </div>
        {selectedTable && (
          <CreateOrderDialog
            open={createOrderDialogOpen}
            onOpenChange={setCreateOrderDialogOpen}
            selectedTable={selectedTable}
            onSuccess={() => {
              setCreateOrderDialogOpen(false);
            }}
          />
        )}
        <ReservationTableDrawer
          tableId={selectedTable?.id || ''}
          isOpen={reservationDrawerOpen}
          onOpenChange={setReservationDrawerOpen}
        />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400">
            <LayoutGrid size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Không có đơn cho bàn này
            </h3>
            <p className="text-sm text-slate-500">
              {selectedTable?.name} hiện chưa có đơn hàng
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedTable.name}
          </Badge>
          <span className="text-xs text-slate-500">
            {selectedTable.seats > 0
              ? `${selectedTable.seats} người`
              : 'Không giới hạn'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* <Button size="icon-xs" variant="ghost">
            <Plus size={14} />
          </Button>
          <Button size="icon-xs" variant="ghost">
            <Users size={14} />
          </Button>
          <Button size="icon-xs" variant="ghost">
            <MoreHorizontal size={14} />
          </Button> */}
        </div>
      </div>

      <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Mã đơn:</span>
          <span className="font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
            {order?.id}
          </span>
        </div>
        <Button
          onClick={() => onCancel(order?.id || 0)}
          variant="outline"
          size="sm"
          className="h-9 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          <X size={14} className="mr-1.5" />
          Hủy
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-3">
          {isLoading || isLoadingOrderData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : orderItems?.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Chưa có món nào. Chọn thực đơn để thêm món.
            </div>
          ) : (
            orderItems?.map((item, idx) => (
              <OrderItemRow
                key={item.id}
                isUpdating={isUpdating}
                item={item}
                index={idx}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))
          )}
        </div>
      </ScrollArea>
      {/* <div className="mx-4 mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
        <span className="mt-0.5">⚠</span>
        <span>
          Bạn vừa cập nhật đơn hàng. Click <strong>Thông báo</strong> để gửi
          thông tin chế biến đến bán bếp.
        </span>
      </div> */}

      <div className="px-4 py-2 border-t border-slate-200 space-y-2">
        <div className="text-xs text-slate-600">
          Ghi chú: {order?.note || 'Không có ghi chú'}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setNoteDialogOpen(true)}
            >
              <Edit3 size={12} />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setHistoryDrawerOpen(true)}
            >
              <NotepadText size={12} />
            </Button>
            <Button size="icon-xs" variant="ghost" onClick={handlePrintOrder}>
              <Printer size={12} />
            </Button>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
            Tổng tiền
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {orderItems.reduce((acc, cur) => acc + cur.quantity, 0) || 0}
            </span>
            <span className="ml-2 text-blue-600 text-base">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onNotify}
            variant="outline"
            className="flex-1 h-11 border-blue-300 text-blue-700 hover:bg-blue-50 text-sm font-medium"
          >
            <Bell size={16} className="mr-2" />
            Thông báo bếp
          </Button>
          <Button
            onClick={() => setPaymentDrawerOpen(true)}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            <DollarSign size={16} className="mr-2" />
            Thanh toán
          </Button>
        </div>
      </div>

      <NoteOrderDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        note={order?.note || ''}
        isPending={updateOrderNoteMutation.isPending}
        onSave={onEditNote}
      />
      <HistoryKitchenTicketDrawer
        tickets={tickets}
        isLoadingTickets={isLoadingTickets}
        open={historyDrawerOpen}
        onOpenChange={setHistoryDrawerOpen}
        orderId={order?.id || null}
      />
      <OrderPaymentDrawer
        open={paymentDrawerOpen}
        onOpenChange={setPaymentDrawerOpen}
        order={order}
        orderItems={orderItems}
        isPending={completeOrderMutation.isPending}
        totalAmount={totalAmount}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
