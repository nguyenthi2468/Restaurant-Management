import { useQuery } from '@tanstack/react-query';
import { getProfile, getUsers, getUserById } from './api';
import { UsersQueryParams } from './types';

export const useUsersQuery = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
