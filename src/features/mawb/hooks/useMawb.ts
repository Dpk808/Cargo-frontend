import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as mawbApi from '@/src/features/mawb/api/mawb.api';
import { useTable } from '@/src/hooks/useTable';
import type { CreateMawbPayload, UpdateMawbPayload } from '@/src/types/index';

const MAWB_QUERY_KEY = ['mawbs'] as const;

/** Paginated / searchable list of MAWBs */
export function useMawbs() {
  const table = useTable();

  const query = {
    page: table.page,
    limit: table.limit,
    search: table.debouncedSearch,
  };

  const result = useQuery({
    queryKey: [...MAWB_QUERY_KEY, query],
    queryFn: () => mawbApi.getMawbs(query),
    placeholderData: keepPreviousData,
  });

  return { ...result, table };
}

/** Single MAWB by ID */
export function useMawbById(id: number | undefined) {
  return useQuery({
    queryKey: [...MAWB_QUERY_KEY, id],
    queryFn: () => mawbApi.getMawb(id!),
    enabled: !!id,
  });
}

export function useCreateMawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMawbPayload) => mawbApi.createMawb(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_QUERY_KEY });
    },
  });
}

export function useUpdateMawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMawbPayload }) =>
      mawbApi.updateMawb(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_QUERY_KEY });
    },
  });
}

export function useDeleteMawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mawbApi.deleteMawb(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_QUERY_KEY });
    },
  });
}
