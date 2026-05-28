'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shift, ShiftType } from '@/features/employee-schedules/types';

interface ShiftListProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
}
const statusLabels = (isActive: boolean)=>{
    return isActive ? 'Hoạt động' : 'Không hoạt động';
}

const statusVariants = (isActive: boolean)=>{
    return isActive ? 'default' : 'secondary';
}

const shiftTypeLabels = {
    [ShiftType.MORNING]: 'Ca sáng',
    [ShiftType.AFTERNOON]: 'Ca chiều',
    [ShiftType.EVENING]: 'Ca tối',
    [ShiftType.NIGHT]: 'Ca đêm',
    [ShiftType.FULL_DAY]: 'Ca toàn ngày',
}

export function ShiftList({ shifts, onEdit, onDelete }: ShiftListProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Tên ca làm việc</TableHead>
            <TableHead className="text-foreground">Loại ca làm việc</TableHead>
            <TableHead className="text-foreground">Giờ bắt đầu</TableHead>
            <TableHead className="text-foreground">Giờ kết thúc</TableHead>
            <TableHead className="text-foreground">Trạng thái</TableHead>
            <TableHead className="text-foreground">Mô tả</TableHead>
            <TableHead className="text-foreground text-right">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                Chưa có ca làm việc nào
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow
                key={shift.id}
                className="border-b border-border hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    {shift.name}
                  </div>
                </TableCell>
                <TableCell className="text-foreground">
                  {shiftTypeLabels[shift.type as keyof typeof shiftTypeLabels] ?? shift.type}
                </TableCell>
                <TableCell className="text-foreground">
                  {shift.startTime}
                </TableCell>
                <TableCell className="text-foreground">
                  {shift.endTime}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants(shift.isActive)}>
                    {statusLabels(shift.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs">
                  <p className="line-clamp-2 text-sm">
                    {shift.description || '-'}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(shift)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(shift.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
