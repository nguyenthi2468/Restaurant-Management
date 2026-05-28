import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TimeOffRequest } from '@/features/employee-schedules/types';

interface ApproveRejectDialogProps {
  approveDialogOpen: boolean;
  rejectDialogOpen: boolean;
  selectedRequest: TimeOffRequest | null;
  reviewNote: string;
  isApproving: boolean;
  isRejecting: boolean;
  onApproveDialogChange: (open: boolean) => void;
  onRejectDialogChange: (open: boolean) => void;
  onReviewNoteChange: (note: string) => void;
  onConfirmApprove: () => void;
  onConfirmReject: () => void;
}

export function ApproveRejectDialog({
  approveDialogOpen,
  rejectDialogOpen,
  selectedRequest,
  reviewNote,
  isApproving,
  isRejecting,
  onApproveDialogChange,
  onRejectDialogChange,
  onReviewNoteChange,
  onConfirmApprove,
  onConfirmReject,
}: ApproveRejectDialogProps) {
  return (
    <>
      <Dialog open={approveDialogOpen} onOpenChange={onApproveDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phê duyệt yêu cầu nghỉ phép</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn phê duyệt yêu cầu nghỉ phép của{' '}
              {selectedRequest?.employee?.firstName}{' '}
              {selectedRequest?.employee?.lastName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Ghi chú (tùy chọn)
            </label>
            <Textarea
              placeholder="Nhập ghi chú..."
              value={reviewNote}
              onChange={(e) => onReviewNoteChange(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onApproveDialogChange(false)}
            >
              Hủy
            </Button>
            <Button onClick={onConfirmApprove} disabled={isApproving}>
              {isApproving ? 'Đang xử lý...' : 'Phê duyệt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={onRejectDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu nghỉ phép</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn từ chối yêu cầu nghỉ phép của{' '}
              {selectedRequest?.employee?.firstName}{' '}
              {selectedRequest?.employee?.lastName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Lý do từ chối (tùy chọn)
            </label>
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={reviewNote}
              onChange={(e) => onReviewNoteChange(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onRejectDialogChange(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'Đang xử lý...' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
