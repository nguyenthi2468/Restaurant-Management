'use client';

import { useState, useEffect } from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useSendMessage } from '@/features/chat/mutations';
import { chatStorage } from '@/features/chat/storage';
import type { ChatSession, ChatMessage } from '@/features/chat/types';
import { Card } from '@/components/ui/card';

interface ChatInterfaceProps {
  sessionId: string | null;
  onSessionUpdate?: () => void;
}

export function ChatInterface({
  sessionId,
  onSessionUpdate,
}: ChatInterfaceProps) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (sessionId) {
      const loadedSession = chatStorage.getSession(sessionId);
      setSession(loadedSession);
    } else {
      setSession(null);
    }
  }, [sessionId]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    chatStorage.addMessage(sessionId, userMessage);
    setSession(chatStorage.getSession(sessionId));
    onSessionUpdate?.();

    sendMessageMutation.mutate(
      {
        message: content,
      },
      {
        onSuccess: (response) => {
          const assistantMessage: ChatMessage = {
            id: `msg_${Date.now()}_assistant`,
            role: 'assistant',
            content: response.explanation,
            timestamp: Date.now(),
            data: response.data,
          };

          chatStorage.addMessage(sessionId, assistantMessage);
          setSession(chatStorage.getSession(sessionId));
          onSessionUpdate?.();
        },
        onError: (error: any) => {
          console.error('Error sending message:', error);

          const errorMessage: ChatMessage = {
            id: `msg_${Date.now()}_error`,
            role: 'assistant',
            content: `Sorry, I encountered an error. Please try again.Error: ${error?.response?.data?.message}`,
            timestamp: Date.now(),
          };
          chatStorage.addMessage(sessionId, errorMessage);
          setSession(chatStorage.getSession(sessionId));
          onSessionUpdate?.();
        },
      }
    );
  };

  if (!sessionId) {
    return (
      <Card className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2 p-8">
          <h3 className="text-lg font-semibold">No session selected</h3>
          <p className="text-sm text-muted-foreground">
            Create a new session or select an existing one to start chatting
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="font-semibold">{session?.title || 'Chat'}</h2>
      </div>

      <ChatMessageList
        messages={session?.messages || []}
        isLoading={sendMessageMutation.isPending}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={sendMessageMutation.isPending}
      />
    </Card>
  );
}
