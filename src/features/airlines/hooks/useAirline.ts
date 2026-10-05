'use client';

import { useQuery } from '@tanstack/react-query';
import * as airlinesApi from '@/src/features/airlines/api/airlines.api';
import type { AirlineEntity } from '@/src/types/airline.types';

const AIRLINES_QUERY_KEY = ['airlines'] as const;

export function useAirlines(search = '') {
	return useQuery<AirlineEntity[]>({
		queryKey: [...AIRLINES_QUERY_KEY, search],
		queryFn: async () => {
			const response = await airlinesApi.getAirlines({ page: 1, limit: 20, search });
			return response.items;
		},
		staleTime: 1000 * 60 * 5,
	});
}

export function useAirlineByPrefix(prefix: string | null) {
	return useQuery<AirlineEntity | null>({
		queryKey: [...AIRLINES_QUERY_KEY, 'prefix', prefix],
		queryFn: () => airlinesApi.getAirlineByPrefix(prefix!),
		enabled: Boolean(prefix) && prefix!.length === 3,
		staleTime: 1000 * 60 * 5,
	});
}
