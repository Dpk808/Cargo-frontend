// src/features/bank/components/BankDropdown.tsx
'use client';

import { useState } from 'react';
import { Select } from '@/src/components/ui/Select';
import { useBankDropdown } from '@/src/features/bank/hooks/useBank';

interface BankSelectProps {
  value?: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
}

export function BankSelect({ value, onChange, onBlur, label, error }: BankSelectProps) {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useBankDropdown(search);

  const options =
    data?.items.map((bank) => ({
      label: bank.bankName,
      value: bank.id,
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
      placeholder="Search bank..."
    />
  );
}
