'use client';

import { useState } from 'react';
import { ChevronRight, ChevronsRight, Bell, Volume2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KitchenTicketPendingDrawer } from '@/components/kitchen/KitchenTicketPendingDrawer';
import {
  KitchenItemStatus,
  KitchenTicketStatus,
  useGetKitchenTicketItemsByStatusQuery,
  useGetKitchenTicketsQuery,
  useUpdateKitchenTicketItemStatusMutation,
} from '@/features/kitchen';
import { formatDistanceToNow } from 'date-fns';
import { usePusherChannel } from '@/hooks/usePusherChannel';
import { useQueryClient } from '@tanstack/react-query';

export default function KitchenPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: itemsCooking, isLoading: isLoadingCookingItems } =
    useGetKitchenTicketItemsByStatusQuery(KitchenItemStatus.COOKING);
  const { data: itemsReady, isLoading: isLoadingReadyItems } =
    useGetKitchenTicketItemsByStatusQuery(KitchenItemStatus.READY);
  const { data: ticketsPending, isLoading: isLoadingPending } =
    useGetKitchenTicketsQuery(KitchenTicketStatus.PENDING);
  const mutation = useUpdateKitchenTicketItemStatusMutation();
  const queryClient = useQueryClient();

  usePusherChannel('kitchen-channel', 'ticket-created', () => {
    queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
    const audio = new Audio('/audio/kichen_bell.mp3');
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  });

  usePusherChannel('kitchen-channel', 'ticket-item-updated', () => {
    queryClient.invalidateQueries({ queryKey: ['kitchen-tickets'] });
    const audio = new Audio('/audio/kichen_bell.mp3');
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  });

  const playBellSound = () => {
    const audio = new Audio('/audio/kichen_bell.mp3');
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  };

  const moveToCompleted = (item: any) => {
    mutation.mutate({
      itemId: item.id,
      status: KitchenItemStatus.READY,
    });
  };

  const moveToServed = (item: any) => {
    mutation.mutate({
      itemId: item.id,
      status: KitchenItemStatus.SERVED,
    });
  };

  const moveToCancelled = (item: any) => {
    mutation.mutate({
      itemId: item.id,
      status: KitchenItemStatus.CANCELLED,
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#003d8f]">
      {/* Top Bar */}
      <div className="flex h-12 shrink-0 items-center justify-between px-4 text-white">
        <div className="w-1/3">
          <h2 className="text-lg font-semibold">Chờ chế biến</h2>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={playBellSound}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        <div className="flex w-1/3 items-center justify-end gap-3">
          <h2 className="mr-auto text-lg font-semibold">
            Đã xong/ Chờ cung ứng
          </h2>
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            <div className="relative">
              <Bell className="size-5" />
              {ticketsPending && ticketsPending.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-lg">
                  {ticketsPending.length > 99 ? '99+' : ticketsPending.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Panels */}
      <div className="flex flex-1 gap-2 overflow-hidden px-2 pb-2">
        {/* Left Panel - Cooking */}
        <div className="flex flex-1 flex-col rounded-t-lg bg-white">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {itemsCooking?.length === 0? (
                <div className="flex h-40 items-center justify-center text-gray-400">
                  Không có món chờ chế biến
                </div>
              ) : (
                <>
                  {[...(itemsCooking || [])].map(
                    (item) => (
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
                              {item.orderItem?.menuItem?.name || 'Unknown Item'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {item.ticketId}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm font-medium text-gray-700">
                            Bàn {item.orderItem?.order?.id}
                          </div>

                          <div className="flex items-center justify-between gap-2 w-full">
                            <button
                              onClick={() => moveToCancelled(item)}
                              className="flex items-center gap-2 rounded-full border border-red-500 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:border-red-600 active:scale-95"
                            >
                              Huỷ
                            </button>
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
                      </div>
                    ),
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Completed */}
        <div className="flex flex-1 flex-col rounded-t-lg bg-white">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {itemsReady?.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-gray-400">
                  Không có món đã xong
                </div>
              ) : (
                (itemsReady || []).map((item) => (
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
                          {item.orderItem?.menuItem?.name || 'Unknown Item'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.ticketId}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-medium text-gray-700">
                        Bàn {item.orderItem?.order?.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveToServed(item)}
                          className="flex size-8 items-center justify-center rounded-full border border-green-600 text-green-600 transition-colors hover:bg-green-50"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                        <button
                          onClick={() => moveToServed(item)}
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

      <KitchenTicketPendingDrawer
        open={drawerOpen}
        ticketsPending={ticketsPending}
        onOpenChange={setDrawerOpen}
        isLoading={isLoadingPending}
      />
    </div>
  );
}
