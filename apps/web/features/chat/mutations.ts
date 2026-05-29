import { useMutation } from '@tanstack/react-query';
import { chatApi } from './api';
import type { SendMessageRequest } from './types';

export function useSendMessage() {
  return useMutation({
    mutationFn: (data: SendMessageRequest) => chatApi.sendMessage(data),
  });
}
