import { apiClient } from '@/src/utils/api/client';
import type { CreditNote, CreateCreditNotePayload } from '@/src/types/entities';

export const getCreditNotes = async (): Promise<CreditNote[]> => {
  const { data } = await apiClient.get<CreditNote[]>('/credit-note');
  return data;
};

export const getCreditNote = async (id: number): Promise<CreditNote> => {
  const { data } = await apiClient.get<CreditNote>(`/credit-note/${id}`);
  return data;
};

export const createCreditNote = async (payload: CreateCreditNotePayload): Promise<CreditNote> => {
  const { data } = await apiClient.post<CreditNote>('/credit-note', payload);
  return data;
};
