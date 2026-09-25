import { apiClient } from '@/src/utils/api/client';
import type { CompanyBank, CreateCompanyBankPayload, UpdateCompanyBankPayload } from '@/src/types/entities';

export async function getBanks(): Promise<CompanyBank[]> {
  const { data } = await apiClient.get<CompanyBank[]>('/banks');
  return data;
}

export async function createBank(payload: CreateCompanyBankPayload): Promise<CompanyBank> {
  const { data } = await apiClient.post<CompanyBank>('/banks', payload);
  return data;
}

export async function updateBank(id: number, payload: UpdateCompanyBankPayload): Promise<CompanyBank> {
  const { data } = await apiClient.patch<CompanyBank>(`/banks/${id}`, payload);
  return data;
}

export async function deleteBank(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/banks/${id}`);
  return data;
}
