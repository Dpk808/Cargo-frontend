import { apiClient } from '@/src/utils/api/client';
import type {
  CreateHawbPayload,
  Hawb,
  UpdateHawbPayload,
} from '@/src/types/entities';

export async function getHawbs(mawbId?: number): Promise<Hawb[]> {
  const url = mawbId ? `/hawb?mawb_id=${mawbId}` : '/hawb';
  const { data } = await apiClient.get<Hawb[]>(url);
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
