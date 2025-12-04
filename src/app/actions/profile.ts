'use server';

import { createClient } from '@/lib/supabase/server';
import { ProfileUpdate } from '@/types';

export async function getProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { profile };
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { profile: data };
}
