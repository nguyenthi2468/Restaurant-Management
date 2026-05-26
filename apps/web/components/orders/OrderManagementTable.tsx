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
import { Button } from '@/components/ui/button';
import { Edit2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Order, OrderStatus } from '@/features/orders';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/currency';

interface OrderManagementTableProps {
  orders: Order[];
}

const getStatusBadge = (status: OrderStatus) => {
  const statusConfig = {
    [OrderStatus.PENDING]: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800',
    },
    [OrderStatus.SERVED]: {
      label: 'Served',
      className: 'bg-blue-100 text-blue-800',
    },
    [OrderStatus.COMPLETED]: {
      label: 'Completed',
      className: 'bg-green-100 text-green-800',
    },
    [OrderStatus.CANCELLED]: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-800',
    },
  };

  const config = statusConfig[status];
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
};

function OrderManagementTable({ orders }: OrderManagementTableProps) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Order ID</TableHead>
            <TableHead className="text-foreground">Customer Name</TableHead>
            <TableHead className="text-foreground">Phone</TableHead>
            <TableHead className="text-foreground">Order Time</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Total</TableHead>
            <TableHead className="text-foreground flex justify-end">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="border-b border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="text-foreground font-medium">
                #{order.id}
              </TableCell>
              <TableCell className="text-foreground">
                {order.customerName || 'N/A'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {order.customerPhone || 'N/A'}
              </TableCell>
              <TableCell className="text-foreground">
                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {getStatusBadge(order.status)}
              </TableCell>
              <TableCell className="text-foreground font-semibold">
                {formatCurrency(Number(order.total))}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Link href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                     <Eye size={16} />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Edit2 size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
    </Card>
  );
}

export default OrderManagementTable;
