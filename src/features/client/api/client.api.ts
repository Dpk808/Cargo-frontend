import { apiClient } from '@/src/utils/api/client';
import type { CreateClientPayload, Client, UpdateClientPayload } from '@/src/types/index';
import type { PaginatedResponse } from '@/src/types/index';

export interface ClientQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getClient(query?: ClientQuery): Promise<PaginatedResponse<Client>> {
  const { data } = await apiClient.get('/client', { params: query });
  return data;
}

export async function getClientById(id: number): Promise<Client> {
  const { data } = await apiClient.get<Client>(`/client/${id}`);
  return data;
}

export async function getClientDropdown(query?: ClientQuery): Promise<PaginatedResponse<Client>> {
  const { data } = await apiClient.get('/client/options', { params: query });
  return data;
}

export async function createClient(payload: CreateClientPayload): Promise<Client> {
  const { data } = await apiClient.post<Client>('/client', payload);
  return data;
}

export async function updateClient(id: number, payload: UpdateClientPayload): Promise<Client> {
  const { data } = await apiClient.patch<Client>(`/client/${id}`, payload);
  return data;
}

export async function toggleClientActive(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.patch<{ message: string }>(`/client/${id}/toggle-active`);
  return data;
}

export async function deleteClient(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/client/${id}`);
  return data;
}