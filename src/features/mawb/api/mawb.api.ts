import { apiClient } from '@/src/utils/api/client';
import type {
  CreateMawbPayload,
  Mawb,
  UpdateMawbPayload,
} from '@/src/types/mawb.types';
import type { PaginatedResponse } from '@/src/types';

export interface MawbQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getMawbs(query?: MawbQuery): Promise<PaginatedResponse<Mawb>> {
  const { data } = await apiClient.get<PaginatedResponse<Mawb>>('/mawb', {
    params: query,
  });
  return data;
}

export async function createMawb(payload: CreateMawbPayload): Promise<Mawb> {
  const { data } = await apiClient.post<Mawb>('/mawb', payload);
  return data;
}

export async function updateMawb(id: number, payload: UpdateMawbPayload): Promise<Mawb> {
  const { data } = await apiClient.patch<Mawb>(`/mawb/${id}`, payload);
  return data;
}

export async function deleteMawb(id: number): Promise<unknown> {
  const { data } = await apiClient.delete(`/mawb/${id}`);
  return data;
}

export async function getMawb(id: number): Promise<Mawb> {
  const { data } = await apiClient.get<Mawb>(`/mawb/${id}`);
  return data;
}
