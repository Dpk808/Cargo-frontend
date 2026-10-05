import { useQuery } from '@tanstack/react-query';
import * as clientApi from '@/src/features/client/api/client.api';

function useParties(role: string) {
  const result = useQuery({
    queryKey: ['clients', 'options', role],
    queryFn: () => clientApi.getClientDropdown({ page: 1, limit: 100 }),
  });

  return {
    ...result,
    data: result.data?.items ?? [],
  };
}

export function useShippers() {
  return useParties('shipper');
}

export function useConsignees() {
  return useParties('consignee');
}

export function useAgents() {
  return useParties('agent');
}
