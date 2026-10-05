import { apiClient } from '@/src/utils/api/client';
import type { Company, UpdateCompanyPayload } from '@/src/types/company.types';

export async function getCompany(): Promise<Company> {
  const { data } = await apiClient.get<Company>('/company');
  return data;
}

export async function updateCompany(
  id: number,
  payload: UpdateCompanyPayload,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(`/company/${id}`, payload);
  return data;
}

