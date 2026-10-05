import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as bankApi from '@/src/features/bank/api/bank.api';
import { useTable } from '@/src/hooks/useTable';
import type {CreateBankPayload, UpdateBankPayload } from '@/src/types/index';

const BANK_QUERY_KEY = ['banks'] as const;

export function useBanks() {
  const table = useTable();

  const query = {
    page: table.page,
    limit: table.limit,
    search: table.search,
  };

  const result = useQuery({
    queryKey: [...BANK_QUERY_KEY, query],
    queryFn: () => bankApi.getBanks(query),
    placeholderData: keepPreviousData,
  });

  return {
    ...result,
    table,
  };
}

export function useBankById(id: number | undefined) {
  return useQuery({
    queryKey: [...BANK_QUERY_KEY, id],
    queryFn: () => bankApi.getBankById(id!),
    enabled: !!id,
  });
}

export function useBankDropdown(search = '') {
  return useQuery({
    queryKey: [...BANK_QUERY_KEY, 'dropdown', search],
    queryFn: () => bankApi.getBankDropdown({ search, limit: 20, page: 1 }),
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBankPayload) => bankApi.createBank(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEY,
      });
    },
  });
}

export function useUpdateBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBankPayload }) =>
      bankApi.updateBank(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEY,
      });
    },
  });
}

export function useToggleBankActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bankApi.toggleBankActive(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEY,
      });
    },
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bankApi.deleteBank(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BANK_QUERY_KEY,
      });
    },
  });
}


