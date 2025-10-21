'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function deleteUser(userId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error('Error deleting user:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
}

export async function updateUserRole(userId: string, currentRole: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const newRole = currentRole === 'admin' ? 'user' : 'admin';

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: newRole },
  });

  if (error) {
    console.error('Error updating user role:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
}
