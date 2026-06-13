'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Clock, Download, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import {
  useQRCodeQuery,
  AttendanceStatus,
  useClockInWithOtpMutation,
  useClockOutWithOtpMutation,
} from '@/features/employee-schedules';

export default function ClockPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [actionType, setActionType] = useState<'clockIn' | 'clockOut'>(
    'clockIn',
  );

  const { data: qrCodeUrl, isLoading: isQRLoading } = useQRCodeQuery(
    user?.id || '',
  );

  const clockInMutation = useClockInWithOtpMutation();
  const clockOutMutation = useClockOutWithOtpMutation();

  const handleOpenDialog = (type: 'clockIn' | 'clockOut') => {
    setActionType(type);
    setOtpValue('');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setOtpValue('');
  };

  const handleSubmitOtp = async () => {
    if (!user?.id || otpValue.length !== 6) return;

    try {
      if (actionType === 'clockIn') {
        await clockInMutation.mutateAsync({
          employeeId: user.id,
          otp: otpValue,
        });
      } else {
        await clockOutMutation.mutateAsync({
          employeeId: user.id,
          otp: otpValue,
        });
      }
      handleCloseDialog();
    } catch (error) {
      // Error is handled by the mutation
      console.error(error);
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const statusConfig = {
      [AttendanceStatus.ON_TIME]: {
        label: 'Đúng giờ',
        variant: 'default' as const,
      },
      [AttendanceStatus.ABSENT]: {
        label: 'Vắng mặt',
        variant: 'destructive' as const,
      },
      [AttendanceStatus.LATE]: {
        label: 'Đi muộn',
        variant: 'secondary' as const,
      },
      [AttendanceStatus.EXCUSED]: {
        label: 'Có phép',
        variant: 'outline' as const,
      },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: 'outline' as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${user?.email}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chấm công</h1>
        <p className="text-muted-foreground">Mã QR để chấm công vào và ra</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Mã QR chấm công
            </CardTitle>
            <CardDescription>
              Quét mã QR này để chấm công vào và ra
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {isQRLoading ? (
              <div className="flex items-center justify-center h-64 w-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : qrCodeUrl ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={qrCodeUrl}
                  alt="QR Code chấm công"
                  className="w-64 h-64 border-2 border-border rounded-lg"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Mã QR của bạn: {user?.email}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQR}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Tải QRCode
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Không thể tải mã QR
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Chấm công bằng OTP
            </CardTitle>
            <CardDescription>
              Nhập mã OTP để chấm công vào và ra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleOpenDialog('clockIn')}
                className="gap-2"
                size="lg"
              >
                <LogIn className="h-5 w-5" />
                Chấm công vào
              </Button>
              <Button
                onClick={() => handleOpenDialog('clockOut')}
                variant="outline"
                className="gap-2"
                size="lg"
              >
                <LogOut className="h-5 w-5" />
                Chấm công ra
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'clockIn' ? 'Chấm công vào' : 'Chấm công ra'}
            </DialogTitle>
            <DialogDescription>
              Nhập mã OTP 6 chữ số để{' '}
              {actionType === 'clockIn' ? 'chấm công vào' : 'chấm công ra'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">
              Nhập mã OTP được tạo từ ứng dụng xác thực
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmitOtp}
              disabled={
                otpValue.length !== 6 ||
                clockInMutation.isPending ||
                clockOutMutation.isPending
              }
            >
              {clockInMutation.isPending || clockOutMutation.isPending
                ? 'Đang xử lý...'
                : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
