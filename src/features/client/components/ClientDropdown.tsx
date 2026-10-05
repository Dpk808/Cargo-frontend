// src/features/client/components/ClientSelect.tsx
'use client';

import { useState } from 'react';
import { Select } from '@/src/components/ui/Select';
import { useClientDropdown } from '@/src/features/client/hooks/useClient';
import { useDebounce } from '@/src/hooks/useDebounce';

interface ClientSelectProps {
  value?: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
}

export function ClientSelect({ value, onChange, onBlur, label, error }: ClientSelectProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search); // 400ms default

  const { data, isLoading } = useClientDropdown(debouncedSearch);
  

  const options = data?.items.map((client) => ({
    label: client.name,
    value: client.id,
  })) ?? [];

  return (
    <Select
      label={label}
      error={error}
      options={options}
      value={value}
      isLoading={isLoading}
      onSearch={setSearch}
      onChange={(val) => onChange(val as number)}
      placeholder="Search client..."
    />
  );
}