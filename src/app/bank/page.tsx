'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import { Pagination } from '@/src/components/ui/Pagination';
import SearchBar from '@/src/components/ui/SearchBar';
import BankTable from '@/src/features/bank/components/BankTable';
import ConfirmModal from '@/src/components/ui/ConfirmModal';
import { useBanks, useDeleteBank } from '@/src/features/bank/hooks/useBank';
import { Bank } from '@/src/types/bank.types';

export default function BankPage() {
  const router = useRouter();

  const { data, isLoading, table } = useBanks();

  const deleteMutation = useDeleteBank();
  const [deleteTarget, setDeleteTarget] = useState<Bank | null>(null);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SearchBar
          value={table.search}
          onChange={table.setSearch}
          placeholder="Search banks..."
          className="w-72"
        />
        <Button onClick={() => router.push('/bank/add')} size="md">
          Add Bank
        </Button>
      </div>

      <BankTable
        data={data?.items ?? []}
        isLoading={isLoading}
        onDelete={setDeleteTarget}
      />

      {data && data.meta.totalPages > 1 && (
        <Pagination
          totalPages={data.meta.totalPages}
          currentPage={table.page}
          onChange={table.setPage}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Bank"
        confirmLabel="Delete Bank"
        cancelLabel="Cancel"
        variant="danger"
        itemName={deleteTarget?.bankName}
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
