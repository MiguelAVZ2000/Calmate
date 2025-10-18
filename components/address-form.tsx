'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Address = {
  id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string | null;
};

interface AddressFormProps {
  onFormSubmit: (address: Address) => void;
  initialData?: Address;
}

export function AddressForm({ onFormSubmit, initialData }: AddressFormProps) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postal_code: initialData?.postal_code || '',
    country: initialData?.country || 'USA', // Default country
    phone_number: initialData?.phone_number || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const newAddress = await response.json();
      onFormSubmit(newAddress);
    } catch (error) {
      console.error(error);
      // Here you could show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Calle</Label>
        <Input id="street" name="street" value={formData.street} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado/Provincia</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Código Postal</Label>
          <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone_number">Número de Teléfono (Opcional)</Label>
        <Input id="phone_number" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Dirección'}
      </Button>
    </form>
  );
}
