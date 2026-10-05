'use client';

import { useMemo } from 'react';
import { ArrowRight, Hand, LockOpen, Trash2 } from 'lucide-react';
import Button from '@/src/components/ui/Button';
import Table from '@/src/components/ui/Table';
import type { TableColumn } from '@/src/types/api';
import type { MawbStock } from '@/src/types/index';
import { MawbStockStatus } from '@/src/types/index';

interface MawbStockTableProps {
  data: MawbStock[];
  isLoading?: boolean;
  onHold: (row: MawbStock) => void;
  onDelete: (row: MawbStock) => void;
  onRelease: (row: MawbStock) => void;
  isReleasing?: boolean;
  onProceed: (row: MawbStock) => void;
}

export default function MawbStockTable({
  data,
  isLoading,
  onHold,
  onDelete,
  onRelease,
  isReleasing,
  onProceed,
}: MawbStockTableProps) {
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
      { key: 'airline', header: 'Airline', render: (row) => row.airline?.name ?? '-' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => {
          const color =
            row.status === MawbStockStatus.AVAILABLE
              ? 'bg-green-100 text-green-800'
              : row.status === MawbStockStatus.HELD
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-800';
          return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${color}`}>{row.status}</span>;
        },
      },
      { key: 'heldByAgent', header: 'Held By Agent', render: (row) => row.heldByAgent?.name ?? '-' },
      { key: 'remarks', header: 'Remarks', render: (row) => row.remarks || '-' },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            {row.status === MawbStockStatus.AVAILABLE && (
              <>
                <Button size="sm" variant="ghost" onClick={() => onHold(row)} title="Hold MAWB">
                  <Hand size={15} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(row)} title="Delete stock">
                  <Trash2 size={15} />
                </Button>
              </>
            )}
            {row.status === MawbStockStatus.HELD && (
              <>
                <Button size="sm" variant="secondary" isLoading={isReleasing} onClick={() => onRelease(row)} title="Release MAWB">
                  <LockOpen size={15} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onProceed(row)} title="Proceed with MAWB">
                  <ArrowRight size={15} />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [isReleasing, onDelete, onHold, onProceed, onRelease],
  );

  return <Table data={data} columns={columns} isLoading={isLoading} emptyMessage="No MAWB stock found." />;
}