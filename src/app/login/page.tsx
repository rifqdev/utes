'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AuthLayout } from '@/components/AuthLayout';
import { signInWithGoogle } from '@/app/actions/auth';
import { GoogleIcon } from '@/components/GoogleIcon';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    const result = await signInWithGoogle();
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.url) {
      // Redirect ke Google OAuth
      window.location.href = result.url;
    } else {
      setError('Gagal menghubungkan ke Google. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

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
              Masuk dengan akun Google kamu
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-3 border-2 hover:bg-slate-50"
              disabled={isLoading}
            >
              <GoogleIcon />
              {isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
            </Button>

            {error && (
              <p className="text-xs lg:text-sm text-red-600 text-center">{error}</p>
            )}
          </div>
        </Card>
      </div>
    </AuthLayout>
  );
}
