import { apiClient } from '@/src/utils/api/client';
import type {
  CreatePartyPayload,
  Shipper,
  UpdatePartyPayload,
} from '@/src/types/entities';

export async function getShippers(): Promise<Shipper[]> {
  const { data } = await apiClient.get<Shipper[]>('/shipper');
  return data;
}

export async function createShipper(payload: CreatePartyPayload): Promise<Shipper> {
  const { data } = await apiClient.post<Shipper>('/shipper', payload);
  return data;
}

export async function updateShipper(
  id: number,
  payload: UpdatePartyPayload,
): Promise<Shipper> {
  const { data } = await apiClient.patch<Shipper>(`/shipper/${id}`, payload);
  return data;
}

export async function deleteShipper(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/shipper/${id}`);
  return data;
}
