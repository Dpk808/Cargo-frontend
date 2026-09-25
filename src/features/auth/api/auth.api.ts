import { apiClient } from '@/src/utils/api/client';
import type { AuthUser, LoginPayload, RegisterPayload, RegisterResponse } from '@/src/types/auth';

export const authApi = {
  login: async (payload: LoginPayload): Promise<{ message: string; user: AuthUser }> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload);
    return data;
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },
};