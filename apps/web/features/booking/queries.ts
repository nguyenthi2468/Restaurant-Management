import { useQuery } from '@tanstack/react-query';
import { getBookings, getBookingById } from './api';

export const useBookingsQuery = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
  });
};

export const useBookingQuery = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
};
