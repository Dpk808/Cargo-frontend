import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as mawbApi from '@/src/utils/api/mawbs';
import type { CreateMawbPayload, UpdateMawbPayload } from '@/src/types/entities';

const MAWB_QUERY_KEY = ['mawbs'] as const;

export function useMawbs() {
  return useQuery({
    queryKey: MAWB_QUERY_KEY,
    queryFn: mawbApi.getMawbs,
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

export function useMawb(id: number) {
  return useQuery({
    queryKey: [...MAWB_QUERY_KEY, id],
    queryFn: () => mawbApi.getMawb(id),
    enabled: !!id,
  });
}
