'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCashierOrderQuery } from '@/features/cashier';
import {
  TableWithBookings,
  TableStatus,
  useTablesWithBookingsQuery,
} from '@/features/tables';
import { Floor, useFloorsQuery } from '@/features/floor';
import type { OrderItem } from '@/features/order-items';
import { TabNavigation } from '@/components/cashier/TabNavigation';
import { FloorFilters } from '@/components/cashier/FloorFilters';
import { StatusFilters } from '@/components/cashier/StatusFilters';
import { TableGrid } from '@/components/cashier/TableGrid';
import { MenuGrid } from '@/components/cashier/MenuGrid';
import { OrderPanel } from '@/components/cashier/OrderPanel';
import { useMenuCategoriesQuery } from '@/features/menu-categories';
import { MenuCategoryFilters } from '@/components/cashier';
import {
  MenuItem,
  useMenuItemsWithPaginationQuery,
} from '@/features/menu-items';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetServedOrderByTableIdQuery } from '@/features/orders';
import {
  useCreateOrderItemMutation,
  useUpdateOrderItemMutation,
  useDeleteOrderItemMutation,
  useGetOrderItemsByOrderIdQuery,
} from '@/features/order-items';
import toast from 'react-hot-toast';
import { ApiError } from '@/types';

export default function CashierPage() {
  const [activeTab, setActiveTab] = useState<'tables' | 'menu'>('tables');
  const [floorFilter, setFloorFilter] = useState<Floor>({
    id: '',
    name: 'Tất cả',
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [currentPageMenu, setCurrentPageMenu] = useState(1);
  const [localOrderItems, setLocalOrderItems] = useState<OrderItem[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (activeTab === 'menu') {
      setCurrentPageMenu(1);
    }
  }, [debouncedSearchTerm, activeTab]);

  const { data: tablesData, isLoading: tablesLoading } =
    useTablesWithBookingsQuery({
      floorId: floorFilter.id,
      page: currentPageTable,
      limit: 20,
    });
  const { data: floors = [] } = useFloorsQuery();
  const { data: orderData } = useGetServedOrderByTableIdQuery(
    selectedTableId ?? '',
  );
  const { data: menuCategories = [] } = useMenuCategoriesQuery();
  const { data: orderItems, isLoading: isLoadingOrderItems } =
    useGetOrderItemsByOrderIdQuery(orderData?.id || '');
  const createOrderItemMutation = useCreateOrderItemMutation();
  const updateOrderItemMutation = useUpdateOrderItemMutation();
  const deleteOrderItemMutation = useDeleteOrderItemMutation();
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('');
  const { data: menuItemsData } = useMenuItemsWithPaginationQuery({
    menuCategoryId: selectedMenuCategory,
    search: debouncedSearchTerm,
    page: currentPageMenu,
    limit: 10,
  });
  const menuItems = menuItemsData?.data || [];
  const metaMenuItems = menuItemsData?.meta;
  const tables = tablesData?.data || [];
  const meta = tablesData?.meta;
  const tablesFilter = tables.filter(
    (t) => statusFilter === '' || t.status === statusFilter,
  );
  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) || null,
    [tables, selectedTableId],
  );

  const stats = useMemo(() => {
    const all = tables.filter(
      (t) =>
        t.floor.name !== 'Tất cả' ||
        (t.id !== 't-takeaway' && t.id !== 't-delivery'),
    );
    return {
      all: all.length,
      occupied: all.filter((t) => t.status === TableStatus.OCCUPIED).length,
      available: all.filter((t) => t.status === TableStatus.AVAILABLE).length,
    };
  }, [tables]);

  const displayItems = useMemo(() => {
    if (localOrderItems.length > 0) return localOrderItems;
    return orderData?.items ?? [];
  }, [localOrderItems, orderData]);

  const totalAmount = useMemo(
    () =>
      displayItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      ),
    [displayItems],
  );

  const handleSelectTable = useCallback((table: TableWithBookings) => {
    setSelectedTableId(table.id);
    setLocalOrderItems([]);
    setCurrentPageTable(1);
  }, []);

  const handleAddItem = useCallback(
    async (menuItem: MenuItem) => {
      if (!orderData?.id) return;

      const existingItem = orderItems?.find(
        (i) => i.menuItemId === menuItem.id,
      );

      if (existingItem) {
        await toast.promise(
          updateOrderItemMutation.mutateAsync({
            id: existingItem.id,
            data: {
              quantity: existingItem.quantity + 1,
              price: Number(menuItem.price),
            },
          }),
          {
            loading: 'Đang cập nhật món ăn...',
            success: 'Món ăn đã được cập nhật',
            error: (err: any) =>
              err?.response?.data?.message || 'Cập nhật món ăn thất bại',
          },
        );
      } else {
        await toast.promise(
          createOrderItemMutation.mutateAsync({
            orderId: orderData.id,
            menuItemId: menuItem.id,
            price: Number(menuItem.price),
            quantity: 1,
            note: 'Ghi chú/Món thêm',
          }),
          {
            loading: 'Đang thêm món ăn...',
            success: 'Món ăn đã được thêm vào order',
            error: (err: any) =>
              err?.response?.data?.message || 'Thêm món ăn vào order thất bại',
          },
        );
      }
    },
    [orderData, createOrderItemMutation, updateOrderItemMutation],
  );

  const handleUpdateQuantity = useCallback(
    async (itemId: string, delta: number) => {
      if (!orderItems) return;

      const existingItem = orderItems.find((i) => i.id === itemId);
      if (!existingItem) return;

      const newQty = existingItem.quantity + delta;

      if (newQty <= 0) {
        await toast.promise(deleteOrderItemMutation.mutateAsync(itemId), {
          loading: 'Đang xóa món ăn...',
          success: 'Món ăn đã được xóa',
          error: (err: ApiError) =>
            err?.response?.data?.message || 'Xóa món ăn thất bại',
        });
      } else {
        await toast.promise(
          updateOrderItemMutation.mutateAsync({
            id: itemId,
            data: {
              quantity: newQty,
              price: Number(existingItem.price),
            },
          }),
          {
            loading: 'Đang cập nhật số lượng...',
            success: 'Số lượng đã được cập nhật',
            error: (err: ApiError) =>
              err?.response?.data?.message || 'Cập nhật số lượng thất bại',
          },
        );
      }
    },
    [orderData, updateOrderItemMutation, deleteOrderItemMutation],
  );

  const handleRemoveItem = useCallback(
    async (itemId: string) => {
      await toast.promise(deleteOrderItemMutation.mutateAsync(itemId), {
        loading: 'Đang xóa món ăn...',
        success: 'Món ăn đã được xóa',
        error: (err: ApiError) =>
          err?.response?.data?.message || 'Xóa món ăn thất bại',
      });
    },
    [deleteOrderItemMutation],
  );

  const handleNotify = useCallback(() => {
    if (!selectedTable) return;
    alert(`Đã gửi thông báo cho ${selectedTable.name}`);
  }, [selectedTable]);

  const handlePay = useCallback(() => {
    if (!selectedTable) return;
    alert(
      `Thanh toán ${totalAmount.toLocaleString('vi-VN')}đ cho ${selectedTable.name}`,
    );
  }, [selectedTable, totalAmount]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-100">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {activeTab === 'tables' && (
          <>
            <FloorFilters
              floors={floors}
              selectedFloor={floorFilter.id}
              onFloorChange={(f) => {
                setFloorFilter(f);
                setCurrentPageTable(1);
              }}
            />

            <StatusFilters
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              stats={stats}
            />

            <TableGrid
              tables={tablesFilter}
              selectedTableId={selectedTableId}
              onSelectTable={handleSelectTable}
              isLoading={tablesLoading}
              currentPage={currentPageTable}
              totalPages={meta?.totalPages || 0}
              onPageChange={setCurrentPageTable}
            />
          </>
        )}

        {activeTab === 'menu' && (
          <>
            <MenuCategoryFilters
              menuCategories={menuCategories}
              selectedMenuCategory={selectedMenuCategory}
              onMenuCategoryChange={(c) => {
                setSelectedMenuCategory(c);
                setCurrentPageMenu(1);
              }}
            />

            <MenuGrid
              menuItems={menuItems}
              onAddItem={handleAddItem}
              hasSelectedTable={!!selectedTable}
              currentPage={currentPageMenu}
              totalPages={metaMenuItems?.totalPages || 0}
              onPageChange={setCurrentPageMenu}
            />
          </>
        )}

        {/* {activeTab === 'delivery' && (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Bike size={48} className="mx-auto mb-2 opacity-50" />
              <p>Không có đơn giao đi</p>
            </div>
          </div>
        )} */}
      </div>

      <OrderPanel
        selectedTable={selectedTable}
        order={orderData || null}
        isLoading={isLoadingOrderItems}
        orderItems={orderItems || []}
        totalAmount={totalAmount}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNotify={handleNotify}
        onPay={handlePay}
      />
    </div>
  );
}
