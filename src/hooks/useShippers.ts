import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as shipperApi from '@/src/utils/api/shippers';
import type { CreatePartyPayload, UpdatePartyPayload } from '@/src/types/entities';

const SHIPPER_QUERY_KEY = ['shippers'] as const;

export function useShippers() {
  return useQuery({
    queryKey: SHIPPER_QUERY_KEY,
    queryFn: shipperApi.getShippers,
  });
}

export function useCreateShipper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePartyPayload) => shipperApi.createShipper(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPER_QUERY_KEY });
    },
  });
}

export function useUpdateShipper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePartyPayload }) =>
      shipperApi.updateShipper(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPER_QUERY_KEY });
    },
  });
}

export function useDeleteShipper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shipperApi.deleteShipper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPER_QUERY_KEY });
    },
  });
}
