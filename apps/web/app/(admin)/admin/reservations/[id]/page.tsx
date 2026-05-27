'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBookingQuery, useNoShowBookingMutation } from '@/features/booking';
import {
  useUpdateBookingMutation,
  useApproveDepositMutation,
  useMarkArrivedMutation,
  useCompleteBookingMutation,
  useCancelBookingMutation,
} from '@/features/booking';
import { useTablesQueryWithPagination } from '@/features/tables/queries';
import { useMenuItemsWithPaginationQuery } from '@/features/menu-items/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ROUTES } from '@/constants';
import { BookingStatus, DepositStatus } from '@/features/booking';
import { formatCurrency } from '@/utils/currency';
import { TableStatus } from '@/features/tables';
import { PaymentStatus, PaymentMethod } from '@/features/payments';

const updateBookingSchema = z.object({
  endTime: z.string().min(1, 'End time is required'),
  numberOfGuests: z.number().min(1, 'At least 1 guest required'),
  numberOfChildren: z.number().min(0, 'Cannot be negative'),
  tables: z.array(z.string()).min(1, 'At least one table required'),
  preOrderItems: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    }),
  ),
});

type UpdateBookingFormValues = z.infer<typeof updateBookingSchema>;

export default function BookingEditPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { data: booking, isLoading, isError } = useBookingQuery(bookingId);
  const { data: tablesData } = useTablesQueryWithPagination({
    page: 1,
    limit: 20,
    status: TableStatus.AVAILABLE,
  });
  const { data: menuItemsData } = useMenuItemsWithPaginationQuery({
    page: 1,
    limit: 20,
  });

  const updateMutation = useUpdateBookingMutation();
  const approveDepositMutation = useApproveDepositMutation();
  const markArrivedMutation = useMarkArrivedMutation();
  const noShowMutation = useNoShowBookingMutation();
  const completeMutation = useCompleteBookingMutation();
  const cancelMutation = useCancelBookingMutation();

  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<
    Array<{
      menuItemId: string;
      quantity: number;
      price: number;
    }>
  >([]);

  const tables = tablesData?.data || [];
  const menuItems = menuItemsData?.data || [];
  const form = useForm<UpdateBookingFormValues>({
    resolver: zodResolver(updateBookingSchema),
    defaultValues: {
      endTime: '',
      numberOfGuests: 1,
      numberOfChildren: 0,
      tables: [],
      preOrderItems: [],
    },
  });

  useEffect(() => {
    if (booking) {
      const endTimeFormatted = format(
        new Date(booking.endTime),
        "yyyy-MM-dd'T'HH:mm",
      );
      form.setValue('endTime', endTimeFormatted);
      form.setValue('numberOfGuests', booking.numberOfGuests);
      form.setValue('numberOfChildren', booking.numberOfChildren);

      const tableIds = booking.bookingTables?.map((bt) => bt.tableId) || [];
      setSelectedTables(tableIds);
      form.setValue('tables', tableIds);

      const items =
        booking.preOrderItems?.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: Number(item.price),
        })) || [];
      setSelectedMenuItems(items);
      form.setValue('preOrderItems', items);
    }
  }, [booking, form]);

  const handleNoShow = () => {
    noShowMutation.mutate(bookingId);
  };

  const handleTableToggle = (tableId: string) => {
    const newTables = selectedTables.includes(tableId)
      ? selectedTables.filter((id) => id !== tableId)
      : [...selectedTables, tableId];
    setSelectedTables(newTables);
    form.setValue('tables', newTables);
  };

  const handleMenuItemToggle = (menuItemId: string, price: number) => {
    const existingItem = selectedMenuItems.find(
      (item) => item.menuItemId === menuItemId,
    );
    if (existingItem) {
      const newItems = selectedMenuItems.filter(
        (item) => item.menuItemId !== menuItemId,
      );
      setSelectedMenuItems(newItems);
      form.setValue('preOrderItems', newItems);
    } else {
      const newItems = [
        ...selectedMenuItems,
        { menuItemId, quantity: 1, price },
      ];
      setSelectedMenuItems(newItems);
      form.setValue('preOrderItems', newItems);
    }
  };

  const handleQuantityChange = (menuItemId: string, quantity: number) => {
    const newItems = selectedMenuItems.map((item) =>
      item.menuItemId === menuItemId ? { ...item, quantity } : item,
    );
    setSelectedMenuItems(newItems);
    form.setValue('preOrderItems', newItems);
  };

  const onSubmit = async (data: UpdateBookingFormValues) => {
    const updateData = {
      endTime: new Date(data.endTime).toISOString(),
      numberOfGuests: data.numberOfGuests,
      numberOfChildren: data.numberOfChildren,
      tables: data.tables.map((tableId) => ({ tableId })),
      preOrderItems: data.preOrderItems,
    };

    updateMutation.mutate(
      { id: bookingId, data: updateData },
      {
        onSuccess: () => {
          router.push(ROUTES.ADMIN_RESERVATIONS);
        },
      },
    );
  };

  const handleApproveDeposit = () => {
    approveDepositMutation.mutate(bookingId);
  };

  const handleMarkArrived = () => {
    markArrivedMutation.mutate(bookingId);
  };

  const handleComplete = () => {
    completeMutation.mutate(bookingId);
  };

  const handleCancel = () => {
    cancelMutation.mutate(bookingId, {
      onSuccess: () => {
        router.push(ROUTES.ADMIN_RESERVATIONS);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">Failed to load booking</p>
        <Button onClick={() => router.push(ROUTES.ADMIN_RESERVATIONS)}>
          Back to Reservations
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: BookingStatus) => {
    const config = {
      [BookingStatus.PENDING]: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
      },
      [BookingStatus.CONFIRMED]: {
        label: 'Confirmed',
        className: 'bg-blue-100 text-blue-800',
      },
      [BookingStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800',
      },
      [BookingStatus.COMPLETED]: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800',
      },
      [BookingStatus.NO_SHOW]: {
        label: 'No Show',
        className: 'bg-gray-100 text-gray-800',
      },
    };
    const { label, className } = config[status];
    return (
      <span className={`px-3 py-1 text-sm rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(ROUTES.ADMIN_RESERVATIONS)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Booking</h1>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Time</p>
                  <p className="font-medium">
                    {format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deposit</p>
                  <p className="font-medium">
                    {formatCurrency(Number(booking.depositAmount))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Edit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup>
                  <Controller
                    name="endTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>End Time</FieldLabel>
                        <Input
                          type="datetime-local"
                          {...field}
                          className={
                            fieldState.error ? 'border-destructive' : ''
                          }
                        />
                        {fieldState.error && (
                          <p className="text-sm text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Controller
                      name="numberOfGuests"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Number of Adults</FieldLabel>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className={
                              fieldState.error ? 'border-destructive' : ''
                            }
                          />
                          {fieldState.error && (
                            <p className="text-sm text-destructive">
                              {fieldState.error.message}
                            </p>
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
                        <Field>
                          <FieldLabel>Number of Children</FieldLabel>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className={
                              fieldState.error ? 'border-destructive' : ''
                            }
                          />
                          {fieldState.error && (
                            <p className="text-sm text-destructive">
                              {fieldState.error.message}
                            </p>
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>

                <div>
                  <FieldLabel>Select Tables</FieldLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {tables?.map((table) => (
                      <div
                        key={table.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`table-${table.id}`}
                          checked={selectedTables.includes(table.id)}
                          onCheckedChange={() => handleTableToggle(table.id)}
                        />
                        <Label
                          htmlFor={`table-${table.id}`}
                          className="cursor-pointer"
                        >
                          {table.name} ({table.seats} seats)
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.tables && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.tables.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>Pre-order Menu Items</FieldLabel>
                  <div className="space-y-3 mt-2">
                    {menuItems?.map((item) => {
                      const selectedItem = selectedMenuItems.find(
                        (si) => si.menuItemId === item.id,
                      );
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`menu-${item.id}`}
                            checked={!!selectedItem}
                            onCheckedChange={() =>
                              handleMenuItemToggle(item.id, Number(item.price))
                            }
                          />
                          <Label
                            htmlFor={`menu-${item.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {item.name} - {formatCurrency(Number(item.price))}
                          </Label>
                          {selectedItem && (
                            <Input
                              type="number"
                              min="1"
                              value={selectedItem.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-20"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.depositStatus === DepositStatus.PENDING && (
                <Button
                  onClick={handleApproveDeposit}
                  disabled={approveDepositMutation.isPending}
                  className="w-full"
                  variant="outline"
                >
                  {approveDepositMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Approve Deposit
                </Button>
              )}

              {booking.status === BookingStatus.PENDING && (
                <Button
                  onClick={handleMarkArrived}
                  disabled={markArrivedMutation.isPending}
                  className="w-full"
                >
                  {markArrivedMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Confirm Booking
                </Button>
              )}

              {booking.status === BookingStatus.CONFIRMED && (
                <div className="w-full">
                  <Button
                    onClick={handleNoShow}
                    disabled={noShowMutation.isPending}
                    className="w-full"
                  >
                    {noShowMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    No-Show
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={completeMutation.isPending}
                    className="w-full"
                  >
                    {completeMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Mark as Completed
                  </Button>
                </div>
              )}

              {(booking.status === BookingStatus.PENDING ||
                booking.status === BookingStatus.CONFIRMED) && (
                <Button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="w-full"
                  variant="destructive"
                >
                  {cancelMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>

          {booking.payment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Transaction Code
                    </span>
                    <span className="text-sm font-medium">
                      {booking.payment.transactionCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(booking.payment.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Method
                    </span>
                    <span className="text-sm font-medium">
                      {booking.payment.method === PaymentMethod.CASH
                        ? 'Cash'
                        : 'VNPay'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        booking.payment.status === PaymentStatus.SUCCESS
                          ? 'text-green-600'
                          : booking.payment.status === PaymentStatus.FAILED
                            ? 'text-red-600'
                            : booking.payment.status === PaymentStatus.REFUNDED
                              ? 'text-blue-600'
                              : 'text-yellow-600'
                      }`}
                    >
                      {booking.payment.status === PaymentStatus.SUCCESS
                        ? 'Success'
                        : booking.payment.status === PaymentStatus.FAILED
                          ? 'Failed'
                          : booking.payment.status === PaymentStatus.REFUNDED
                            ? 'Refunded'
                            : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Date
                    </span>
                    <span className="text-sm font-medium">
                      {format(
                        new Date(booking.payment.createdAt),
                        'dd/MM/yyyy HH:mm',
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
