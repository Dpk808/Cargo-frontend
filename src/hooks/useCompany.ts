import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as companyApi from '@/src/utils/api/company';
import type { CreateCompanyPayload, UpdateCompanyPayload } from '@/src/types/entities';

const COMPANY_QUERY_KEY = ['company'] as const;

export function useCompany() {
  return useQuery({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: async () => {
        const companies = await companyApi.getCompanies();
        return companies[0] || null; // Since there is only one company
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => companyApi.createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCompanyPayload }) =>
      companyApi.updateCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
    },
  });
}
