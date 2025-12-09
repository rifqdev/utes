import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export interface AuthenticatedContext {
  supabase: SupabaseClient;
  user: User;
}

/**
 * Get authenticated user and supabase client
 * Throws error if user is not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedContext> {
  const supabase = await createClient();
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  return { supabase, user };
}
