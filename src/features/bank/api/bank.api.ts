import { apiClient } from '@/src/utils/api/client';
import type { CompanyBank, CreateCompanyBankPayload, UpdateCompanyBankPayload } from '@/src/types/entities';
import type { PaginatedResponse } from '@/src/types/index';

export interface BankQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getBanks(query?: BankQuery): Promise<PaginatedResponse<CompanyBank>> {
  const { data } = await apiClient.get<PaginatedResponse<CompanyBank>>('/banks', { params: query });
  return data;
}

export async function getBankById(id: number): Promise<CompanyBank> {
  const { data } = await apiClient.get<CompanyBank>(`/banks/${id}`);
  return data;
}

export async function getBankDropdown(query?: BankQuery): Promise<PaginatedResponse<CompanyBank>> {
  const { data } = await apiClient.get<PaginatedResponse<CompanyBank>>('/banks/options', { params: query });
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

export async function toggleBankActive(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.patch<{ message: string }>(`/banks/${id}/toggle-active`);
  return data;
}

export async function deleteBank(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/banks/${id}`);
  return data;
}


