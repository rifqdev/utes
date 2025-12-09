'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_QUIZ_FULL, MOCK_QUIZ_PARTIAL, MOCK_ESSAY_DATA } from '@/data/mockData';
import { YouTubeMetadata, YouTubeTranscript } from '@/app/actions/youtube';
import { QuizQuestion, EssayQuestion } from '@/app/actions/openai';
import { VideoCompletionStatus } from '@/app/actions/quiz';

interface QuizContextType {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  isFullVideo: boolean;
  setIsFullVideo: (value: boolean) => void;
  quizMode: 'nob' | 'legend';
  setQuizMode: (mode: 'nob' | 'legend') => void;
  progressTime: string;
  setProgressTime: (time: string) => void;
  progressTopic: string;
  setProgressTopic: (topic: string) => void;
  currentQuestionIdx: number;
  setCurrentQuestionIdx: (idx: number) => void;
  selectedAnswer: number | null;
  setSelectedAnswer: (answer: number | null) => void;
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  isAnswered: boolean;
  setIsAnswered: (answered: boolean) => void;
  essayAnswer: string;
  setEssayAnswer: (answer: string) => void;
  essayFeedbackMode: boolean;
  setEssayFeedbackMode: (mode: boolean) => void;
  activeQuiz: typeof MOCK_QUIZ_FULL;
  activeEssay: typeof MOCK_ESSAY_DATA;
  youtubeMetadata: YouTubeMetadata | null;
  setYoutubeMetadata: (metadata: YouTubeMetadata | null) => void;
  youtubeTranscript: YouTubeTranscript | null;
  setYoutubeTranscript: (transcript: YouTubeTranscript | null) => void;
  generatedQuiz: QuizQuestion[];
  setGeneratedQuiz: (quiz: QuizQuestion[]) => void;
  userAnswers: (number | null)[];
  setUserAnswers: (answers: (number | null)[]) => void;
  generatedEssay: EssayQuestion[];
  setGeneratedEssay: (essay: EssayQuestion[]) => void;
  essayAnswers: string[];
  setEssayAnswers: (answers: string[]) => void;
  essayScores: (number | null)[];
  setEssayScores: (scores: (number | null)[]) => void;
  essayFeedbacks: string[];
  setEssayFeedbacks: (feedbacks: string[]) => void;
  quizSessionId: string | null;
  setQuizSessionId: (id: string | null) => void;
  currentVideoInfo: { videoId: string; videoTitle: string; videoUrl: string } | null;
  setCurrentVideoInfo: (info: { videoId: string; videoTitle: string; videoUrl: string } | null) => void;
  videoCompletionStatus: VideoCompletionStatus | null;
  setVideoCompletionStatus: (status: VideoCompletionStatus | null) => void;
  resetQuiz: () => void;
  resetEssayState: (length: number) => void;
  resetQuizState: (length: number) => void;
  clearQuizData: () => void;
  clearEssayData: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [inputUrl, setInputUrl] = useState('');
  const [isFullVideo, setIsFullVideo] = useState(true);
  const [quizMode, setQuizMode] = useState<'nob' | 'legend'>('nob');
  const [progressTime, setProgressTime] = useState('');
  const [progressTopic, setProgressTopic] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [essayAnswer, setEssayAnswer] = useState('');
  const [essayFeedbackMode, setEssayFeedbackMode] = useState(false);
  const [youtubeMetadata, setYoutubeMetadata] = useState<YouTubeMetadata | null>(null);
  const [youtubeTranscript, setYoutubeTranscript] = useState<YouTubeTranscript | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [currentVideoInfo, setCurrentVideoInfo] = useState<{ videoId: string; videoTitle: string; videoUrl: string } | null>(null);
  const [videoCompletionStatus, setVideoCompletionStatus] = useState<VideoCompletionStatus | null>(null);
  const [generatedEssay, setGeneratedEssay] = useState<EssayQuestion[]>([]);
  const [essayAnswers, setEssayAnswers] = useState<string[]>([]);
  const [essayScores, setEssayScores] = useState<(number | null)[]>([]);
  const [essayFeedbacks, setEssayFeedbacks] = useState<string[]>([]);

  const activeQuiz = generatedQuiz.length > 0 ? generatedQuiz : (isFullVideo ? MOCK_QUIZ_FULL : MOCK_QUIZ_PARTIAL);
  const activeEssay = generatedEssay.length > 0 ? generatedEssay : (MOCK_ESSAY_DATA as any);

  // Helper: Reset essay state
  const resetEssayState = (length: number) => {
    setEssayAnswers(new Array(length).fill(''));
    setEssayScores(new Array(length).fill(null));
    setEssayFeedbacks(new Array(length).fill(''));
    setEssayAnswer('');
    setEssayFeedbackMode(false);
  };

  // Helper: Reset quiz state
  const resetQuizState = (length: number) => {
    setUserAnswers(new Array(length).fill(null));
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // Helper: Clear mode-specific data
  const clearQuizData = () => {
    setGeneratedQuiz([]);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const clearEssayData = () => {
    setGeneratedEssay([]);
    setEssayAnswers([]);
    setEssayScores([]);
    setEssayFeedbacks([]);
    setEssayAnswer('');
    setEssayFeedbackMode(false);
  };

  const resetQuiz = () => {
    setInputUrl('');
    setIsFullVideo(true);
    setQuizMode('nob');
    setProgressTime('');
    setProgressTopic('');
    setCurrentQuestionIdx(0);
    setScore(0);
    setYoutubeMetadata(null);
    setYoutubeTranscript(null);
    setQuizSessionId(null);
    setCurrentVideoInfo(null);
    setVideoCompletionStatus(null);
    clearQuizData();
    clearEssayData();
  };

  return (
    <QuizContext.Provider
      value={{
        inputUrl,
        setInputUrl,
        isFullVideo,
        setIsFullVideo,
        quizMode,
        setQuizMode,
        progressTime,
        setProgressTime,
        progressTopic,
        setProgressTopic,
        currentQuestionIdx,
        setCurrentQuestionIdx,
        selectedAnswer,
        setSelectedAnswer,
        score,
        setScore,
        isAnswered,
        setIsAnswered,
        essayAnswer,
        setEssayAnswer,
        essayFeedbackMode,
        setEssayFeedbackMode,
        activeQuiz,
        activeEssay,
        youtubeMetadata,
        setYoutubeMetadata,
        youtubeTranscript,
        setYoutubeTranscript,
        generatedQuiz,
        setGeneratedQuiz,
        userAnswers,
        setUserAnswers,
        quizSessionId,
        setQuizSessionId,
        currentVideoInfo,
        setCurrentVideoInfo,
        videoCompletionStatus,
        setVideoCompletionStatus,
        generatedEssay,
        setGeneratedEssay,
        essayAnswers,
        setEssayAnswers,
        essayScores,
        setEssayScores,
        essayFeedbacks,
        setEssayFeedbacks,
        resetQuiz,
        resetEssayState,
        resetQuizState,
        clearQuizData,
        clearEssayData,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
