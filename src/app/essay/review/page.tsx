'use client';

import { Flame, ArrowLeft, Home, RefreshCw, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AppLayout } from '@/components/AppLayout';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EssayReviewPage() {
  const {
    activeEssay,
    essayAnswers,
    essayScores,
    essayFeedbacks,
    score,
    setCurrentQuestionIdx,
    setScore,
    resetEssayState,
  } = useQuiz();
  const router = useRouter();

  const handleRetakeEssay = () => {
    // Reset all essay state using helper
    setCurrentQuestionIdx(0);
    setScore(0);
    resetEssayState(activeEssay.length);
    
    // Navigate to essay page
    router.push('/essay');
  };

  useEffect(() => {
    // Redirect if no essay data
    if (activeEssay.length === 0 || essayAnswers.length === 0) {
      // Give some time for state to update from history
      const timer = setTimeout(() => {
        if (activeEssay.length === 0 || essayAnswers.length === 0) {
          router.push('/app');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeEssay, essayAnswers, router]);

  // Show loading if data not ready yet
  if (activeEssay.length === 0 || essayAnswers.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalQuestions = activeEssay.length;

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
            <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-orange-600 bg-orange-50 px-2 lg:px-3 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Level Legend
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">
                {score}
              </div>
              <div className="text-xs text-slate-500">
                Skor Rata-rata
              </div>
            </div>
          </div>
        </div>

        {/* Review Title */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
            Review Jawaban Essay
          </h2>
          <p className="text-slate-600 text-sm">
            Lihat jawaban dan feedback AI dari essay yang sudah kamu kerjakan
          </p>
        </div>

        {/* Questions Review */}
        <div className="space-y-6 mb-8">
          {activeEssay.map((question, qIndex) => {
            const userAnswer = essayAnswers[qIndex];
            const questionScore = essayScores[qIndex];
            const feedback = essayFeedbacks[qIndex];

            return (
              <Card key={question.id} className="p-4 lg:p-6">
                {/* Question Header */}
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-2">
                    Soal {qIndex + 1} dari {totalQuestions}
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-slate-800 leading-relaxed mb-3">
                    {question.question}
                  </h3>
                  
                  {/* Score Badge */}
                  {questionScore !== null && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      questionScore >= 80 ? 'bg-green-100 text-green-700' : 
                      questionScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      Skor: {questionScore}/100
                    </div>
                  )}
                </div>

                {/* User Answer */}
                <div className="bg-slate-50 p-3 lg:p-4 rounded-xl border border-slate-200 mb-4">
                  <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase mb-2">
                    Jawaban Kamu
                  </p>
                  <p className="text-slate-800 text-sm lg:text-base whitespace-pre-wrap leading-relaxed">
                    {userAnswer || '-'}
                  </p>
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className="bg-blue-50 p-3 lg:p-4 rounded-xl border border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <BrainCircuit className="text-blue-600 w-12 h-12 lg:w-16 lg:h-16" />
                    </div>
                    <p className="text-[10px] lg:text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-2">
                      <BrainCircuit className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Analisis AI
                    </p>
                    <p className="text-blue-800 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">
                      {feedback}
                    </p>
                  </div>
                )}

                {/* Key Points Reference */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase mb-2">
                    Poin Kunci yang Diharapkan
                  </p>
                  <ul className="space-y-1">
                    {question.keyPoints?.map((point, idx) => (
                      <li key={idx} className="text-xs lg:text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
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
              onClick={handleRetakeEssay}
              variant="legend"
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
