'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { chatStorage } from '@/features/chat/storage';
import type { ChatSession } from '@/features/chat/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChatSidebarProps {
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onSessionsChange?: () => void;
}

export function ChatSidebar({
  activeSessionId,
  onSessionSelect,
  onSessionsChange,
}: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const loadSessions = () => {
    const allSessions = chatStorage.getAllSessions();
    const sortedSessions = allSessions.sort((a, b) => b.updatedAt - a.updatedAt);
    setSessions(sortedSessions);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreateSession = () => {
    const newSession = chatStorage.createSession();
    loadSessions();
    onSessionSelect(newSession.id);
    onSessionsChange?.();
  };

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      chatStorage.deleteSession(sessionToDelete);
      
      if (activeSessionId === sessionToDelete) {
        const remainingSessions = chatStorage.getAllSessions();
        if (remainingSessions.length > 0) {
          onSessionSelect(remainingSessions[0].id);
        } else {
          onSessionSelect('');
        }
      }
      
      loadSessions();
      onSessionsChange?.();
    }
    setDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  return (
    <>
      <Card className="w-80 flex flex-col h-full">
        <div className="p-4 border-b">
          <Button onClick={handleCreateSession} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No chat sessions yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a new chat to get started
                </p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={cn(
                    'group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors',
                    'hover:bg-accent',
                    activeSessionId === session.id && 'bg-accent'
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.messages.length} messages
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteClick(session.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chat
              session and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
