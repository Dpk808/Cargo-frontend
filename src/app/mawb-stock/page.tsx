'use client';

import { useMemo, useState } from 'react';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import InputBox from '@/src/components/ui/InputBox';
import Modal from '@/src/components/ui/Modal';
import SelectField from '@/src/components/ui/SelectField';
import Table from '@/src/components/ui/Table';
import { useAgents } from '@/src/hooks/useAgents';
import { useAirlines } from '@/src/hooks/useAirlines';
import {
  useCreateMawbStockRange,
  useDeleteMawbStock,
  useHoldMawbStock,
  useMawbStock,
  useReleaseMawbStock,
} from '@/src/hooks/useMawbStock';
import type { MawbStock } from '@/src/types/entities';
import { MawbStockStatus } from '@/src/types/entities';
import type { TableColumn } from '@/src/types/api';

export default function MawbStockPage() {
  const { data: airlines = [] } = useAirlines();
  const { data: agents = [] } = useAgents();

  const [selectedAirlineId, setSelectedAirlineId] = useState('');
  const [startSerial, setStartSerial] = useState('');
  const [endSerial, setEndSerial] = useState('');
  const [checkDigit, setCheckDigit] = useState('');
  const [remarks, setRemarks] = useState('');

  const [holdTarget, setHoldTarget] = useState<MawbStock | null>(null);
  const [holdAgentId, setHoldAgentId] = useState('');
  const [holdRemarks, setHoldRemarks] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MawbStock | null>(null);

  const selectedAirline = airlines.find((airline) => String(airline.id) === selectedAirlineId);
  const airlineIdNumber = selectedAirlineId ? Number(selectedAirlineId) : undefined;

  const { data: stock = [], isLoading } = useMawbStock(airlineIdNumber);
  const createRangeMutation = useCreateMawbStockRange();
  const holdMutation = useHoldMawbStock();
  const releaseMutation = useReleaseMawbStock();
  const deleteMutation = useDeleteMawbStock();

  const airlineOptions = airlines.map((airline) => ({
    label: `${airline.name ?? 'Unnamed Airline'} (${airline.prefixCode ?? '-'})`,
    value: String(airline.id),
  }));

  const agentOptions = agents.map((agent) => ({
    label: agent.name,
    value: String(agent.id),
  }));

  const columns: TableColumn<MawbStock>[] = useMemo(
    () => [
      {
        key: 'mawbNo',
        header: 'MAWB No',
        render: (row) => (
          <span className="font-semibold text-[var(--color-ocean)]">
            {row.airline_prefix}-{row.serial_no}-{row.check_digit}
          </span>
        ),
      },
      {
        key: 'airline',
        header: 'Airline',
        render: (row) => row.airline?.name ?? '-',
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => {
          const colorClass =
            row.status === MawbStockStatus.AVAILABLE
              ? 'bg-green-100 text-green-800'
              : row.status === MawbStockStatus.HELD
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-800';

          return (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${colorClass}`}>
              {row.status}
            </span>
          );
        },
      },
      {
        key: 'heldByAgent',
        header: 'Held By Agent',
        render: (row) => row.heldByAgent?.name ?? '-',
      },
      {
        key: 'remarks',
        header: 'Remarks',
        render: (row) => row.remarks || '-',
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            

            {row.status === MawbStockStatus.AVAILABLE && (
              <>
                <Button size="sm" variant="ghost" onClick={() => {
                  setHoldTarget(row);
                  setHoldAgentId('');
                  setHoldRemarks(row.remarks ?? '');
                }}>
                  🤝 Hold
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
                  🗑️ Delete
                </Button>
              </>
            )}
            {row.status === MawbStockStatus.HELD && (
              <Button
                size="sm"
                variant="secondary"
                isLoading={releaseMutation.isPending}
                onClick={async () => {
                  await releaseMutation.mutateAsync(row.id);
                }}
              >
                🔓 Release
              </Button>
            )}
            {row.status === MawbStockStatus.HELD && (
              <>
                <Button size="sm" variant="ghost" onClick={() => {
                  const query = new URLSearchParams({
                    airline_prefix: row.airline_prefix,
                    serial_no: row.serial_no,
                    agent_id: row.heldByAgent?.id ? String(row.heldByAgent.id) : '',
                  }).toString();
                  window.location.href = `/mawb/add?${query}`;
                }}>
                  ➡ Proceed
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [releaseMutation],
  );

  const handleCreateRange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAirlineId || !startSerial || !endSerial || !checkDigit) {
      return;
    }

    await createRangeMutation.mutateAsync({
      airline_id: Number(selectedAirlineId),
      start_serial: Number(startSerial),
      end_serial: Number(endSerial),
      check_digit: checkDigit,
      remarks: remarks || undefined,
    });

    setStartSerial('');
    setEndSerial('');
    setCheckDigit('');
    setRemarks('');
  };

  const handleHold = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!holdTarget || !holdAgentId) {
      return;
    }

    await holdMutation.mutateAsync({
      id: holdTarget.id,
      payload: {
        agent_id: Number(holdAgentId),
        remarks: holdRemarks || undefined,
      },
    });

    setHoldTarget(null);
    setHoldAgentId('');
    setHoldRemarks('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">Stock</h1>
        <p className="mt-2 text-[var(--color-ink)]/70">
          Create airline-wise MAWB stock in serial order and hold specific MAWBs for agents.
        </p>
      </div>

      <Card title="Create MAWB Stock" subtitle="Select an airline and generate a serial range of available MAWBs">
        <form className="space-y-5" onSubmit={handleCreateRange}>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Airline"
              value={selectedAirlineId}
              onChange={(event) => setSelectedAirlineId(event.target.value)}
              options={airlineOptions}
              placeholder="Select airline"
              required
            />
            <InputBox
              label="Airline Prefix"
              value={selectedAirline?.prefixCode ?? ''}
              disabled
              placeholder="Auto-filled from airline"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InputBox
              label="Start Serial"
              type="number"
              min="0"
              max="9999999"
              value={startSerial}
              onChange={(event) => setStartSerial(event.target.value)}
              placeholder="e.g. 1"
              required
            />
            <InputBox
              label="End Serial"
              type="number"
              min="0"
              max="9999999"
              value={endSerial}
              onChange={(event) => setEndSerial(event.target.value)}
              placeholder="e.g. 100"
              required
            />
            <InputBox
              label="Check Digit"
              maxLength={1}
              value={checkDigit}
              onChange={(event) => setCheckDigit(event.target.value.slice(0, 1))}
              placeholder="e.g. 1"
              required
            />
          </div>

          <InputBox
            label="Remarks"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            placeholder="Optional remarks for this stock batch"
          />

          <div className="flex justify-end">
            <Button type="submit" size="lg" isLoading={createRangeMutation.isPending}>
              Create Stock Range
            </Button>
          </div>
        </form>
      </Card>

      <Card
        title="Stock List"
        subtitle="View, hold, release, and manage MAWB stock by airline"
      >
        <Table
          data={stock}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No MAWB stock found for the selected airline."
        />
      </Card>

      <Modal
        isOpen={Boolean(holdTarget)}
        title="Hold MAWB for Agent"
        onClose={() => {
          setHoldTarget(null);
          setHoldAgentId('');
          setHoldRemarks('');
        }}
      >
        <form className="space-y-5" onSubmit={handleHold}>
          <div className="rounded-lg border border-[var(--color-mist)] bg-[var(--color-canvas)] p-4 text-sm text-[var(--color-ink)]">
            Holding <strong>{holdTarget?.airline_prefix}-{holdTarget?.serial_no}-{holdTarget?.check_digit}</strong>
          </div>

          <SelectField
            label="Agent"
            value={holdAgentId}
            onChange={(event) => setHoldAgentId(event.target.value)}
            options={agentOptions}
            placeholder="Select agent"
            required
          />

          <InputBox
            label="Remarks"
            value={holdRemarks}
            onChange={(event) => setHoldRemarks(event.target.value)}
            placeholder="Optional hold remarks"
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setHoldTarget(null);
                setHoldAgentId('');
                setHoldRemarks('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={holdMutation.isPending}>
              Hold MAWB
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Delete MAWB Stock"
        onClose={() => setDeleteTarget(null)}
      >
        <div className="space-y-5">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-900">
              Are you sure you want to delete stock <strong>{deleteTarget?.airline_prefix}-{deleteTarget?.serial_no}-{deleteTarget?.check_digit}</strong>? Only available stock can be deleted.
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
              Delete Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
