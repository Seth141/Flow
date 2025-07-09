'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('Login error:', error.message);
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('Login successful for user:', user?.email);

  //  revalidate all pages that depend on authentication state
  revalidatePath('/', 'layout');
  redirect('/');
}
