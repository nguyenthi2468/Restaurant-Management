'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Booking, BookingStatus, DepositStatus } from '@/features/booking';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { format } from 'date-fns';

interface ReservationManagementTableProps {
  bookings: Booking[];
}

const getStatusBadge = (status: BookingStatus) => {
  const statusConfig = {
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

  const config = statusConfig[status];
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
};

const getDepositStatusBadge = (status: DepositStatus) => {
  const statusConfig = {
    [DepositStatus.PENDING]: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800',
    },
    [DepositStatus.PAID]: {
      label: 'Paid',
      className: 'bg-green-100 text-green-800',
    },
    [DepositStatus.REFUNDED]: {
      label: 'Refunded',
      className: 'bg-blue-100 text-blue-800',
    },
    [DepositStatus.WAIVED]: {
      label: 'Waived',
      className: 'bg-gray-100 text-gray-800',
    },
  };

  const config = statusConfig[status];
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
};

function ReservationManagementTable({
  bookings,
}: ReservationManagementTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Customer Name</TableHead>
            <TableHead className="text-foreground">Phone</TableHead>
            <TableHead className="text-foreground">Booking Time</TableHead>
            <TableHead className="text-foreground">Guests</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Deposit Status</TableHead>
            <TableHead className="text-foreground flex justify-end">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className="border-b border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="text-foreground font-medium">
                {booking.customerName}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {booking.customerPhone}
              </TableCell>
              <TableCell className="text-foreground">
                {format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell className="text-foreground">
                <div className="flex flex-col">
                  <span>{booking.numberOfGuests} adults</span>
                  {booking.numberOfChildren > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {booking.numberOfChildren} children
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {getStatusBadge(booking.status)}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {getDepositStatusBadge(booking.depositStatus)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Link href={`${ROUTES.ADMIN_RESERVATIONS}/${booking.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => handleViewDetails(booking)}
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Edit2 size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reservations found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Customer Name
                  </h3>
                  <p className="text-foreground">
                    {selectedBooking.customerName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Phone Number
                  </h3>
                  <p className="text-foreground">
                    {selectedBooking.customerPhone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Booking Time
                  </h3>
                  <p className="text-foreground">
                    {format(
                      new Date(selectedBooking.bookingTime),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    End Time
                  </h3>
                  <p className="text-foreground">
                    {format(
                      new Date(selectedBooking.endTime),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Number of Guests
                  </h3>
                  <p className="text-foreground">
                    {selectedBooking.numberOfGuests} adults
                    {selectedBooking.numberOfChildren > 0 &&
                      `, ${selectedBooking.numberOfChildren} children`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Status
                  </h3>
                  <div>{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Deposit Amount
                  </h3>
                  <p className="text-foreground">
                    {Number(selectedBooking.depositAmount).toLocaleString(
                      'vi-VN',
                    )}{' '}
                    VND
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Deposit Status
                  </h3>
                  <div>
                    {getDepositStatusBadge(selectedBooking.depositStatus)}
                  </div>
                </div>
              </div>

              {selectedBooking.note && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Note
                  </h3>
                  <p className="text-foreground">{selectedBooking.note}</p>
                </div>
              )}

              {selectedBooking.bookingTables &&
                selectedBooking.bookingTables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Tables
                    </h3>
                    <div className="space-y-2">
                      {selectedBooking.bookingTables.map((bt) => (
                        <div
                          key={bt.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-foreground">
                            {bt.table?.name || 'Unknown Table'}
                          </span>
                          {bt.table?.floor && (
                            <span className="text-muted-foreground">
                              ({bt.table.floor.name} - {bt.table.seats} seats)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedBooking.preOrderItems &&
                selectedBooking.preOrderItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Pre-ordered Items
                    </h3>
                    <div className="space-y-2">
                      {selectedBooking.preOrderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-foreground">
                            {item.menuItem?.name || 'Unknown Item'} x{' '}
                            {item.quantity}
                          </span>
                          <span className="text-foreground">
                            {Number(item.price).toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Created At
                  </h3>
                  <p className="text-foreground text-sm">
                    {format(
                      new Date(selectedBooking.createdAt),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Updated At
                  </h3>
                  <p className="text-foreground text-sm">
                    {format(
                      new Date(selectedBooking.updatedAt),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ReservationManagementTable;
