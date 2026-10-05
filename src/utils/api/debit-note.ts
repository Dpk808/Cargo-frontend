import { apiClient } from '@/src/utils/api/client';
import type { DebitNote, CreateDebitNotePayload } from '@/src/types/entities';

export const getDebitNotes = async (): Promise<DebitNote[]> => {
  const { data } = await apiClient.get<DebitNote[]>('/debit-note');
  return data;
};

export const getDebitNote = async (id: number): Promise<DebitNote> => {
  const { data } = await apiClient.get<DebitNote>(`/debit-note/${id}`);
  return data;
};

export const createDebitNote = async (payload: CreateDebitNotePayload): Promise<DebitNote> => {
  const { data } = await apiClient.post<DebitNote>('/debit-note', payload);
  return data;
};
