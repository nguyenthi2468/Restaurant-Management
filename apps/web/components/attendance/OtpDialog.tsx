'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGenerateOTPQuery } from '@/features/employee-schedules/queries';
import { Spinner } from '@/components/ui/spinner';
import { RefreshCw, Copy, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OtpDialog({
  open,
  onOpenChange,
}: OtpDialogProps) {
  const { data, isLoading, error, refetch } = useGenerateOTPQuery();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Countdown timer for OTP expiry (30 seconds)
  useEffect(() => {
    if (!data?.otp) return;

    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.otp]);

  const handleCopy = async () => {
    if (data?.otp) {
      await navigator.clipboard.writeText(data.otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    refetch();
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mã OTP chấm công</DialogTitle>
          <DialogDescription>
            Mã OTP này có hiệu lực trong 30 giây. Nhân viên sử dụng mã này để
            chấm công.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {error && (
            <Card className="p-4 border-destructive">
              <p className="text-destructive text-sm text-center">
                Không thể tạo mã OTP. Vui lòng thử lại.
              </p>
            </Card>
          )}

          {data?.otp && (
            <>
              <Card className="p-6 bg-primary/5">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Mã OTP</p>
                  <div className="text-5xl font-bold tracking-wider font-mono">
                    {data.otp}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div
                      className={`text-sm font-medium ${
                        timeLeft <= 10 ? 'text-destructive' : 'text-primary'
                      }`}
                    >
                      Hết hạn sau: {timeLeft}s
                    </div>
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          timeLeft <= 10 ? 'bg-destructive' : 'bg-primary'
                        }`}
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Sao chép
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  Làm mới
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>
            Mã OTP được tạo tự động và hết hạn sau 30 giây. Nhấn &quot;Làm
            mới&quot; để tạo mã mới.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
