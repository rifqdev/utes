'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">Utes</h1>
        <p className="text-slate-600">Platform pembelajaran interaktif</p>
        <div className="pt-4">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Mulai Belajar
          </button>
        </div>
      </div>
    </div>
  );
}
