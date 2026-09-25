import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/utils/api/client';
import type { AgentEntity } from '@/src/types/entities';

export function useAgentDetails(id: number | null) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<AgentEntity>(`/agent/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
