'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Elimina un usuario de la base de datos de autenticación (sólo para administradores).
 */
export async function deleteUser(userId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error('Error al eliminar usuario:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
}

/**
 * Actualiza el rol de un usuario entre 'admin' y 'user'.
 */
export async function updateUserRole(userId: string, currentRole: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const newRole = currentRole === 'admin' ? 'user' : 'admin';

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: newRole },
  });

  if (error) {
    console.error('Error al actualizar rol del usuario:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
}
