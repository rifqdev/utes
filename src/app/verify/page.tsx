'use client';

import { Clock, PlayCircle, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AppLayout } from '@/components/AppLayout';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getYouTubeMetadata, getYouTubeTranscript } from '@/app/actions/youtube';
import { checkVideoCompletion } from '@/app/actions/quiz';

export default function VerifyPage() {
  const { inputUrl, setIsFullVideo, youtubeMetadata, setYoutubeMetadata, setYoutubeTranscript, youtubeTranscript, setVideoCompletionStatus } = useQuiz();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inputUrl) {
      router.push('/app');
      return;
    }

    async function fetchYouTubeData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch metadata first
        const metadata = await getYouTubeMetadata(inputUrl);
        
        if (!metadata) {
          setError('URL tidak valid atau video tidak ditemukan.');
          return;
        }

        setYoutubeMetadata(metadata);

        // Then fetch transcript
        const transcript = await getYouTubeTranscript(inputUrl);

        if (!transcript) {
          setError('Transkrip tidak tersedia untuk video ini. Pastikan video memiliki subtitle/caption yang aktif. Coba video lain atau aktifkan caption di YouTube terlebih dahulu.');
          // Set metadata tetap tersedia meskipun transcript gagal
          return;
        }

        setYoutubeTranscript(transcript);

        // Check if user has completed this video before
        if (metadata?.videoId) {
          try {
            const completionStatus = await checkVideoCompletion(metadata.videoId);
            setVideoCompletionStatus(completionStatus);
          } catch (err) {
            console.error('Failed to check video completion:', err);
            // Non-critical error, continue without completion status
          }
        }
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError('Terjadi kesalahan saat mengambil data video. Silakan coba lagi dalam beberapa saat.');
      } finally {
        setLoading(false);
      }
    }

    fetchYouTubeData();
  }, [inputUrl, router, setYoutubeMetadata, setYoutubeTranscript, setVideoCompletionStatus]);

  const handleFullVideo = () => {
    setIsFullVideo(true);
    router.push('/select-level');
  };

  const handlePartialVideo = () => {
    setIsFullVideo(false);
    router.push('/progress-check');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-600">Menyiapkan materi...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
          <button 
            onClick={() => router.push('/app')} 
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium mb-4"
          >
            &larr; Kembali
          </button>
          <Card className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/app')}>Coba Lagi</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!youtubeMetadata) return null;

  return (
    <AppLayout>
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      <button 
        onClick={() => router.push('/app')} 
        className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium mb-4"
      >
        &larr; Kembali
      </button>

      <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Video Ditemukan</h2>
      
      <Card className="overflow-hidden p-0">
        <div className="h-40 lg:h-48 w-full relative">
          <img src={youtubeMetadata.thumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
             <PlayCircle className="text-white opacity-80 w-10 h-10 lg:w-12 lg:h-12" />
          </div>
        </div>
        <div className="p-4 lg:p-6">
          <h3 className="font-bold text-base lg:text-lg mb-1">{youtubeMetadata.title}</h3>
          <p className="text-slate-500 text-xs lg:text-sm flex items-center gap-2">
             <span>{youtubeMetadata.channel}</span>
             {/* <span className="w-1 h-1 bg-slate-300 rounded-full"></span> */}
             {/* <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> {youtubeMetadata.duration} */}
          </p>
        </div>
      </Card>

      <div className="bg-indigo-50 rounded-xl p-4 lg:p-6 border border-indigo-100 space-y-4">
        <h3 className="font-semibold text-indigo-900 flex items-center gap-2 text-sm lg:text-base">
          <Target className="w-4 h-4 lg:w-5 lg:h-5" />
          Status Pengetahuan
        </h3>
        <p className="text-indigo-800/80">
          Apakah kamu sudah menonton dan menyelesaikan semua materi di video ini?
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Button 
            onClick={handleFullVideo}
            className="w-full justify-center"
            disabled={!youtubeTranscript}
          >
            Ya, Sudah Selesai
          </Button>
          <Button 
            variant="secondary"
            onClick={handlePartialVideo}
            className="w-full justify-center"
            disabled={true}
          >
            Belum Selesai
          </Button>
        </div>
        {!youtubeTranscript && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
            ⚠️ Transkrip tidak tersedia untuk video ini
          </p>
        )}
      </div>
    </div>
    </AppLayout>
  );
}
