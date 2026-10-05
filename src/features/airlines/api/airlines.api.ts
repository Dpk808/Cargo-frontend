import { apiClient } from '@/src/utils/api/client';
import type { AirlineEntity } from '@/src/types/airline.types';
import type { PaginatedResponse } from '@/src/types/index';



export interface airlineQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export async function getAirlines(query: airlineQuery): Promise<PaginatedResponse<AirlineEntity>> {
    const { data } = await apiClient.get<PaginatedResponse<AirlineEntity>>('/airlines/options', { params: query });
    return data;
}

export async function getAirlineByPrefix(prefix: string): Promise<AirlineEntity | null> {
    const { data } = await apiClient.get<AirlineEntity>(`/airlines/prefix/${prefix}`);
    return data;
}

export async function getAirlineById(id: number): Promise<AirlineEntity | null> {
    const { data } = await apiClient.get<AirlineEntity>(`/airlines/${id}`);
    return data;
}



