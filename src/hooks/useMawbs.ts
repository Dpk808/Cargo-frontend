import { useQuery } from '@tanstack/react-query';
import * as mawbApi from '@/src/features/mawb/api/mawb.api';
import { useMawbs as usePaginatedMawbs, useMawbById } from '@/src/features/mawb/hooks/useMawb';

export function useMawbs() {
  const result = usePaginatedMawbs();

  return {
    ...result,
    data: result.data?.items ?? [],
  };
}

export function useMawb(id: number) {
  return useQuery({
    queryKey: ['mawbs', id],
    queryFn: () => mawbApi.getMawb(id),
    enabled: id > 0,
  });
}

export { useMawbById };
