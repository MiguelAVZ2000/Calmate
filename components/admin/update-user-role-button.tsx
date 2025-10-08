"use client"

import { Button } from "@/components/ui/button"
import { updateUserRole } from "@/app/actions"

export function UpdateUserRoleButton({ userId, role }: { userId: string, role: string }) {
  const handleUpdate = async () => {
    if (!confirm(`¿Estás seguro de que quieres cambiar el rol de este usuario a "${role === 'admin' ? 'user' : 'admin'}"?`)) {
      return
    }
    await updateUserRole(userId, role)
  }

  return (
    <Button onClick={handleUpdate} variant="secondary" size="sm">
      {role === 'admin' ? 'Hacer Usuario' : 'Hacer Admin'}
    </Button>
  )
}