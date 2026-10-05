'use client';

export interface SelectFilterConfig {
  type: 'select';
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

export interface DateRangeFilterConfig {
  type: 'daterange';
  key: string;
  label: string;
}

export type FilterConfig = SelectFilterConfig | DateRangeFilterConfig;

export interface DateRangeValue {
  from: string;
  to: string;
}

export type FilterValues = Record<string, string | DateRangeValue>;

interface FilterBarProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  className?: string;
}

export default function FilterBar({
  filters,
  values,
  onChange,
  className = '',
}: FilterBarProps) {
  const handleChange = (key: string, value: string | DateRangeValue) => {
    onChange({ ...values, [key]: value });
  };

  const handleClear = () => {
    const cleared: FilterValues = {};
    filters.forEach((f) => {
      cleared[f.key] = f.type === 'daterange' ? { from: '', to: '' } : '';
    });
    onChange(cleared);
  };

  const hasActiveFilters = filters.some((f) => {
    const val = values[f.key];
    if (f.type === 'daterange') {
      return (val as DateRangeValue)?.from || (val as DateRangeValue)?.to;
    }
    return !!val;
  });

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filters.map((filter) => {
        if (filter.type === 'select') {
          return (
            <select
              key={filter.key}
              value={(values[filter.key] as string) ?? ''}
              onChange={(e) => handleChange(filter.key, e.target.value)}
              className="h-9 rounded-lg border border-[var(--color-mist)] bg-white px-3 text-xs text-[var(--color-ink)] focus:border-[var(--color-ocean)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ocean)]"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        if (filter.type === 'daterange') {
          const val = (values[filter.key] as DateRangeValue) ?? { from: '', to: '' };
          return (
            <div key={filter.key} className="flex items-center gap-1">
              <span className="text-xs text-[var(--color-ink)]/50">{filter.label}</span>
              <input
                type="date"
                value={val.from}
                onChange={(e) =>
                  handleChange(filter.key, { ...val, from: e.target.value })
                }
                className="h-9 rounded-lg border border-[var(--color-mist)] bg-white px-3 text-xs text-[var(--color-ink)] focus:border-[var(--color-ocean)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ocean)]"
              />
              <span className="text-xs text-[var(--color-ink)]/40">to</span>
              <input
                type="date"
                value={val.to}
                onChange={(e) =>
                  handleChange(filter.key, { ...val, to: e.target.value })
                }
                className="h-9 rounded-lg border border-[var(--color-mist)] bg-white px-3 text-xs text-[var(--color-ink)] focus:border-[var(--color-ocean)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ocean)]"
              />
            </div>
          );
        }
      })}

      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="h-9 rounded-lg px-3 text-xs text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}