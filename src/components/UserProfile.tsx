'use client';

import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { Button } from './Button';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
      <div className="p-2 bg-indigo-100 rounded-full">
        <UserIcon className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {user.email}
        </p>
        <p className="text-xs text-slate-500">Logged in</p>
      </div>
      <button
        onClick={handleSignOut}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
