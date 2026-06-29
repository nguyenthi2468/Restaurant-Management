import { useQuery } from '@tanstack/react-query';
import {
  getTables,
  getTableById,
  getTablesByStatus,
  getTablesWithPagination,
  getTablesWithBookings,
  SearchTablesParams,
  checkAvailableTables,
  countAvailableTables,
  getReservationsByDate,
} from './api';
import { CheckAvailableTablesDto, QueryTableDto } from './types';

export const useTablesQuery = (params?: SearchTablesParams) => {
  return useQuery({
    queryKey: ['tables', params],
    queryFn: () => getTables(params),
  });
};

export const useTablesQueryWithPagination = (params?: QueryTableDto) => {
  return useQuery({
    queryKey: ['tables', 'pagination', params],
    queryFn: () => getTablesWithPagination(params),
  });
};

export const useTablesWithBookingsQuery = (params?: QueryTableDto) => {
  return useQuery({
    queryKey: ['tables', 'with-bookings', params],
    queryFn: () => getTablesWithBookings(params),
  });
};

export const useTablesByStatusQuery = (status: string) => {
  return useQuery({
    queryKey: ['tables', 'status', status],
    queryFn: () => getTablesByStatus(status),
    enabled: !!status,
  });
};

export const useTableQuery = (id: string) => {
  return useQuery({
    queryKey: ['table', id],
    queryFn: () => getTableById(id),
    enabled: !!id,
  });
};

export const useCheckAvailableTablesQuery = (
  params: CheckAvailableTablesDto,
) => {
  return useQuery({
    queryKey: ['availableTables', params],
    queryFn: () => checkAvailableTables(params),
    enabled: !!params.floorId && !!params.bookingTime,
  });
};

export const useCountAvailableTablesQuery = (
  params: CheckAvailableTablesDto,
  options?: any,
) => {
  return useQuery({
    queryKey: ['availableTablesCount', params],
    queryFn: () => countAvailableTables(params),
    ...options,
  });
};

export const useReservationsByDateQuery = (date: string) => {
  return useQuery({
    queryKey: ['reservations', 'by-date', date],
    queryFn: () => getReservationsByDate(date),
    enabled: !!date,
  });
};
