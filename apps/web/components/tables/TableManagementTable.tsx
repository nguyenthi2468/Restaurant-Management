import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Armchair } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table as TableType, TableArea, TableStatus } from '@/features/tables';
import { Badge } from '@/components/ui/badge';

interface TableManagementTableProps {
  tables: TableType[];
  onEdit: (table: TableType) => void;
  onDelete: (id: string) => void;
}

const areaLabels: Record<TableArea, string> = {
  [TableArea.NORMAL]: 'Thường',
  [TableArea.VIP]: 'VIP',
};

const statusLabels: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: 'Trống',
  [TableStatus.OCCUPIED]: 'Có khách',
  [TableStatus.RESERVED]: 'Đã đặt',
  [TableStatus.MAINTENANCE]: 'Bảo trì',
};

const statusVariants: Record<TableStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [TableStatus.AVAILABLE]: 'default',
  [TableStatus.OCCUPIED]: 'secondary',
  [TableStatus.RESERVED]: 'outline',
  [TableStatus.MAINTENANCE]: 'destructive',
};

function TableManagementTable({ tables, onEdit, onDelete }: TableManagementTableProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Tên bàn</TableHead>
            <TableHead className="text-foreground">Tầng</TableHead>
            <TableHead className="text-foreground">Khu vực</TableHead>
            <TableHead className="text-foreground">Số ghế</TableHead>
            <TableHead className="text-foreground">Trạng thái</TableHead>
            <TableHead className="text-foreground text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map((table) => (
            <TableRow key={table.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
              <TableCell className="text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Armchair size={16} className="text-primary" />
                  {table.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{table.floor}</TableCell>
              <TableCell className="text-foreground">
                <Badge variant={table.area === TableArea.VIP ? 'default' : 'secondary'}>
                  {areaLabels[table.area]}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground">{table.seats}</TableCell>
              <TableCell className="text-foreground">
                <Badge variant={statusVariants[table.status]}>
                  {statusLabels[table.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(table)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => onDelete(table.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State */}
      {tables.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Armchair size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không tìm thấy bàn nào</p>
        </div>
      )}
    </Card>
  );
}

export default TableManagementTable;
