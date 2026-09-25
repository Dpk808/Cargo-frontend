import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/utils/api/client';
import type { AirlineEntity } from '@/src/types/entities';

export function useAirlines() {
	return useQuery<AirlineEntity[]>({
		queryKey: ['airlines'],
		queryFn: async () => {
			const response = await apiClient.get<AirlineEntity[]>('/airlines');
			return response.data;
		},
		staleTime: 1000 * 60 * 5,
	});
}

export function useAirlineByPrefix(prefix: string | null) {
	return useQuery<AirlineEntity | null>({
		queryKey: ['airline', prefix],
		queryFn: async () => {
			if (!prefix || prefix.length !== 3) {
				return null;
			}
			try {
				const response = await apiClient.get(`/airlines/prefix/${prefix}`);
				return response.data;
			} catch {
				return null;
			}
		},
		enabled: !!prefix && prefix.length === 3,
		staleTime: 1000 * 60 * 5,
	});
}
