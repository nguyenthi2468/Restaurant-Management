'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Floor,
  FloorFormValues,
  useFloorsQuery,
  useCreateFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
} from '@/features/floor';
import FloorManagementTable from '@/components/floor/FloorManagementTable';
import FloorFormDialog from '@/components/floor/FloorFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ApiError } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function FloorsPage() {
  const { data, isLoading, isError } = useFloorsQuery();
  const [floorToEdit, setFloorToEdit] = useState<Floor | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const createFloorMutation = useCreateFloorMutation();
  const updateFloorMutation = useUpdateFloorMutation();
  const deleteFloorMutation = useDeleteFloorMutation();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const floors = data || [];

  const handleEdit = (floor: Floor) => {
    setFloorToEdit(floor);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setFloorToEdit(null);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteFloorMutation.mutate(deleteId, {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setDeleteId(null);
        },
        onError: (error: any) => {
          const err = error as ApiError;
          toast.error(err?.response?.data?.message || 'Không thể xóa tầng');
        },
      });
    }
  };

  const handleSave = async (data: FloorFormValues) => {
    if (floorToEdit) {
      updateFloorMutation.mutate(
        {
          id: floorToEdit.id,
          data,
        },
        {
          onSuccess: () => {
            setOpenDialog(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Edit floor error:', error);
          },
        },
      );
    } else {
      createFloorMutation.mutate(data, {
        onSuccess: () => {
          setOpenDialog(false);
        },
        onError: (err) => {
          const error = err as ApiError;
          console.error('Create floor error:', error);
          setOpenDialog(false);
        },
      });
    }
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý tầng</h1>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleCreate}
        >
          <Plus size={20} className="mr-2" />
          Thêm tầng
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          Đang tải danh sách tầng...
        </div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Lỗi khi tải danh sách tầng
        </div>
      ) : (
        <>
          <FloorManagementTable
            floors={floors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <FloorFormDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            floor={floorToEdit}
            onSubmit={handleSave}
            isSubmitting={
              createFloorMutation.isPending || updateFloorMutation.isPending
            }
          />

          <ConfirmDialog
            open={openDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={() => setOpenDeleteDialog(false)}
            title="Xóa tầng"
            description="Bạn có chắc chắn muốn xóa tầng này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            isLoading={deleteFloorMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

export default FloorsPage;
