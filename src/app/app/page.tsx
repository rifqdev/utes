'use client';

import { YoutubeIcon, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { AppLayout } from '@/components/AppLayout';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { inputUrl, setInputUrl } = useQuiz();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      router.push('/verify');
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-2xl mx-auto text-center space-y-6 lg:space-y-8">
      <div className="bg-indigo-100 p-3 lg:p-4 rounded-full text-indigo-600 mb-2 lg:mb-4">
        <BookOpen className="w-8 h-8 lg:w-12 lg:h-12" />
      </div>
      <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight">
        Utes
      </h1>
      <p className="text-base lg:text-lg text-slate-600">
        Belajar otodidak jadi lebih efektif. Masukkan link video, kami buatkan latihan soal untukmu.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full relative group">
        <input 
          type="text" 
          placeholder="https://youtube.com/watch?v=..." 
          className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-base lg:text-lg transition-all shadow-sm"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <div className="mt-4 lg:mt-6 flex justify-center">
          <Button type="submit" icon={ArrowRight}>
            Mulai Belajar
          </Button>
        </div>
      </form>

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 text-xs lg:text-sm text-slate-500 pt-6 lg:pt-8">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 lg:w-4 lg:h-4 text-green-500" />
          <span>Analisis Transkrip AI</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 lg:w-4 lg:h-4 text-green-500" />
          <span>Mode Nob & Legend</span>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
