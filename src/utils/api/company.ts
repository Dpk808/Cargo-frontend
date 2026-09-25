import { apiClient } from '@/src/utils/api/client';
import type {
  CreateCompanyPayload,
  Company,
  UpdateCompanyPayload,
} from '@/src/types/entities';

export async function getCompanies(): Promise<Company[]> {
  const { data } = await apiClient.get<Company[]>('/company');
  return data;
}

export async function createCompany(payload: CreateCompanyPayload): Promise<Company> {
  const { data } = await apiClient.post<Company>('/company', payload);
  return data;
}

export async function updateCompany(
  id: number,
  payload: UpdateCompanyPayload,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(`/company/${id}`, payload);
  return data;
}

export async function deleteCompany(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/company/${id}`);
  return data;
}
