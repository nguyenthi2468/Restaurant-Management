'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Loader2, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useBookingQuery } from '@/features/booking/queries';
import { useCreateVnpayPaymentMutation } from '@/features/booking/mutations';
import { formatCurrency } from '@/utils/currency';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

function ConfirmPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [isConfirming, setIsConfirming] = useState(false);

  const { data: booking, isLoading: isLoadingBooking } = useBookingQuery(
    bookingId || '',
  );
  const createVnpayPaymentMutation = useCreateVnpayPaymentMutation();

  const handleConfirmPayment = async () => {
    if (!bookingId) return;

    setIsConfirming(true);
    try {
      await createVnpayPaymentMutation.mutateAsync(bookingId);
      // The mutation will redirect to VNPay payment URL on success
    } catch (error) {
      console.error('Payment error:', error);
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    router.push('/reservation');
  };

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bookingId || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không tìm thấy thông tin đặt bàn</AlertTitle>
          <AlertDescription>
            Vui lòng kiểm tra lại đường dẫn hoặc thực hiện đặt bàn mới.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const depositAmount =
    typeof booking.depositAmount === 'string'
      ? parseFloat(booking.depositAmount)
      : booking.depositAmount;

  if (depositAmount <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-center">Đặt bàn thành công!</CardTitle>
            <CardDescription className="text-center">
              Bạn không cần đặt cọc cho đơn đặt bàn này.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => router.push('/reservation')}
            >
              Quay lại trang đặt bàn
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Xác nhận thanh toán đặt cọc
            </CardTitle>
            <CardDescription className="text-center">
              Vui lòng xác nhận thông tin đặt bàn và tiến hành thanh toán đặt
              cọc qua VNPay
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Booking Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-slate-900">
                Thông tin đặt bàn
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Họ tên:</span>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Số điện thoại:</span>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
                <div>
                  <span className="text-slate-500">Thời gian đến:</span>
                  <p className="font-medium">
                    {format(new Date(booking.bookingTime), 'HH:mm - dd/MM/yyyy', {
                      locale: vi,
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Số khách:</span>
                  <p className="font-medium">
                    {booking.numberOfGuests} người lớn
                    {booking.numberOfChildren > 0 &&
                      `, ${booking.numberOfChildren} trẻ em`}
                  </p>
                </div>
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Số tiền đặt cọc
                  </h3>
                  <p className="text-sm text-blue-700">
                    Thanh toán qua VNPay
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(depositAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription>
                Sau khi xác nhận, bạn sẽ được chuyển đến cổng thanh toán VNPay để
                hoàn tất giao dịch. Số tiền đặt cọc sẽ được trừ vào tổng hóa đơn
                khi bạn đến nhà hàng.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleCancel}
              disabled={isConfirming}
            >
              Hủy bỏ
            </Button>
            <Button
              className="w-full sm:flex-1"
              onClick={handleConfirmPayment}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Xác nhận và thanh toán
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConfirmPaymentContent />
    </Suspense>
  );
}