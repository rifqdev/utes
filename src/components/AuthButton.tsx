'use client';

import { useEffect, useState } from 'react';
import { LogIn, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { LogoutButton } from './LogoutButton';

export const AuthButton = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="px-4 py-2 bg-slate-100 rounded-lg animate-pulse">
        <div className="h-5 w-20 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <LogIn size={18} />
        <span className="font-medium">Masuk</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* User Info */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
        <div className="p-1.5 bg-indigo-100 rounded-full">
          <User size={16} className="text-indigo-600" />
        </div>
        <span className="text-sm font-medium text-slate-700">{user.email}</span>
      </div>

      {/* Logout Button */}
      <LogoutButton variant="icon" />
    </div>
  );
};
