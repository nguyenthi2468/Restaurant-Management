import type { ChatSession, ChatMessage } from './types';

const STORAGE_KEY = 'chat_sessions';

export const chatStorage = {
  getAllSessions: (): ChatSession[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  },

  getSession: (sessionId: string): ChatSession | null => {
    const sessions = chatStorage.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  },

  saveSession: (session: ChatSession): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = chatStorage.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  },

  createSession: (title?: string): ChatSession => {
    const session: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title || `Chat ${new Date().toLocaleString()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    chatStorage.saveSession(session);
    return session;
  },

  addMessage: (sessionId: string, message: ChatMessage): void => {
    const session = chatStorage.getSession(sessionId);
    if (!session) return;
    
    session.messages.push(message);
    session.updatedAt = Date.now();
    chatStorage.saveSession(session);
  },

  updateSessionTitle: (sessionId: string, title: string): void => {
    const session = chatStorage.getSession(sessionId);
    if (!session) return;
    
    session.title = title;
    session.updatedAt = Date.now();
    chatStorage.saveSession(session);
  },

  deleteSession: (sessionId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = chatStorage.getAllSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  },

  clearAllSessions: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chat sessions:', error);
    }
  },
};
