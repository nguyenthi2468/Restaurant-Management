'use client';

import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, CheckCircle2, XCircle, ChefHat } from 'lucide-react';
import { useGetKitchenTicketsByOrderIdQuery } from '@/features/kitchen/queries';
import {
  KitchenTicketStatus,
  KitchenItemStatus,
} from '@/features/kitchen/types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface HistoryKitchenTicketDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number | null;
}

const statusConfig = {
  [KitchenTicketStatus.PENDING]: {
    label: 'Chờ xử lý',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-slate-600',
  },
  [KitchenTicketStatus.ACCEPTED]: {
    label: 'Đang chế biến',
    variant: 'default' as const,
    icon: ChefHat,
    color: 'text-blue-600',
  },
  [KitchenTicketStatus.SERVED]: {
    label: 'Đã phục vụ',
    variant: 'outline' as const,
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  [KitchenTicketStatus.CANCELLED]: {
    label: 'Đã hủy',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-red-600',
  },
};

const itemStatusConfig = {
  [KitchenItemStatus.PENDING]: {
    label: 'Chờ',
    color: 'bg-slate-100 text-slate-700',
  },
  [KitchenItemStatus.COOKING]: {
    label: 'Đang nấu',
    color: 'bg-blue-100 text-blue-700',
  },
  [KitchenItemStatus.READY]: {
    label: 'Sẵn sàng',
    color: 'bg-green-100 text-green-700',
  },
  [KitchenItemStatus.SERVED]: {
    label: 'Đã phục vụ',
    color: 'bg-gray-100 text-gray-700',
  },
  [KitchenItemStatus.CANCELLED]: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-700',
  },
};

export function HistoryKitchenTicketDrawer({
  open,
  onOpenChange,
  orderId,
}: HistoryKitchenTicketDrawerProps) {
  const { data: tickets, isLoading } = useGetKitchenTicketsByOrderIdQuery(
    orderId || 0,
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction='right'>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Lịch sử phiếu bếp</DrawerTitle>
          <DrawerDescription>
            Xem lịch sử các phiếu bếp của đơn hàng #{orderId}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ChefHat size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có phiếu bếp nào cho đơn hàng này</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const statusInfo = statusConfig[ticket.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={ticket.id}
                    className="border border-slate-200 rounded-lg p-4 bg-white space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">
                            Phiếu
                          </span>
                          <span className="font-mono text-sm font-semibold text-slate-900">
                            #{ticket.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} className={statusInfo.color} />
                          <Badge
                            variant={statusInfo.variant}
                            className="text-xs"
                          >
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right text-xs text-slate-500 space-y-1">
                        {ticket.sentAt && (
                          <div>
                            Gửi:{' '}
                            {formatDistanceToNow(new Date(ticket.sentAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </div>
                        )}
                        {ticket.acceptedAt && (
                          <div>
                            Nhận:{' '}
                            {formatDistanceToNow(new Date(ticket.acceptedAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </div>
                        )}
                        {ticket.completedAt && (
                          <div>
                            Hoàn thành:{' '}
                            {formatDistanceToNow(new Date(ticket.completedAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {ticket.note && (
                      <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded p-2">
                        <span className="font-medium">Ghi chú:</span>{' '}
                        {ticket.note}
                      </div>
                    )}

                    {ticket.items && ticket.items.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-slate-700">
                          Món ăn ({ticket.items.length})
                        </div>
                        <div className="space-y-1.5">
                          {ticket.items.map((item) => {
                            const itemStatus = itemStatusConfig[item.status];
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm bg-slate-50 rounded p-2"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-slate-900">
                                    {item.orderItem?.menuItem?.name || 'N/A'}
                                  </div>
                                  {item.note && (
                                    <div className="text-xs text-slate-500 mt-0.5">
                                      {item.note}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-slate-600">
                                    x{item.quantity}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${itemStatus.color}`}
                                  >
                                    {itemStatus.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
