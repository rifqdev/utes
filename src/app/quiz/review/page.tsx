'use client';

import { Gamepad2, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AppLayout } from '@/components/AppLayout';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getReviewOptionClassName } from '@/lib/quiz-helpers';

export default function QuizReviewPage() {
  const {
    activeQuiz,
    userAnswers,
    score,
    quizMode,
    setCurrentQuestionIdx,
    setScore,
    setSelectedAnswer,
    setIsAnswered,
    setUserAnswers,
  } = useQuiz();
  const router = useRouter();

  const handleRetakeQuiz = () => {
    // Reset all quiz state
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setUserAnswers(new Array(activeQuiz.length).fill(null));
    
    // Navigate to quiz page
    router.push('/quiz');
  };

  useEffect(() => {
    // Redirect legend to essay review page
    if (quizMode === 'legend' && activeQuiz.length > 0) {
      router.push('/essay/review');
    }
  }, [quizMode, activeQuiz, router]);

  // Show loading if data not ready yet
  if (activeQuiz.length === 0 || userAnswers.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalQuestions = activeQuiz.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-screen">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Home
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-sky-600 bg-sky-50 px-2 lg:px-3 py-1 rounded-full">
              <Gamepad2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Level {quizMode === 'nob' ? 'NOB' : 'Legend'}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">
                {score}/{totalQuestions}
              </div>
              <div className="text-xs text-slate-500">
                {percentage}% Benar
              </div>
            </div>
          </div>
        </div>

        {/* Review Title */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
            Review Jawaban
          </h2>
          <p className="text-slate-600 text-sm">
            Lihat jawaban yang benar dan salah dari quiz yang sudah kamu kerjakan
          </p>
        </div>

        {/* Questions Review */}
        <div className="space-y-4 mb-8">
          {activeQuiz.map((question, qIndex) => {
            const userAnswer = userAnswers[qIndex];
            const isCorrect = userAnswer === question.correct;

            return (
              <Card key={question.id} className="p-4 lg:p-6">
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 mb-1">
                      Soal {qIndex + 1}
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-slate-800 leading-relaxed">
                      {question.question}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 ml-11">
                  {question.options?.map((option: string, optIndex: number) => {
                    const isUserAnswer = userAnswer === optIndex;
                    const isCorrectAnswer = question.correct === optIndex;
                    const optionClass = getReviewOptionClassName(optIndex, question.correct, userAnswer, isCorrect);

                    return (
                      <div key={optIndex} className={optionClass}>
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          <div className="flex items-center gap-2">
                            {isUserAnswer && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/50">
                                Jawaban Kamu
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <Card className="p-6 sticky bottom-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push('/app')}
              variant="secondary"
              icon={Home}
              className="flex-1 justify-center"
            >
              Kembali ke Home
            </Button>
            <Button
              onClick={handleRetakeQuiz}
              variant="nob"
              icon={RefreshCw}
              className="flex-1 justify-center"
            >
              Kerjakan Ulang
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
