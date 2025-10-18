'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddressForm } from '@/components/address-form';

// Define the Address type according to your DB schema
type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string | null;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch('/api/addresses');
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, []);

  const handleFormSubmit = (newAddress: Address) => {
    setAddresses((prev) => [...prev, newAddress]);
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Direcciones</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>Añadir Nueva Dirección</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Dirección</DialogTitle>
            </DialogHeader>
            <AddressForm onFormSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Cargando direcciones...</p>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg p-6">
              <p className="font-semibold">{address.street}</p>
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
              {address.phone_number && <p>Tel: {address.phone_number}</p>}
              {/* Add Edit/Delete buttons later */}
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes ninguna dirección guardada.</p>
      )}
    </div>
  );
}
