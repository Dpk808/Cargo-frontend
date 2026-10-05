'use client';

import { useState } from 'react';
import { Select } from '@/src/components/ui/Select';
import { useAirlines } from '@/src/features/airlines/hooks/useAirline';
import { useDebounce } from '@/src/hooks/useDebounce';

interface AirlineSelectProps {
  value?: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
}

export function AirlineSelect({ value, onChange, onBlur, label, error }: AirlineSelectProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { data: airlines = [], isLoading } = useAirlines(debouncedSearch);

  const options = airlines.map((airline) => ({
    label: `${airline.name ?? 'Unnamed Airline'} (${airline.prefixCode ?? '-'})`,
    value: airline.id,
  }));

  return (
    <Select
      label={label}
      error={error}
      options={options}
      value={value}
      isLoading={isLoading}
      onSearch={setSearch}
      onChange={(selectedValue) => onChange(selectedValue as number)}
      placeholder="Search airline..."
    />
  );
}