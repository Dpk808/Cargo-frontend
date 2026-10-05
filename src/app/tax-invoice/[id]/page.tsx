'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Table from '@/src/components/ui/Table';
import { useTaxInvoicesByMawb, useDeleteTaxInvoice } from '@/src/hooks/useTaxInvoices';
import { TaxInvoiceUI } from '@/src/components/bill/TaxInvoiceUI';
import { PrintTemplate } from '@/src/components/bill/PrintTemplate';
import type { TaxInvoice } from '@/src/types/entities';
import type { TableColumn } from '@/src/types/api';

export default function MawbTaxInvoicesPage() {
  const router = useRouter();
  const params = useParams();
  const mawbId = Number(params.id);

  const { data: invoices = [], isLoading, isError } = useTaxInvoicesByMawb(mawbId);
  const deleteMutation = useDeleteTaxInvoice();

  const [activeTab, setActiveTab] = useState<'list' | 'view_all' | 'print_all'>('list');

  const columns: TableColumn<TaxInvoice>[] = useMemo(
    () => [
      {
        key: 'date',
        header: 'Date',
        render: (row) => (
            <span className="text-[var(--color-ink)]/70">
                {new Date(row.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                })}
            </span>
        ),
      },
      {
        key: 'invoice_no',
        header: 'Invoice #',
        render: (row) => (
          <span className="text-[var(--color-ocean)] font-medium">
            {row.invoice_no}
          </span>
        ),
      },
      {
        key: 'grandtotal',
        header: 'Grand Total',
        render: (row) => (
            <span className="font-bold text-[var(--color-ink)]">
                {row.is_usd ? '$' : 'Rs.'} {row.grandtotal.toLocaleString()}
            </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push(`/tax-invoice/invoice/${row.id}`)}
              className="bg-[var(--color-ocean)]/10 text-[var(--color-ocean)] hover:bg-[var(--color-ocean)] hover:text-white border-none"
            >
              ✏️ Edit / View
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={async (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete invoice ${row.invoice_no}?`)) {
                  await deleteMutation.mutateAsync({ id: row.id, mawbId });
                }
              }}
            >
              🗑️
            </Button>
          </div>
        ),
      },
    ],
    [router, deleteMutation]
  );

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white space-y-6">
      <div className="flex justify-between items-end print:hidden">
        <div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">🧾 MAWB Tax Invoices</h1>
            <p className="mt-2 text-[var(--color-ink)]/70">Manage billing records for this MAWB.</p>
        </div>
        <div className="flex gap-4">
            <Button variant="ghost" onClick={() => router.push('/tax-invoice')}>
                ← Back to MAWBs
            </Button>
            <Button onClick={() => router.push(`/tax-invoice/invoice/new?mawb_id=${mawbId}`)} size="lg" className="shadow-lg shadow-[var(--color-ocean)]/20">
                ➕ Add Invoice
            </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-8 print:hidden">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${activeTab === 'list' ? 'bg-[var(--color-ocean)] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📋 List Invoices
          </button>
          <button 
            onClick={() => setActiveTab('view_all')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${activeTab === 'view_all' ? 'bg-[var(--color-ocean)] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            👁️ View All Invoices
          </button>
          <button 
            onClick={() => setActiveTab('print_all')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${activeTab === 'print_all' ? 'bg-[var(--color-ocean)] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            🖨️ Print All Invoices
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <Card>
            {isError ? (
                <div className="p-8 text-center text-red-500">Failed to load invoices for this MAWB.</div>
            ) : (
                <Table 
                    data={invoices} 
                    columns={columns} 
                    isLoading={isLoading} 
                    emptyMessage="No invoices found for this MAWB." 
                />
            )}
        </Card>
      )}

      {activeTab === 'view_all' && (
        <div className="flex flex-col gap-12">
            {invoices.length === 0 ? (
                <Card>
                    <div className="p-8 text-center text-gray-500">No invoices to display.</div>
                </Card>
            ) : (
                invoices.map(invoice => (
                    <div key={invoice.id} className="relative pb-12 border-b-2 border-dashed border-gray-300 last:border-0">
                        <TaxInvoiceUI data={invoice} />
                    </div>
                ))
            )}
        </div>
      )}

      {activeTab === 'print_all' && (
        <div className="flex flex-col gap-12">
            {invoices.length === 0 ? (
                <Card>
                    <div className="p-8 text-center text-gray-500">No invoices to print.</div>
                </Card>
            ) : (
                invoices.map(invoice => (
                    <div key={invoice.id} className="relative pb-12 border-b-2 border-dashed border-gray-300 last:border-0 print:border-0 print:break-after-page">
                        <PrintTemplate data={invoice} />
                    </div>
                ))
            )}
            
            {invoices.length > 0 && (
                <div className="fixed bottom-10 right-10 print:hidden z-50">
                    <button 
                        onClick={() => window.print()}
                        className="bg-black text-white px-10 py-5 rounded-full shadow-2xl font-black flex items-center gap-3 transform hover:scale-105 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print All
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
