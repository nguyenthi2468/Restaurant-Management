'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar, Clock, Users, User, Phone } from 'lucide-react';
import {
  bookingFormSchema,
  BookingFormValues,
} from '@/features/booking/validator';
import { useCreateBookingMutation } from '@/features/booking/mutations';
import { useTablesQuery } from '@/features/tables/queries';
import { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function ReservationForm() {
  const [loading, setLoading] = useState(false);
  const createBookingMutation = useCreateBookingMutation();
  const { data: tables = [], isLoading: tablesLoading } = useTablesQuery();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      bookingTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      numberOfGuests: 1,
      numberOfChildren: 0,
      note: '',
      tables: [],
      preOrderItems: [],
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    try {
      await createBookingMutation.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTables = form.watch('tables') || [];

  const handleTableToggle = (tableId: string) => {
    const currentTables = form.getValues('tables') || [];
    const isSelected = currentTables.some((t) => t.tableId === tableId);

    if (isSelected) {
      form.setValue(
        'tables',
        currentTables.filter((t) => t.tableId !== tableId),
      );
    } else {
      form.setValue('tables', [...currentTables, { tableId }]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldGroup>
          <Controller
            name="customerName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerName">Họ và tên</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerName"
                    placeholder="Nhập họ và tên"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
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
            name="customerPhone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerPhone">Số điện thoại</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerPhone"
                    placeholder="Nhập số điện thoại"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
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
            name="bookingTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bookingTime">Thời gian đến</FieldLabel>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="bookingTime"
                    type="datetime-local"
                    className="pl-10"
                    disabled={loading}
                    value={
                      field.value
                        ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    aria-invalid={fieldState.invalid}
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
            name="endTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="endTime">Thời gian kết thúc</FieldLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="endTime"
                    type="datetime-local"
                    className="pl-10"
                    disabled={loading}
                    value={
                      field.value
                        ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    aria-invalid={fieldState.invalid}
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
            name="numberOfGuests"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="numberOfGuests">Số lượng khách</FieldLabel>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="numberOfGuests"
                    type="number"
                    min="1"
                    placeholder="Nhập số lượng khách"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    aria-invalid={fieldState.invalid}
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
            name="numberOfChildren"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="numberOfChildren">
                  Số lượng trẻ em
                </FieldLabel>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="numberOfChildren"
                    type="number"
                    min="0"
                    placeholder="Nhập số lượng trẻ em"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    aria-invalid={fieldState.invalid}
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
      </div>

      <FieldGroup>
        <Controller
          name="note"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="note">Ghi chú</FieldLabel>
              <div className="relative">
                <Textarea
                  id="note"
                  placeholder="Nhập ghi chú (nếu có)"
                  disabled={loading}
                  {...field}
                  aria-invalid={fieldState.invalid}
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
        <Field>
          <FieldLabel>Chọn bàn</FieldLabel>
          {tablesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border border-input rounded-md">
              {tables.map((table) => (
                <div key={table.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`table-${table.id}`}
                    checked={selectedTables.some((t) => t.tableId === table.id)}
                    onCheckedChange={() => handleTableToggle(table.id)}
                    disabled={loading || table.status !== 'AVAILABLE'}
                  />
                  <Label
                    htmlFor={`table-${table.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {table.name} ({table.seats} chỗ)
                  </Label>
                </div>
              ))}
            </div>
          )}
          {form.formState.errors.tables && (
            <span className="text-xs text-destructive mt-1 block">
              {form.formState.errors.tables.message}
            </span>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={loading}
        >
          Đặt lại
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Đặt bàn
        </Button>
      </div>
    </form>
  );
}
