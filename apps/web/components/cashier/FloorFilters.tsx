import { Floor } from '@/features/floor';
import { cn } from '@/lib/utils';

interface FloorFiltersProps {
  floors: Floor[];
  selectedFloor: string;
  onFloorChange: (floor: Floor) => void;
}

export function FloorFilters({
  floors,
  selectedFloor,
  onFloorChange,
}: FloorFiltersProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <button
        onClick={() =>
          onFloorChange({
            id: '',
            name: 'Tất cả',
          })
        }
        className={cn(
          'px-3 py-1 rounded-md text-xs font-medium transition-colors',
          selectedFloor === ''
            ? 'bg-blue-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200',
        )}
      >
        Tất cả
      </button>
      {floors.map((f) => (
        <button
          key={f.id}
          onClick={() => onFloorChange(f)}
          className={cn(
            'px-3 py-1 rounded-md text-xs font-medium transition-colors',
            selectedFloor === f.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200',
          )}
        >
          {f.name}
        </button>
      ))}
    </div>
  );
}
