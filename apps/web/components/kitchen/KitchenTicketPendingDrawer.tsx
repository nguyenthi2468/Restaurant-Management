'use client';

import { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  useGetKitchenTicketsQuery,
  useAcceptKitchenTicketMutation,
  useDeleteKitchenTicketMutation,
  KitchenTicketStatus,
  KitchenTicket,
} from '@/features/kitchen';
import { formatDistanceToNow } from 'date-fns';

interface KitchenTicketPendingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketsPending?: KitchenTicket[];
  isLoading?: boolean;
}

export function KitchenTicketPendingDrawer({
  open,
  onOpenChange,
  ticketsPending = [],
  isLoading,
}: KitchenTicketPendingDrawerProps) {
  const acceptMutation = useAcceptKitchenTicketMutation();
  const cancelMutation = useDeleteKitchenTicketMutation();

  const handleApprove = async (ticketId: string) => {
    try {
      await acceptMutation.mutateAsync(ticketId);
    } catch (error) {
      console.error('Error approving ticket:', error);
    }
  };

  const handleCancel = async (ticketId: string) => {
    try {
      await cancelMutation.mutateAsync(ticketId);
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction='right'>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Đơn chờ xác nhận</DrawerTitle>
          <DrawerDescription>
            Danh sách các đơn hàng đang chờ xác nhận từ bếp
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-[60vh] px-4 pb-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-gray-400">
              Đang tải...
            </div>
          ) : !ticketsPending || ticketsPending.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-400">
              Không có đơn chờ xác nhận
            </div>
          ) : (
            <div className="space-y-4">
              {ticketsPending.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Bàn {ticket.orderId}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="size-4" />
                        <span>
                          {formatDistanceToNow(new Date(ticket.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(ticket.id)}
                        disabled={
                          cancelMutation.isPending || acceptMutation.isPending
                        }
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <X className="mr-1 size-4" />
                        Hủy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(ticket.id)}
                        disabled={
                          acceptMutation.isPending || cancelMutation.isPending
                        }
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        <Check className="mr-1 size-4" />
                        Xác nhận
                      </Button>
                    </div>
                  </div>

                  {ticket.note && (
                    <div className="mb-3 rounded bg-yellow-50 p-2 text-sm text-gray-700">
                      <span className="font-medium">Ghi chú:</span>{' '}
                      {ticket.note}
                    </div>
                  )}

                  {ticket.items && ticket.items.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        Món ăn:
                      </div>
                      {ticket.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {item.quantity}x
                            </span>
                            <span className="text-gray-700">
                              {item.orderItem?.menuItem?.name || 'Unknown Item'}
                            </span>
                          </div>
                          {item.note && (
                            <span className="text-xs text-gray-500">
                              {item.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
