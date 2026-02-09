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

  // Validar formato de UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return { error: 'ID de usuario inválido' };
  }

  // Verificar que el usuario actual es administrador
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autorizado' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Permisos insuficientes' };
  }

  // Prevenir auto-eliminación
  if (userId === user.id) {
    return { error: 'No puedes eliminar tu propia cuenta' };
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error('Error al eliminar usuario:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Actualiza el rol de un usuario entre 'admin' y 'user'.
 */
export async function updateUserRole(userId: string, currentRole: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Validar formato de UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return { error: 'ID de usuario inválido' };
  }

  // Validar que el rol actual es válido
  if (!['admin', 'user'].includes(currentRole)) {
    return { error: 'Rol inválido' };
  }

  // Verificar que el usuario actual es administrador
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'No autorizado' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Permisos insuficientes' };
  }

  // Prevenir auto-modificación de permisos
  if (userId === user.id) {
    return { error: 'No puedes modificar tu propio rol' };
  }

  const newRole = currentRole === 'admin' ? 'user' : 'admin';

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: newRole },
  });

  if (error) {
    console.error('Error al actualizar rol del usuario:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true, newRole };
}
