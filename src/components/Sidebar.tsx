'use client';

import { useState, useEffect } from 'react';
import { History, ChevronRight, Trophy, Clock, CheckCircle2, XCircle, User, X, PanelLeft, BookOpen, Menu, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { useLayout } from '@/context/LayoutContext';
import { useRouter } from 'next/navigation';
import { getUser } from '@/app/actions/auth';
import { LogoutButton } from './LogoutButton';
import { getQuizSessions } from '@/app/actions/quiz';
import { useQuiz } from '@/context/QuizContext';
import { getModeStyle, getScoreColor } from '@/lib/quiz-helpers';
import { HISTORY_LIMITS, QUIZ_MODES } from '@/lib/constants';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface QuizSession {
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

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useLayout();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { 
    setGeneratedQuiz, 
    setQuizMode, 
    setCurrentQuestionIdx, 
    setScore, 
    setUserAnswers, 
    setCurrentVideoInfo,
    setGeneratedEssay,
    setEssayAnswers,
    setEssayScores,
    setEssayFeedbacks,
    resetEssayState,
    resetQuizState,
    clearQuizData,
    clearEssayData,
  } = useQuiz();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData);
      
      if (userData) {
        try {
          const { data } = await getQuizSessions(HISTORY_LIMITS.DEFAULT_SESSIONS);
          setQuizSessions(data || []);
        } catch (error) {
          console.error('Error fetching quiz sessions:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  const handleLoadQuizSession = async (session: QuizSession) => {
    try {
      const questions = session.questions;
      const isLegend = session.quiz_mode === QUIZ_MODES.LEGEND;
      
      // Set common state
      setQuizMode(session.quiz_mode as 'nob' | 'legend');
      setCurrentVideoInfo({
        videoId: session.video_id,
        videoTitle: session.video_title,
        videoUrl: session.video_url,
      });
      
      // Load completed session for review
      if (session.latest_result) {
        setScore(session.latest_result.score);
        
        if (isLegend) {
          setGeneratedEssay(questions);
          clearQuizData();
          setEssayAnswers(session.latest_result.user_answers);
          setEssayScores(session.latest_result.essay_scores || []);
          setEssayFeedbacks(session.latest_result.essay_feedbacks || []);
          router.push('/essay/review');
        } else {
          setGeneratedQuiz(questions);
          clearEssayData();
          setUserAnswers(session.latest_result.user_answers);
          router.push('/quiz/review');
        }
      } else {
        // Start new quiz session
        setCurrentQuestionIdx(0);
        setScore(0);
        
        if (isLegend) {
          setGeneratedEssay(questions);
          clearQuizData();
          resetEssayState(questions.length);
          router.push('/essay');
        } else {
          setGeneratedQuiz(questions);
          clearEssayData();
          resetQuizState(questions.length);
          router.push('/quiz');
        }
      }
      
      // Close sidebar on mobile
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }
    } catch (error) {
      console.error('Error loading quiz session:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Hamburger Button - Only visible on mobile when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 bg-white border border-slate-200 rounded-lg shadow-sm z-30 lg:hidden hover:bg-slate-50 transition-colors"
        >
          <Menu size={24} className="text-slate-700" />
        </button>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-80 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Toggle Button Strip - Always Visible */}
        <div className="h-full flex">
          {/* Toggle Button */}
          <div className="w-16 flex-shrink-0 flex flex-col items-center py-4 border-r border-slate-100 bg-slate-50/50">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className={`p-3 mb-4 rounded-lg transition-all group ${
                isSidebarOpen 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title={isSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
            >
              <PanelLeft 
                size={22}
                className={`transition-transform ${
                  isSidebarOpen ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
            </button>
            
            {/* Divider */}
            {!isSidebarOpen && (
              <div className="w-8 h-px bg-slate-200 my-3" />
            )}
            
            {/* Quick Stats - Only visible when closed */}
            {!isSidebarOpen && (
              <div className="flex flex-col items-center gap-3 mt-2">
                <div className="text-center">
                  <div className="text-xs font-bold text-green-600">{quizSessions.length}</div>
                  <div className="text-[10px] text-slate-400">Quiz</div>
                </div>
              </div>
            )}

            {/* Profile Button */}
            <div className="mt-auto w-full flex justify-center pb-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                title="Profile"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-indigo-600 w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                </div>
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
          {/* Header with Logo */}
          <div className="p-4 border-b border-slate-200">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 w-full hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <div>
                <h1 className="text-base lg:text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  UTES
                </h1>
              </div>
            </button>
          </div>

          {/* History Section Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="text-indigo-600 w-4 h-4 lg:w-[18px] lg:h-[18px]" />
              <h2 className="text-xs lg:text-sm font-bold text-slate-800">History</h2>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="p-4 bg-white border-b border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs text-green-600 font-medium">Total Quiz</p>
                <p className="text-lg font-bold text-green-700">{quizSessions.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-600 font-medium">NOB</p>
                <p className="text-lg font-bold text-blue-700">
                  {quizSessions.filter(s => s.quiz_mode === QUIZ_MODES.NOB).length}
                </p>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="mx-auto text-indigo-600 mb-3 animate-spin" size={32} />
                <p className="text-slate-400 text-sm">Memuat history...</p>
              </div>
            ) : quizSessions.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-400 text-sm">Belum ada quiz tersimpan</p>
                <p className="text-slate-300 text-xs mt-1">Buat quiz pertamamu!</p>
              </div>
            ) : (
              quizSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleLoadQuizSession(session)}
                  className="w-full text-left"
                >
                  <Card className="p-3 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group">
                    <div className="space-y-2">
                    {/* Title & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 text-xs lg:text-sm leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {session.video_title}
                      </h3>
                      {session.latest_result && (
                        <CheckCircle2 className="text-green-500 flex-shrink-0 w-3 h-3 lg:w-4 lg:h-4" />
                      )}
                    </div>

                    {/* Channel */}
                    {session.video_channel && (
                      <p className="text-[10px] text-slate-500 truncate">
                        {session.video_channel}
                      </p>
                    )}

                    {/* Score (if completed) */}
                    {session.latest_result && (
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-2 py-1">
                        <span className="text-[10px] lg:text-xs text-slate-500">Skor Terakhir</span>
                        <span className={`text-sm lg:text-base font-bold ${getScoreColor(session.latest_result.score, session.latest_result.total_questions)}`}>
                          {session.latest_result.score}/{session.latest_result.total_questions}
                        </span>
                      </div>
                    )}

                    {/* Mode & Questions Count */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${getModeStyle(session.quiz_mode)}`}>
                        {session.quiz_mode === QUIZ_MODES.NOB ? 'NOB' : 'Legend'}
                      </span>
                      <span className="text-slate-500">
                        {Array.isArray(session.questions) ? session.questions.length : 0} soal
                      </span>
                    </div>

                    {/* Date & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        {new Date(session.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                        {session.latest_result ? 'Lihat Review' : 'Mulai Quiz'}
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={14} />
                      </div>
                    </div>
                    </div>
                  </Card>
                </button>
              ))
            )}
          </div>


          </div>
        </div>
      </aside>

      {/* Profile Modal */}
      {showProfileModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setShowProfileModal(false)}
          />
          
          {/* Modal */}
          <div className={`fixed bottom-20 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            isSidebarOpen ? 'left-20' : 'left-20'
          }`}>
            <div className="bg-white rounded-2xl border border-slate-100 w-64 p-0 overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user?.user_metadata?.name || 'User'}</p>
                    <p className="text-xs opacity-90 truncate max-w-[180px]">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-2">
                <LogoutButton variant="text" className="w-full" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
