'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Home,
  Receipt,
  CalendarDays,
  Building,
  CreditCard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/currency';
import { useGetOrderByIdQuery } from '@/features/orders';

export function PaymentResult() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentStatus = searchParams.get('payment_status');
  const orderId = searchParams.get('order_id');

  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(orderId || '');

  const isSuccess = paymentStatus === 'success';

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <XCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
        <p className="text-gray-500">Unable to retrieve order information.</p>
        <Button onClick={() => router.push('/')}>
          <Home className="w-4 h-4 mr-2" />
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card
          className={`border-2 ${isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {isSuccess ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-green-900 mb-2">
                      Payment Successful!
                    </h1>
                    <p className="text-green-700">
                      Your order payment has been confirmed. Thank you for
                      dining with us!
                    </p>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-base">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Paid
                  </Badge>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-red-900 mb-2">
                      Payment Failed
                    </h1>
                    <p className="text-red-700">
                      Unfortunately, your payment could not be processed. Please
                      try again or contact support.
                    </p>
                  </div>
                  <Badge variant="destructive" className="px-4 py-2 text-base">
                    <XCircle className="w-4 h-4 mr-2" />
                    Payment Failed
                  </Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-500" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Order ID</p>
                <p className="font-semibold text-gray-900">#{order.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <Badge
                  variant={
                    order.status === 'COMPLETED' ? 'default' : 'secondary'
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">
                  Customer Information
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-lg">
                    {order.customerName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{order.customerPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">Order Time</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold">
                  {format(new Date(order.createdAt), 'dd MMM yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>

            {order.orderTables && order.orderTables.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900">Table(s)</p>
                  </div>
                  <div className="space-y-2">
                    {order.orderTables.map((orderTable) => (
                      <div
                        key={orderTable.id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {orderTable.table?.name ||
                                `Table ${orderTable.tableId}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              Floor: {orderTable.table?.floor.name || 'N/A'} •
                              Seats: {orderTable.table?.seats || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {order.items && order.items.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="font-medium text-gray-900 mb-2">Menu Items</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Menu Item</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.menuItem?.name || item.menuItemId}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Number(item.price))}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(Number(item.price) * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            <Separator />

            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push(`/admin/cashier`)}
          >
            Go to cashier
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {!isSuccess && order.status === 'PENDING' && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-orange-900 font-medium">
                  Would you like to try payment again?
                </p>
                <Button
                  variant="default"
                  onClick={() => router.push(`/me/my-orders/${order.id}`)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResult />
    </Suspense>
  );
}
