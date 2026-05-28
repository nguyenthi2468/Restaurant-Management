'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit2, Trash2 } from 'lucide-react';
import { Shift } from '@/features/employee-schedules/types';

interface ShiftCardProps {
  shift: Shift;
  onEdit?: (shift: Shift) => void;
  onDelete?: (id: string) => void;
}

const statusLabels = (isActive: boolean)=>{
    return isActive ? 'Hoạt động' : 'Không hoạt động';
}

const statusVariants = (isActive: boolean)=>{
    return isActive ? 'default' : 'secondary';
}

export function ShiftCard({ shift, onEdit, onDelete }: ShiftCardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{shift.name}</CardTitle>
          </div>
          <Badge variant={statusVariants(shift.isActive)}>
            {statusLabels(shift.isActive)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Giờ làm việc:</span>
            <span className="font-medium text-foreground">
              {shift.startTime} - {shift.endTime}
            </span>
          </div>

          {shift.description && (
            <div className="text-sm text-muted-foreground">
              <p className="line-clamp-2">{shift.description}</p>
            </div>
          )}

          {(onEdit || onDelete) && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(shift)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(shift.id)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
