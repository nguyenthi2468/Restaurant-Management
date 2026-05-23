import { useState } from 'react';
import type { CashierMenuItem } from '@/features/cashier';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface MenuGridProps {
  menuItems: CashierMenuItem[];
  onAddItem: (item: CashierMenuItem) => void;
  hasSelectedTable: boolean;
}

export function MenuGrid({
  menuItems,
  onAddItem,
  hasSelectedTable,
}: MenuGridProps) {
  const [showFullMenu, setShowFullMenu] = useState(false);

  const handleItemClick = (item: CashierMenuItem) => {
    if (!hasSelectedTable) {
      alert('Vui lòng chọn bàn trước');
      return;
    }
    onAddItem(item);
  };

  return (
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
          {(showFullMenu ? menuItems : menuItems.slice(0, 8)).map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
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
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
