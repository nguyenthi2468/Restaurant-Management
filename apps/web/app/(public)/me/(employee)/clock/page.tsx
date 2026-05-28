'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Download } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import {
  useQRCodeQuery,
  AttendanceStatus,
} from '@/features/employee-schedules';
export default function ClockPage() {
  const { user } = useAuth();

  const { data: qrCodeUrl, isLoading: isQRLoading } = useQRCodeQuery(
    user?.id || '',
  )

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
      </div>
    </div>
  );
}
