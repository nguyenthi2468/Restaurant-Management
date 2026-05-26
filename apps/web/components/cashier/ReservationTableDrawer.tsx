'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookingStatus,
  DepositStatus,
  useBookingsByTableIdQuery,
  useCompleteBookingMutation,
  useCancelBookingMutation,
  useNoShowBookingMutation,
} from '@/features/booking';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle, UserX } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ReservationTableDrawerProps {
  tableId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationTableDrawer({
  tableId,
  isOpen,
  onOpenChange,
}: ReservationTableDrawerProps) {
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, isError } = useBookingsByTableIdQuery(tableId, {
    page,
    limit,
  });

  const completeBookingMutation = useCompleteBookingMutation();
  const cancelBookingMutation = useCancelBookingMutation();
  const noShowBookingMutation = useNoShowBookingMutation();

  const handleComplete = async (bookingId: string) => {
    try {
      await completeBookingMutation.mutateAsync(bookingId);
    } catch (error) {
      console.error('Error completing booking:', error);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleNoShow = async (bookingId: string) => {
    try {
      await noShowBookingMutation.mutateAsync(bookingId);
    } catch (error) {
      console.error('Error marking no-show:', error);
    }
  };

  const canComplete = (status: BookingStatus) => {
    return status === BookingStatus.CONFIRMED;
  };

  const canCancel = (status: BookingStatus) => {
    return (
      status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED
    );
  };

  const canNoShow = (status: BookingStatus) => {
    return status === BookingStatus.CONFIRMED;
  };

  const renderStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      [BookingStatus.PENDING]: {
        variant: 'outline' as const,
        label: 'Chờ xác nhận',
        className: 'border-yellow-500 text-yellow-700',
      },
      [BookingStatus.CONFIRMED]: {
        variant: 'default' as const,
        label: 'Đã xác nhận',
        className: 'bg-green-600 text-green-100',
      },
      [BookingStatus.CANCELLED]: {
        variant: 'destructive' as const,
        label: 'Đã hủy',
        className: 'bg-red-600 text-red-100',
      },
      [BookingStatus.COMPLETED]: {
        variant: 'outline' as const,
        label: 'Hoàn thành',
        className: 'border-blue-500 text-blue-700',
      },
      [BookingStatus.NO_SHOW]: {
        variant: 'outline' as const,
        label: 'Không đến',
        className: 'border-gray-500 text-gray-700',
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={cn(config.className)}>
        {config.label}
      </Badge>
    );
  };

  const renderDepositStatusBadge = (status: DepositStatus) => {
    const statusConfig = {
      [DepositStatus.PENDING]: {
        variant: 'outline' as const,
        label: 'Chờ thanh toán',
        className: 'border-yellow-500 text-yellow-700',
      },
      [DepositStatus.PAID]: {
        variant: 'default' as const,
        label: 'Đã cọc',
        className: 'bg-green-600 text-green-100',
      },
      [DepositStatus.REFUNDED]: {
        variant: 'destructive' as const,
        label: 'Hoàn cọc',
        className: 'bg-red-600 text-red-100',
      },
      [DepositStatus.WAIVED]: {
        variant: 'outline' as const,
        label: 'Miễn cọc',
        className: 'border-gray-500 text-gray-700',
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={cn(config.className)}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? Number(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numAmount);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm dd/MM/yyyy', { locale: vi });
  };

  if (isError) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[100vh]">
          <DrawerHeader>
            <DrawerTitle>Đặt bàn</DrawerTitle>
            <DrawerDescription>
              Không thể tải danh sách đặt bàn
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-center text-red-500">
            Đã xảy ra lỗi khi tải dữ liệu
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Đóng</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  const bookings = data?.data || [];

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[100vh] flex flex-col">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Đặt bàn - Bàn {tableId}</DrawerTitle>
              <DrawerDescription>
                Danh sách các lần đặt bàn tại bàn này
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Đóng</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="pb-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                <div className="mb-2 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <p>Không có dữ liệu đặt bàn</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Số người</TableHead>
                    <TableHead>Tiền cọc</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {booking.customerName}
                          </span>
                          {booking.customerPhone && (
                            <span className="text-xs text-slate-500">
                              {booking.customerPhone}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDateTime(booking.bookingTime)}</span>
                          <span className="text-xs text-slate-500">
                            Đến: {formatDateTime(booking.endTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>
                            {booking.numberOfGuests} người{' '}
                            {booking.numberOfChildren > 0 && (
                              <>({booking.numberOfChildren} trẻ em)</>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatCurrency(booking.depositAmount)}</span>
                          {renderDepositStatusBadge(booking.depositStatus)}
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                            disabled={
                              !canComplete(booking.status) ||
                              completeBookingMutation.isPending
                            }
                            onClick={() => handleComplete(booking.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            disabled={
                              !canNoShow(booking.status) ||
                              noShowBookingMutation.isPending
                            }
                            onClick={() => handleNoShow(booking.id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={
                              !canCancel(booking.status) ||
                              cancelBookingMutation.isPending
                            }
                            onClick={() => handleCancel(booking.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </ScrollArea>

        {bookings.length > 0 && (
          <DrawerFooter className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Trang {page} / {data?.meta?.totalPages || 1} (
                {data?.meta?.total || 0} kết quả)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Trang trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= (data?.meta?.totalPages || 1)}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(data?.meta?.totalPages || 1, prev + 1),
                    )
                  }
                >
                  Trang sau
                </Button>
              </div>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
