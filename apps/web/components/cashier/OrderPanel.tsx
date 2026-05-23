import { useState } from 'react';
import { TableStatus, type Table} from '@/features/tables';
import type { OrderItem } from '@/features/cashier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutGrid,
  Plus,
  Users,
  MoreHorizontal,
  Search,
  Bell,
  DollarSign,
  Edit3,
  Phone,
  Printer,
  ClipboardList,
} from 'lucide-react';
import { OrderItemRow } from './OrderItemRow';

interface OrderPanelProps {
  selectedTable: Table | null;
  orderItems: OrderItem[];
  totalAmount: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNotify: () => void;
  onPay: () => void;
}

export function OrderPanel({
  selectedTable,
  orderItems,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onNotify,
  onPay,
}: OrderPanelProps) {
  const [customerSearch, setCustomerSearch] = useState('');

  if (!selectedTable) {
    return (
      <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col">
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <LayoutGrid size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chọn bàn để xem chi tiết đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTable.status === TableStatus.AVAILABLE) {
    return (
      <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
            <LayoutGrid size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Bàn trống - {selectedTable.name}
            </h3>
            <p className="text-sm text-slate-500">
              {selectedTable.seats > 0
                ? `${selectedTable.seats} người`
                : 'Không giới hạn'}
            </p>
          </div>
          <Button onClick={onNotify} className="w-full max-w-[200px]" size="lg">
            <ClipboardList size={16} className="mr-2" />
            Tạo đơn cho bàn này
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 lg:w-96 xl:w-[480px] bg-white md:border-l border-slate-200 flex flex-col">
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

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-3">
          {orderItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Chưa có món nào. Chọn thực đơn để thêm món.
            </div>
          ) : (
            orderItems.map((item, idx) => (
              <OrderItemRow
                key={item.id}
                item={item}
                index={idx}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="mx-4 mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
        <span className="mt-0.5">⚠</span>
        <span>
          Bạn vừa cập nhật đơn hàng. Click <strong>Thông báo</strong> để gửi
          thông tin chế biến đến bán bếp.
        </span>
      </div>

      <div className="px-4 py-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              {orderItems.length}
            </span>
            <span className="ml-2 text-blue-600 text-base">
              {totalAmount.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onNotify}
            variant="outline"
            className="flex-1 h-11 border-blue-300 text-blue-700 hover:bg-blue-50 text-sm font-medium"
          >
            <Bell size={16} className="mr-2" />
            Thông báo (F10)
          </Button>
          <Button
            onClick={onPay}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            <DollarSign size={16} className="mr-2" />
            Thanh toán (F9)
          </Button>
        </div>
      </div>
    </div>
  );
}
