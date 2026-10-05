'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Modal from '@/src/components/ui/Modal';
import Table from '@/src/components/ui/Table';
import { useCreditNotes } from '@/src/hooks/useNotes';
import type { CreditNote } from '@/src/types/entities';
import type { TableColumn } from '@/src/types/api';

export default function CreditNotePage() {
  const router = useRouter();
  const { data = [], isLoading } = useCreditNotes();
  const [viewTarget, setViewTarget] = useState<CreditNote | null>(null);

  const columns: TableColumn<CreditNote>[] = useMemo(
    () => [
      {
        key: 'credit_note_no',
        header: 'Credit Note #',
        render: (row) => (
          <span className="font-semibold text-[var(--color-ink)]">{row.credit_note_no}</span>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        render: (row) => new Date(row.date).toLocaleDateString(),
      },
      {
        key: 'party',
        header: 'Billed To',
        render: (row) => (
          <span>
            {row.shipper?.name || row.consignee?.name || row.agent?.name || (
              <span className="text-[var(--color-ink)]/40 italic">—</span>
            )}
          </span>
        ),
      },
      {
        key: 'mawb',
        header: 'MAWB',
        render: (row) =>
          row.mawb
            ? `${row.mawb.airline_prefix}-${row.mawb.serial_no}`
            : <span className="text-[var(--color-ink)]/40 italic">—</span>,
      },
      {
        key: 'currency',
        header: 'Currency',
        render: (row) => (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.is_usd ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {row.is_usd ? 'USD' : 'NPR'}
          </span>
        ),
      },
      {
        key: 'grandtotal',
        header: 'Grand Total',
        render: (row) => (
          <span className="font-bold text-[var(--color-ink)]">
            {Number(row.grandtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => router.push(`/credit-note/${row.id}`)}>
              👁️ View
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <Card
      title="Credit Notes"
      subtitle="Manage credit notes issued to shippers, consignees, and agents"
      action={
        <Button onClick={() => router.push('/credit-note/add')} size="lg">
          ➕ Add Credit Note
        </Button>
      }
    >
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No credit notes yet. Create one to get started."
      />
    </Card>
  );
}
