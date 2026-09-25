import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/utils/api/client';
import type { Shipper } from '@/src/types/entities';

export function useShipperDetails(shipperId: number | null) {
	return useQuery<Shipper | null>({
		queryKey: ['shipper', shipperId],
		queryFn: async () => {
			if (!shipperId) {
				return null;
			}
			try {
				const response = await apiClient.get(`/shipper/${shipperId}`);
				return response.data;
			} catch {
				return null;
			}
		},
		enabled: !!shipperId,
		staleTime: 1000 * 60 * 5,
	});
}
