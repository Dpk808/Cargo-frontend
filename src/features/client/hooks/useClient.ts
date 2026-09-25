import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

import * as clientApi from '@/src/features/client/api/client.api';
import { useTable } from '@/src/hooks/useTable';

import type { CreateClientPayload, UpdateClientPayload } from '@/src/types/index';

  const table = useTable();

  const query = {
    page: table.page,
    limit: 5,
    search: table.search,
  };

const Client_QUERY_KEY = ['Clients'] as const;

export function useClients() {


  const result = useQuery({
    queryKey: [...Client_QUERY_KEY, query],
    queryFn: () => clientApi.getClient(query),
    placeholderData: keepPreviousData,
  });

  return {
    ...result,
    table,
  };
}

export function useClientById(id: number | undefined) {
  return useQuery({
    queryKey: [...Client_QUERY_KEY, id],
    queryFn: () => clientApi.getClientById(id!),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientPayload) =>
      clientApi.createClient(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Client_QUERY_KEY,
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateClientPayload;
    }) => clientApi.updateClient(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Client_QUERY_KEY,
      });
    },
  });
}

export function useClientDropdown() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...Client_QUERY_KEY, 'dropdown'],
    queryFn: () => clientApi.getClientDropdown(),
  });
}

export function useToggleClientActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => clientApi.toggleClientActive(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Client_QUERY_KEY,
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => clientApi.deleteClient(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: Client_QUERY_KEY,
      });
    },
  });
}