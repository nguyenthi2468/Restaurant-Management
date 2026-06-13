'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface LocationAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationConfirm?: (location: LocationData) => void;
  title?: string;
  description?: string;
}

export function LocationAttendanceDialog({
  open,
  onOpenChange,
  onLocationConfirm,
  title = 'Xác nhận vị trí',
  description = 'Vui lòng cho phép truy cập vị trí để xác nhận chấm công',
}: LocationAttendanceDialogProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Trình duyệt của bạn không hỗ trợ định vị địa lý.');
      return;
    }

    setIsGettingLocation(true);
    setError('');
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(locationData);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Không thể lấy vị trí của bạn.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Yêu cầu lấy vị trí đã hết thời gian chờ.';
            break;
          default:
            errorMessage = 'Đã xảy ra lỗi không xác định khi lấy vị trí.';
        }

        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleConfirm = () => {
    if (location && onLocationConfirm) {
      onLocationConfirm(location);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocation(null);
    setError('');
    setIsGettingLocation(false);
    onOpenChange(false);
  };

  const handleRetry = () => {
    setError('');
    setLocation(null);
    getLocation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Location Request Button */}
          {!location && !error && !isGettingLocation && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="rounded-full bg-primary/10 p-6">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Nhấn nút bên dưới để lấy vị trí hiện tại của bạn
              </p>
              <Button onClick={getLocation} size="lg" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Lấy vị trí
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isGettingLocation && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Đang lấy vị trí của bạn...
              </p>
            </div>
          )}

          {/* Success State */}
          {location && !error && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Đã lấy vị trí thành công!
                </AlertDescription>
              </Alert>

              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Vĩ độ (Latitude)</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      {location.latitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Kinh độ (Longitude)</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  size="sm"
                  className="flex-1"
                >
                  Lấy lại
                </Button>
                <a
                  href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Xem trên bản đồ
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-4">
              <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center gap-4 py-4">
                <div className="rounded-full bg-red-100 p-6 dark:bg-red-950">
                  <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          {location && <Button onClick={handleConfirm}>Xác nhận vị trí</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
