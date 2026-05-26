'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PaymentResultDialogProps {
  open: boolean;
  paymentStatus: 'success' | 'failed' | null;
  amount?: number;
  tableName?: string;
  onClose: () => void;
}

export function PaymentResultDialog({
  open,
  paymentStatus,
  amount,
  tableName,
  onClose,
}: PaymentResultDialogProps) {
  if (!paymentStatus) return null;

  const isSuccess = paymentStatus === 'success';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="flex items-center justify-center pb-4">
          <div
            className={`mb-4 p-4 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          <DialogTitle className="text-center">
            {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-2">
          {tableName && (
            <p className="text-sm text-muted-foreground">
              Bàn: <span className="font-medium">{tableName}</span>
            </p>
          )}
          {amount !== undefined && (
            <p className="text-sm text-muted-foreground">
              Số tiền:{' '}
              <span className="font-medium">
                {amount.toLocaleString('vi-VN')}đ
              </span>
            </p>
          )}
        </div>
        <DialogFooter className="flex justify-center mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
