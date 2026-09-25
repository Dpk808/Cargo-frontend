import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as agentApi from '@/src/utils/api/agents';
import type { CreatePartyPayload, UpdatePartyPayload } from '@/src/types/entities';

const AGENT_QUERY_KEY = ['agents'] as const;

export function useAgents() {
  return useQuery({
    queryKey: AGENT_QUERY_KEY,
    queryFn: agentApi.getAgents,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePartyPayload) => agentApi.createAgent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_QUERY_KEY });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePartyPayload }) =>
      agentApi.updateAgent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_QUERY_KEY });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => agentApi.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_QUERY_KEY });
    },
  });
}
