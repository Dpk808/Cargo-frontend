'use client';

import { useState } from 'react';
import { Pagination } from '@/src/components/ui/Pagination';
import InputBox from '@/src/components/ui/InputBox';
import Modal from '@/src/components/ui/Modal';
import Button from '@/src/components/ui/Button';
import SearchBar from '@/src/components/ui/SearchBar';
import Card from '@/src/components/ui/Card';
import { ClientSelect } from '@/src/features/client/components/ClientDropdown';
import MawbStockForm from '@/src/features/mawb-stock/forms/MawbStockForm';
import MawbStockTable from '@/src/features/mawb-stock/components/MawbStockTable';
import {
  useDeleteMawbStock,
  useHoldMawbStock,
  useMawbStock,
  useReleaseMawbStock,
} from '@/src/features/mawb-stock/hooks/useMawbStock';
import type { MawbStock } from '@/src/types/index';

export default function MawbStockPage() {
  const { data, isLoading, table } = useMawbStock();
  const holdMutation = useHoldMawbStock();
  const releaseMutation = useReleaseMawbStock();
  const deleteMutation = useDeleteMawbStock();
  const [holdTarget, setHoldTarget] = useState<MawbStock | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MawbStock | null>(null);
  const [clientId, setClientId] = useState<number>();
  const [remarks, setRemarks] = useState('');
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  async function handleHold(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!holdTarget) return;

    try {
      await holdMutation.mutateAsync({
        id: holdTarget.id,
        payload: {
          ...(clientId ? { client_id: clientId } : {}),
          ...(remarks.trim() ? { remarks: remarks.trim() } : {}),
        },
      });
      setHoldTarget(null);
      setClientId(undefined);
      setRemarks('');
    } catch {
      // Keep the modal open so the user can correct or retry the request.
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4">
        <div className="mb-4">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search MAWB, airline, agent..." className="w-72" />
        </div>
          <Button onClick={() => setIsAddStockOpen(true)}>Add MAWB Stock</Button>
        </div>
      </div>
        <MawbStockTable
          data={data?.items ?? []}
          isLoading={isLoading}
          onHold={(row) => setHoldTarget(row)}
          onDelete={(row) => setDeleteTarget(row)}
          onRelease={(row) => { void releaseMutation.mutateAsync(row.id); }}
          isReleasing={releaseMutation.isPending}
          onProceed={(row) => {
            const query = new URLSearchParams({
              airline_prefix: row.airline_prefix,
              serial_no: row.serial_no,
            });
            window.location.href = `/mawb/add?${query.toString()}`;
          }}
        />
        {data && data.meta.totalPages > 1 && (
          <Pagination totalPages={data.meta.totalPages} currentPage={table.page} onChange={table.setPage} />
        )}
      <Modal
        isOpen={isAddStockOpen}
        title="Add MAWB Stock"
        onClose={() => setIsAddStockOpen(false)}
      >
        <MawbStockForm onSuccess={() => setIsAddStockOpen(false)} />
      </Modal>
      <Modal isOpen={Boolean(holdTarget)} title="Hold MAWB Stock" onClose={() => setHoldTarget(null)}>
        <form className="space-y-5" onSubmit={handleHold}>
          <ClientSelect label="Client" value={clientId} onChange={setClientId} />
          <InputBox label="Remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional hold remarks" />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setHoldTarget(null)}>Cancel</Button>
            <Button type="submit" isLoading={holdMutation.isPending}>Hold MAWB</Button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={Boolean(deleteTarget)} title="Delete MAWB Stock" onClose={() => setDeleteTarget(null)}>
        <div className="space-y-5">
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Delete {deleteTarget?.airline_prefix}-{deleteTarget?.serial_no}-{deleteTarget?.check_digit}?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" isLoading={deleteMutation.isPending} onClick={async () => {
              if (!deleteTarget) return;
              await deleteMutation.mutateAsync(deleteTarget.id);
              setDeleteTarget(null);
            }}>Delete Stock</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
