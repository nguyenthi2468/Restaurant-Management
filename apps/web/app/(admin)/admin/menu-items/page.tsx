'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useMenuItemsQuery,
  useDeleteMenuItemMutation,
} from '@/features/menu-items';
import MenuItemManagementTable from '@/components/menu-items/MenuItemManagementTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ApiError } from '@/types';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import Link from 'next/link';

function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useMenuItemsQuery();
  const menuItems = data || [];
  const deleteMenuItemMutation = useDeleteMenuItemMutation();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMenuItemMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Món ăn đã được xóa thành công');
          setOpenDeleteDialog(false);
          setDeleteId(null);
        },
        onError: (error: any) => {
          const err = error as ApiError;
          toast.error(err?.response?.data.message || 'Không thể xóa món ăn');
        },
      });
    }
  };

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý món ăn</h1>
        <Link href={ROUTES.ADMIN_MENU_ITEMS + '/new'}>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus size={20} className="mr-2" />
            Thêm món ăn
          </Button>
        </Link>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Tìm kiếm món ăn theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">Đang tải món ăn...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Lỗi khi tải món ăn
        </div>
      ) : (
        <>
          <MenuItemManagementTable
            menuItems={filteredMenuItems}
            onDelete={handleDelete}
          />

          <ConfirmDialog
            open={openDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={() => setOpenDeleteDialog(false)}
            title="Xóa món ăn"
            description="Bạn có chắc chắn muốn xóa món ăn này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            isLoading={deleteMenuItemMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

export default MenuItemsPage;
