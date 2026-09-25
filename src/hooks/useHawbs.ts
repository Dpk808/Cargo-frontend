import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as hawbApi from '@/src/utils/api/hawbs';
import type { CreateHawbPayload, UpdateHawbPayload } from '@/src/types/entities';

const HAWB_QUERY_KEY = ['hawbs'] as const;

export function useHawbs(mawbId?: number) {
  return useQuery({
    queryKey: [...HAWB_QUERY_KEY, mawbId],
    queryFn: () => hawbApi.getHawbs(mawbId),
  });
}

export function useCreateHawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHawbPayload) => hawbApi.createHawb(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HAWB_QUERY_KEY });
      if ((variables as any).mawb_id) {
        queryClient.invalidateQueries({ queryKey: [...HAWB_QUERY_KEY, (variables as any).mawb_id] });
      }
    },
  });
}

export function useUpdateHawb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateHawbPayload }) =>
      hawbApi.updateHawb(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: HAWB_QUERY_KEY });
      if ((data as any).mawb_id) {
        queryClient.invalidateQueries({ queryKey: [...HAWB_QUERY_KEY, (data as any).mawb_id] });
      }
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
