'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  ClockIcon,
  PencilIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderItem } from '@/features/order-items';

interface ReturnOrderItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OrderItem | null;
  onConfirm: (quantity: number, reason: string) => void;
}

export function ReturnOrderItemsDialog({
  open,
  onOpenChange,
  item,
  onConfirm,
}: ReturnOrderItemsDialogProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [reason, setReason] = React.useState('Khác');
  const [customReason, setCustomReason] = React.useState('Khác');
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (item && quantity < item?.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity, customReason);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="text-lg">Xác nhận giảm / Hủy món</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-foreground">
            Bạn có chắc chắn muốn hủy món không?
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Số lượng hủy</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="rounded-full"
                >
                  <MinusIcon className="size-4" />
                </Button>
                <div className="flex h-8 w-12 items-center justify-center rounded-md border border-input bg-background text-sm">
                  {quantity}/{item?.quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleIncrement}
                  className="rounded-full"
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lý do hủy</label>
                <Select value={reason} onValueChange={(value) => {
                  setReason(value);
                  setCustomReason(value);
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn lý do" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Khác">Khác</SelectItem>
                    <SelectItem value="Khách hàng yêu cầu">
                      Khách hàng yêu cầu
                    </SelectItem>
                    <SelectItem value="Hết nguyên liệu">
                      Hết nguyên liệu
                    </SelectItem>
                    <SelectItem value="Lỗi đặt món">Lỗi đặt món</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {reason === 'Khác' && (
              <div className="relative">
                <PencilIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do"
                  className="pl-9"
                />
              </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2Icon className="mr-2 size-4" />
              Chắc chắn
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <ClockIcon className="mr-2 size-4" />
              Bỏ qua
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
