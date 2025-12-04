'use client';

import { LogOut } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { useState } from 'react';

interface LogoutButtonProps {
  variant?: 'icon' | 'button' | 'text';
  className?: string;
}

export function LogoutButton({ variant = 'button', className = '' }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Keluar"
      >
        <LogOut className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <LogOut size={18} className="text-red-600" />
        <span className="text-sm font-medium text-slate-700 group-hover:text-red-600">
          {isLoading ? 'Keluar...' : 'Keluar'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isLoading ? 'Keluar...' : 'Keluar'}
      </span>
    </button>
  );
}
