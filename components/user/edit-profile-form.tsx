'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export function EditProfileForm({
  profile,
  regions,
  communes,
  onSave,
  onCancel,
}) {
  const { supabase, user } = useSupabase();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [filteredCommunes, setFilteredCommunes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setAddress(profile.address ?? '');
      setRegion(profile.region ?? '');
      setComuna(profile.comuna ?? '');
    }
  }, [profile]);

  useEffect(() => {
    if (region && regions.length > 0 && communes.length > 0) {
      const selectedRegion = regions.find((r) => r.name === region);
      if (selectedRegion) {
        const relatedCommunes = communes.filter(
          (c) => c.region_id === selectedRegion.id
        );
        setFilteredCommunes(relatedCommunes);
      } else {
        setFilteredCommunes([]);
      }
    } else {
      setFilteredCommunes([]);
    }
  }, [region, regions, communes]);

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setComuna(''); // Reset comuna when region changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Updating profile for user ID:', user?.id);

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        address: address,
        region: region,
        comuna: comuna,
      })
      .eq('id', user.id)
      .select(); // Important: .select() will return the updated data

    if (error) {
      console.error('Error updating profile:', error);
      toast.error(`Error al actualizar el perfil: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log('Profile updated successfully:', data);
      toast.success('Perfil actualizado con éxito.');
      onSave();
      router.refresh();
    } else {
      console.error(
        'Update returned no data and no error. This might be an RLS issue.'
      );
      toast.error('No se pudo actualizar el perfil. Verifique los permisos.');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='fullName'>Nombre Completo</Label>
        <Input
          id='fullName'
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='address'>Calle y Número</Label>
        <Input
          id='address'
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='region'>Región</Label>
          <Select value={region} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder='Seleccione una región' />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.id} value={r.name}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='comuna'>Comuna</Label>
          <Select
            value={comuna}
            onValueChange={setComuna}
            disabled={!region || filteredCommunes.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccione una comuna' />
            </SelectTrigger>
            <SelectContent>
              {filteredCommunes.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex justify-end space-x-4 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
