import { useQuery } from '@tanstack/react-query';
import { getTables, getTableById, getTablesByStatus, SearchTablesParams } from './api';

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
