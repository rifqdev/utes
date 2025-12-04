'use client';

import { User } from '@supabase/supabase-js';
import { User as UserIcon } from 'lucide-react';
import { LogoutButton } from './LogoutButton';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
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
      <LogoutButton variant="icon" />
    </div>
  );
}
