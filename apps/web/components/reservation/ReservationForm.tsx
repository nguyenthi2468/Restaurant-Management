'use client';

import toast from 'react-hot-toast';
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
import { useFloorsQuery } from '@/features/floor/queries';
import { useMenuItemsQuery } from '@/features/menu-items/queries';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/currency';
import { useRouter } from 'next/navigation';
import { Booking } from '@/features/booking/types';

export function ReservationForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const router = useRouter();
  const createBookingMutation = useCreateBookingMutation();
  const { data: floors = [], isLoading: floorsLoading } = useFloorsQuery();
  const { data: allTables = [], isLoading: tablesLoading } = useTablesQuery({
    floorId: selectedFloorId,
  });
  const { data: menuItems = [], isLoading: menuItemsLoading } =
    useMenuItemsQuery();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema) as never,
    defaultValues: {
      customerName: '',
      customerPhone: '',
      bookingTime: undefined,
      numberOfGuests: 1,
      numberOfChildren: 0,
      note: '',
      tables: [],
      preOrderItems: [],
    },
  });

  useEffect(() => {
    if (floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  const numberOfGuests = form.watch('numberOfGuests') || 1;
  const numberOfChildren = form.watch('numberOfChildren') || 0;
  const totalPersons = numberOfGuests + numberOfChildren;

  const tables = useMemo(() => {
    return allTables.filter((table) => table.seats >= totalPersons);
  }, [allTables, totalPersons]);

  const preOrderItems = form.watch('preOrderItems') || [];

  const totalAmount = useMemo(() => {
    return preOrderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [preOrderItems]);

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    try {
      const booking: Booking = await createBookingMutation.mutateAsync(data);

      // Check if depositAmount > 0, redirect to confirm-payment page
      const depositAmount =
        typeof booking.depositAmount === 'string'
          ? parseFloat(booking.depositAmount)
          : booking.depositAmount;

      if (depositAmount > 0) {
        router.push(`/reservation/confirm-payment?bookingId=${booking.id}`);
      } else {
        router.push(`/reservation/success?bookingId=${booking.id}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
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
      const newTable = allTables.find((t) => t.id === tableId);
      if (!newTable) return;

      const currentSeats = currentTables.reduce((sum, t) => {
        const table = allTables.find((at) => at.id === t.tableId);
        return sum + (table?.seats || 0);
      }, 0);

      if (currentTables.length > 0 && currentSeats + newTable.seats > totalPersons) {
        toast.error(
          `Không thể chọn thêm bàn ${newTable.seats} chỗ vì vượt quá số người (${totalPersons} người)`,
        );
        return;
      }

      form.setValue('tables', [...currentTables, { tableId }]);
    }
  };

  const handleMenuItemToggle = (menuItemId: string, price: number) => {
    const currentItems = form.getValues('preOrderItems') || [];
    const existingItem = currentItems.find(
      (item) => item.menuItemId === menuItemId,
    );

    if (existingItem) {
      form.setValue(
        'preOrderItems',
        currentItems.filter((item) => item.menuItemId !== menuItemId),
      );
    } else {
      form.setValue('preOrderItems', [
        ...currentItems,
        { menuItemId, quantity: 1, price },
      ]);
    }
  };

  const handleQuantityChange = (menuItemId: string, quantity: number) => {
    const currentItems = form.getValues('preOrderItems') || [];
    const updatedItems = currentItems.map((item) =>
      item.menuItemId === menuItemId ? { ...item, quantity } : item,
    );
    form.setValue('preOrderItems', updatedItems);
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
          <FieldLabel>Chọn tầng</FieldLabel>
          {floorsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <Select value={selectedFloorId} onValueChange={setSelectedFloorId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tầng" />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
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

      <FieldGroup>
        <Field>
          <FieldLabel>Đặt món trước (tùy chọn)</FieldLabel>
          {menuItemsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-input rounded-md max-h-96 overflow-y-auto">
                {menuItems
                  .filter((item) => item.isAvailable)
                  .map((menuItem) => {
                    const selectedItem = preOrderItems.find(
                      (item) => item.menuItemId === menuItem.id,
                    );
                    const isSelected = !!selectedItem;

                    return (
                      <div
                        key={menuItem.id}
                        className="flex flex-col space-y-2 p-3 border border-input rounded-md"
                      >
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id={`menu-${menuItem.id}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleMenuItemToggle(menuItem.id, menuItem.price)
                            }
                            disabled={loading}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`menu-${menuItem.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {menuItem.name}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {menuItem.description}
                            </p>
                            <p className="text-sm font-semibold text-primary mt-1">
                              {formatCurrency(menuItem.price)} đ
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-2 ml-6">
                            <Label
                              htmlFor={`quantity-${menuItem.id}`}
                              className="text-xs"
                            >
                              Số lượng:
                            </Label>
                            <Input
                              id={`quantity-${menuItem.id}`}
                              type="number"
                              min="1"
                              value={selectedItem.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  menuItem.id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-20 h-8 text-sm"
                              disabled={loading}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              {preOrderItems.length > 0 && (
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Tổng tiền đặt trước:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Đặt bàn
        </Button>
      </div>
    </form>
  );
}
