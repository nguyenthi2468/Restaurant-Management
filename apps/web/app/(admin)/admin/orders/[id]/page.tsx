'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetOrderByIdQuery } from '@/features/orders';
import { useGetKitchenTicketsByOrderIdQuery } from '@/features/kitchen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ROUTES } from '@/constants';
import { OrderStatus } from '@/features/orders';
import { KitchenTicketStatus } from '@/features/kitchen';
import { formatCurrency } from '@/utils/currency';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const { data: kitchenTickets, isLoading: isKitchenTicketsLoading } =
    useGetKitchenTicketsByOrderIdQuery(Number(order?.id));

  const handlePrintOrder = () => {
    if (!order) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Hóa đơn #${order.id}</title>
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
              <span><strong>#${order.id}</strong></span>
            </div>
            <div class="info-row">
              <span>Bàn:</span>
              <span><strong>${order.orderTables && order.orderTables.length > 0 ? order.orderTables[0].table.name : 'N/A'}</strong></span>
            </div>
            <div class="info-row">
              <span>Ngày:</span>
              <span>${new Date().toLocaleString('vi-VN')}</span>
            </div>
            ${
              order.customerName
                ? `
            <div class="info-row">
              <span>Khách hàng:</span>
              <span>${order.customerName}</span>
            </div>
            `
                : ''
            }
            ${
              order.customerPhone
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
            ${
              order.items && order.items.length > 0
                ? order.items
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
                    .join('')
                : '<div class="item">Không có món nào</div>'
            }
          </div>
          
          <div class="total">
            <div class="total-row">
              <span>TỔNG CỘNG:</span>
              <span>${formatCurrency(Number(order.total))}</span>
            </div>
            ${
              order.depositAmount && order.depositAmount > 0
                ? `
            <div class="info-row" style="font-size: 12px; font-weight: normal; color: #16a34a;">
              <span>Tiền đặt cọc:</span>
              <span>-${formatCurrency(Number(order.depositAmount))}</span>
            </div>
            <div class="total-row" style="font-size: 13px; color: #2563eb; border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px;">
              <span>Khách cần trả:</span>
              <span>${formatCurrency(Number(order.total) - Number(order.depositAmount))}</span>
            </div>
            `
                : ''
            }
            <div class="info-row" style="font-size: 12px; font-weight: normal;">
              <span>Số lượng món:</span>
              <span>${order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0}</span>
            </div>
          </div>
          
          ${
            order.note
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">Failed to load order</p>
        <Button onClick={() => router.push(ROUTES.ADMIN_ORDERS)}>
          Back to Orders
        </Button>
      </div>
    );
  }

  if (isKitchenTicketsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      [OrderStatus.PENDING]: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
      },
      [OrderStatus.SERVED]: {
        label: 'Served',
        className: 'bg-blue-100 text-blue-800',
      },
      [OrderStatus.COMPLETED]: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800',
      },
      [OrderStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800',
      },
    };
    const { label, className } = config[status];
    return (
      <span className={`px-3 py-1 text-sm rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  const getKitchenStatusBadge = (status: KitchenTicketStatus) => {
    const config = {
      [KitchenTicketStatus.PENDING]: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
      },
      [KitchenTicketStatus.ACCEPTED]: {
        label: 'Accepted',
        className: 'bg-blue-100 text-blue-800',
      },
      [KitchenTicketStatus.SERVED]: {
        label: 'Served',
        className: 'bg-green-100 text-green-800',
      },
      [KitchenTicketStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800',
      },
    };
    const { label, className } = config[status];
    return (
      <span className={`px-3 py-1 text-sm rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      SUCCESS: {
        label: 'Success',
        className: 'bg-green-100 text-green-800',
      },
      PENDING: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
      },
      FAILED: {
        label: 'Failed',
        className: 'bg-red-100 text-red-800',
      },
      REFUNDED: {
        label: 'Refunded',
        className: 'bg-gray-100 text-gray-800',
      },
    };
    const { label, className } = config[status] || config.PENDING;
    return (
      <span
        className={`inline-block px-3 py-1 text-sm rounded-full ${className}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(ROUTES.ADMIN_ORDERS)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePrintOrder}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(Number(order.total))}
                  </p>
                </div>
                {order.depositAmount > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Deposit Amount
                    </p>
                    <p className="font-medium text-lg">
                      {formatCurrency(Number(order.depositAmount))}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                {order.customerName && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Customer Name
                    </p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                )}
                {order.customerPhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Customer Phone
                    </p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                )}
              </div>
              {order.note && (
                <div>
                  <p className="text-sm text-muted-foreground">Note</p>
                  <p className="font-medium">{order.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
          {order.items && order.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.menuItem?.name || 'Unknown Item'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        {item.note && (
                          <p className="text-sm text-muted-foreground italic">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(Number(item.price))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Subtotal:{' '}
                          {formatCurrency(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {kitchenTickets && kitchenTickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {kitchenTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Ticket #{ticket.id}</p>
                      {getKitchenStatusBadge(ticket.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Priority</p>
                        <p className="font-medium">{ticket.priority}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {format(new Date(ticket.createdAt), 'HH:mm dd/MM')}
                        </p>
                      </div>
                    </div>
                    {ticket.note && (
                      <div>
                        <p className="text-muted-foreground text-sm">Note</p>
                        <p className="font-medium text-sm">{ticket.note}</p>
                      </div>
                    )}
                    {ticket.items && ticket.items.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Items:</p>
                        <div className="space-y-2">
                          {ticket.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {item.menuItem?.name || 'Unknown Item'} ×{' '}
                                {item.quantity}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  item.status === 'COOKING'
                                    ? 'bg-orange-100 text-orange-800'
                                    : item.status === 'READY'
                                      ? 'bg-green-100 text-green-800'
                                      : item.status === 'SERVED'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {order.orderTables && order.orderTables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.orderTables.map((orderTable) => (
                    <div key={orderTable.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{orderTable.table.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Seats: {orderTable.table.seats}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {orderTable.table.status}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {order.payments && order.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div>
                      {getPaymentStatusBadge(payment.status)}
                      <p className="font-medium">Payment #{payment.id}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Transaction Code
                        </p>
                        <p className="font-medium text-sm">
                          {payment.transactionCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment Method
                        </p>
                        <p className="font-medium text-sm">
                          {payment.method === 'CASH' ? 'Cash' : 'VNPay'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium text-lg">
                          {formatCurrency(Number(payment.amount))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment Date
                        </p>
                        <p className="font-medium text-sm">
                          {format(
                            new Date(payment.createdAt),
                            'dd/MM/yyyy HH:mm',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(order.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
