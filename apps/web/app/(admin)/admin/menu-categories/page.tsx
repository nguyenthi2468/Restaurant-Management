'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useMenuCategoriesQuery,
} from '@/features/menu-categories';
import MenuCategoryManagementTable from '@/components/menucategories/MenuCategoryManagementTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  useDeleteMenuCategoryMutation,
} from '@/features/menu-categories';
import { ApiError } from '@/types';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants';
import Link from 'next/link';

function MenuCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useMenuCategoriesQuery();
  const menuCategories = data || [];
  const deleteMenuCategoryMutation = useDeleteMenuCategoryMutation();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMenuCategoryMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Menu category deleted successfully');
          setOpenDeleteDialog(false);
          setDeleteId(null);
        },
        onError: (error: any) => {
          const err = error as ApiError;
          toast.error(
            err?.response?.data.message || 'Failed to delete menu category',
          );
        },
      });
    }
  };
  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Menu Categories Management
        </h1>
        <Link
          href={ROUTES.ADMIN_MENU_CATEGORIES + '/new'}
        >
          <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus size={20} className="mr-2" />
            Add Menu Category
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
            placeholder="Search menu categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          Loading menu categories...
        </div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading menu categories
        </div>
      ) : (
        <>
          <MenuCategoryManagementTable
            menuCategories={menuCategories}
            onDelete={handleDelete}
          />

          <ConfirmDialog
            open={openDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={() => setOpenDeleteDialog(false)}
            title="Delete Menu Category"
            description="Are you sure you want to delete this menu category? This action cannot be undone."
            confirmText="Delete"
            isLoading={deleteMenuCategoryMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

export default MenuCategoriesPage;
