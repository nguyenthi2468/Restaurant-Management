import { useQuery } from '@tanstack/react-query';
import {
  getBookings,
  getBookingById,
  getBookingsWithPagination,
  getBookingsByTableId,
} from './api';
import { BookingQueryParams, QueryBookingByTableParams } from './types';

export const useBookingsQuery = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
  });
};

export const useBookingsWithPaginationQuery = (params?: BookingQueryParams) => {
  return useQuery({
    queryKey: ['bookings', 'paginated', params],
    queryFn: () => getBookingsWithPagination(params),
  });
};

export const useBookingQuery = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
};

export const useBookingsByTableIdQuery = (
  tableId: string,
  params?: QueryBookingByTableParams,
) => {
  return useQuery({
    queryKey: ['bookings', 'table', tableId, params],
    queryFn: () => getBookingsByTableId(tableId, params),
    enabled: !!tableId,
  });
};
