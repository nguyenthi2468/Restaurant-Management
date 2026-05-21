import { useQuery } from '@tanstack/react-query';
import { getFloors, getFloorById } from './api';

export const useFloorsQuery = () => {
  return useQuery({
    queryKey: ['floors'],
    queryFn: () => getFloors(),
  });
};

export const useFloorQuery = (id: string) => {
  return useQuery({
    queryKey: ['floor', id],
    queryFn: () => getFloorById(id),
    enabled: !!id,
  });
};
