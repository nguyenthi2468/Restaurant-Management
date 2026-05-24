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
import { useBookingQuery } from '@/features/booking';

export function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get('bookingId');

  const {
    data: booking,
    isLoading,
    isError,
  } = useBookingQuery(bookingId || '');

  useEffect(() => {
    // Redirect to home if no bookingId
    if (!bookingId) {
      router.push('/');
    }
  }, [bookingId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <XCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Booking Not Found</h1>
        <p className="text-gray-500">Unable to retrieve booking information.</p>
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
        {/* Status Card */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-900 mb-2">
                  Booking Successful!
                </h1>
                <p className="text-green-700">
                  Your reservation has been confirmed. We&apos;ve sent a
                  confirmation to your registered contact.
                </p>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-base">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmed
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-500" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Booking ID</p>
                <p className="font-semibold text-gray-900">#{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <Badge
                  variant={
                    booking.status === 'CONFIRMED' ? 'default' : 'secondary'
                  }
                >
                  {booking.status}
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
                    {booking.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">Booking Time</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Time</p>
                  <p className="font-semibold">
                    {format(new Date(booking.bookingTime), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.bookingTime), 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">Guest Information</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Adults</p>
                  <p className="font-semibold text-lg">
                    {booking.numberOfGuests}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Children</p>
                  <p className="font-semibold text-lg">
                    {booking.numberOfChildren || 0}
                  </p>
                </div>
              </div>
            </div>

            {booking.bookingTables && booking.bookingTables.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900">Reserved Tables</p>
                  </div>
                  <div className="space-y-2">
                    {booking.bookingTables.map((bookingTable) => (
                      <div
                        key={bookingTable.id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {bookingTable.table?.name ||
                                `Table ${bookingTable.table?.name}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              Floor: {bookingTable.table?.floor.name || 'N/A'} •
                              Seats: {bookingTable.table?.seats || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {booking.preOrderItems && booking.preOrderItems.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="font-medium text-gray-900 mb-2">
                    Pre-Order Menu Items
                  </p>
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
                      {booking.preOrderItems.map((item) => (
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

            {Number(booking.depositAmount) !== 0 && (
              <>
                <Separator />
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        Deposit Amount
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(Number(booking.depositAmount))}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
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
            onClick={() => router.push(`/me/my-bookings/${booking.id}`)}
          >
            View Booking Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
