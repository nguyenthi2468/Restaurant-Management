'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ShiftList } from '@/components/shifts/ShiftList';
import ShiftFormDialog from '@/components/shifts/ShiftForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useShiftsQuery } from '@/features/employee-schedules/queries';
import {
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} from '@/features/employee-schedules/mutations';
import { Shift, ShiftType } from '@/features/employee-schedules/types';
import { ShiftFormValues } from '@/features/employee-schedules/validator';
import { Spinner } from '@/components/ui/spinner';

export default function ShiftsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

  const { data: shifts, isLoading, error } = useShiftsQuery();
  const createMutation = useCreateShiftMutation();
  const updateMutation = useUpdateShiftMutation();
  const deleteMutation = useDeleteShiftMutation();

  const handleCreate = () => {
    setSelectedShift(null);
    setIsFormOpen(true);
  };

  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setShiftToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (shiftToDelete) {
      await deleteMutation.mutateAsync(shiftToDelete);
      setDeleteDialogOpen(false);
      setShiftToDelete(null);
    }
  };

  const handleFormSubmit = async (data: ShiftFormValues) => {
    if (selectedShift) {
      await updateMutation.mutateAsync({
        id: selectedShift.id,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedShift(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">
            Không thể tải danh sách ca làm việc
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý ca làm việc
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các ca làm việc cho nhân viên
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm ca làm việc
        </Button>
      </div>

      <ShiftList
        shifts={shifts || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ShiftFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        shift={selectedShift}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setShiftToDelete(null);
        }}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa ca làm việc này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
