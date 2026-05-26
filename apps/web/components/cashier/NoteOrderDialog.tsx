'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NoteOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: string;
  isPending: boolean;
  onSave: (note: string) => void;
}

export function NoteOrderDialog({
  open,
  onOpenChange,
  note,
  onSave,
  isPending,
}: NoteOrderDialogProps) {
  const [noteValue, setNoteValue] = useState(note);

  useEffect(() => {
    if (open) {
      setNoteValue(note);
    }
  }, [open, note]);

  const handleSave = () => {
    onSave(noteValue);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium">
            Ghi chú đơn hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="w-full">
            <Textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Nhập ghi chú cho đơn hàng..."
              className="min-h-[100px] w-full"
            />
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg border-0"
            >
              Bỏ qua
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Xong'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
