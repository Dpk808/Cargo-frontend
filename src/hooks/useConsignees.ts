import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as consigneeApi from '@/src/utils/api/consignees';
import type { CreatePartyPayload, UpdatePartyPayload } from '@/src/types/entities';

const CONSIGNEE_QUERY_KEY = ['consignees'] as const;

export function useConsignees() {
  return useQuery({
    queryKey: CONSIGNEE_QUERY_KEY,
    queryFn: consigneeApi.getConsignees,
  });
}

export function useCreateConsignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePartyPayload) => consigneeApi.createConsignee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSIGNEE_QUERY_KEY });
    },
  });
}

export function useUpdateConsignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePartyPayload }) =>
      consigneeApi.updateConsignee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSIGNEE_QUERY_KEY });
    },
  });
}

export function useDeleteConsignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => consigneeApi.deleteConsignee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSIGNEE_QUERY_KEY });
    },
  });
}
