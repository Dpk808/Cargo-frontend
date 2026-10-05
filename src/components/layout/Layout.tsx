'use client';

import { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import Sidebar from '@/src/components/layout/Sidebar';
import Navbar from '@/src/components/layout/Navbar';
import { useUIStore } from '@/src/stores/ui.store';

export default function Layout({ children }: PropsWithChildren) {
  const { sidebarCollapsed } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[var(--color-ice)] via-white to-[var(--color-canvas)]">
      <Sidebar />
      <div
        className={`flex min-h-screen w-full flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}