'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import Layout from '@/src/components/layout/Layout';

const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

export default function RouteShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}