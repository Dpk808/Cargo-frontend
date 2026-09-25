'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import { useUIStore } from '@/src/stores/ui.store';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: '•' },
  { label: 'Shippers', href: '/shipper', icon: '—' },
  { label: 'Consignees', href: '/consignee', icon: '≈' },
  { label: 'Agents', href: '/agent', icon: '⧉' },
  { label: 'MAWB', href: '/mawb', icon: '∞' },
  { label: 'Tax Invoice', href: '/tax-invoice', icon: '🧾' },
  { label: 'Credit Note', href: '/credit-note', icon: '📋' },
  { label: 'Debit Note', href: '/debit-note', icon: '📝' },
  { label: 'Company', href: '/company', icon: '🏢' },
  { label: 'Bank', href: '/bank', icon: '🏦' },
  { label: 'MAWB Stock', href: '/mawb-stock', icon: '📦' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen shrink-0 border-r border-[var(--color-mist)]/50 bg-gradient-to-b from-[var(--color-ink)] to-[#0a1f3a] text-white transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } hidden md:flex md:flex-col`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div
          className={`flex items-center gap-2 transition-opacity duration-300 ${
            sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          <span className="text-lg font-bold">CN</span>
          <div>
            <h1 className="font-bold text-sm leading-tight">Cargo Nexus</h1>
            <p className="text-xs text-white/60">Logistics</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg bg-white/10 px-2 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[var(--color-ocean)] text-white shadow-lg shadow-[var(--color-ocean)]/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
            >
              <span className="text-lg flex-shrink-0 w-6 text-center">{item.icon}</span>
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div
          className={`text-xs text-white/60 transition-opacity ${
            sidebarCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          <p className="font-semibold text-white/80 mb-2">v1.0.0</p>
          <p>Streamline operations</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className={`w-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all ${
            sidebarCollapsed ? 'px-2' : ''
          }`}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? '⬅' : '➡ Collapse'}
        </Button>
      </div>
    </aside>
  );
}