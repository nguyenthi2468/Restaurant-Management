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
import { Button } from '@/components/ui/button';
import { Floor, floorSchema, FloorFormValues } from '@/features/floor';

interface FloorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  floor?: Floor | null;
  onSubmit: (data: FloorFormValues) => Promise<void>;
  isSubmitting: boolean;
}

function FloorFormDialog({
  open,
  onOpenChange,
  floor,
  onSubmit,
  isSubmitting,
}: FloorFormDialogProps) {
  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema) as never,
    defaultValues: {
      name: floor?.name || '',
    },
  });

  useEffect(() => {
    if (floor) {
      form.reset({
        name: floor.name || '',
      });
    } else {
      form.reset({
        name: '',
      });
    }
  }, [floor, form]);

  const handleSubmit = async (data: FloorFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const dialogTitle = floor ? 'Chỉnh sửa tầng' : 'Thêm tầng mới';
  const dialogDescription = floor
    ? 'Chỉnh sửa thông tin tầng ở đây.'
    : 'Thêm tầng mới vào hệ thống.';

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
                    <FieldLabel>Tên tầng</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nhập tên tầng (vd: Tầng 1, Tầng 2)"
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
              {isSubmitting ? 'Đang lưu...' : floor ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FloorFormDialog;
