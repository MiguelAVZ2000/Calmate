'use client';

import * as React from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Address {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: { comuna: string; region: string }) => void;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
}: AddressAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(false);
  // Use local state for query to allow immediate typing, but debounce search
  const debouncedQuery = useDebounce(value, 500);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Only search if length > 3 and the query isn't exactly what we just selected (to avoid re-opening on select)

    if (!debouncedQuery || debouncedQuery.length < 4) {
      setResults([]);
      return;
    }

    async function searchAddress() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&countrycodes=cl&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setResults(data);
        if (data.length > 0) setOpen(true);
      } catch (error) {
        console.error('Error searching address:', error);
      } finally {
        setLoading(false);
      }
    }

    // Only trigger search if value changed and looks like a search
    searchAddress();
  }, [debouncedQuery]);

  // Handle outside click to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: Address) => {
    // Construct the address line
    const road = item.address.road || item.display_name.split(',')[0];
    const number = item.address.house_number
      ? ` ${item.address.house_number}`
      : '';
    const fullAddress = `${road}${number}`.trim();

    onChange(fullAddress);

    const comuna = item.address.suburb || item.address.city || '';
    const region = item.address.state || '';

    onAddressSelect({
      comuna,
      region,
    });

    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className='relative z-50'>
      <div className='relative'>
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!open && e.target.value.length > 3) setOpen(true);
          }}
          placeholder='Dirección y número (ej: Av. Providencia 1234)'
          className='h-10 border-input focus-visible:ring-ring focus-visible:border-primary pr-10'
        />
        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
          {loading ? (
            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
          ) : (
            <MapPin className='h-4 w-4 text-muted-foreground' />
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <ul className='absolute top-full left-0 w-full mt-1 bg-popover border border-border shadow-md rounded-md max-h-60 overflow-auto z-50 animate-in fade-in zoom-in-95 duration-200'>
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className='px-4 py-3 text-sm cursor-pointer hover:bg-muted/50 flex items-start gap-3 border-b border-border last:border-0 transition-colors'
            >
              <MapPin className='h-4 w-4 text-primary mt-0.5 shrink-0' />
              <div className='flex flex-col'>
                <span className='font-semibold text-foreground'>
                  {item.address.road || item.display_name.split(',')[0]}{' '}
                  {item.address.house_number}
                </span>
                <span className='text-[10px] text-muted-foreground uppercase tracking-tight'>
                  {item.address.suburb ? `${item.address.suburb}, ` : ''}
                  {item.address.city ? `${item.address.city}, ` : ''}
                  {item.address.state}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
