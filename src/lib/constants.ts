// Quiz Configuration
export const QUIZ_DEFAULTS = {
  NUMBER_OF_QUESTIONS: 10,
  NUMBER_OF_OPTIONS: 4,
  ESSAY_QUESTIONS: 5,
} as const;

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
} as const;

// Quiz Modes
export const QUIZ_MODES = {
  NOB: 'nob',
  LEGEND: 'legend',
} as const;

export type QuizMode = typeof QUIZ_MODES[keyof typeof QUIZ_MODES];

// History Limits
export const HISTORY_LIMITS = {
  DEFAULT_SESSIONS: 10,
} as const;
