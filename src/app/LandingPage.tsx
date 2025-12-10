'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { 
  Brain, 
  Target, 
  Sparkles, 
  Layout, 
  ArrowRight, 
  BarChart,
  Zap,
  BookOpen,
  Settings,
  Trophy,
  Github,
  Mail
} from 'lucide-react';
import { useState } from 'react';

// Constants for better maintainability
const FEATURES = [
  {
    icon: Target,
    title: 'Dua Level Tantangan',
    description: 'Pilih mode yang sesuai dengan kebutuhan Anda:',
    details: [
      { label: 'NOB', desc: 'Mode pilihan ganda cepat', color: 'bg-sky-500' },
      { label: 'LEGEND', desc: 'Mode essay dengan analisis AI', color: 'bg-orange-500' }
    ]
  },
  {
    icon: Settings,
    title: 'Konfigurasi Fleksibel',
    description: 'Sesuaikan quiz dengan kebutuhan belajar Anda. Atur jumlah soal, tingkat kesulitan, hingga target pembelajaran Taksonomi Bloom.',
    details: undefined
  },
  {
    icon: Brain,
    title: 'Analisis AI Cerdas',
    description: 'Dapatkan feedback instan dan mendalam untuk setiap jawaban essay Anda. AI kami menganalisis pemahaman konsep Anda secara akurat.',
    details: undefined
  }
];

const STEPS = [
  { icon: Layout, title: 'Login', desc: 'Masuk ke dashboard aplikasi' },
  { icon: BookOpen, title: 'Pilih Materi', desc: 'Tentukan topik pembelajaran' },
  { icon: Zap, title: 'Kerjakan Quiz', desc: 'Jawab soal dari AI' },
  { icon: BarChart, title: 'Dapat Feedback', desc: 'Lihat hasil analisis' }
] as const;

export default function LandingPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStart = async () => {
    setIsNavigating(true);
    router.push('/login');
  };

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <header className="relative pt-16 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-purple-50 opacity-60" aria-hidden="true" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs sm:text-sm border border-indigo-100">
                <Sparkles size={16} aria-hidden="true" />
                <span>Platform Pembelajaran AI</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Evaluasi Pemahaman Materi <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  dengan Cerdas
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                UTES membantu Anda menguji pemahaman melalui soal pilihan ganda dan essay mendalam dengan analisis AI yang akurat.
              </p>
              
              <div className="pt-4">
                <Button 
                  onClick={handleStart}
                  disabled={isNavigating}
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 focus:ring-4 focus:ring-indigo-200"
                  icon={isNavigating ? undefined : ArrowRight}
                >
                  {isNavigating ? 'Memuat...' : 'Mulai Belajar'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content">
          {/* Features Section */}
          <section className="py-16 sm:py-24 bg-white" aria-labelledby="features-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                  Fitur Unggulan
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
                  Didesain untuk memaksimalkan proses pembelajaran Anda dengan berbagai mode dan konfigurasi fleksibel.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {FEATURES.map((feature, index) => (
                  <Card 
                    key={index}
                    className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                      <feature.icon size={24} aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.details && (
                      <ul className="space-y-2 text-sm text-slate-600">
                        {feature.details.map((detail: { label: string; desc: string; color: string }, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${detail.color} flex-shrink-0`} aria-hidden="true" />
                            <span><strong>{detail.label}:</strong> {detail.desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 sm:py-24 bg-slate-50" aria-labelledby="how-it-works-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                  Cara Kerja
                </h2>
                <p className="text-slate-600 text-base sm:text-lg">
                  Langkah mudah untuk mulai meningkatkan pemahaman Anda
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
                {STEPS.map((step, index) => (
                  <div key={index} className="relative text-center group">
                    <div className="h-16 w-16 bg-white rounded-2xl shadow-md border border-slate-200 flex items-center justify-center text-indigo-600 mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <step.icon size={28} aria-hidden="true" />
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-12 sm:px-8 sm:py-16 lg:p-20 text-center">
                <Trophy size={48} className="mx-auto mb-6 text-indigo-200" aria-hidden="true" />
                <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                  Siap Menguji Kemampuanmu?
                </h2>
                <p className="text-indigo-100 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                  Mulai perjalanan belajarmu sekarang dan dapatkan evaluasi mendalam untuk setiap materi yang kamu pelajari.
                </p>
                <Button 
                  onClick={handleStart}
                  disabled={isNavigating}
                  variant="secondary"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 focus:ring-4 focus:ring-white/30"
                >
                  {isNavigating ? 'Memuat...' : 'Mulai Belajar Sekarang'}
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  UTES
                </div>
                <p className="text-slate-500 text-sm">Platform Pembelajaran Interaktif</p>
              </div>
              
              <div className="flex items-center gap-6">
                <a 
                  href="mailto:support@utes.com" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
                  aria-label="Email support"
                >
                  <Mail size={20} />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
                  aria-label="GitHub repository"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} UTES. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
