import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as creditNoteApi from '@/src/utils/api/credit-note';
import * as debitNoteApi from '@/src/utils/api/debit-note';
import type { CreateCreditNotePayload, CreateDebitNotePayload } from '@/src/types/entities';

const CREDIT_NOTE_QUERY_KEY = ['creditNotes'] as const;
const DEBIT_NOTE_QUERY_KEY = ['debitNotes'] as const;

// ── Credit Notes ────────────────────────────────────────────────────────

export function useCreditNotes() {
  return useQuery({
    queryKey: CREDIT_NOTE_QUERY_KEY,
    queryFn: creditNoteApi.getCreditNotes,
  });
}

export function useCreditNote(id: number) {
  return useQuery({
    queryKey: [...CREDIT_NOTE_QUERY_KEY, id],
    queryFn: () => creditNoteApi.getCreditNote(id),
    enabled: !!id,
  });
}

export function useCreateCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCreditNotePayload) => creditNoteApi.createCreditNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CREDIT_NOTE_QUERY_KEY });
    },
  });
}

// ── Debit Notes ────────────────────────────────────────────────────────

export function useDebitNotes() {
  return useQuery({
    queryKey: DEBIT_NOTE_QUERY_KEY,
    queryFn: debitNoteApi.getDebitNotes,
  });
}

export function useDebitNote(id: number) {
  return useQuery({
    queryKey: [...DEBIT_NOTE_QUERY_KEY, id],
    queryFn: () => debitNoteApi.getDebitNote(id),
    enabled: !!id,
  });
}

export function useCreateDebitNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDebitNotePayload) => debitNoteApi.createDebitNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBIT_NOTE_QUERY_KEY });
    },
  });
}
