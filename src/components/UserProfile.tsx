'use client';

import { User } from '@supabase/supabase-js';
import { LogoutButton } from './LogoutButton';
import { UserAvatar } from './UserAvatar';
import { getUserDisplayName } from '@/lib/user-utils';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const displayName = getUserDisplayName(user);

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
      <UserAvatar user={user} size="lg" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {displayName}
        </p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
      <LogoutButton variant="icon" />
    </div>
  );
}
