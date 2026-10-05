import { useState } from 'react';
import { useDebounce } from '@/src/hooks/useDebounce';

interface UseTableOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  debounceDelay?: number;
}

export function useTable({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = '',
  debounceDelay = 400,
}: UseTableOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearchValue] = useState(initialSearch);

  const debouncedSearch = useDebounce(search, debounceDelay);

  const setSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const changeLimit = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return {
    page,
    limit,
    search,          // raw — bind to SearchBar value
    debouncedSearch, // debounced — use in query
    setPage,
    setLimit: changeLimit,
    setSearch,
  };
}