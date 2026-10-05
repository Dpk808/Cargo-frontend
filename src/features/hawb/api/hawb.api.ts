import { apiClient } from '@/src/utils/api/client';
import type { Hawb, CreateHawbPayload, UpdateHawbPayload } from '@/src/types/hawb.types';
import type { PaginatedResponse } from '@/src/types';

export interface HawbQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getHawbs(query?: HawbQuery): Promise<PaginatedResponse<Hawb>> {
  const { data } = await apiClient.get<PaginatedResponse<Hawb>>('/hawb', {
    params: query,
  });
  return data;
}

export async function getHawb(id: number): Promise<Hawb> {
  const { data } = await apiClient.get<Hawb>(`/hawb/${id}`);
  return data;
}

export async function createHawb(payload: CreateHawbPayload): Promise<Hawb> {
  const { data } = await apiClient.post<Hawb>('/hawb', payload);
  return data;
}

export async function updateHawb(id: number, payload: UpdateHawbPayload): Promise<Hawb> {
  const { data } = await apiClient.patch<Hawb>(`/hawb/${id}`, payload);
  return data;
}

export async function deleteHawb(id: number): Promise<unknown> {
  const { data } = await apiClient.delete(`/hawb/${id}`);
  return data;
}
