'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import { Pagination } from '@/src/components/ui/Pagination';
import SearchBar from '@/src/components/ui/SearchBar';
import ClientTable from '@/src/features/client/components/ClientTable';
import ConfirmModal from '@/src/components/ui/ConfirmModal';

import {
  useDeleteClient,
  useClients,
} from '@/src/features/client/hooks/useClient';

import { Client } from '@/src/types/client.types';

export default function ClientPage() {
  const router = useRouter();

  const { data, isLoading, table } = useClients();

  const deleteMutation = useDeleteClient();
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | undefined>();

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">


        <SearchBar
          value={table.search}
          onChange={table.setSearch}
          placeholder="Search clients..."
          className="w-72"
        />
        <Button onClick={() => router.push('/client/add')} size="md">
          Add Client
        </Button>

   
      </div>

      <ClientTable
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
        title="Delete Client"
        confirmLabel="Delete Client"
        cancelLabel="Cancel"
        variant="danger"
        itemName={deleteTarget?.name}
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