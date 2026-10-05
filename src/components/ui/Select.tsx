'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

interface Option {
  label: string;
  value: number | string;
}

interface SelectProps {
  options: Option[];
  value?: number | string | null;
  onChange: (value: number | string) => void;
  onSearch?: (search: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  /** Native form field name — enables use inside <form> without onChange wiring */
  name?: string;
  required?: boolean;
}

const DROPDOWN_MAX_HEIGHT = 208; // max-h-52
const DROPDOWN_OFFSET = 4;

function computeDropdownStyle(
  anchorRect: DOMRect,
  dropdownHeight: number
): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceBelow = vh - anchorRect.bottom - DROPDOWN_OFFSET;
  const spaceAbove = anchorRect.top - DROPDOWN_OFFSET;
  const fitsBelow = spaceBelow >= Math.min(dropdownHeight, DROPDOWN_MAX_HEIGHT);

  // Vertical: prefer below, flip above if not enough room
  const top = fitsBelow
    ? anchorRect.bottom + DROPDOWN_OFFSET
    : Math.max(DROPDOWN_OFFSET, anchorRect.top - Math.min(dropdownHeight, DROPDOWN_MAX_HEIGHT) - DROPDOWN_OFFSET);

  // Horizontal: align to left edge of anchor, clamp so it doesn't overflow right
  const idealLeft = anchorRect.left;
  const width = Math.max(anchorRect.width, 160);
  const clampedLeft = Math.min(idealLeft, vw - width - DROPDOWN_OFFSET);
  const left = Math.max(DROPDOWN_OFFSET, clampedLeft);

  return {
    position: 'fixed',
    top,
    left,
    width,
    zIndex: 9999,
  };
}

export function Select({
  options,
  value,
  onChange,
  onSearch,
  placeholder = 'Select...',
  label,
  error,
  isLoading,
  disabled,
  name,
  required,
}: SelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  // Compute and store position once when opening
  const computePosition = useCallback(() => {
    const anchor = containerRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const h = dropdownRef.current?.offsetHeight ?? DROPDOWN_MAX_HEIGHT;
    setDropdownStyle(computeDropdownStyle(rect, h));
  }, []);

  // Open/close
  function openDropdown() {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(selected ? options.findIndex((o) => o.value === value) : -1);
  }

  function closeDropdown(clearSearch = true) {
    setOpen(false);
    if (clearSearch) {
      setSearch('');
      onSearch?.('');
    }
  }

  // Compute position once after dropdown mounts (needs a frame for dropdownRef to have height)
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(computePosition);
    return () => cancelAnimationFrame(raf);
  }, [open, computePosition]);

  // Close on scroll or resize — don't try to chase the anchor
  useEffect(() => {
    if (!open) return;
    const close = () => closeDropdown();
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close, { passive: true });
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      closeDropdown();
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          handleSelect(options[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        inputRef.current?.blur();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  function handleSearch(val: string) {
    setSearch(val);
    onSearch?.(val);
    setActiveIndex(-1);
    if (!open) openDropdown();
  }

  function handleSelect(option: Option) {
    onChange(option.value);
    closeDropdown();
    inputRef.current?.blur();
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    // Signal "no value" — pass empty string; caller decides how to handle
    onChange('');
    setSearch('');
    onSearch?.('');
    closeDropdown(false);
  }

  const showClear = !disabled && value !== null && value !== undefined && value !== '';

  const dropdown = open
    ? createPortal(
        <div
          ref={dropdownRef}
          role="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
          className="rounded-lg border border-[var(--color-mist)] bg-white shadow-xl"
          style={dropdownStyle}
        >
          <ul ref={listRef} className="max-h-52 overflow-y-auto py-1">
            {isLoading ? (
              <li className="px-3 py-2 text-sm text-[var(--color-ink)]/50">Loading…</li>
            ) : options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--color-ink)]/50">No options found</li>
            ) : (
              options.map((option, idx) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors duration-75 select-none
                    ${option.value === value
                      ? 'bg-[var(--color-ocean)]/10 text-[var(--color-ocean)] font-medium'
                      : idx === activeIndex
                      ? 'bg-[var(--color-canvas)] text-[var(--color-ink)]'
                      : 'text-[var(--color-ink)] hover:bg-[var(--color-canvas)]'
                    }`}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label
          id={`${id}-label`}
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-ink)]"
        >
          {label}
        </label>
      )}

      {/* Hidden input carries the real value for form submissions */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          required={required}
        />
      )}

      {/* Visible search/display input */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? search : (selected?.label ?? '')}
          onClick={() => { if (open) closeDropdown(); else openDropdown(); }}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-11 w-full rounded-lg border px-3 pr-8 text-sm outline-none transition-all duration-150
            ${error ? 'border-red-400 ring-1 ring-red-300' : 'border-[var(--color-mist)]'}
            ${open ? 'border-[var(--color-ocean)] ring-2 ring-[var(--color-ocean)]/15' : 'hover:border-[var(--color-ocean)]/40'}
            ${disabled ? 'bg-[var(--color-canvas)] text-[var(--color-ink)]/50 cursor-not-allowed' : 'bg-white text-[var(--color-ink)] cursor-pointer'}
          `}
        />

        {/* Chevron / clear button */}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {showClear ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="pointer-events-auto rounded text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70 transition-colors"
              aria-label="Clear selection"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className={`transition-transform duration-150 text-[var(--color-ink)]/40 ${open ? 'rotate-180' : ''}`}
            >
              <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </div>

      {dropdown}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}