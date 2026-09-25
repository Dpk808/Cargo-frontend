import { apiClient } from '@/src/utils/api/client';
import type {
  Consignee,
  CreatePartyPayload,
  UpdatePartyPayload,
} from '@/src/types/entities';

export async function getConsignees(): Promise<Consignee[]> {
  const { data } = await apiClient.get<Consignee[]>('/consignee');
  return data;
}

export async function createConsignee(payload: CreatePartyPayload): Promise<Consignee> {
  const { data } = await apiClient.post<Consignee>('/consignee', payload);
  return data;
}

export async function updateConsignee(
  id: number,
  payload: UpdatePartyPayload,
): Promise<Consignee> {
  const { data } = await apiClient.patch<Consignee>(`/consignee/${id}`, payload);
  return data;
}

export async function deleteConsignee(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/consignee/${id}`);
  return data;
}
