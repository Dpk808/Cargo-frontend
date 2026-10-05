import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as companyApi from '@/src/features/company/api/company.api';
import type { UpdateCompanyPayload } from '@/src/types/company.types';

const COMPANY_QUERY_KEY = ['company'] as const;

export function useCompany() {
  return useQuery({
    queryKey: COMPANY_QUERY_KEY,
    queryFn: () => companyApi.getCompany(),
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

