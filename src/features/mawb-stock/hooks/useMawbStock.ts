import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as mawbStockApi from '@/src/features/mawb-stock/api/mawb-stock.api';
import { useTable } from '@/src/hooks/useTable';
import type { CreateMawbStockRangePayload, LockMawbStockPayload } from '@/src/types/index';

const MAWB_STOCK_QUERY_KEY = ['mawb-stock'] as const;

export function useMawbStock() {
  const table = useTable();
  const query = {
    page: table.page,
    limit: table.limit,
    search: table.debouncedSearch,
  };

  const result = useQuery({
    queryKey: [...MAWB_STOCK_QUERY_KEY, query],
    queryFn: () => mawbStockApi.getMawbStockAll(query),
    placeholderData: keepPreviousData,
  });

  return { ...result, table };
}

export function useCreateMawbStockRange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMawbStockRangePayload) => mawbStockApi.createMawbStockRange(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_STOCK_QUERY_KEY });
    },
  });
}

export function useHoldMawbStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LockMawbStockPayload }) =>
      mawbStockApi.holdMawbStock(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_STOCK_QUERY_KEY });
    },
  });
}

export function useReleaseMawbStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mawbStockApi.releaseMawbStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_STOCK_QUERY_KEY });
    },
  });
}

export function useDeleteMawbStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mawbStockApi.deleteMawbStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_STOCK_QUERY_KEY });
    },
  });
}

export function useAvailableMawbStock(airlinePrefix?: string) {
  return useQuery({
    queryKey: ['available-mawb-stock', airlinePrefix],
    queryFn: () => mawbStockApi.getAvailableMawbStock(airlinePrefix ?? ''),
    enabled: Boolean(airlinePrefix),
  });
}

export function useStartMawbStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mawbStockApi.startMawbStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAWB_STOCK_QUERY_KEY });
    },
  });
}
