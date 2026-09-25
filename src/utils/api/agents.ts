import { apiClient } from '@/src/utils/api/client';
import type {
  CreatePartyPayload,
  AgentEntity,
  UpdatePartyPayload,
} from '@/src/types/entities';

export async function getAgents(): Promise<AgentEntity[]> {
  const { data } = await apiClient.get<AgentEntity[]>('/agent');
  return data;
}

export async function createAgent(payload: CreatePartyPayload): Promise<AgentEntity> {
  const { data } = await apiClient.post<AgentEntity>('/agent', payload);
  return data;
}

export async function updateAgent(
  id: number,
  payload: UpdatePartyPayload,
): Promise<AgentEntity> {
  const { data } = await apiClient.patch<AgentEntity>(`/agent/${id}`, payload);
  return data;
}

export async function deleteAgent(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/agent/${id}`);
  return data;
}
