import { apiClient } from '@/src/utils/api/client';
import type {
  CreateMawbStockRangePayload,
  LockMawbStockPayload,
  MawbStock,
} from '@/src/types/index';

import type { PaginatedResponse } from '@/src/types/index';

export interface MawbStockQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getMawbStockAll(query?: MawbStockQuery): Promise<PaginatedResponse<MawbStock>> {
  const { data } = await apiClient.get<PaginatedResponse<MawbStock>>('/mawb-stock', {
    params: query,
  });
  return data;
}

export async function getMawbStockById(id: number): Promise<MawbStock> {
  const { data } = await apiClient.get<MawbStock>(`/mawb-stock/${id}`);
  return data;
}


export async function createMawbStockRange(payload: CreateMawbStockRangePayload): Promise<MawbStock[]> {
  const { data } = await apiClient.post<MawbStock[]>('/mawb-stock', payload);
  return data;
}

export async function holdMawbStock(id: number, payload: LockMawbStockPayload): Promise<MawbStock> {
  const { data } = await apiClient.patch<MawbStock>(`/mawb-stock/${id}/hold`, payload);
  return data;
}

export async function releaseMawbStock(id: number): Promise<MawbStock> {
  const { data } = await apiClient.patch<MawbStock>(`/mawb-stock/${id}/release`);
  return data;
}

export async function deleteMawbStock(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/mawb-stock/${id}`);
  return data;
}

export async function getAvailableMawbStock(airlinePrefix: string): Promise<MawbStock | null> {
  const { data } = await apiClient.get<MawbStock | null>('/mawb-stock/available', {
    params: { airline_prefix: airlinePrefix },
  });
  return data;
}

export async function startMawbStock(id: number): Promise<MawbStock> {
  const { data } = await apiClient.patch<MawbStock>(`/mawb-stock/${id}/start`);
  return data;
}
