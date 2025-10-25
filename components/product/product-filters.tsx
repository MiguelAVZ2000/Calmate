'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

type Category = {
  id: number;
  name: string;
  slug: string;
};

export function ProductFilters({
  initialSearchParams,
}: {
  initialSearchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultSort, setDefaultSort] = useState(
    initialSearchParams && initialSearchParams.sort
      ? (initialSearchParams.sort as string)
      : ''
  );
  const [defaultCategory, setDefaultCategory] = useState(
    initialSearchParams && initialSearchParams.category
      ? (initialSearchParams.category as string)
      : ''
  );
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

      if (data) {
        setCategories(data);
      }
      if (error) {
        console.error('Error al obtener las categorías:', error);
        setError('Error al cargar categorías');
      }
      setLoading(false);
    }
    fetchCategories();
  }, [supabase]);

  const handleFilterChange = (type: 'sort' | 'category', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'all') {
      current.delete(type);
    } else {
      current.set(type, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${pathname}${query}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 mb-8'>
      <div className='flex-1'>
        <Select
          onValueChange={(value) => handleFilterChange('sort', value)}
          defaultValue={defaultSort}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='price-asc'>Precio: Menor a mayor</SelectItem>
            <SelectItem value='price-desc'>Precio: Mayor a menor</SelectItem>
            <SelectItem value='rating-desc'>
              Calificación: Mejor a peor
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex-1'>
        <Select
          onValueChange={(value) => handleFilterChange('category', value)}
          defaultValue={defaultCategory}
          disabled={loading || !!error}
        >
          <SelectTrigger className='w-full'>
            <SelectValue
              placeholder={
                loading
                  ? 'Cargando categorías...'
                  : error || 'Filtrar por categoría'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {(searchParams.get('sort') || searchParams.get('category')) && (
        <Button variant='ghost' onClick={clearFilters}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
