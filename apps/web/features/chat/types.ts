export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  data?: unknown;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  explanation: string;
  data: unknown;
}
