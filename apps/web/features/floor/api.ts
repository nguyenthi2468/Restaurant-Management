import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import type { Floor } from './types';
import type { FloorFormValues } from './validator';

export const getFloors = async () => {
  const response = await api.get<Floor[]>(API_ENDPOINTS.FLOORS);
  return response.data;
};

export const getFloorById = async (id: string) => {
  const response = await api.get<Floor>(`${API_ENDPOINTS.FLOORS}/${id}`);
  return response.data;
};

export const createFloor = async (data: FloorFormValues) => {
  const response = await api.post<Floor>(API_ENDPOINTS.FLOORS, data);
  return response.data;
};

export const updateFloor = async (id: string, data: FloorFormValues) => {
  const response = await api.patch<Floor>(
    `${API_ENDPOINTS.FLOORS}/${id}`,
    data,
  );
  return response.data;
};

export const deleteFloor = async (id: string) => {
  const response = await api.delete<Floor>(`${API_ENDPOINTS.FLOORS}/${id}`);
  return response.data;
};
