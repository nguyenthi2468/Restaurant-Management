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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Shift, ShiftType } from '@/features/employee-schedules/types';
import {
  shiftFormSchema,
  ShiftFormValues,
} from '@/features/employee-schedules/validator';

interface ShiftFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift?: Shift | null;
  onSubmit: (data: ShiftFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const shiftTypeLabels: Record<ShiftType, string> = {
  [ShiftType.MORNING]: 'Ca sáng',
  [ShiftType.AFTERNOON]: 'Ca chiều',
  [ShiftType.EVENING]: 'Ca tối',
  [ShiftType.NIGHT]: 'Ca đêm',
  [ShiftType.FULL_DAY]: 'Ca cả ngày',
};

function ShiftFormDialog({
  open,
  onOpenChange,
  shift,
  onSubmit,
  isSubmitting,
}: ShiftFormDialogProps) {
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      name: (shift?.name as ShiftType) || ShiftType.MORNING,
      startTime: shift?.startTime || '',
      endTime: shift?.endTime || '',
      description: shift?.description || '',
      isActive: shift?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (shift) {
      form.reset({
        name: shift.name || '',
        type: (shift.type as ShiftType) || ShiftType.MORNING,
        startTime: shift.startTime || '',
        endTime: shift.endTime || '',
        description: shift.description || '',
        isActive: shift.isActive ?? true,
      });
    } else {
      form.reset({
        name: '',
        type: ShiftType.MORNING,
        startTime: '',
        endTime: '',
        description: '',
        isActive: true,
      });
    }
  }, [shift, form]);

  const handleSubmit = async (values: ShiftFormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const dialogTitle = shift ? 'Chỉnh sửa ca làm việc' : 'Thêm ca làm việc mới';
  const dialogDescription = shift
    ? 'Cập nhật thông tin ca làm việc.'
    : 'Tạo ca làm việc mới cho nhân viên.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <FieldGroup>
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Tên ca làm việc</FieldLabel>
                      <Input {...field} />
                      {fieldState.invalid && (
                        <span className="text-xs text-destructive mt-1 block">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </Field>
                  )}
                />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Loại ca làm việc</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại ca làm việc" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ShiftType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {shiftTypeLabels[type]}
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

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="startTime"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Giờ bắt đầu</FieldLabel>
                      <Input
                        {...field}
                        type="time"
                        aria-invalid={fieldState.invalid}
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

              <FieldGroup>
                <Controller
                  control={form.control}
                  name="endTime"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Giờ kết thúc</FieldLabel>
                      <Input
                        {...field}
                        type="time"
                        aria-invalid={fieldState.invalid}
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

            <FieldGroup>
              <Controller
                control={form.control}
                name="isActive"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel>Trạng thái hoạt động</FieldLabel>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Mô tả (tùy chọn)</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả cho ca làm việc"
                      rows={3}
                      aria-invalid={fieldState.invalid}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : shift ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ShiftFormDialog;
