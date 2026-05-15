import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignPermissionToAction } from './api';

export const useAssignPermissionToAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: string[] }) => 
      assignPermissionToAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    },
  });
};