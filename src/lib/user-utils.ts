import { User } from '@supabase/supabase-js';

/**
 * Get user's avatar URL from metadata
 */
export function getUserAvatar(user: User | null | undefined): string | null {
  if (!user) return null;
  return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
}

/**
 * Get user's display name from metadata or email
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'User';
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'
  );
}
