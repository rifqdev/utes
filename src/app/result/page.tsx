'use client';

import { Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/Button';
import { AppLayout } from '@/components/AppLayout';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const { 
    score, 
    quizMode, 
    activeQuiz, 
    activeEssay,
    resetQuiz,
    setQuizMode,
    setCurrentQuestionIdx,
    setScore,
    setSelectedAnswer,
    setIsAnswered,
    setEssayAnswer,
    setEssayFeedbackMode,
  } = useQuiz();
  const router = useRouter();

  const totalQuestions = quizMode === 'nob' ? activeQuiz.length : activeEssay.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "";
  let color = "";
  let bgIcon = "";

  if (percentage === 100) {
    message = quizMode === 'nob' ? "Nob Master!" : "Absolute Legend!";
    color = quizMode === 'nob' ? "text-sky-600" : "text-orange-600";
    bgIcon = "bg-yellow-400";
  } else if (percentage >= 70) {
    message = "Hebat!";
    color = "text-indigo-600";
    bgIcon = "bg-indigo-400";
  } else {
    message = "Butuh Latihan Lagi";
    color = "text-slate-600";
    bgIcon = "bg-slate-400";
  }

  const handleTryAgain = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setEssayAnswer('');
    setEssayFeedbackMode(false);
    
    if (quizMode === 'nob') {
      router.push('/quiz');
    } else {
      router.push('/essay');
    }
  };

  const handleChangeLevel = () => {
    router.push('/select-level');
  };

  const handleNewVideo = () => {
    resetQuiz();
    router.push('/app');
  };

  return (
    <AppLayout>
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 lg:space-y-8">
      <div className="relative inline-block">
        <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full border-8 border-slate-100 flex items-center justify-center bg-white shadow-xl">
          <div>
            <span className={`text-4xl lg:text-5xl font-bold block ${color}`}>{score}/{totalQuestions}</span>
            <span className="text-slate-400 text-xs lg:text-sm font-medium">Benar</span>
          </div>
        </div>
        <div className={`absolute -bottom-2 -right-2 ${bgIcon} p-3 rounded-full text-white shadow-lg`}>
           <Trophy className="w-6 h-6 lg:w-8 lg:h-8" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className={`text-xl lg:text-2xl font-bold ${color}`}>{message}</h2>
        <p className="text-slate-500 text-sm lg:text-base">
          Kamu menyelesaikan latihan level 
          <span className={`font-bold mx-1 ${quizMode === 'nob' ? 'text-sky-600' : 'text-orange-600'}`}>
            {quizMode === 'nob' ? 'NOB' : 'LEGEND'}
          </span>
          untuk materi ini.
        </p>
      </div>

      <div className="grid gap-2 lg:gap-3 pt-6">
        <Button onClick={handleTryAgain} variant={quizMode} icon={RefreshCw} className="justify-center">
          Coba Lagi (Level sama)
        </Button>
        <Button onClick={handleChangeLevel} variant="secondary" className="justify-center">
          Ganti Level
        </Button>
        <Button onClick={handleNewVideo} variant="secondary" className="justify-center">
          Pilih Video Baru
        </Button>
      </div>
    </div>
    </AppLayout>
  );
}
