// src/components/ui/SearchBar.tsx
'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={14}
        className="absolute left-3 text-[var(--color-ink)]/40"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-[var(--color-mist)] bg-gray-100 py-2 pl-9 pr-8 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-ocean)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ocean)]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}