import { OrderItem } from '@/features/order-items';
import { formatCurrency } from '@/utils/currency';
import { Minus, Plus, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UpdateQuantityDialog } from './UpdateQuantityDialog';
import { useState } from 'react';

interface OrderItemRowProps {
  item: OrderItem;
  index: number;
  isUpdating: boolean;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemove: (itemId: string) => void;
}

export function OrderItemRow({
  item,
  index,
  isUpdating,
  onUpdateQuantity,
  onRemove,
}: OrderItemRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleQuantityConfirm = (newQuantity: number) => {
    const delta = newQuantity - item.quantity;
    if (delta !== 0) {
      onUpdateQuantity(item.id, delta);
    }
  };
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600">{index + 1}.</span>
          <span className="text-sm font-medium text-slate-800 truncate">
            {item.menuItem?.name || 'Món không có tên'}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <button className="flex items-center gap-1 hover:text-blue-600">
            <Edit3 size={10} />
            {item.note || 'Ghi chú/Món thêm'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={isUpdating}
          onClick={() => onUpdateQuantity(item.id, -1)}
          className={cn(
            'w-6 h-6 rounded-full border flex items-center justify-center text-slate-600 transition-all',
            isUpdating
              ? 'border-slate-300 bg-slate-100 cursor-not-allowed opacity-70'
              : 'border-slate-300 hover:bg-slate-100',
          )}
        >
          <Minus size={12} />
        </button>
        <TooltipProvider>
          <Tooltip open={item.quantity > 10 && tooltipOpen}>
            <TooltipTrigger
              asChild
              onFocus={() => setTooltipOpen(true)}
              onBlur={() => setTooltipOpen(false)}
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
            >
              <button
                onClick={() => setDialogOpen(true)}
                className={cn(
                  'w-6 text-center text-sm font-medium transition-colors cursor-pointer',
                  item.quantity > 10
                    ? 'text-red-600'
                    : 'text-blue-600 hover:text-blue-600',
                )}
              >
                {item.quantity}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-red-600" />
                <span>số lượng quá lớn bạn có chắn không</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <button
          disabled={isUpdating}
          onClick={() => onUpdateQuantity(item.id, 1)}
          className={cn(
            'w-6 h-6 rounded-full border flex items-center justify-center text-slate-600 transition-all',
            isUpdating
              ? 'border-slate-300 bg-slate-100 cursor-not-allowed opacity-70'
              : 'border-slate-300 hover:bg-slate-100',
          )}
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="text-right w-20">
        <div className="text-sm font-medium text-slate-700">
          {formatCurrency(Number(item.price))}
        </div>
        <div className="text-xs font-semibold text-slate-900">
          {formatCurrency(Number(item.price) * item.quantity)}
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="text-slate-400 hover:text-red-500 mt-1"
      >
        <Trash2 size={14} />
      </button>

      <UpdateQuantityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentQuantity={item.quantity}
        onConfirm={handleQuantityConfirm}
      />
    </div>
  );
}
