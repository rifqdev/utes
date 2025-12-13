'use server';

import { getAuthenticatedUser } from '@/lib/auth-helpers';

const GENERATION_SERVICE_URL = process.env.NEXT_PUBLIC_GENERATION_SERVICE_URL || 'http://localhost:3002';

export interface GenerationRequest {
  transcript: string;
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  learningObjective: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  quizMode: 'nob' | 'legend';
}

export interface GenerationStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    questions: any[];
    totalChunks: number;
    processingTime: number;
  };
  error?: string;
}

/**
 * Start question generation job
 */
export async function startQuestionGeneration(request: GenerationRequest) {
  try {
    const response = await fetch(`${GENERATION_SERVICE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start generation');
    }

    const data = await response.json();
    return { success: true, jobId: data.jobId };
  } catch (error: any) {
    console.error('Error starting generation:', error);
    throw error;
  }
}

/**
 * Check generation status
 */
export async function checkGenerationStatus(jobId: string): Promise<GenerationStatus> {
  try {
    const response = await fetch(`${GENERATION_SERVICE_URL}/api/status/${jobId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to check status');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error checking status:', error);
    throw error;
  }
}

/**
 * Save generated questions to database
 */
export async function saveGeneratedQuestions(params: {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  videoThumbnail?: string;
  videoChannel?: string;
  videoDuration?: string;
  quizMode: string;
  questions: any[];
  transcriptText: string;
}) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

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
        questions: params.questions,
        transcript_text: params.transcriptText,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, sessionId: data.id };
  } catch (error: any) {
    console.error('Error saving questions:', error);
    throw error;
  }
}
