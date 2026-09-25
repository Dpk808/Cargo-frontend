'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import { useMe, useLogout } from '@/src/features/auth/hooks/useAuth';

const TITLES: Record<string, { title: string; icon: string }> = {
  '/': { title: 'Dashboard', icon: '◆' },
  '/shipper': { title: 'Shipper Management', icon: '▬' },
  '/consignee': { title: 'Consignee Management', icon: '⬚' },
  '/agent': { title: 'Agent Management', icon: '⧉' },
  '/mawb': { title: 'MAWB Management', icon: '▲' },
  '/tax-invoice': { title: 'Tax Invoice', icon: '🧾' },
  '/credit-note': { title: 'Credit Note', icon: '📋' },
  '/debit-note': { title: 'Debit Note', icon: '📝' },
  '/company': { title: 'Company', icon: '🏢' },
  '/bank': { title: 'Bank', icon: '🏦' },
  '/mawb-stock': { title: 'MAWB Stock', icon: '📦' },
};

export default function Navbar() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const logout = useLogout();

  const titleData = useMemo(() => {
    return TITLES[pathname] ?? { title: 'Cargo Workspace', icon: '▪' };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--color-mist)]/50 bg-white/80 px-4 backdrop-blur md:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-[var(--color-ocean)]">{titleData.icon}</span>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-ocean)]/70 font-semibold">Cargo Nexus</p>
          <h2 className="text-lg font-bold text-[var(--color-ink)]">{titleData.title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right md:block pr-4 border-r border-[var(--color-mist)]">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            {user?.firstName ?? 'Operator'}
          </p>
          <p className="text-xs text-[var(--color-ink)]/60">
            {user?.email ?? 'user@cargo.local'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}