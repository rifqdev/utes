import type { SupabaseClient } from '@supabase/supabase-js';
import { SCORE_THRESHOLDS } from './constants';

/**
 * Get video info from metadata or fallback to current video info
 */
export function getVideoInfo(
  youtubeMetadata: { videoId: string; title: string } | null,
  inputUrl: string,
  currentVideoInfo: { videoId: string; videoTitle: string; videoUrl: string } | null
) {
  if (youtubeMetadata?.videoId) {
    return {
      videoId: youtubeMetadata.videoId,
      videoTitle: youtubeMetadata.title,
      videoUrl: inputUrl,
    };
  }
  return currentVideoInfo;
}

/**
 * Get CSS classes for quiz option based on state
 */
export function getOptionClassName(
  optionIndex: number,
  correctIndex: number,
  selectedIndex: number | null,
  isAnswered: boolean
): string {
  const baseClass = 'w-full p-3 lg:p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group text-sm lg:text-base ';

  if (isAnswered) {
    if (optionIndex === correctIndex) {
      return baseClass + 'border-green-500 bg-green-50 text-green-800';
    } else if (optionIndex === selectedIndex) {
      return baseClass + 'border-red-500 bg-red-50 text-red-800';
    } else {
      return baseClass + 'border-slate-100 text-slate-400 opacity-50';
    }
  } else {
    if (selectedIndex === optionIndex) {
      return baseClass + 'border-sky-600 bg-sky-50 text-sky-900';
    } else {
      return baseClass + 'border-slate-100 text-slate-700 hover:border-sky-200 hover:bg-slate-50';
    }
  }
}

/**
 * Get CSS classes for review option based on state
 */
export function getReviewOptionClassName(
  optionIndex: number,
  correctIndex: number,
  userAnswer: number | null,
  isCorrect: boolean
): string {
  const baseClass = 'p-3 rounded-lg border-2 text-sm lg:text-base ';
  const isUserAnswer = userAnswer === optionIndex;
  const isCorrectAnswer = correctIndex === optionIndex;

  if (isCorrectAnswer) {
    return baseClass + 'border-green-500 bg-green-50 text-green-900';
  } else if (isUserAnswer && !isCorrect) {
    return baseClass + 'border-red-500 bg-red-50 text-red-900';
  } else {
    return baseClass + 'border-slate-100 bg-slate-50 text-slate-600';
  }
}

/**
 * Get color class for score display
 */
export function getScoreColor(score: number, total: number): string {
  const percentage = (score / total) * 100;
  if (percentage >= SCORE_THRESHOLDS.EXCELLENT) return 'text-green-600';
  if (percentage >= SCORE_THRESHOLDS.GOOD) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get CSS classes for quiz mode badge
 */
export function getModeStyle(mode: string): string {
  return mode === 'nob'
    ? 'bg-sky-100 text-sky-700'
    : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700';
}

/**
 * Fetch latest quiz result for a video and mode
 */
export async function getLatestResult(
  supabase: SupabaseClient,
  userId: string,
  videoId: string,
  quizMode: string
) {
  const { data: result } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .eq('quiz_mode', quizMode)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return result || null;
}
