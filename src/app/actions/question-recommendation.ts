'use server';

export interface RecommendationResult {
  recommended: number;
  min: number;
  max: number;
  reasoning: string;
  metrics: {
    transcript_length?: number;
    word_count: number;
    estimated_duration_minutes?: number;
    concept_density?: 'low' | 'medium' | 'high';
    content_richness?: number;
    key_concepts_found?: number;
    examples_found?: number;
    estimation_method?: 'quick' | 'full';
  };
}

const API_URL = process.env.YOUTUBE_SERVICE_URL || 'http://localhost:3001';

/**
 * Get recommended number of questions (Full Analysis)
 */
export async function getQuestionRecommendation(
  transcript: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  quick: boolean = false
): Promise<RecommendationResult> {
  try {
    const response = await fetch(`${API_URL}/api/recommend-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, difficulty, quick }),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendation');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recommendation:', error);
    throw error;
  }
}

/**
 * Quick recommendation (Fast, less accurate)
 */
export async function getQuickRecommendation(
  wordCount: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<RecommendationResult> {
  try {
    const response = await fetch(
      `${API_URL}/api/recommend-questions/quick?word_count=${wordCount}&difficulty=${difficulty}`
    );

    if (!response.ok) {
      throw new Error('Failed to get quick recommendation');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting quick recommendation:', error);
    throw error;
  }
}
