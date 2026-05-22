import { useQuery } from '@tanstack/react-query';
import { getBookings, getBookingById, getBookingsWithPagination } from './api';
import { BookingQueryParams } from './types';

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
