'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useCashierTablesQuery,
  useCashierOrderQuery,
  useCashierMenuItemsQuery,
} from '@/features/cashier';
import type {
  CashierTable,
  OrderItem,
  CashierMenuItem,
  TableFilter,
} from '@/features/cashier';
import {
  Search,
  Minus,
  Plus,
  LayoutGrid,
  List,
  Bell,
  DollarSign,
  ShoppingBag,
  Bike,
  Clock,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  Printer,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CashierPage() {
  const [activeTab, setActiveTab] = useState<'tables' | 'menu' | 'delivery'>(
    'tables',
  );
  const [floorFilter, setFloorFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState<TableFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [localOrderItems, setLocalOrderItems] = useState<OrderItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showFullMenu, setShowFullMenu] = useState(false);

  const { data: tables = [], isLoading: tablesLoading } =
    useCashierTablesQuery();
  const { data: menuItems = [] } = useCashierMenuItemsQuery();
  const { data: orderData } = useCashierOrderQuery(selectedTableId ?? '');

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) || null,
    [tables, selectedTableId],
  );

  const floors = useMemo(() => {
    const set = new Set(tables.map((t) => t.floor));
    return ['Tất cả', ...Array.from(set).filter((f) => f !== 'Tất cả')];
  }, [tables]);

  const filteredTables = useMemo(() => {
    let result = tables;
    if (floorFilter !== 'Tất cả') {
      result = result.filter((t) => t.floor === floorFilter);
    }
    if (statusFilter === 'occupied') {
      result = result.filter((t) => t.status === 'occupied');
    } else if (statusFilter === 'available') {
      result = result.filter((t) => t.status === 'available');
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [tables, floorFilter, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const all = tables.filter(
      (t) =>
        t.floor !== 'Tất cả' ||
        (t.id !== 't-takeaway' && t.id !== 't-delivery'),
    );
    return {
      all: all.length,
      occupied: all.filter((t) => t.status === 'occupied').length,
      available: all.filter((t) => t.status === 'available').length,
    };
  }, [tables]);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredTables.length / pageSize));
  const pagedTables = filteredTables.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const displayItems = useMemo(() => {
    if (localOrderItems.length > 0) return localOrderItems;
    return orderData?.items ?? [];
  }, [localOrderItems, orderData]);

  const totalAmount = useMemo(
    () =>
      displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [displayItems],
  );

  const handleSelectTable = useCallback((table: CashierTable) => {
    setSelectedTableId(table.id);
    setLocalOrderItems([]);
    setCurrentPage(1);
  }, []);

  const handleAddItem = useCallback((menuItem: CashierMenuItem) => {
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

  const formatMinutes = (mins: number) => {
    const m = Math.floor(mins);
    const s = Math.floor((mins - m) * 60);
    return `${m}p${s.toString().padStart(2, '0')}s`;
  };

  const TableCard = ({ table }: { table: CashierTable }) => {
    const isSelected = selectedTableId === table.id;
    const isOccupied = table.status === 'occupied';
    return (
      <button
        onClick={() => handleSelectTable(table)}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all w-full h-24',
          isSelected && 'ring-2 ring-primary border-primary',
          isOccupied
            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50',
        )}
      >
        {isOccupied && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-blue-600">
            <Clock size={10} />
            <span>{formatMinutes(table.elapsedMinutes)}</span>
          </div>
        )}
        {isOccupied && table.itemCount > 0 && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md">
            {table.itemCount}
          </div>
        )}
        <div
          className={cn(
            'mb-1',
            isOccupied ? 'text-blue-600' : 'text-slate-400',
          )}
        >
          {table.id === 't-takeaway' && <ShoppingBag size={24} />}
          {table.id === 't-delivery' && <Bike size={24} />}
          {!['t-takeaway', 't-delivery'].includes(table.id) && (
            <div className="w-8 h-8 rounded-md border border-current flex items-center justify-center text-xs font-bold">
              {table.seats > 0 ? table.seats : '-'}
            </div>
          )}
        </div>
        <span
          className={cn(
            'text-xs font-semibold',
            isOccupied ? 'text-blue-700' : 'text-slate-600',
          )}
        >
          {table.name}
        </span>
      </button>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-100">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTab === 'tables'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200',
            )}
          >
            <LayoutGrid size={16} />
            Phòng bàn
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTab === 'menu'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200',
            )}
          >
            <List size={16} />
            Thực đơn
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTab === 'delivery'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200',
            )}
          >
            <Bike size={16} />
            Giao đi
          </button>

          <div className="flex-1" />

          <div className="relative w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Tìm món (F3)"
              className="pl-9 h-9 bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" className="h-9 px-3 bg-white">
            Số lưu
          </Button>
          <Button size="sm" className="h-9 w-9 p-0 bg-blue-600">
            <Plus size={16} />
          </Button>
        </div>

        {activeTab === 'tables' && (
          <>
            {/* Floor filters */}
            <div className="flex items-center gap-1 px-4 py-2">
              {floors.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFloorFilter(f);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                    floorFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Status filters */}
            <div className="flex items-center gap-4 px-4 py-1 text-xs text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === 'all'}
                  onChange={() => setStatusFilter('all')}
                  className="text-blue-600"
                />
                Tất cả ({stats.all})
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === 'occupied'}
                  onChange={() => setStatusFilter('occupied')}
                  className="text-blue-600"
                />
                Sử dụng ({stats.occupied})
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === 'available'}
                  onChange={() => setStatusFilter('available')}
                  className="text-blue-600"
                />
                Còn trống ({stats.available})
              </label>
            </div>

            {/* Table Grid */}
            <ScrollArea className="flex-1 px-4 py-2">
              {tablesLoading ? (
                <div className="flex justify-center py-8 text-slate-500">
                  Đang tải bàn...
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 pb-4">
                  {pagedTables.map((table) => (
                    <TableCard key={table.id} table={table} />
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 bg-white">
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" className="rounded" />
                Mở thực đơn khi chọn bàn
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-slate-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'menu' && (
          <ScrollArea className="flex-1 px-4 py-2">
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">Thực đơn</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFullMenu((v) => !v)}
                >
                  {showFullMenu ? 'Thu gọn' : 'Xem tất cả'}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(showFullMenu ? menuItems : menuItems.slice(0, 8)).map(
                  (item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!selectedTable) {
                          alert('Vui lòng chọn bàn trước');
                          return;
                        }
                        handleAddItem(item);
                      }}
                      className="flex flex-col items-start p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-blue-600 mt-2">
                        {item.price.toLocaleString('vi-VN')}đ
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          </ScrollArea>
        )}

        {activeTab === 'delivery' && (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Bike size={48} className="mx-auto mb-2 opacity-50" />
              <p>Không có đơn giao đi</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Order Details */}
      <div className="w-[480px] bg-white border-l border-slate-200 flex flex-col">
        {selectedTable ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedTable.name}
                </Badge>
                <span className="text-xs text-slate-500">
                  {selectedTable.seats > 0
                    ? `${selectedTable.seats} người`
                    : 'Không giới hạn'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon-xs" variant="ghost">
                  <Plus size={14} />
                </Button>
                <Button size="icon-xs" variant="ghost">
                  <Users size={14} />
                </Button>
                <Button size="icon-xs" variant="ghost">
                  <MoreHorizontal size={14} />
                </Button>
              </div>
            </div>

            {/* Customer search */}
            <div className="px-4 py-2 border-b border-slate-200">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  placeholder="Tìm khách hàng (F4)"
                  className="pl-9 h-8 text-sm bg-slate-50"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Order Items */}
            <ScrollArea className="flex-1 px-4 py-2">
              <div className="space-y-3">
                {displayItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Chưa có món nào. Chọn thực đơn để thêm món.
                  </div>
                ) : (
                  displayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600">
                            {idx + 1}.
                          </span>
                          <span className="text-sm font-medium text-slate-800 truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <Edit3 size={10} />
                            {item.notes || 'Ghi chú/Món thêm'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 text-slate-600"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 text-slate-600"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right w-20">
                        <div className="text-sm font-medium text-slate-700">
                          {item.price.toLocaleString('vi-VN')}
                        </div>
                        <div className="text-xs font-semibold text-slate-900">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 mt-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Notification banner */}
            <div className="mx-4 mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              <span>
                Bạn vừa cập nhật đơn hàng. Click <strong>Thông báo</strong> để
                gửi thông tin chế biến đến bán bếp.
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="px-4 py-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 px-2"
                  >
                    <Users size={14} className="mr-1" />
                    Nguyễn...
                  </Button>
                  <Button size="icon-xs" variant="ghost">
                    <Edit3 size={12} />
                  </Button>
                  <Button size="icon-xs" variant="ghost">
                    <Phone size={12} />
                  </Button>
                  <Button size="icon-xs" variant="ghost">
                    <Printer size={12} />
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                  Tổng tiền
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {displayItems.length}
                  </span>
                  <span className="ml-2 text-blue-600 text-base">
                    {totalAmount.toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleNotify}
                  variant="outline"
                  className="flex-1 h-11 border-blue-300 text-blue-700 hover:bg-blue-50 text-sm font-medium"
                >
                  <Bell size={16} className="mr-2" />
                  Thông báo (F10)
                </Button>
                <Button
                  onClick={handlePay}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  <DollarSign size={16} className="mr-2" />
                  Thanh toán (F9)
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <LayoutGrid size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chọn bàn để xem chi tiết đơn hàng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
