import { Table, TableStatus } from '@/features/tables';
import { Clock, ShoppingBag, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateMinutesAgo } from '@/utils/time';
import { useInterval } from '@/hooks/useInterval';
import { useState } from 'react';

interface TableCardProps {
  table: Table;
  isSelected: boolean;
  onSelect: (table: Table) => void;
}

export function TableCard({ table, isSelected, onSelect }: TableCardProps) {
  const isOccupied = table.status === TableStatus.OCCUPIED;
  let [minutesUsed, setMinutesUsed] = useState(() =>
    calculateMinutesAgo(table.updatedAt),
  );

  useInterval(
    () => {
      if (isOccupied) {
        setMinutesUsed(calculateMinutesAgo(table.updatedAt));
      }
    },
    isOccupied ? 60000 : null,
  );

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
      {isOccupied && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-blue-600">
          <Clock size={10} />
          <span>{minutesUsed} phút</span>
        </div>
      )}
      <div
        className={cn('mb-1', isOccupied ? 'text-blue-600' : 'text-slate-400')}
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
}
