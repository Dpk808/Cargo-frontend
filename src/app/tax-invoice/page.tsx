'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Table from '@/src/components/ui/Table';
import { useMawbs } from '@/src/hooks/useMawbs';
import type { Mawb } from '@/src/types/mawb.types';
import type { TableColumn } from '@/src/types/api';

export default function TaxInvoiceAddPage() {
  const router = useRouter();
  const { data: mawbs = [], isLoading } = useMawbs();

  const columns: TableColumn<Mawb>[] = useMemo(
    () => [
      {
        key: 'mawbNo',
        header: 'MAWB #',
        render: (row) => (
          <span className="font-bold text-[var(--color-ink)]">
            {row.airline_prefix}-{row.serial_no}-{row.check_digit}
          </span>
        ),
      },
      {
        key: 'shipper',
        header: 'Shipper',
        render: (row) => row.shipper?.name || '-',
      },
      {
        key: 'consignee',
        header: 'Consignee',
        render: (row) => row.consignee?.name || '-',
      },
      {
        key: 'date',
        header: 'Created At',
        render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
      },
      {
        key: 'actions',
        header: 'Action',
        render: (row) => (
          <Button
            size="sm"
            onClick={() => {
                router.push(`/tax-invoice/${row.id}`);
            }}
          >
            View Invoices
          </Button>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">🆕 Create New Tax Invoice</h1>
            <p className="mt-2 text-[var(--color-ink)]/70">Select a MAWB record to generate a tax invoice.</p>
        </div>

        <Card title="Select MAWB">
            <Table 
                data={mawbs} 
                columns={columns} 
                isLoading={isLoading} 
                emptyMessage="No MAWBs found. Please create a MAWB first." 
            />
        </Card>
        
        <div className="flex justify-start">
            <Button variant="ghost" onClick={() => router.push('/tax-invoice')}>
                ← Back to List
            </Button>
        </div>
    </div>
  );
}
