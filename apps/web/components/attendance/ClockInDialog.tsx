'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useClockInMutation } from '@/features/employee-schedules/mutations';
import { Camera, Loader2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClockInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClockInDialog({ open, onOpenChange }: ClockInDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [scannedEmployeeId, setScannedEmployeeId] = useState<string>('');

  const clockInMutation = useClockInMutation();

  useEffect(() => {
    if (!open) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      setIsScanning(false);
      setError('');
      setScannedEmployeeId('');
      return;
    }

    const initScanner = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!videoRef.current) {
        setError('Video element không sẵn sàng');
        return;
      }

      try {
        setError('');
        setIsScanning(true);

        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            const employeeId = result.data;
            setScannedEmployeeId(employeeId);

            scanner.stop();
            setIsScanning(false);

            clockInMutation.mutate(
              { employeeId },
              {
                onSuccess: () => {
                //   onOpenChange(false);
                  scanner.start();
                },
                onError: (error: any) => {
                  setError(
                    error?.response?.data?.message ||
                      'Không thể chấm công. Vui lòng thử lại.',
                  );
                  setIsScanning(true);
                  scanner.start();
                },
              },
            );
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment',
          },
        );

        scannerRef.current = scanner;
        await scanner.start();
      } catch (err: any) {
        console.error('Error initializing scanner:', err);
        let errorMessage = 'Không thể khởi động camera.';

        if (err.name === 'NotAllowedError') {
          errorMessage =
            'Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép truy cập camera trong cài đặt trình duyệt.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Không tìm thấy camera trên thiết bị của bạn.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera đang được sử dụng bởi ứng dụng khác.';
        }

        setError(errorMessage);
        setIsScanning(false);
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [open, onOpenChange]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Chấm công vào
          </DialogTitle>
          <DialogDescription>
            Quét mã QR của nhân viên để chấm công vào
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" />

            {!isScanning && !clockInMutation.isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Camera className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">Đang khởi động camera...</p>
                </div>
              </div>
            )}

            {clockInMutation.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-2" />
                  <p className="text-sm font-medium">Đang chấm công...</p>
                  {scannedEmployeeId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Mã nhân viên: {scannedEmployeeId}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isScanning && !clockInMutation.isPending && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Đưa mã QR vào khung hình để quét
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={clockInMutation.isPending}
          >
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
