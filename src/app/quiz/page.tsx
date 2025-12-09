'use client';

import { Gamepad2, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AppLayout } from '@/components/AppLayout';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { saveQuizResult } from '@/app/actions/quiz';
import { getVideoInfo, getOptionClassName } from '@/lib/quiz-helpers';

export default function QuizPage() {
  const {
    activeQuiz,
    currentQuestionIdx,
    selectedAnswer,
    isAnswered,
    setSelectedAnswer,
    setIsAnswered,
    score,
    setScore,
    setCurrentQuestionIdx,
    userAnswers,
    setUserAnswers,
    youtubeMetadata,
    inputUrl,
    quizMode,
    currentVideoInfo,
  } = useQuiz();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Initialize userAnswers array
  useEffect(() => {
    if (userAnswers.length === 0 && activeQuiz.length > 0) {
      setUserAnswers(new Array(activeQuiz.length).fill(null));
    }
  }, [activeQuiz.length, userAnswers.length, setUserAnswers]);

  const question = activeQuiz[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx + 1) / activeQuiz.length) * 100;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    
    // Save user answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIdx] = idx;
    setUserAnswers(newAnswers);
    
    if (idx === question.correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIdx < activeQuiz.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Last question - save to database
      setSaving(true);
      try {
        // Get video info from either youtubeMetadata or currentVideoInfo (from history)
        const videoInfo = getVideoInfo(youtubeMetadata, inputUrl, currentVideoInfo);

        if (videoInfo) {
          await saveQuizResult({
            videoId: videoInfo.videoId,
            videoTitle: videoInfo.videoTitle,
            videoUrl: videoInfo.videoUrl,
            quizMode: quizMode,
            score: score,
            totalQuestions: activeQuiz.length,
            questions: activeQuiz,
            userAnswers: userAnswers,
          });
        }
        router.push('/result');
      } catch (error) {
        console.error('Error saving quiz result:', error);
        // Still navigate to result page even if save fails
        router.push('/result');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <AppLayout>
    <div className="max-w-2xl mx-auto py-8 px-4 min-h-screen flex flex-col">
      <div className="mb-6 lg:mb-8 space-y-2">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-sky-600 bg-sky-50 px-2 lg:px-3 py-1 rounded-full">
             <Gamepad2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Level Nob
           </div>
           <span className="text-xs lg:text-sm font-medium text-slate-500">Soal {currentQuestionIdx + 1}/{activeQuiz.length}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sky-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col">
        <h3 className="text-lg lg:text-2xl font-bold text-slate-800 mb-6 lg:mb-8 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-6 lg:mb-8">
          {question.options.map((opt: string, idx: number) => {
            const btnClass = getOptionClassName(idx, question.correct, selectedAnswer, isAnswered);

            return (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className="font-medium">{opt}</span>
                {isAnswered && idx === question.correct && <CheckCircle2 className="text-green-600 w-4 h-4 lg:w-5 lg:h-5" />}
                {isAnswered && idx === selectedAnswer && idx !== question.correct && <AlertCircle className="text-red-500 w-4 h-4 lg:w-5 lg:h-5" />}
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex justify-end pt-4 border-t border-slate-100">
           <Button 
              onClick={nextQuestion} 
              variant="nob"
              disabled={!isAnswered || saving}
              className={(!isAnswered || saving) ? "opacity-50 cursor-not-allowed bg-slate-300" : ""}
              icon={saving ? Loader2 : ArrowRight}
           >
             {saving ? 'Menyimpan...' : (currentQuestionIdx === activeQuiz.length - 1 ? 'Lihat Hasil' : 'Selanjutnya')}
           </Button>
        </div>
      </Card>
    </div>
    </AppLayout>
  );
}
