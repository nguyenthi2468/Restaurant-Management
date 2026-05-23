import { Table, TableStatus } from '@/features/tables';
import { Clock, ShoppingBag, Bike, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateMinutesAgo } from '@/utils/time';
import { useInterval } from '@/hooks/useInterval';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TableCardProps {
  table: Table;
  isSelected: boolean;
  onSelect: (table: Table) => void;
}

export function TableCard({ table, isSelected, onSelect }: TableCardProps) {
  const isOccupied = table.status === TableStatus.OCCUPIED;
  const isMaintenance = table.status === TableStatus.MAINTENANCE;
  let [minutesUsed, setMinutesUsed] = useState(() =>
    calculateMinutesAgo(table.updatedAt),
  );

  useEffect(() => {
    if (isOccupied) {
      setMinutesUsed(calculateMinutesAgo(table.updatedAt));
    }
  }, [table.updatedAt, isOccupied]);

  useInterval(
    () => {
      if (isOccupied) {
        setMinutesUsed(calculateMinutesAgo(table.updatedAt));
      }
    },
    isOccupied ? 60000 : null,
  );

  const renderTableContent = () => (
    <>
      {isOccupied && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-blue-600">
          <Clock size={10} />
          <span>{minutesUsed} phút</span>
        </div>
      )}
      <div
        className={cn(
          'mb-1',
          isMaintenance
            ? 'text-slate-400'
            : isOccupied
              ? 'text-blue-600'
              : 'text-slate-400',
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
          isMaintenance
            ? 'text-slate-500'
            : isOccupied
              ? 'text-blue-700'
              : 'text-slate-600',
        )}
      >
        {table.name}
      </span>
    </>
  );

  if (isMaintenance) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={isMaintenance}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all w-full h-24',
              isSelected && 'ring-2 ring-primary border-primary',
              'bg-slate-100 border-slate-300 cursor-not-allowed opacity-60',
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <X className="text-red-600" size={48} strokeWidth={2} />
            </div>
            {renderTableContent()}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bàn đang bảo trì</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={() => onSelect(table)}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all w-full h-24',
        isSelected && 'ring-2 ring-primary border-primary',
        isOccupied
          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50',
      )}
    >
      {renderTableContent()}
    </button>
  );
}
