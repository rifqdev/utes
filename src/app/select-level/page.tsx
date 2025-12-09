'use client';

import { Gamepad2, Flame, ChevronRight, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { CompletionBadge } from '@/components/CompletionBadge';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { generateQuizFromTranscript, generateEssayFromTranscript } from '@/app/actions/openai';
import { saveQuizSession } from '@/app/actions/quiz';
import { QUIZ_DEFAULTS } from '@/lib/constants';

export default function SelectLevelPage() {
  const { 
    setQuizMode, 
    setCurrentQuestionIdx, 
    setScore, 
    setSelectedAnswer, 
    setIsAnswered, 
    setEssayAnswer, 
    setEssayFeedbackMode,
    youtubeTranscript,
    youtubeMetadata,
    inputUrl,
    setGeneratedQuiz,
    setQuizSessionId,
    setCurrentVideoInfo,
    videoCompletionStatus,
    setGeneratedEssay,
    setEssayAnswers,
    setEssayScores,
  } = useQuiz();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLevelSelect = async (mode: 'nob' | 'legend') => {
    setQuizMode(mode);
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setEssayAnswer('');
    setEssayFeedbackMode(false);
    
    if (mode === 'nob') {
      // Generate quiz menggunakan OpenAI
      if (!youtubeTranscript?.text) {
        setError('Transkrip tidak tersedia. Silakan coba lagi.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const quiz = await generateQuizFromTranscript(
          youtubeTranscript.text,
          QUIZ_DEFAULTS.NUMBER_OF_QUESTIONS
        );
        setGeneratedQuiz(quiz);

        // Save quiz session to database
        const sessionResult = await saveQuizSession({
          videoId: youtubeMetadata?.videoId || '',
          videoTitle: youtubeMetadata?.title || '',
          videoUrl: inputUrl,
          videoThumbnail: youtubeMetadata?.thumbnail,
          videoChannel: youtubeMetadata?.channel,
          videoDuration: youtubeMetadata?.duration,
          quizMode: 'nob',
          questions: quiz,
          transcriptText: youtubeTranscript.text,
        });

        // Save session ID and video info to context
        if (sessionResult.data?.id) {
          setQuizSessionId(sessionResult.data.id);
        }
        
        setCurrentVideoInfo({
          videoId: youtubeMetadata?.videoId || '',
          videoTitle: youtubeMetadata?.title || '',
          videoUrl: inputUrl,
        });

        router.push('/quiz');
      } catch (err) {
        console.error(err);
        setError('Gagal membuat soal latihan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'legend') {
      // Generate essay questions menggunakan OpenAI
      if (!youtubeTranscript?.text) {
        setError('Transkrip tidak tersedia. Silakan coba lagi.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const essayQuestions = await generateEssayFromTranscript(
          youtubeTranscript.text,
          QUIZ_DEFAULTS.ESSAY_QUESTIONS
        );
        setGeneratedEssay(essayQuestions);

        // Save quiz session to database
        const sessionResult = await saveQuizSession({
          videoId: youtubeMetadata?.videoId || '',
          videoTitle: youtubeMetadata?.title || '',
          videoUrl: inputUrl,
          videoThumbnail: youtubeMetadata?.thumbnail,
          videoChannel: youtubeMetadata?.channel,
          videoDuration: youtubeMetadata?.duration,
          quizMode: 'legend',
          questions: essayQuestions,
          transcriptText: youtubeTranscript.text,
        });

        // Save session ID and video info to context
        if (sessionResult.data?.id) {
          setQuizSessionId(sessionResult.data.id);
        }
        
        setCurrentVideoInfo({
          videoId: youtubeMetadata?.videoId || '',
          videoTitle: youtubeMetadata?.title || '',
          videoUrl: inputUrl,
        });

        // Initialize essay answers and scores
        setEssayAnswers(new Array(essayQuestions.length).fill(''));
        setEssayScores(new Array(essayQuestions.length).fill(null));

        router.push('/essay');
      } catch (err) {
        console.error(err);
        setError('Gagal membuat soal essay. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AppLayout>
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 lg:space-y-8">
       <div className="text-center space-y-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Pilih Level Tantangan</h2>
        <p className="text-slate-600 text-sm lg:text-base">Seberapa dalam kamu ingin menguji pemahamanmu?</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
          <p className="text-slate-600 font-medium">Sedang membuat soal latihan...</p>
          <p className="text-slate-500 text-sm">Mohon tunggu sebentar</p>
        </div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        <button 
          onClick={() => handleLevelSelect('nob')}
          className="relative group bg-white p-4 lg:p-6 rounded-3xl border-2 border-slate-100 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-100 transition-all text-left flex flex-col h-full"
        >
          <CompletionBadge 
            isCompleted={videoCompletionStatus?.hasNobQuiz ?? false}
            score={videoCompletionStatus?.nobScore}
          />
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">NOB</h3>
          <div className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold mb-3 lg:mb-4 w-fit">
            PILIHAN GANDA
          </div>
          <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mb-6 lg:mb-8 flex-1">
            Cocok untuk pemula. Tinggal klik jawaban yang menurutmu benar. Santai tapi tetap menguji ingatan.
          </p>
          <div className="flex items-center text-sky-600 font-semibold text-xs lg:text-sm mt-auto">
            {videoCompletionStatus?.hasNobQuiz ? 'Kerjakan Lagi' : 'Pilih Level Nob'} <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </div>
        </button>

        <button 
          onClick={() => handleLevelSelect('legend')}
          className="relative group bg-white p-4 lg:p-6 rounded-3xl border-2 border-slate-100 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-100 transition-all text-left flex flex-col h-full overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          
          <CompletionBadge 
            isCompleted={videoCompletionStatus?.hasLegendQuiz ?? false}
            score={videoCompletionStatus?.legendScore}
          />

          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform z-10">
            <Flame className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 z-10">LEGEND</h3>
          <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold mb-3 lg:mb-4 w-fit z-10">
            ESSAY / URAIAN
          </div>
          <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mb-6 lg:mb-8 flex-1 z-10">
            Ujian sesungguhnya. Jawab dengan kata-katamu sendiri. Sistem akan menilai kedalaman pemahamanmu.
          </p>
          <div className="flex items-center text-orange-600 font-semibold text-xs lg:text-sm mt-auto z-10">
            {videoCompletionStatus?.hasLegendQuiz ? 'Kerjakan Lagi' : 'Pilih Level Legend'} <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </div>
        </button>
      </div>
      )}
    </div>
    </AppLayout>
  );
}
