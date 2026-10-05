import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/utils/api/client';

export interface Currency {
	code: string;
	codeNumeric?: number | null;
	currency: string;
}

export function useCurrencies() {
	return useQuery<Currency[]>({
		queryKey: ['currencies'],
		queryFn: async () => {
			const response = await apiClient.get('/currencies');
			return response.data;
		},
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}
