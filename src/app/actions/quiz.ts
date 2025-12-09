'use server';

import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { getLatestResult } from '@/lib/quiz-helpers';
import { QuizQuestion } from './openai';
import { QuizMode, QUIZ_MODES } from '@/lib/constants';

export interface SaveQuizResultParams {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  quizMode: QuizMode;
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
}

export interface SaveQuizSessionParams {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  videoThumbnail?: string;
  videoChannel?: string;
  videoDuration?: string;
  quizMode: QuizMode;
  questions: QuizQuestion[];
  transcriptText?: string;
}

export async function saveQuizSession(params: SaveQuizSessionParams) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Check if quiz session already exists for this video and mode
    const { data: existingSession } = await supabase
      .from('quiz_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', params.videoId)
      .eq('quiz_mode', params.quizMode)
      .single();

    if (existingSession) {
      // Update existing session
      const { data, error } = await supabase
        .from('quiz_sessions')
        .update({
          questions: params.questions as any,
          transcript_text: params.transcriptText,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSession.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating quiz session:', error);
        throw new Error('Gagal update quiz session');
      }

      return { success: true, data, isNew: false };
    }

    // Insert new quiz session
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: user.id,
        video_id: params.videoId,
        video_title: params.videoTitle,
        video_url: params.videoUrl,
        video_thumbnail: params.videoThumbnail,
        video_channel: params.videoChannel,
        video_duration: params.videoDuration,
        quiz_mode: params.quizMode,
        questions: params.questions as any,
        transcript_text: params.transcriptText,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving quiz session:', error);
      throw new Error('Gagal menyimpan quiz session');
    }

    return { success: true, data, isNew: true };
  } catch (error) {
    console.error('Error in saveQuizSession:', error);
    throw error;
  }
}

export async function getQuizSessions(limit: number = 10) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Get quiz sessions with latest result (if any)
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sessionsError) {
      console.error('Error getting quiz sessions:', sessionsError);
      throw new Error('Gagal mengambil quiz sessions');
    }

    // Get latest result for each session
    const sessionsWithResults = await Promise.all(
      (sessions || []).map(async (session) => {
        const result = await getLatestResult(
          supabase,
          user.id,
          session.video_id,
          session.quiz_mode
        );

        return {
          ...session,
          latest_result: result,
        };
      })
    );

    return { success: true, data: sessionsWithResults };
  } catch (error) {
    console.error('Error in getQuizSessions:', error);
    throw error;
  }
}

export async function getQuizSessionById(sessionId: string) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Get quiz session
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error getting quiz session:', error);
      throw new Error('Gagal mengambil quiz session');
    }

    // Get latest result for this session
    const result = await getLatestResult(
      supabase,
      user.id,
      session.video_id,
      session.quiz_mode
    );

    return {
      success: true,
      data: {
        ...session,
        latest_result: result,
      },
    };
  } catch (error) {
    console.error('Error in getQuizSessionById:', error);
    throw error;
  }
}

export async function saveQuizResult(params: SaveQuizResultParams) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Insert quiz result
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        video_id: params.videoId,
        video_title: params.videoTitle,
        video_url: params.videoUrl,
        quiz_mode: params.quizMode,
        score: params.score,
        total_questions: params.totalQuestions,
        questions: params.questions as any,
        user_answers: params.userAnswers as any,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving quiz result:', error);
      throw new Error('Gagal menyimpan hasil quiz');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in saveQuizResult:', error);
    throw error;
  }
}

export interface VideoCompletionStatus {
  hasNobQuiz: boolean;
  hasLegendQuiz: boolean;
  nobScore?: number;
  legendScore?: number;
  nobAttempts: number;
  legendAttempts: number;
}

export async function checkVideoCompletion(videoId: string): Promise<VideoCompletionStatus> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('quiz_mode, score')
      .eq('user_id', user.id)
      .eq('video_id', videoId);

    if (error) throw error;

    const nobResults = results?.filter(r => r.quiz_mode === QUIZ_MODES.NOB) ?? [];
    const legendResults = results?.filter(r => r.quiz_mode === QUIZ_MODES.LEGEND) ?? [];

    return {
      hasNobQuiz: nobResults.length > 0,
      hasLegendQuiz: legendResults.length > 0,
      nobScore: nobResults.length > 0 ? Math.max(...nobResults.map(r => r.score)) : undefined,
      legendScore: legendResults.length > 0 ? Math.max(...legendResults.map(r => r.score)) : undefined,
      nobAttempts: nobResults.length,
      legendAttempts: legendResults.length,
    };
  } catch (error) {
    console.error('Error checking video completion:', error);
    throw error;
  }
}

export interface SaveEssayResultParams {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  quizMode: typeof QUIZ_MODES.LEGEND;
  score: number;
  totalQuestions: number;
  questions: any[];
  userAnswers: string[];
  essayScores: (number | null)[];
  essayFeedbacks: string[];
}

export async function saveEssayResult(params: SaveEssayResultParams) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Insert essay result
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        video_id: params.videoId,
        video_title: params.videoTitle,
        video_url: params.videoUrl,
        quiz_mode: params.quizMode,
        score: params.score,
        total_questions: params.totalQuestions,
        questions: params.questions as any,
        user_answers: params.userAnswers as any,
        essay_scores: params.essayScores as any,
        essay_feedbacks: params.essayFeedbacks as any,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving essay result:', error);
      throw new Error('Gagal menyimpan hasil essay');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in saveEssayResult:', error);
    throw error;
  }
}
