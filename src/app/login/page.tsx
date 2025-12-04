'use client';

import { useState } from 'react';
import { Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AuthLayout } from '@/components/AuthLayout';
import { signInWithMagicLink } from '@/app/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signInWithMagicLink(email);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setEmailSent(true);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await signInWithMagicLink(email);
    
    if (result.error) {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <AuthLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center space-y-4 lg:space-y-6">
          <div className="flex justify-center">
            <div className="p-3 lg:p-4 bg-green-100 rounded-full">
              <CheckCircle2 className="text-green-600 w-10 h-10 lg:w-12 lg:h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
              Cek Email Kamu!
            </h1>
            <p className="text-slate-600 text-sm lg:text-base">
              Kami sudah mengirim magic link ke
            </p>
            <p className="font-semibold text-indigo-600 text-sm lg:text-base">{email}</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 lg:p-4 text-xs lg:text-sm text-slate-700">
            <p className="mb-1 lg:mb-2">📧 Klik link di email untuk masuk</p>
            <p className="text-[10px] lg:text-xs text-slate-500">
              Link akan kadaluarsa dalam 15 menit
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim ulang...' : 'Kirim Ulang Email'}
            </Button>

            <button
              onClick={() => setEmailSent(false)}
              className="text-xs lg:text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Gunakan email lain
            </button>
          </div>
        </Card>
      </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 lg:space-y-3">
          <div className="flex justify-center">
            <div className="p-2 lg:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="text-white w-6 h-6 lg:w-8 lg:h-8" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
            Selamat Datang!
          </h1>
          <p className="text-slate-600 text-sm lg:text-base">
            Masuk dengan magic link tanpa password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs lg:text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm lg:text-base"
              />
            </div>
            {error && (
              <p className="text-xs lg:text-sm text-red-600">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            icon={ArrowRight}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Mengirim Magic Link...' : 'Kirim Magic Link'}
          </Button>
        </form>

        {/* Info */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 lg:p-4 space-y-1 lg:space-y-2">
          <p className="text-xs lg:text-sm font-medium text-slate-700">
            ✨ Apa itu Magic Link?
          </p>
          <p className="text-[10px] lg:text-xs text-slate-600 leading-relaxed">
            Magic link adalah cara login tanpa password. Kamu cukup masukkan email, 
            lalu klik link yang kami kirim ke inbox kamu. Mudah dan aman!
          </p>
        </div>
      </Card>
    </div>
    </AuthLayout>
  );
}
