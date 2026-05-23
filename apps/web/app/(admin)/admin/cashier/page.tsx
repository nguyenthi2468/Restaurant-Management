'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  useCashierOrderQuery,
  useCashierMenuItemsQuery,
} from '@/features/cashier';
import {
  Table,
  TableStatus,
  useTablesQuery,
  useTablesQueryWithPagination,
} from '@/features/tables';
import { Floor, useFloorsQuery } from '@/features/floor';
import type { OrderItem, CashierMenuItem } from '@/features/cashier';
import { TabNavigation } from '@/components/cashier/TabNavigation';
import { FloorFilters } from '@/components/cashier/FloorFilters';
import { StatusFilters } from '@/components/cashier/StatusFilters';
import { TableGrid } from '@/components/cashier/TableGrid';
import { MenuGrid } from '@/components/cashier/MenuGrid';
import { OrderPanel } from '@/components/cashier/OrderPanel';
import {
  MenuCategory,
  useMenuCategoriesQuery,
} from '@/features/menu-categories';
import { MenuCategoryFilters } from '@/components/cashier';
import {
  MenuItem,
  useMenuItemsWithPaginationQuery,
} from '@/features/menu-items';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
    useTablesQueryWithPagination({
      floorId: floorFilter.id,
      page: currentPageTable,
      limit: 20,
    });
  const { data: floors = [] } = useFloorsQuery();
  const { data: orderData } = useCashierOrderQuery(selectedTableId ?? '');
  const { data: menuCategories = [] } = useMenuCategoriesQuery();
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
      displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [displayItems],
  );

  const handleSelectTable = useCallback((table: Table) => {
    setSelectedTableId(table.id);
    setLocalOrderItems([]);
    setCurrentPageTable(1);
  }, []);

  const handleAddItem = useCallback((menuItem: MenuItem) => {
    setLocalOrderItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                total: (i.quantity + 1) * i.price,
              }
            : i,
        );
      }
      const newItem: OrderItem = {
        id: `tmp-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        notes: 'Ghi chú/Món thêm',
        total: menuItem.price,
      };
      return [...prev, newItem];
    });
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    setLocalOrderItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== itemId) return i;
          const newQty = Math.max(0, i.quantity + delta);
          return { ...i, quantity: newQty, total: newQty * i.price };
        })
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setLocalOrderItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

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
    <div className="flex h-[calc(100vh-64px)] bg-slate-100">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col min-w-0">
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
        orderItems={displayItems}
        totalAmount={totalAmount}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNotify={handleNotify}
        onPay={handlePay}
      />
    </div>
  );
}
