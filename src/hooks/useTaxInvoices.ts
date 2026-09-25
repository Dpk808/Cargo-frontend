import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as taxInvoiceApi from '@/src/utils/api/tax-invoice';
import type { TaxInvoice } from '@/src/types/entities';

const TAX_INVOICE_QUERY_KEY = ['tax-invoices'] as const;

export function useTaxInvoicesByMawb(mawbId: number) {
  return useQuery({
    queryKey: [...TAX_INVOICE_QUERY_KEY, 'mawb', mawbId],
    queryFn: () => taxInvoiceApi.getTaxInvoicesByMawb(mawbId),
    enabled: !!mawbId,
  });
}

export function useTaxInvoice(id: number) {
  return useQuery({
    queryKey: [...TAX_INVOICE_QUERY_KEY, id],
    queryFn: () => taxInvoiceApi.getTaxInvoice(id),
    enabled: !!id,
  });
}

export function useCreateTaxInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => taxInvoiceApi.createTaxInvoice(payload),
    onSuccess: (createdInvoice: TaxInvoice) => {
      queryClient.invalidateQueries({ queryKey: TAX_INVOICE_QUERY_KEY });
      if (createdInvoice.mawb_id) {
        queryClient.invalidateQueries({
          queryKey: [...TAX_INVOICE_QUERY_KEY, 'mawb', createdInvoice.mawb_id],
        });
      }
    },
  });
}

export function useUpdateTaxInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      taxInvoiceApi.updateTaxInvoice(id, payload),
    onSuccess: (updatedInvoice, variables) => {
      queryClient.invalidateQueries({ queryKey: TAX_INVOICE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TAX_INVOICE_QUERY_KEY, variables.id] });
      if (updatedInvoice.mawb_id) {
        queryClient.invalidateQueries({
          queryKey: [...TAX_INVOICE_QUERY_KEY, 'mawb', updatedInvoice.mawb_id],
        });
      }
    },
  });
}

export function useDeleteTaxInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; mawbId?: number }) => taxInvoiceApi.deleteTaxInvoice(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TAX_INVOICE_QUERY_KEY });
      if (variables.mawbId) {
        queryClient.invalidateQueries({
          queryKey: [...TAX_INVOICE_QUERY_KEY, 'mawb', variables.mawbId],
        });
      }
    },
  });
}
