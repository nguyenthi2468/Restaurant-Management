import { useQuery } from '@tanstack/react-query';
import {
  getTables,
  getTableById,
  getTablesByStatus,
  SearchTablesParams,
  checkAvailableTables,
  countAvailableTables,
} from './api';
import { CheckAvailableTablesDto } from './types';

export const useTablesQuery = (params?: SearchTablesParams) => {
  return useQuery({
    queryKey: ['tables', params],
    queryFn: () => getTables(params),
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
