'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { AuthLayout } from '@/components/AuthLayout';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Memverifikasi magic link...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error) {
      setStatus('error');
      setMessage('Magic link tidak valid atau sudah kadaluarsa');
    } else {
      // Jika tidak ada error, berarti route handler sudah handle redirect
      // Page ini hanya ditampilkan jika ada error
      setStatus('success');
      setMessage('Login berhasil! Mengalihkan...');
      setTimeout(() => {
        router.push('/app');
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <AuthLayout>
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center space-y-4 lg:space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          {status === 'loading' && (
            <div className="p-3 lg:p-4 bg-indigo-100 rounded-full">
              <Loader2 className="text-indigo-600 animate-spin w-10 h-10 lg:w-12 lg:h-12" />
            </div>
          )}
          {status === 'success' && (
            <div className="p-3 lg:p-4 bg-green-100 rounded-full animate-bounce">
              <CheckCircle2 className="text-green-600 w-10 h-10 lg:w-12 lg:h-12" />
            </div>
          )}
          {status === 'error' && (
            <div className="p-3 lg:p-4 bg-red-100 rounded-full">
              <XCircle className="text-red-600 w-10 h-10 lg:w-12 lg:h-12" />
            </div>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
            {status === 'loading' && 'Memverifikasi...'}
            {status === 'success' && 'Berhasil!'}
            {status === 'error' && 'Oops!'}
          </h1>
          <p className="text-slate-600 text-sm lg:text-base">{message}</p>
        </div>

        {/* Loading Progress */}
        {status === 'loading' && (
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => router.push('/login')}
              variant="primary"
              className="w-full"
            >
              Kembali ke Login
            </Button>
            <p className="text-xs text-slate-500">
              Pastikan kamu mengklik link terbaru dari email
            </p>
          </div>
        )}

        {/* Success Info */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 lg:p-4 text-xs lg:text-sm text-slate-700">
            <p>🎉 Kamu akan dialihkan ke halaman utama</p>
          </div>
        )}
      </Card>
    </div>
    </AuthLayout>
  );
}
