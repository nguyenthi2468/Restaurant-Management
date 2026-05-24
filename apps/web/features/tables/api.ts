import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import type {
  CheckAvailableTablesDto,
  Table,
  PaginatedTableResponse,
  PaginatedTableWithBookingsResponse,
  QueryTableDto,
} from './types';
import type { TableFormValues } from './validator';

// Search params interface
export interface SearchTablesParams {
  name?: string;
  floorId?: string;
  status?: string;
}

// Build query string from search params
const buildQueryString = (params: SearchTablesParams): string => {
  const queryParams = new URLSearchParams();
  if (params.name) queryParams.append('name', params.name);
  if (params.floorId) queryParams.append('floorId', params.floorId);
  if (params.status) queryParams.append('status', params.status);
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Get all tables with optional search params
export const getTables = async (params?: SearchTablesParams) => {
  const queryString = params ? buildQueryString(params) : '';
  const response = await api.get<PaginatedTableResponse>(
    `${API_ENDPOINTS.TABLES}${queryString}`,
  );
  return response.data;
};

// Get all tables with pagination
export const getTablesWithPagination = async (params?: QueryTableDto) => {
  const queryString = buildPaginationQuery(params);
  const response = await api.get<PaginatedTableResponse>(
    `${API_ENDPOINTS.TABLES}${queryString}`,
  );
  return response.data;
};

export const getTablesWithBookings = async (params?: QueryTableDto) => {
  const queryString = buildPaginationQuery(params);
  const response = await api.get<PaginatedTableWithBookingsResponse>(
    `${API_ENDPOINTS.TABLES}/with-bookings${queryString}`,
  );
  return response.data;
};

// Build pagination query string
const buildPaginationQuery = (params?: QueryTableDto): string => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.floorId) queryParams.append('floorId', params.floorId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Get tables by status (legacy, use getTables with params instead)
export const getTablesByStatus = async (status: string) => {
  return getTables({ status });
};

// Get table by ID
export const getTableById = async (id: string) => {
  const response = await api.get<Table>(`${API_ENDPOINTS.TABLES}/${id}`);
  return response.data;
};

// Create new table
export const createTable = async (data: TableFormValues) => {
  const response = await api.post<Table>(API_ENDPOINTS.TABLES, data);
  return response.data;
};

// Update table
export const updateTable = async (id: string, data: TableFormValues) => {
  const response = await api.patch<Table>(
    `${API_ENDPOINTS.TABLES}/${id}`,
    data,
  );
  return response.data;
};

// Delete table
export const deleteTable = async (id: string) => {
  const response = await api.delete<Table>(`${API_ENDPOINTS.TABLES}/${id}`);
  return response.data;
};

// Check available tables
export const checkAvailableTables = async (params: CheckAvailableTablesDto) => {
  const response = await api.get<Table[]>(
    `${API_ENDPOINTS.TABLES}/available/tables`,
    { params },
  );
  return response.data;
};

export const countAvailableTables = async (params: CheckAvailableTablesDto) => {
  const response = await api.get<{ count: number }>(
    `${API_ENDPOINTS.TABLES}/available/count`,
    { params },
  );
  return response.data;
};
