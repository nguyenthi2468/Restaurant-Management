import api from '@/lib/axios';
import type { SendMessageRequest, SendMessageResponse } from './types';

export const chatApi = {
  sendMessage: async (
    data: SendMessageRequest,
  ): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>(
      '/ai/chat',
      data,
    );
    return response.data;
  },
};
