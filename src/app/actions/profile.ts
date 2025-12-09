'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';

type ProfileUpdateInput = {
  full_name?: string | null;
  avatar_url?: string | null;
};

export async function getProfile(userId: string) {
  try {
    if (!userId) {
      return { error: 'User ID is required' };
    }

    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return { error: error.message };
    }

    return { profile };
  } catch (error) {
    console.error('Unexpected get profile error:', error);
    return { error: 'Terjadi kesalahan saat mengambil profil' };
  }
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdateInput,
) {
  try {
    // Verify user is authenticated and updating their own profile
    const currentUser = await getUser();
    if (!currentUser || currentUser.id !== userId) {
      return { error: 'Unauthorized' };
    }

    if (!userId) {
      return { error: 'User ID is required' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return { error: error.message };
    }

    return { profile: data };
  } catch (error) {
    console.error('Unexpected update profile error:', error);
    return { error: 'Terjadi kesalahan saat memperbarui profil' };
  }
}
