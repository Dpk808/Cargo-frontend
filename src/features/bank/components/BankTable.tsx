'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/src/components/ui/Table';
import type { Bank } from '@/src/types/index';
import type { TableColumn } from '@/src/types/api';
import { useToggleBankActive } from '../hooks/useBank';

interface BankTableProps {
  data: Bank[];
  isLoading?: boolean;
  onDelete: (bank: Bank) => void;
}

export default function BankTable({ data, isLoading, onDelete }: BankTableProps) {
  const router = useRouter();
  const toggleActive = useToggleBankActive();

  const columns: TableColumn<Bank>[] = useMemo(
    () => [
      {
        key: 'bankName',
        header: 'Bank Name',
        render: (row) => (
          <span className="font-semibold text-[var(--color-ink)]">{row.bankName}</span>
        ),
      },
      {
        key: 'accountNumber',
        header: 'Account Number',
        render: (row) => row.bankAccountNumber,
      },
      {
        key: 'holderName',
        header: 'Holder Name',
        render: (row) => row.bankAccHolderName,
      },
      {
        key: 'branch',
        header: 'Branch',
        render: (row) => row.bankBranch,
      },
      {
        key: 'currency',
        header: 'Currency',
        render: (row) => (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.isUsd ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {row.isUsd ? 'USD' : 'NPR'}
          </span>
        ),
      },
    ],
    [router, onDelete],
  );

  return (
    <Table
      data={data}
      columns={columns}
      onEdit={(row) => router.push(`/bank/${row.id}/edit`)}
      onDelete={onDelete}
      onToggleActive={(row) => toggleActive.mutate(row.id)}
      isLoading={isLoading}
    />
  );
}
