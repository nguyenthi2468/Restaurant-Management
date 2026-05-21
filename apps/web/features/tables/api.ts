import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import type { Table } from './types';
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
  const response = await api.get<Table[]>(
    `${API_ENDPOINTS.TABLES}${queryString}`,
  );
  return response.data;
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
