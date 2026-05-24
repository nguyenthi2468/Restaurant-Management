'use client';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableArea,
  TableStatus,
  tableSchema,
  TableFormValues,
} from '@/features/tables';
import { useFloorsQuery } from '@/features/floor';

interface TableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: Table | null;
  onSubmit: (data: TableFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const areaOptions = [
  { value: TableArea.NORMAL, label: 'Thường' },
  { value: TableArea.VIP, label: 'VIP' },
];

const statusOptions = [
  { value: TableStatus.AVAILABLE, label: 'Trống' },
  // { value: TableStatus.RESERVED, label: 'Đã đặt' },
  { value: TableStatus.MAINTENANCE, label: 'Bảo trì' },
];

function TableFormDialog({
  open,
  onOpenChange,
  table,
  onSubmit,
  isSubmitting,
}: TableFormDialogProps) {
  const { data: floors } = useFloorsQuery();
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema) as never,
    defaultValues: {
      name: table?.name || '',
      floorId: table?.floorId || '',
      area: table?.area || TableArea.NORMAL,
      seats: table?.seats || 4,
      status: table?.status || TableStatus.AVAILABLE,
    },
  });

  useEffect(() => {
    if (table) {
      form.reset({
        name: table.name || '',
        floorId: table.floorId || '',
        area: table.area || TableArea.NORMAL,
        seats: table.seats || 4,
        status: table.status || TableStatus.AVAILABLE,
      });
    } else {
      form.reset({
        name: '',
        floorId: '',
        area: TableArea.NORMAL,
        seats: 4,
        status: TableStatus.AVAILABLE,
      });
    }
  }, [table, form]);

  const handleSubmit = async (data: TableFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const dialogTitle = table ? 'Chỉnh sửa bàn' : 'Thêm bàn mới';
  const dialogDescription = table
    ? 'Chỉnh sửa thông tin bàn ở đây.'
    : 'Thêm bàn mới vào hệ thống.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Name */}
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tên bàn</FieldLabel>
                    <Input {...field} placeholder="Nhập tên bàn" />
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Floor */}
            <FieldGroup>
              <Controller
                control={form.control}
                name="floorId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tầng</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tầng" />
                      </SelectTrigger>
                      <SelectContent>
                        {floors?.map((floor) => (
                          <SelectItem key={floor.id} value={floor.id}>
                            {floor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Area and Seats - Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Area */}
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="area"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Khu vực</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khu vực" />
                        </SelectTrigger>
                        <SelectContent>
                          {areaOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <span className="text-xs text-destructive mt-1 block">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Seats */}
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="seats"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Số ghế</FieldLabel>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                        placeholder="Số ghế"
                      />
                      {fieldState.invalid && (
                        <span className="text-xs text-destructive mt-1 block">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            {/* Status */}
            <FieldGroup>
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Trạng thái</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                        {table?.status === TableStatus.OCCUPIED && (
                          <SelectItem value={TableStatus.OCCUPIED}>
                            Có khách
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? 'Đang lưu...' : table ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TableFormDialog;
