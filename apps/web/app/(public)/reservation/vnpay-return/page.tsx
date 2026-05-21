'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleVnpayReturn } from '@/features/booking/api';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VnpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        const queryParams: Record<string, any> = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        if (Object.keys(queryParams).length === 0) {
          setStatus('error');
          setMessage('Không tìm thấy thông tin thanh toán');
          return;
        }

        const booking = await handleVnpayReturn(queryParams);
        setBookingId(booking.id);
        setStatus('success');
        setMessage('Thanh toán thành công! Đặt bàn của bạn đã được xác nhận.');
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error?.response?.data?.message ||
            'Thanh toán thất bại. Vui lòng liên hệ với chúng tôi để được hỗ trợ.',
        );
      }
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-slate-600">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-slate-600 mb-6">{message}</p>
            {bookingId && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 mb-1">Mã đặt bàn</p>
                <p className="text-lg font-mono font-semibold text-slate-900">
                  {bookingId}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Button onClick={() => router.push('/')} className="w-full">
                Về trang chủ
              </Button>
              <Link href="/reservation" className="block">
                <Button variant="outline" className="w-full">
                  Đặt bàn mới
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700">
                Nếu bạn cần hỗ trợ, vui lòng liên hệ:
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-2">
                Hotline:{' '}
                <a
                  href="tel:0123456789"
                  className="text-blue-600 hover:underline"
                >
                  0123 456 789
                </a>
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Email:{' '}
                <a
                  href="mailto:info@restaurant.com"
                  className="text-blue-600 hover:underline"
                >
                  info@restaurant.com
                </a>
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/reservation')}
                className="w-full"
              >
                Thử lại
              </Button>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VnpayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Đang tải...
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <VnpayReturnContent />
    </Suspense>
  );
}
