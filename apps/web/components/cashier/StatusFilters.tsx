import { TableStatus } from "@/features/tables";

interface StatusFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  stats: {
    all: number;
    occupied: number;
    available: number;
  };
}

export function StatusFilters({
  selectedStatus,
  onStatusChange,
  stats,
}: StatusFiltersProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-1 text-xs text-slate-600">
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name="status"
          checked={selectedStatus === ""}
          onChange={() => onStatusChange('')}
          className="text-blue-600"
        />
        Tất cả ({stats.all})
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name="status"
          checked={selectedStatus === TableStatus.OCCUPIED}
          onChange={() => onStatusChange(TableStatus.OCCUPIED)}
          className="text-blue-600"
        />
        Sử dụng ({stats.occupied})
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name="status"
          checked={selectedStatus === TableStatus.AVAILABLE}
          onChange={() => onStatusChange(TableStatus.AVAILABLE)}
          className="text-blue-600"
        />
        Còn trống ({stats.available})
      </label>
    </div>
  );
}
