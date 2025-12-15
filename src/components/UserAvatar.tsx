import { User } from '@supabase/supabase-js';
import { User as UserIcon } from 'lucide-react';
import { getUserAvatar, getUserDisplayName } from '@/lib/user-utils';

interface UserAvatarProps {
  user: User | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-7 h-7',
    icon: 16,
  },
  md: {
    container: 'w-8 h-8',
    icon: 18,
  },
  lg: {
    container: 'w-10 h-10',
    icon: 20,
  },
};

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const avatarUrl = getUserAvatar(user);
  const displayName = getUserDisplayName(user);
  const config = sizeConfig[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={`${config.container} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${config.container} bg-indigo-100 rounded-full flex items-center justify-center ${className}`}>
      <UserIcon size={config.icon} className="text-indigo-600" />
    </div>
  );
}
