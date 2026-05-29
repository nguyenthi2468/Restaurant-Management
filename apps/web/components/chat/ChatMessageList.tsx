'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/features/chat/types';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

function renderDataTable(data: unknown) {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div className="mt-3 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
          No data returned
        </div>
      );
    }

    const firstItem = data[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      const columns = Object.keys(firstItem);

      return (
        <div className="mt-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="font-semibold">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {typeof row[col] === 'object'
                        ? JSON.stringify(row[col])
                        : String(row[col] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return (
      <div className="mt-3 overflow-x-auto">
        <Table>
          <TableBody>
            {Object.entries(data).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-semibold">{key}</TableCell>
                <TableCell>
                  {typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value ?? '')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (
    typeof data === 'number' ||
    typeof data === 'string' ||
    typeof data === 'boolean'
  ) {
    return (
      <div className="mt-3 p-3 bg-muted/50 rounded-md">
        <div className="text-sm">
          <span className="font-semibold">Result: </span>
          <span>{String(data)}</span>
        </div>
      </div>
    );
  }

  return null;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">Start a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Send a message to begin chatting with AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                'rounded-lg px-4 py-2 max-w-[80%]',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted',
              )}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
              {message.data != null && renderDataTable(message.data)}
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {message.role === 'user' && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-secondary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg px-4 py-2 bg-muted">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
