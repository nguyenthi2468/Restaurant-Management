'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingQuery } from '@/features/booking/queries';
import {
  Loader2,
  Search,
  Calendar,
  Users,
  Phone,
  Mail,
  Clock,
  MapPin,
  UtensilsCrossed,
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/currency';
import { BookingStatus, DepositStatus } from '@/features/booking/types';
import { PageTitle } from '@/components/common/PageTitle';

const bookingIdSchema = z.object({
  bookingId: z.string().min(1, 'Vui lòng nhập mã đặt bàn'),
});

type BookingIdFormValues = z.infer<typeof bookingIdSchema>;

const getStatusText = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.PENDING:
      return 'Chờ xác nhận';
    case BookingStatus.CONFIRMED:
      return 'Đã xác nhận';
    case BookingStatus.CANCELLED:
      return 'Đã hủy';
    case BookingStatus.COMPLETED:
      return 'Hoàn thành';
    case BookingStatus.NO_SHOW:
      return 'Không đến';
    default:
      return status;
  }
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.PENDING:
      return 'text-yellow-600 bg-yellow-50';
    case BookingStatus.CONFIRMED:
      return 'text-green-600 bg-green-50';
    case BookingStatus.CANCELLED:
      return 'text-red-600 bg-red-50';
    case BookingStatus.COMPLETED:
      return 'text-blue-600 bg-blue-50';
    case BookingStatus.NO_SHOW:
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getDepositStatusText = (status: DepositStatus) => {
  switch (status) {
    case DepositStatus.PENDING:
      return 'Chờ thanh toán';
    case DepositStatus.PAID:
      return 'Đã thanh toán';
    case DepositStatus.REFUNDED:
      return 'Đã hoàn tiền';
    case DepositStatus.WAIVED:
      return 'Miễn phí';
    default:
      return status;
  }
};

const getDepositStatusColor = (status: DepositStatus) => {
  switch (status) {
    case DepositStatus.PENDING:
      return 'text-yellow-600 bg-yellow-50';
    case DepositStatus.PAID:
      return 'text-green-600 bg-green-50';
    case DepositStatus.REFUNDED:
      return 'text-blue-600 bg-blue-50';
    case DepositStatus.WAIVED:
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function VerifyBookingPage() {
  const [searchedBookingId, setSearchedBookingId] = useState<string>('');

  const form = useForm<BookingIdFormValues>({
    resolver: zodResolver(bookingIdSchema),
    defaultValues: {
      bookingId: '',
    },
  });

  const {
    data: booking,
    isLoading,
    error,
  } = useBookingQuery(searchedBookingId);

  const onSubmit = form.handleSubmit((values) => {
    setSearchedBookingId(values.bookingId);
  });

  return (
    <div className="min-h-screen bg-background">
        <PageTitle title="Xác nhận đặt bàn" description="Nhập mã đặt bàn để xem trạng thái đặt bàn"/>
      <div className="max-w-4xl mx-auto">


        <Card className="mb-8 mt-5">
          <CardContent className="pt-6">
            <form onSubmit={onSubmit}>
              <FieldGroup>
                <Controller
                  name="bookingId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="bookingId">Mã đặt bàn</FieldLabel>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="bookingId"
                            placeholder="Nhập mã đặt bàn của bạn"
                            className="pl-10"
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Tìm kiếm
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <span className="text-xs text-destructive mt-1 block">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Không tìm thấy đặt bàn</p>
                <p className="text-sm mt-1">
                  Vui lòng kiểm tra lại mã đặt bàn của bạn
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {booking && (
          <div className="space-y-6 py-5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin đặt bàn</CardTitle>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground/60">
                        Thời gian đặt bàn
                      </p>
                      <p className="text-base font-medium">
                        {format(
                          new Date(booking.bookingTime),
                          'dd/MM/yyyy HH:mm',
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground/60">
                        Thời gian kết thúc
                      </p>
                      <p className="text-base font-medium">
                        {format(new Date(booking.endTime), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground/60">
                        Số lượng khách
                      </p>
                      <p className="text-base font-medium">
                        {booking.numberOfGuests} người lớn
                        {booking.numberOfChildren > 0 &&
                          `, ${booking.numberOfChildren} trẻ em`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground/60">
                        Tiền đặt cọc
                      </p>
                      <p className="text-base font-medium">
                        {formatCurrency(Number(booking.depositAmount))}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getDepositStatusColor(booking.depositStatus)}`}
                      >
                        {getDepositStatusText(booking.depositStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.note && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-foreground/60 mb-1">
                      Ghi chú
                    </p>
                    <p className="text-base">{booking.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Tên khách hàng
                    </p>
                    <p className="text-base font-medium">
                      {booking.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Số điện thoại
                    </p>
                    <p className="text-base font-medium">
                      {booking.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Email
                    </p>
                    <p className="text-base font-medium">
                      {booking.customerEmail}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {booking.bookingTables && booking.bookingTables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Bàn đã đặt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {booking.bookingTables.map((bookingTable) => (
                      <div
                        key={bookingTable.id}
                        className="p-4 border rounded-lg bg-muted/50"
                      >
                        <p className="font-medium text-lg">
                          {bookingTable.table?.name}
                        </p>
                        {bookingTable.table?.floor && (
                          <p className="text-sm text-foreground/60">
                            {bookingTable.table.floor.name}
                          </p>
                        )}
                        {bookingTable.table?.seats && (
                          <p className="text-sm text-foreground/60">
                            {bookingTable.table.seats} chỗ ngồi
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {booking.preOrderItems && booking.preOrderItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5" />
                    Món ăn đã đặt trước
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {booking.preOrderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.menuItem?.name}</p>
                          <p className="text-sm text-foreground/60">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(Number(item.price))}
                          </p>
                          <p className="text-sm text-foreground/60">
                            Tổng:{' '}
                            {formatCurrency(Number(item.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Tổng cộng món ăn</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(
                            booking.preOrderItems.reduce(
                              (sum, item) =>
                                sum + Number(item.price) * item.quantity,
                              0,
                            ),
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
