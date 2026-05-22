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
import {
  useBookingsWithPaginationQuery,
  BookingStatus,
} from '@/features/booking';
import ReservationManagementTable from '@/components/reservation/ReservationManagementTable';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const limit = 10;

  const { data, isLoading, isError } = useBookingsWithPaginationQuery({
    search: debouncedSearchTerm || undefined,
    status: status !== 'ALL' ? status : undefined,
    page,
    limit,
  });

  const bookings = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as BookingStatus | 'ALL');
    setPage(1);
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Reservations Management
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
              placeholder="Search reservations by customer name or phone..."
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
                <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={BookingStatus.CONFIRMED}>
                  Confirmed
                </SelectItem>
                <SelectItem value={BookingStatus.CANCELLED}>
                  Cancelled
                </SelectItem>
                <SelectItem value={BookingStatus.COMPLETED}>
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading reservations...</div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading reservations
        </div>
      ) : (
        <>
          <ReservationManagementTable bookings={bookings} />

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-end mt-6">
              <EllipsisPagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReservationsPage;
