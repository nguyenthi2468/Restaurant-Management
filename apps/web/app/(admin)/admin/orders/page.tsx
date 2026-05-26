'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetOrdersQuery, OrderStatus } from '@/features/orders';
import OrderManagementTable from '@/components/orders/OrderManagementTable';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const limit = 10;

  const { data, isLoading, isError } = useGetOrdersQuery({
    search: debouncedSearchTerm || undefined,
    status: status !== 'ALL' ? status : undefined,
    page,
    limit,
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as OrderStatus | 'ALL');
    setPage(1);
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Orders Management
        </h1>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search orders by customer name or phone..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value={OrderStatus.SERVED}>Served</SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading orders...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading orders
        </div>
      ) : (
        <>
          <OrderManagementTable orders={orders} />

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-end mt-6">
              <EllipsisPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OrdersPage;
