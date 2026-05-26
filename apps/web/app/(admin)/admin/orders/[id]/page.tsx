'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetOrderByIdQuery } from '@/features/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ROUTES } from '@/constants';
import { OrderStatus } from '@/features/orders';
import { formatCurrency } from '@/utils/currency';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);

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
        {getStatusBadge(order.status)}
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
