'use client';

import { useState } from 'react';
import { ChevronRight, ChevronsRight, Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  KitchenTicketItem,
  useGetKitchenTicketsQuery,
  useUpdateKitchenTicketItemStatusMutation,
} from '@/features/kitchen';
import { KitchenItemStatus } from '@/features/kitchen';
import { formatDistanceToNow } from 'date-fns';
import { usePusherChannel } from '@/hooks/usePusherChannel';
import { useQueryClient } from '@tanstack/react-query';
interface TransformationData {
  pendingItems: any[];
  completedItems: any[];
}

const transformKitchenTickets = (tickets: any[]): TransformationData => {
  const pendingItems: any[] = [];
  const completedItems: any[] = [];

  tickets.forEach((ticket) => {
    if (ticket.items && ticket.items.length > 0) {
      ticket.items.forEach((item: any) => {
        const transformedItem = {
          id: item.id,
          name: item.orderItem?.menuItem?.name || 'Unknown Item',
          quantity: item.quantity,
          tableName: `Bàn ${ticket.orderId}`,
          time: `${ticket.createdAt}`,
          elapsedTime: item.completedAt
            ? formatDistanceToNow(new Date(item.completedAt), {
                addSuffix: true,
              })
            : formatDistanceToNow(new Date(ticket.createdAt), {
                addSuffix: true,
              }),
          status:
            item.status === KitchenItemStatus.READY ||
            item.status === KitchenItemStatus.SERVED
              ? ('completed' as const)
              : ('pending' as const),
        };

        if (transformedItem.status === 'completed') {
          completedItems.push(transformedItem);
        } else {
          pendingItems.push(transformedItem);
        }
      });
    }
  });

  return { pendingItems, completedItems };
};

export default function KitchenPage() {
  const { data: tickets, isLoading } = useGetKitchenTicketsQuery();
  const mutation = useUpdateKitchenTicketItemStatusMutation();
  const queryClient = useQueryClient();

  usePusherChannel('kitchen-channel', 'ticket-created', () => {
    queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
    new Audio('/audio/kichen_bell.mp3').play().catch(() => {});
  });

  usePusherChannel('kitchen-channel', 'ticket-item-updated', () => {
    queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
    new Audio('/audio/kichen_bell.mp3').play().catch(() => {});
  });

  const { pendingItems, completedItems } = transformKitchenTickets(
    tickets || [],
  );

  const moveToCompleted = (item: KitchenTicketItem) => {
    mutation.mutate({
      itemId: item.id,
      status: KitchenItemStatus.READY,
    });
  };

  const moveToPending = (item: KitchenTicketItem) => {
    mutation.mutate({
      itemId: item.id,
      status: KitchenItemStatus.PENDING,
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#003d8f]">
      {/* Top Bar */}
      <div className="flex h-12 shrink-0 items-center justify-between px-4 text-white">
        <div className="w-1/3">
          <h2 className="text-lg font-semibold">Chờ chế biến</h2>
        </div>

        <div className="flex w-1/3 items-center justify-end gap-3">
          <h2 className="mr-auto text-lg font-semibold">
            Đã xong/ Chờ cung ứng
          </h2>
        </div>
      </div>

      {/* Main Content Panels */}
      <div className="flex flex-1 gap-2 overflow-hidden px-2 pb-2">
        {/* Left Panel - Pending */}
        <div className="flex flex-1 flex-col rounded-t-lg bg-white">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {pendingItems.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-gray-400">
                  Không có món chờ chế biến
                </div>
              ) : (
                pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-lg font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <span className="text-base font-semibold text-gray-900">
                          {item.name}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.time}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-medium text-gray-700">
                        {item.tableName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.elapsedTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveToCompleted(item)}
                          className="flex size-8 items-center justify-center rounded-full border border-pink-500 text-pink-500 transition-colors hover:bg-pink-50"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                        <button
                          onClick={() => moveToCompleted(item)}
                          className="flex size-8 items-center justify-center rounded-full bg-pink-500 text-white transition-colors hover:bg-pink-600"
                        >
                          <ChevronsRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Completed */}
        <div className="flex flex-1 flex-col rounded-t-lg bg-white">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {completedItems.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-gray-400">
                  Không có món đã xong
                </div>
              ) : (
                completedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-lg font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <span className="text-base font-semibold text-gray-900">
                          {item.name}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.time} - {item.staffName}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-medium text-gray-700">
                        {item.tableName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.elapsedTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveToPending(item)}
                          className="flex size-8 items-center justify-center rounded-full border border-green-600 text-green-600 transition-colors hover:bg-green-50"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                        <button
                          onClick={() => moveToPending(item)}
                          className="flex size-8 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700"
                        >
                          <ChevronsRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
