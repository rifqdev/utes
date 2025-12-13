'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/Button';
import { Loader2, Settings, ArrowRight, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { QUIZ_CONFIG_OPTIONS, QuizConfiguration } from '@/lib/constants';
import { startQuestionGeneration, checkGenerationStatus, saveGeneratedQuestions } from '@/app/actions/question-generation';
import { getQuestionRecommendation, getQuickRecommendation, RecommendationResult } from '@/app/actions/question-recommendation';

const STORAGE_KEY = 'quiz_generation_job';

export default function QuizConfigurationPage() {
  const router = useRouter();
  const {
    quizMode,
    youtubeTranscript,
    youtubeMetadata,
    inputUrl,
    quizConfig,
    setQuizConfig,
    setGeneratedQuiz,
    setGeneratedEssay,
    setQuizSessionId,
    setCurrentVideoInfo,
    setEssayAnswers,
    setEssayScores,
    setCurrentQuestionIdx,
    setScore,
    setSelectedAnswer,
    setIsAnswered,
    setEssayAnswer,
    setEssayFeedbackMode,
  } = useQuiz();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<{ key: string; value: any } | null>(null);

  const updateConfig = <K extends keyof QuizConfiguration>(key: K, value: QuizConfiguration[K]) => {
    // If recommendation already exists and user changes difficulty or learningObjective
    if (showRecommendation && (key === 'difficulty' || key === 'learningObjective')) {
      setPendingConfig({ key, value });
      setShowConfirmation(true);
    } else {
      setQuizConfig({ ...quizConfig, [key]: value });
    }
  };

  const handleConfirmReanalyze = () => {
    if (pendingConfig) {
      setQuizConfig({ ...quizConfig, [pendingConfig.key]: pendingConfig.value });
      setShowRecommendation(false);
      setRecommendation(null);
    }
    setShowConfirmation(false);
    setPendingConfig(null);
  };

  const handleCancelReanalyze = () => {
    setShowConfirmation(false);
    setPendingConfig(null);
  };

  // Check ongoing job on mount
  useEffect(() => {
    const jobId = localStorage.getItem(STORAGE_KEY);
    if (jobId) {
      setStatus('generating');
      setProgress(50);
    }
  }, []);

  const handleAnalyzeContent = async () => {
    if (!youtubeTranscript?.text) {
      setError('Transkrip tidak tersedia. Silakan coba lagi.');
      return;
    }

    setIsLoadingRecommendation(true);
    setError(null);
    
    try {
      // Load full analysis with difficulty and learningObjective
      const fullRec = await getQuestionRecommendation(
        youtubeTranscript.text,
        quizConfig.difficulty,
        false
      );
      setRecommendation(fullRec);
      setShowRecommendation(true);

      // Set numberOfQuestions to recommended value
      updateConfig('numberOfQuestions', fullRec.recommended);
    } catch (error) {
      console.error('Failed to load recommendation:', error);
      setError('Gagal menganalisis materi. Silakan coba lagi.');
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  // Polling effect
  useEffect(() => {
    const jobId = localStorage.getItem(STORAGE_KEY);
    if (!jobId || status === 'completed' || status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const result = await checkGenerationStatus(jobId);

        if (result.status === 'completed') {
          setStatus('completed');
          setProgress(100);
          
          if (result.result) {
            setProcessingTime(result.result.processingTime);

            // Set generated questions
            if (quizMode === 'nob') {
              setGeneratedQuiz(result.result.questions);
            } else {
              setGeneratedEssay(result.result.questions);
              setEssayAnswers(new Array(result.result.questions.length).fill(''));
              setEssayScores(new Array(result.result.questions.length).fill(null));
            }

            // Save to database
            try {
              const sessionResult = await saveGeneratedQuestions({
                videoId: youtubeMetadata?.videoId || '',
                videoTitle: youtubeMetadata?.title || '',
                videoUrl: inputUrl,
                videoThumbnail: youtubeMetadata?.thumbnail,
                videoChannel: youtubeMetadata?.channel,
                videoDuration: youtubeMetadata?.duration,
                quizMode,
                questions: result.result.questions,
                transcriptText: youtubeTranscript?.text || '',
              });

              if (sessionResult.sessionId) {
                setQuizSessionId(sessionResult.sessionId);
              }
            } catch (dbError) {
              console.error('Error saving to database:', dbError);
              // Continue anyway, questions are generated
            }

            setCurrentVideoInfo({
              videoId: youtubeMetadata?.videoId || '',
              videoTitle: youtubeMetadata?.title || '',
              videoUrl: inputUrl,
            });

            // Clean up
            localStorage.removeItem(STORAGE_KEY);

            // Navigate
            setTimeout(() => {
              router.push(quizMode === 'nob' ? '/quiz' : '/essay');
            }, 500);
          }
        } else if (result.status === 'failed') {
          setStatus('failed');
          setError(result.error || 'Generation failed');
          localStorage.removeItem(STORAGE_KEY);
        } else if (result.status === 'processing') {
          setProgress(50);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [status, quizMode, youtubeMetadata, inputUrl, youtubeTranscript, setGeneratedQuiz, setGeneratedEssay, setEssayAnswers, setEssayScores, setCurrentVideoInfo, setQuizSessionId, router]);

  const handleStartQuiz = async () => {
    if (!youtubeTranscript?.text) {
      setError('Transkrip tidak tersedia. Silakan coba lagi.');
      return;
    }

    setLoading(true);
    setError(null);

    // Reset state
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setEssayAnswer('');
    setEssayFeedbackMode(false);

    try {
      // Call service to start generation
      const result = await startQuestionGeneration({
        transcript: youtubeTranscript.text,
        numberOfQuestions: quizConfig.numberOfQuestions,
        difficulty: quizConfig.difficulty,
        learningObjective: quizConfig.learningObjective,
        quizMode,
      });

      // Save jobId to localStorage
      localStorage.setItem(STORAGE_KEY, result.jobId);

      setStatus('generating');
      setProgress(10);
    } catch (err: any) {
      setError(err.message || 'Gagal memulai pembuatan soal. Silakan coba lagi.');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Settings className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Konfigurasi {quizMode === 'nob' ? 'Quiz' : 'Essay'}
          </h2>
          <p className="text-slate-600 text-sm lg:text-base">
            Sesuaikan pengaturan sebelum memulai latihan
          </p>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Pengaturan Berubah
                  </h3>
                  <p className="text-sm text-slate-600">
                    Anda mengubah pengaturan. Analisis ulang dengan pengaturan baru?
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleCancelReanalyze}
                  variant="secondary"
                  className="flex-1"
                >
                  Tidak
                </Button>
                <Button
                  onClick={handleConfirmReanalyze}
                  variant="nob"
                  className="flex-1"
                >
                  Ya, Analisis Ulang
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium text-sm">Terjadi Kesalahan</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {status === 'generating' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              <div className="flex-1">
                <p className="text-blue-700 font-medium text-sm">Membuat soal...</p>
                <p className="text-blue-600 text-xs mt-1">Proses ini mungkin memakan waktu beberapa menit</p>
              </div>
            </div>
            <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-blue-600 text-xs text-center">{progress}%</p>
          </div>
        )}

        {status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
            <p className="text-green-700 font-medium text-sm">Soal berhasil dibuat!</p>
            <p className="text-green-600 text-xs">Waktu pemrosesan: {(processingTime / 1000).toFixed(2)} detik</p>
          </div>
        )}

        {status === 'idle' && (
          <div className="bg-white rounded-3xl border-2 border-slate-100 p-6 space-y-6">

          {/* Tingkat Kesulitan */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Tingkat Kesulitan
            </label>
            <div className="space-y-2">
              {QUIZ_CONFIG_OPTIONS.DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => updateConfig('difficulty', diff.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    quizConfig.difficulty === diff.value
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-800">{diff.label}</div>
                  <div className="text-sm text-slate-600 mt-1">{diff.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tujuan Pembelajaran */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Tujuan Pembelajaran
            </label>
            <div className="space-y-2">
              {QUIZ_CONFIG_OPTIONS.LEARNING_OBJECTIVES.map((obj) => (
                <button
                  key={obj.value}
                  onClick={() => updateConfig('learningObjective', obj.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    quizConfig.learningObjective === obj.value
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{obj.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{obj.label}</div>
                      <div className="text-sm text-slate-600 mt-1">{obj.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Section - Shows after analysis */}
          {showRecommendation && (
            <>
              {isLoadingRecommendation ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-blue-300 rounded w-3/4"></div>
                      <div className="h-3 bg-blue-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ) : recommendation ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1">
                          Hasil Analisis Materi
                        </h3>
                        <p className="text-sm text-blue-700 mb-3">
                          {recommendation.reasoning}
                        </p>
                        
                        {/* Metrics */}
                        {recommendation.metrics.estimated_duration_minutes && recommendation.metrics.concept_density && (
                          <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                            <div>
                              <span className="font-medium">Durasi:</span> ~{Math.round(recommendation.metrics.estimated_duration_minutes)} menit
                            </div>
                            <div>
                              <span className="font-medium">Kepadatan:</span> {recommendation.metrics.concept_density}
                            </div>
                            {recommendation.metrics.key_concepts_found !== undefined && (
                              <div>
                                <span className="font-medium">Konsep:</span> {recommendation.metrics.key_concepts_found}
                              </div>
                            )}
                            {recommendation.metrics.examples_found !== undefined && (
                              <div>
                                <span className="font-medium">Contoh:</span> {recommendation.metrics.examples_found}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Jumlah Soal Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Pilih Jumlah Soal
                      <span className="ml-2 text-xs text-slate-500 font-normal">
                        (Range optimal: {recommendation.min} - {recommendation.max})
                      </span>
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[5, 10, 20].map((count) => (
                        <button
                          key={count}
                          onClick={() => updateConfig('numberOfQuestions', count)}
                          className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                            quizConfig.numberOfQuestions === count
                              ? 'bg-sky-600 text-white shadow-lg shadow-sky-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                      <button
                        onClick={() => updateConfig('numberOfQuestions', recommendation.recommended)}
                        className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1 ${
                          quizConfig.numberOfQuestions === recommendation.recommended
                            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                            : 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {recommendation.recommended}
                      </button>
                    </div>
                    
                    {/* Warning if outside recommended range */}
                    {(quizConfig.numberOfQuestions < recommendation.min || quizConfig.numberOfQuestions > recommendation.max) && (
                      <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Jumlah di luar range optimal. Kualitas soal mungkin menurun.
                      </p>
                    )}
                    
                    {/* Success message if following recommendation */}
                    {quizConfig.numberOfQuestions === recommendation.recommended && (
                      <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Jumlah optimal untuk konten ini
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="flex-1"
            disabled={loading || status === 'generating' || isLoadingRecommendation}
          >
            Kembali
          </Button>
          
          {!showRecommendation ? (
            <Button
              onClick={handleAnalyzeContent}
              variant={quizMode === 'nob' ? 'nob' : 'legend'}
              className="flex-1"
              icon={isLoadingRecommendation ? Loader2 : Settings}
              disabled={isLoadingRecommendation || status === 'generating'}
            >
              {isLoadingRecommendation ? 'Menganalisis...' : 'Analisis Materi'}
            </Button>
          ) : (
            <Button
              onClick={handleStartQuiz}
              variant={quizMode === 'nob' ? 'nob' : 'legend'}
              className="flex-1"
              icon={loading ? Loader2 : ArrowRight}
              disabled={loading || status === 'generating' || status === 'completed'}
            >
              {status === 'generating' ? 'Sedang membuat soal...' : status === 'completed' ? 'Soal siap!' : loading ? 'Memulai...' : 'Mulai Latihan'}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
