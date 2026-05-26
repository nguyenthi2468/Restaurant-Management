import { TableWithBookings } from '@/features/tables';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableCard } from './TableCard';

interface TableGridProps {
  tables: TableWithBookings[];
  selectedTableId: string | null;
  onSelectTable: (table: TableWithBookings) => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TableGrid({
  tables,
  selectedTableId,
  onSelectTable,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: TableGridProps) {
  return (
    <>
      <ScrollArea className="flex-1 px-4 py-2">
        {isLoading ? (
          <div className="flex justify-center py-8 text-slate-500">
            Đang tải bàn...
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 sm:gap-3 py-3 sm:py-4 px-2 sm:px-3">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={selectedTableId === table.id}
                onSelect={onSelectTable}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center justify-end px-4 py-2 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
