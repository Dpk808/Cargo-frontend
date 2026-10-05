import { apiClient } from '@/src/utils/api/client';
import type { TaxInvoice } from '@/src/types/entities';

export async function getTaxInvoicesByMawb(mawbId: number): Promise<TaxInvoice[]> {
  const { data } = await apiClient.get<TaxInvoice[]>(`/tax-invoice/mawb/${mawbId}`);
  return data;
}

export async function getTaxInvoice(id: number): Promise<TaxInvoice> {
  const { data } = await apiClient.get<TaxInvoice>(`/tax-invoice/${id}`);
  return data;
}

export async function createTaxInvoice(payload: any): Promise<TaxInvoice> {
  const { data } = await apiClient.post<TaxInvoice>('/tax-invoice', payload);
  return data;
}

export async function updateTaxInvoice(id: number, payload: any): Promise<TaxInvoice> {
  const { data } = await apiClient.patch<TaxInvoice>(`/tax-invoice/${id}`, payload);
  return data;
}

export async function deleteTaxInvoice(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/tax-invoice/${id}`);
  return data;
}
