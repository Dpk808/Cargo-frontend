import { useState } from 'react';

interface UseTableOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

export function useTable({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = '',
}: UseTableOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearchValue] = useState(initialSearch);

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
    search,
    setPage,
    setLimit: changeLimit,
    setSearch,
  };
}