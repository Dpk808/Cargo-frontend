'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/src/components/ui/Table';
import type { Mawb } from '@/src/types/mawb.types';
import type { TableColumn } from '@/src/types/api';
import { Printer, PlusCircle } from 'lucide-react';

interface MawbTableProps {
  data: Mawb[];
  isLoading?: boolean;
  onDelete: (mawb: Mawb) => void;
}

export default function MawbTable({ data, isLoading, onDelete }: MawbTableProps) {
  const router = useRouter();

  const columns: TableColumn<Mawb>[] = useMemo(
    () => [
      {
        key: 'mawbNo',
        header: 'MAWB #',
        render: (row) => (
          <span className="font-semibold font-mono text-[var(--color-ocean)]">
            {row.airline_prefix}-{row.serial_no}-{row.check_digit}
          </span>
        ),
      },
      {
        key: 'shipper',
        header: 'Shipper',
        render: (row) => row.shipper?.name ?? '-',
      },
      {
        key: 'consignee',
        header: 'Consignee',
        render: (row) => row.consignee?.name ?? '-',
      },
      {
        key: 'pieces',
        header: 'Pieces',
        render: (row) => row.no_of_pieces,
      },
      {
        key: 'weight',
        header: 'Weight',
        render: (row) => `${row.gross_weight} ${row.unit || 'KG'}`,
      },
      {
        key: 'total',
        header: 'Total',
        render: (row) => `${row.accounting?.currency ?? 'USD'} ${row.total ?? '-'}`,
      },
      {
        key: 'operations',
        header: 'Operations',
        render: (row) => {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push(`/mawb/${row.id}/hawb/add`)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--color-ocean)] hover:bg-[var(--color-ocean)]/10 rounded transition-colors"
                title="Add Homebill"
              >
                <PlusCircle size={13} />
                <span>+ HAWB</span>
              </button>
              <button
                type="button"
                onClick={() => window.open(`${baseUrl}/mawb/${row.id}/pdf`, '_blank')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                title="Print PDF"
              >
                <Printer size={13} />
                <span>PDF</span>
              </button>
            </div>
          );
        },
      },
    ],
    [router],
  );

  return (
    <Table
      data={data}
      columns={columns}
      onEdit={(row) => router.push(`/mawb/${row.id}/edit`)}
      onDelete={onDelete}
      isLoading={isLoading}
      emptyMessage="No MAWB records found. Create one to get started."
    />
  );
}
