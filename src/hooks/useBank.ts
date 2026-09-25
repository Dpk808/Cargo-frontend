import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as bankApi from '@/src/utils/api/bank';
import type { CreateCompanyBankPayload, UpdateCompanyBankPayload } from '@/src/types/entities';

const BANK_QUERY_KEY = ['banks'] as const;

export function useBanks() {
  return useQuery({
    queryKey: BANK_QUERY_KEY,
    queryFn: () => bankApi.getBanks(),
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyBankPayload) => bankApi.createBank(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_QUERY_KEY });
    },
  });
}

export function useUpdateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCompanyBankPayload }) =>
      bankApi.updateBank(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_QUERY_KEY });
    },
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bankApi.deleteBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_QUERY_KEY });
    },
  });
}
