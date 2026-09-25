import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/utils/api/client';
import type { Consignee } from '@/src/types/entities';

export function useConsigneeDetails(consigneeId: number | null) {
	return useQuery<Consignee | null>({
		queryKey: ['consignee', consigneeId],
		queryFn: async () => {
			if (!consigneeId) {
				return null;
			}
			try {
				const response = await apiClient.get(`/consignee/${consigneeId}`);
				return response.data;
			} catch {
				return null;
			}
		},
		enabled: !!consigneeId,
		staleTime: 1000 * 60 * 5,
	});
}
