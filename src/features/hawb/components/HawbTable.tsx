'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/src/components/ui/Table';
import type { Hawb } from '@/src/types/hawb.types';
import type { TableColumn } from '@/src/types/api';

interface HawbTableProps {
  data: Hawb[];
  isLoading?: boolean;
  onDelete: (hawb: Hawb) => void;
}

export default function HawbTable({ data, isLoading, onDelete }: HawbTableProps) {
  const router = useRouter();

  const columns: TableColumn<Hawb>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'HAWB #',
        render: (row) => (
          <span className="font-semibold font-mono text-[var(--color-ocean)]">
            HAWB-{row.id}
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
        render: (row) => (row.total != null ? `USD ${row.total}` : '-'),
      },
    ],
    [],
  );

  return (
    <Table
      data={data}
      columns={columns}
      onEdit={(row) => {
        if (row.mawb?.id) {
          router.push(`/mawb/${row.mawb.id}/hawb/${row.id}/edit`);
        }
      }}
      onDelete={onDelete}
      isLoading={isLoading}
      emptyMessage="No HAWB records found."
    />
  );
}
