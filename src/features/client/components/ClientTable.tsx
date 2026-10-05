'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/src/components/ui/Table';
import type { Client } from '@/src/types/index';
import type { TableColumn } from '@/src/types/api';
import { useToggleClientActive } from '@/src/features/client/hooks/useClient';


interface ClientTableProps {
  data: Client[];
  isLoading?: boolean;
  onDelete: (client: Client) => void;
}

export default function ClientTable({ data, isLoading, onDelete }: ClientTableProps) {
  const router = useRouter();
    const toggleActive = useToggleClientActive();


  const columns: TableColumn<Client>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        render: (row) => (
          <span className="font-semibold text-[var(--color-ink)]">{row.name}</span>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        render: (row) =>
          row.email ? (
            <a href={`mailto:${row.email}`} className="text-[var(--color-ocean)] hover:underline">
              {row.email}
            </a>
          ) : (
            <span className="text-[var(--color-ink)]/50">-</span>
          ),
      },
      {
        key: 'phone',
        header: 'Phone',
        render: (row) =>
          row.phoneNumber ?? <span className="text-[var(--color-ink)]/50">-</span>,
      },
      {
        key: 'city',
        header: 'City',
        render: (row) => row.city,
      },
      {
        key: 'country',
        header: 'Country',
        render: (row) => row.country,
      }
    ],
    [router, onDelete],
  );

  return (
<Table
  data={data}
  columns={columns}
  onEdit={(row) => router.push(`/client/${row.id}/edit`)}
  onDelete={onDelete}
  onToggleActive={(row) => toggleActive.mutate(row.id)}
/>
  );
}