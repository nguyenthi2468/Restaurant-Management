import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Floor } from '@/features/floor';
import { Badge } from '@/components/ui/badge';

interface FloorManagementTableProps {
  floors: Floor[];
  onEdit: (floor: Floor) => void;
  onDelete: (id: string) => void;
}

function FloorManagementTable({
  floors,
  onEdit,
  onDelete,
}: FloorManagementTableProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Tên tầng</TableHead>
            <TableHead className="text-foreground">Số lượng bàn</TableHead>
            <TableHead className="text-foreground text-right">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {floors.map((floor) => (
            <TableRow
              key={floor.id}
              className="border-b border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="text-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  {floor.name}
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                <Badge variant="secondary">
                  {floor._count?.tables || 0} bàn
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(floor)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => onDelete(floor.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {floors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Building2 size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không tìm thấy tầng nào</p>
        </div>
      )}
    </Card>
  );
}

export default FloorManagementTable;
