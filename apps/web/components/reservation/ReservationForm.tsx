'use client';

import toast from 'react-hot-toast';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import {
  bookingFormSchema,
  BookingFormValues,
} from '@/features/booking/validator';
import { useCreateBookingMutation } from '@/features/booking/mutations';
import {
  useCountAvailableTablesQuery,
  useCheckAvailableTablesQuery,
} from '@/features/tables/queries';
import { useFloorsQuery } from '@/features/floor/queries';
import {
  useMenuItemsQuery,
  useMenuItemsWithPaginationQuery,
} from '@/features/menu-items/queries';
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

const getMinimumBookingTime = (): Date => {
  const now = new Date();
  const minimumTime = new Date(
    Math.max(
      now.getTime() + 3 * 60 * 60 * 1000,
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        8,
        0,
        0,
      ).getTime(),
    ),
  );
  if (minimumTime.getHours() >= 22) {
    const nextDay = new Date(minimumTime);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(8, 0, 0, 0);
    return nextDay;
  }
  return minimumTime;
};

const isBookingTimeTooEarly = (date: Date): boolean => {
  const now = new Date();
  const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return date < threeHoursLater;
};

const isBookingTimeAllowed = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 8 && hours < 22;
};

export function ReservationForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const [showTableSelection, setShowTableSelection] = useState(false);
  const router = useRouter();
  const createBookingMutation = useCreateBookingMutation();
  const { data: floors = [], isLoading: floorsLoading } = useFloorsQuery();
  const { data: menuItemsData, isLoading: menuItemsLoading } =
    useMenuItemsWithPaginationQuery({
      page: 1,
      limit: 10,
    });
  const menuItems = menuItemsData?.data || [];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema) as never,
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      bookingTime: undefined,
      numberOfGuests: 1,
      numberOfChildren: 0,
      note: '',
      tables: [],
      preOrderItems: [],
    },
  });
  const numberOfGuests = form.watch('numberOfGuests') || 1;
  const numberOfChildren = form.watch('numberOfChildren') || 0;
  const totalPersons = numberOfGuests + numberOfChildren;
  const bookingTime = form.watch('bookingTime');
  const { data: allTables = [], isLoading: tablesLoading } =
    useCheckAvailableTablesQuery({
      floorId: selectedFloorId,
      bookingTime: bookingTime?.toISOString() || '',
    });

  useEffect(() => {
    if (floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  const { data: availableTablesCount, isSuccess: isCountSuccess } =
    useCountAvailableTablesQuery(
      {
        floorId: selectedFloorId,
        bookingTime: bookingTime?.toISOString() || '',
      },
      {
        enabled: !!bookingTime,
      },
    );
  useEffect(() => {
    if (bookingTime && isCountSuccess && availableTablesCount) {
      const count = (availableTablesCount as { count: number }).count || 0;
      if (count === 0) {
        toast.error('Không có bàn nào khả dụng cho thời gian này');
        setShowTableSelection(false);
      } else {
        setShowTableSelection(true);
      }
    } else if (!bookingTime) {
      setShowTableSelection(false);
    }
  }, [bookingTime, isCountSuccess, availableTablesCount]);

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

    const remainingSeats = totalPersons - currentSeats;

    // Kiểm tra ngay từ bàn đầu tiên, bỏ điều kiện currentTables.length > 0
    if (newTable.seats > remainingSeats) {
      const selectedTableIds = currentTables.map((t) => t.tableId);
      const hasAlternative = allTables.some(
        (t) =>
          !selectedTableIds.includes(t.id) &&
          t.id !== tableId &&
          t.seats <= remainingSeats &&
          t.seats > 0,
      );

      if (hasAlternative) {
        toast.error(
          `Còn bàn phù hợp hơn cho ${remainingSeats} chỗ còn lại. Vui lòng chọn bàn nhỏ hơn.`,
        );
        return; // ← chặn
      }

      // Không còn bàn phù hợp hơn → cảnh báo nhưng vẫn cho chọn
      // toast.error(
      //   `Không có bàn ${remainingSeats} chỗ, hệ thống chọn bàn ${newTable.seats} chỗ thay thế.`,
      // );
      // Không return → tiếp tục setValue
    }

    // Chặn khi đã đủ hoặc vượt quá số người
    if (currentSeats >= totalPersons) {
      toast.error(`Đã đủ ${totalPersons} người, không thể chọn thêm bàn.`);
      return; // ← chặn
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
            name="customerEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerEmail">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="Nhập email"
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
                    min={format(getMinimumBookingTime(), "yyyy-MM-dd'T'HH:mm")}
                    value={
                      field.value
                        ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      if (isBookingTimeTooEarly(selectedDate)) {
                        toast.error(
                          'Không thể chọn thời gian quá sớm (phải ít nhất 3 tiếng nữa)',
                        );
                        return;
                      }
                      if (!isBookingTimeAllowed(selectedDate)) {
                        toast.error('Chỉ có thể đặt bàn từ 8:00 đến 22:00');
                        return;
                      }
                      field.onChange(selectedDate);
                    }}
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

      {showTableSelection && (
        <>
          <FieldGroup>
            <Field>
              <FieldLabel>Chọn tầng</FieldLabel>
              {floorsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <Select
                  value={selectedFloorId}
                  onValueChange={setSelectedFloorId}
                >
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
                  {allTables.map((table) => (
                    <div key={table.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`table-${table.id}`}
                        checked={selectedTables.some(
                          (t) => t.tableId === table.id,
                        )}
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
                                  handleMenuItemToggle(
                                    menuItem.id,
                                    menuItem.price,
                                  )
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
                        <span className="font-semibold">
                          Tổng tiền đặt trước:
                        </span>
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
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Đặt bàn
        </Button>
      </div>
    </form>
  );
}
