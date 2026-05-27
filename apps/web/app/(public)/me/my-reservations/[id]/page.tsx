'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import {
  BookingStatus,
  DepositStatus,
  useBookingQuery,
} from '@/features/booking';
import { useAuth } from '@/providers/AuthProvider';
import { ArrowLeft, Calendar, Clock, Loader2, MapPin, Users } from 'lucide-react';

const statusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Đang chờ',
  [BookingStatus.CONFIRMED]: 'Đã xác nhận',
  [BookingStatus.CANCELLED]: 'Đã hủy',
  [BookingStatus.COMPLETED]: 'Đã hoàn thành',
  [BookingStatus.NO_SHOW]: 'Không đến',
};

const depositStatusLabels: Record<DepositStatus, string> = {
  [DepositStatus.PENDING]: 'Đang chờ',
  [DepositStatus.PAID]: 'Đã thanh toán',
  [DepositStatus.REFUNDED]: 'Đã hoàn tiền',
  [DepositStatus.WAIVED]: 'Miễn giảm',
};

const ReservationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.id as string;

  const { data: booking, isLoading, error } = useBookingQuery(bookingId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chi tiết đặt bàn</CardTitle>
            <CardDescription>Thông tin chi tiết về đặt bàn của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chi tiết đặt bàn</CardTitle>
            <CardDescription>Thông tin chi tiết về đặt bàn của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <p className="text-lg font-medium">Không tìm thấy thông tin đặt bàn</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/me/my-reservations')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/me/my-reservations')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-serif">
                  Đặt bàn #{booking.id.slice(-6)}
                </CardTitle>
                <CardDescription>
                  Đặt lúc {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    booking.status === BookingStatus.CONFIRMED
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : booking.status === BookingStatus.CANCELLED
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : booking.status === BookingStatus.COMPLETED
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : booking.status === BookingStatus.NO_SHOW
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {statusLabels[booking.status]}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-muted-foreground min-w-[120px]">Họ tên:</span>
                    <span className="font-medium">{booking.customerName}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-muted-foreground min-w-[120px]">Số điện thoại:</span>
                    <span className="font-medium">{booking.customerPhone}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-muted-foreground min-w-[120px]">Email:</span>
                    <span className="font-medium">{booking.customerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin đặt bàn</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Thời gian đến:</span>
                      <span className="font-medium">
                        {format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Thời gian kết thúc:</span>
                      <span className="font-medium">
                        {format(new Date(booking.endTime), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Số lượng khách:</span>
                      <span className="font-medium">
                        {booking.numberOfGuests} người lớn
                        {booking.numberOfChildren > 0 && `, ${booking.numberOfChildren} trẻ em`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {booking.note && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Ghi chú</h3>
                <p className="text-muted-foreground bg-muted p-4 rounded-lg">
                  {booking.note}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Thông tin thanh toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Số tiền cọc:</span>
                  <span className="font-semibold text-lg">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(Number(booking.depositAmount))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Trạng thái cọc:</span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      booking.depositStatus === DepositStatus.PAID
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : booking.depositStatus === DepositStatus.REFUNDED
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : booking.depositStatus === DepositStatus.WAIVED
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {depositStatusLabels[booking.depositStatus]}
                  </span>
                </div>
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
              <CardDescription>
                Danh sách các bàn được đặt cho buổi này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên bàn</TableHead>
                      <TableHead>Tầng</TableHead>
                      <TableHead>Số chỗ ngồi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.bookingTables.map((bookingTable) => (
                      <TableRow key={bookingTable.id}>
                        <TableCell className="font-medium">
                          {bookingTable.table?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {bookingTable.table?.floor?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {bookingTable.table?.seats || 0} chỗ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.preOrderItems && booking.preOrderItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Món ăn đặt trước</CardTitle>
              <CardDescription>
                Danh sách các món ăn bạn đã đặt trước
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên món</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.preOrderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.menuItem?.name || 'N/A'}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(Number(item.price))}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(Number(item.price) * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">
                        Tổng cộng:
                      </TableCell>
                      <TableCell className="text-right font-semibold text-lg">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(
                          booking.preOrderItems.reduce(
                            (total, item) => total + Number(item.price) * item.quantity,
                            0,
                          ),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailPage;
