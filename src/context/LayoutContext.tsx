'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getQuizSessions } from '@/app/actions/quiz';
import { HISTORY_LIMITS } from '@/lib/constants';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface QuizSession {
  id: string;
  video_id: string;
  video_title: string;
  video_url: string;
  video_thumbnail: string | null;
  video_channel: string | null;
  video_duration: string | null;
  quiz_mode: string;
  questions: any;
  created_at: string;
  latest_result?: {
    id: string;
    score: number;
    total_questions: number;
    user_answers: any;
    essay_scores?: any;
    essay_feedbacks?: any;
    created_at: string;
  } | null;
}

interface LayoutContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  quizSessions: QuizSession[];
  loading: boolean;
  refreshHistory: () => Promise<void>;
  setUser: (user: SupabaseUser | null) => void;
  user: SupabaseUser | null;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const refreshHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data } = await getQuizSessions(HISTORY_LIMITS.DEFAULT_SESSIONS);
      setQuizSessions(data || []);
    } catch (error) {
      console.error('Error fetching quiz sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch once when user is set
  useEffect(() => {
    if (user && !hasInitialized) {
      refreshHistory();
      setHasInitialized(true);
    } else if (!user) {
      setLoading(false);
      setHasInitialized(false);
    }
  }, [user, hasInitialized]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const setSidebarOpen = (open: boolean) => setIsSidebarOpen(open);

  return (
    <LayoutContext.Provider value={{ 
      isSidebarOpen, 
      toggleSidebar, 
      setSidebarOpen,
      quizSessions,
      loading,
      refreshHistory,
      user,
      setUser
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
