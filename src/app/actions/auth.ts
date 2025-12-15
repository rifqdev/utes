'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google sign in error:', error);
      return { error: error.message };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected sign out error:', error);
  }
  
  redirect('/login');
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Get user error:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Unexpected get user error:', error);
    return null;
  }
}
