import type { OrderItem } from '@/features/cashier';
import { Minus, Plus, Trash2, Edit3 } from 'lucide-react';

interface OrderItemRowProps {
  item: OrderItem;
  index: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemove: (itemId: string) => void;
}

export function OrderItemRow({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}: OrderItemRowProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600">{index + 1}.</span>
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
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 text-slate-600"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
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
        onClick={() => onRemove(item.id)}
        className="text-slate-400 hover:text-red-500 mt-1"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
