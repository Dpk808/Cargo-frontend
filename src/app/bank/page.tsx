'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Modal from '@/src/components/ui/Modal';
import Table from '@/src/components/ui/Table';
import { useBanks, useDeleteBank } from '@/src/hooks/useBank';
import type { CompanyBank } from '@/src/types/entities';
import type { TableColumn } from '@/src/types/api';

export default function BankPage() {
  const router = useRouter();
  const { data = [], isLoading } = useBanks();
  const deleteMutation = useDeleteBank();

  const [deleteTarget, setDeleteTarget] = useState<CompanyBank | null>(null);

  const columns: TableColumn<CompanyBank>[] = useMemo(
    () => [
      {
        key: 'bankName',
        header: 'Bank Name',
        render: (row) => <span className="font-semibold text-[var(--color-ink)]">{row.bankName}</span>,
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
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => router.push(`/bank/${row.id}/edit`)}>
              ✏️ Edit
            </Button>
            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
              🗑️ Delete
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <>
      <Card
        title="Bank Accounts"
        subtitle="Manage company bank accounts and financial details"
        action={
          <Button onClick={() => router.push('/bank/add')} size="lg">
            ➕ Add Bank
          </Button>
        }
      >
        <Table data={data} columns={columns} isLoading={isLoading} emptyMessage="No banks available. Create one to get started." />
      </Card>

      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Delete Bank"
        onClose={() => setDeleteTarget(null)}
      >
        <div className="space-y-5">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-900">
              Are you sure you want to delete bank account <strong>{deleteTarget?.bankName} - {deleteTarget?.bankAccountNumber}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={async () => {
                if (!deleteTarget) {
                  return;
                }
                await deleteMutation.mutateAsync(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete Bank
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
