import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as hawbApi from '@/src/features/hawb/api/hawb.api';
import { useTable } from '@/src/hooks/useTable';
import type { CreateHawbPayload, UpdateHawbPayload } from '@/src/types/hawb.types';

const HAWB_QUERY_KEY = ['hawbs'] as const;

/** Paginated list with search — use in list/table pages */
export function useHawbs() {
  const table = useTable();

  const query = {
    page: table.page,
    limit: table.limit,
    search: table.debouncedSearch,
  };

  const result = useQuery({
    queryKey: [...HAWB_QUERY_KEY, query],
    queryFn: () => hawbApi.getHawbs(query),
    placeholderData: keepPreviousData,
  });

  return { ...result, table };
}

/** Single HAWB — use in edit/detail pages */
export function useHawbById(id: number | undefined) {
  return useQuery({
    queryKey: [...HAWB_QUERY_KEY, id],
    queryFn: () => hawbApi.getHawb(id!),
    enabled: !!id,
  });
}

export function useCreateHawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHawbPayload) => hawbApi.createHawb(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HAWB_QUERY_KEY });
    },
  });
}

export function useUpdateHawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateHawbPayload }) =>
      hawbApi.updateHawb(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HAWB_QUERY_KEY });
    },
  });
}

export function useDeleteHawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hawbApi.deleteHawb(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HAWB_QUERY_KEY });
    },
  });
}
