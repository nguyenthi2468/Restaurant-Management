'use client';

import { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { chatStorage } from '@/features/chat/storage';

export default function AdminPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const sessions = chatStorage.getAllSessions();
    if (sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
    } else {
      const newSession = chatStorage.createSession();
      setActiveSessionId(newSession.id);
    }
  }, []);

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const handleSessionsChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-4rem)] p-4">
      <ChatSidebar
        key={refreshKey}
        activeSessionId={activeSessionId}
        onSessionSelect={handleSessionSelect}
        onSessionsChange={handleSessionsChange}
      />
      <ChatInterface
        sessionId={activeSessionId}
        onSessionUpdate={handleSessionsChange}
      />
    </div>
  );
}
