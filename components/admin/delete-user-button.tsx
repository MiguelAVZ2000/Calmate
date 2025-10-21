'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteUser } from '@/app/actions';

export function DeleteUserButton({ userId }: { userId: string }) {
  const handleDelete = async () => {
    if (
      !confirm(
        '¿Estás ABSOLUTAMENTE seguro de que quieres eliminar este usuario? Esta acción es irreversible.'
      )
    ) {
      return;
    }
    await deleteUser(userId);
  };

  return (
    <Button variant='destructive' size='icon' onClick={handleDelete}>
      <Trash2 className='h-4 w-4' />
    </Button>
  );
}
