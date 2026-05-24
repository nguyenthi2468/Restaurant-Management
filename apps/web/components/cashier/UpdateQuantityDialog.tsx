'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Delete } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface UpdateQuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentQuantity: number;
  onConfirm: (newQuantity: number) => void;
}

export function UpdateQuantityDialog({
  open,
  onOpenChange,
  currentQuantity,
  onConfirm,
}: UpdateQuantityDialogProps) {
  const [quantity, setQuantity] = useState<string>(currentQuantity.toString());

  useEffect(() => {
    if (open) {
      setQuantity(currentQuantity.toString());
    }
  }, [open, currentQuantity]);

  const handleNumberClick = (num: string) => {
    if (quantity === '0') {
      setQuantity(num);
    } else {
      setQuantity(quantity + num);
    }
  };

  const handleBackspace = () => {
    if (quantity.length > 1) {
      setQuantity(quantity.slice(0, -1));
    } else {
      setQuantity('0');
    }
  };

  const handleIncrement = () => {
    const currentValue = parseFloat(quantity) || 0;
    setQuantity((currentValue + 1).toString());
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(quantity) || 0;
    if (currentValue > 1) {
      setQuantity((currentValue - 1).toString());
    }
  };

  const handleConfirm = () => {
    const newQuantity = parseFloat(quantity) || 0;
    if (newQuantity === 0) {
      toast.error('Vui lòng nhập số lượng lớn hơn 0');
      return;
    }
    if (newQuantity > 0) {
      onConfirm(newQuantity);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const numpadButtons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', 'backspace'],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium">
            Số lượng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 py-4">
            <button
              onClick={handleDecrement}
              className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Minus size={18} />
            </button>

            <div className="min-w-[120px] text-center">
              <span className="text-3xl font-medium text-slate-900">
                {quantity}
              </span>
            </div>

            <button
              onClick={handleIncrement}
              className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {numpadButtons.map((row, rowIndex) =>
              row.map((button, colIndex) => {
                if (button === 'backspace') {
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={handleBackspace}
                      className="h-14 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center col-span-2"
                    >
                      <Delete size={20} className="text-slate-600" />
                    </button>
                  );
                }

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleNumberClick(button)}
                    className="h-14 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xl font-medium text-slate-900"
                  >
                    {button}
                  </button>
                );
              }),
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleConfirm}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            >
              Xong
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 h-12 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg border-0"
            >
              Bỏ qua
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
