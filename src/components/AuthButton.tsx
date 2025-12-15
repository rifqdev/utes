'use client';

import { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { LogoutButton } from './LogoutButton';
import { UserAvatar } from './UserAvatar';
import { getUserDisplayName } from '@/lib/user-utils';

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

  const displayName = getUserDisplayName(user);

  return (
    <div className="flex items-center gap-3">
      {/* User Info */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
        <UserAvatar user={user} size="sm" />
        <span className="text-sm font-medium text-slate-700">{displayName}</span>
      </div>

      {/* Logout Button */}
      <LogoutButton variant="icon" />
    </div>
  );
};
