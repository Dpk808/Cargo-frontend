import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/src/features/auth/api/auth.api';
import type { LoginPayload, RegisterPayload, RegisterResponse } from '@/src/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => {
      window.location.href = '/';
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) => authApi.register(payload),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    staleTime: Infinity,
    retry: false, // don't retry on 401 — user is just not logged in
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.clear(); // wipe all cached data
      window.location.replace('/auth/login');
    }
  };
}