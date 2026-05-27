'use client';

import { useState } from 'react';
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
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import {
  BookingStatus,
  DepositStatus,
  useMyBookingsWithPaginationQuery,
} from '@/features/booking';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import Link from 'next/link';

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

const MyReservations = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<BookingStatus | 'ALL'>('ALL');

  const { data, isLoading, error } = useMyBookingsWithPaginationQuery({
    page,
    limit,
    status: status === 'ALL' ? undefined : status,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lịch sử đặt bàn</CardTitle>
          <CardDescription>Xem và quản lý các đặt bàn của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lịch sử đặt bàn</CardTitle>
          <CardDescription>Xem và quản lý các đặt bàn của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-destructive">
            Có lỗi xảy ra khi tải dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  const bookings = data?.data || [];
  const meta = data?.meta;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Lịch sử đặt bàn</CardTitle>
        <CardDescription>Xem và quản lý các đặt bàn của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as BookingStatus | 'ALL')
              }
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value={BookingStatus.PENDING}>
                    {statusLabels[BookingStatus.PENDING]}
                  </SelectItem>
                  <SelectItem value={BookingStatus.CONFIRMED}>
                    {statusLabels[BookingStatus.CONFIRMED]}
                  </SelectItem>
                  <SelectItem value={BookingStatus.CANCELLED}>
                    {statusLabels[BookingStatus.CANCELLED]}
                  </SelectItem>
                  <SelectItem value={BookingStatus.COMPLETED}>
                    {statusLabels[BookingStatus.COMPLETED]}
                  </SelectItem>
                  <SelectItem value={BookingStatus.NO_SHOW}>
                    {statusLabels[BookingStatus.NO_SHOW]}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Số lượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10 mỗi trang</SelectItem>
                  <SelectItem value="20">20 mỗi trang</SelectItem>
                  <SelectItem value="50">50 mỗi trang</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Tổng số đặt bàn: {meta?.total || 0}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đặt bàn</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Số khách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Trạng thái cọc</TableHead>
                <TableHead>Số tiền cọc</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Chưa có đặt bàn nào
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      #{booking.id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(booking.bookingTime),
                        'dd/MM/yyyy HH:mm',
                      )}
                    </TableCell>
                    <TableCell>{booking.numberOfGuests} người</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                    </TableCell>
                    <TableCell>
                      {formatCurrency(Number(booking.depositAmount))}
                    </TableCell>
                    <TableCell>
                      <Link href={`/me/my-reservations/${booking.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <EllipsisPagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyReservations;
