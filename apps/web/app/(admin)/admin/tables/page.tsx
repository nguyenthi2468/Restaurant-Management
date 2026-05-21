'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MESSAGES } from '@/constants/message';
import {
  Table,
  TableFormValues,
  useTablesQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  TableStatus,
  SearchTablesParams,
} from '@/features/tables';
import { useFloorsQuery } from '@/features/floor';
import TableManagementTable from '@/components/tables/TableManagementTable';
import TableFormDialog from '@/components/tables/TableFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ApiError } from '@/types';
import { Plus, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';

function TablesPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const debouncedNameFilter = useDebounce(nameFilter, 300);

  const searchParams: SearchTablesParams = useMemo(() => {
    const params: SearchTablesParams = {};
    if (debouncedNameFilter) params.name = debouncedNameFilter;
    if (floorFilter) params.floorId = floorFilter;
    if (statusFilter) params.status = statusFilter;
    return params;
  }, [debouncedNameFilter, floorFilter, statusFilter]);

  const { data, isLoading, isError } = useTablesQuery(searchParams);
  const { data: floorsData } = useFloorsQuery();
  const [tableToEdit, setTableToEdit] = useState<Table | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const createTableMutation = useCreateTableMutation();
  const updateTableMutation = useUpdateTableMutation();
  const deleteTableMutation = useDeleteTableMutation();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const tables = data || [];

  const hasFilters = nameFilter || floorFilter || statusFilter;

  const handleClearFilters = () => {
    setNameFilter('');
    setFloorFilter('');
    setStatusFilter('');
  };

  const handleEdit = (table: Table) => {
    setTableToEdit(table);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setTableToEdit(null);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTableMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Xóa bàn thành công');
          setOpenDeleteDialog(false);
          setDeleteId(null);
        },
        onError: (error: any) => {
          const err = error as ApiError;
          toast.error(err?.response?.data?.message || 'Không thể xóa bàn');
        },
      });
    }
  };

  const handleSave = async (data: TableFormValues) => {
    if (tableToEdit) {
      updateTableMutation.mutate(
        {
          id: tableToEdit.id,
          data,
        },
        {
          onSuccess: () => {
            setOpenDialog(false);
          },
          onError: (err) => {
            const error = err as ApiError;
            console.error('Edit table error:', error);
          },
        },
      );
    } else {
      createTableMutation.mutate(data, {
        onSuccess: () => {
          setOpenDialog(false);
        },
        onError: (err) => {
          const error = err as ApiError;
          console.error('Create table error:', error);
          setOpenDialog(false);
        },
      });
    }
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý bàn</h1>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleCreate}
        >
          <Plus size={20} className="mr-2" />
          Thêm bàn
        </Button>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Name search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Tìm theo tên bàn..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {/* Floor filter */}
            <Select
              value={floorFilter || 'ALL'}
              onValueChange={(value) =>
                setFloorFilter(value === 'ALL' ? '' : value)
              }
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Lọc theo tầng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả tầng</SelectItem>
                {floorsData?.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status filter */}
            <Select
              value={statusFilter || 'ALL'}
              onValueChange={(value) =>
                setStatusFilter(value === 'ALL' ? '' : value)
              }
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value={TableStatus.AVAILABLE}>Trống</SelectItem>
                <SelectItem value={TableStatus.OCCUPIED}>Có khách</SelectItem>
                <SelectItem value={TableStatus.RESERVED}>Đã đặt</SelectItem>
                <SelectItem value={TableStatus.MAINTENANCE}>Bảo trì</SelectItem>
              </SelectContent>
            </Select>
            {/* Clear filters button */}
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} className="mr-2" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          Đang tải danh sách bàn...
        </div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Lỗi khi tải danh sách bàn
        </div>
      ) : (
        <>
          <TableManagementTable
            tables={tables}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Edit/Create Table Dialog */}
          <TableFormDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            table={tableToEdit}
            onSubmit={handleSave}
            isSubmitting={
              createTableMutation.isPending || updateTableMutation.isPending
            }
          />

          <ConfirmDialog
            open={openDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={() => setOpenDeleteDialog(false)}
            title="Xóa bàn"
            description="Bạn có chắc chắn muốn xóa bàn này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            isLoading={deleteTableMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

export default TablesPage;
