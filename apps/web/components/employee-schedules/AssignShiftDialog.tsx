'use client';

import React, { useEffect, useState } from 'react';
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
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
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
import {
  assignShiftFormSchema,
  AssignShiftFormValues,
} from '@/features/employee-schedules/validator';
import { useActiveShiftsQuery } from '@/features/employee-schedules/queries';
import { useUsersQuery } from '@/features/user/queries';
import { EmployeeSchedule } from '@/features/employee-schedules/types';
import { format } from 'date-fns';

interface AssignShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: EmployeeSchedule | null;
  onSubmit: (data: AssignShiftFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function AssignShiftDialog({
  open,
  onOpenChange,
  schedule,
  onSubmit,
  isSubmitting,
}: AssignShiftDialogProps) {
  const form = useForm<AssignShiftFormValues>({
    resolver: zodResolver(assignShiftFormSchema),
    defaultValues: {
      shiftId: schedule?.shiftId || '',
      date: schedule?.date ? format(new Date(schedule.date), 'yyyy-MM-dd') : '',
      note: schedule?.note || '',
    },
  });

  const { data: shiftsData, isLoading: shiftsLoading } = useActiveShiftsQuery();
  const { data: usersData, isLoading: usersLoading } = useUsersQuery({ limit: 100 });

  const shifts = shiftsData || [];
  const users = usersData?.data || [];

  useEffect(() => {
    if (schedule) {
      form.reset({
        shiftId: schedule.shiftId || '',
        date: schedule.date ? format(new Date(schedule.date), 'yyyy-MM-dd') : '',
        note: schedule.note || '',
      });
    } else {
      form.reset({
        shiftId: '',
        date: '',
        note: '',
      });
    }
  }, [schedule, form]);

  const handleSubmit = async (data: AssignShiftFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {schedule ? 'Cập nhật lịch làm việc' : 'Phân ca làm việc'}
          </DialogTitle>
          <DialogDescription>
            {schedule
              ? 'Cập nhật thông tin lịch làm việc cho nhân viên'
              : 'Phân ca làm việc cho nhân viên'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

          <FieldGroup>
            <Field>
              <FieldLabel>Ca làm việc</FieldLabel>
              <Controller
                name="shiftId"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={shiftsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ca làm việc" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.name} ({shift.startTime} - {shift.endTime})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.shiftId && (
                <FieldError>{form.formState.errors.shiftId.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Ngày</FieldLabel>
              <Controller
                name="date"
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...field}
                    disabled={!!schedule}
                  />
                )}
              />
              {form.formState.errors.date && (
                <FieldError>{form.formState.errors.date.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Ghi chú (tùy chọn)</FieldLabel>
              <Controller
                name="note"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Nhập ghi chú..."
                    rows={3}
                  />
                )}
              />
              {form.formState.errors.note && (
                <FieldError>{form.formState.errors.note.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

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
              {isSubmitting ? 'Đang xử lý...' : schedule ? 'Cập nhật' : 'Phân ca'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
