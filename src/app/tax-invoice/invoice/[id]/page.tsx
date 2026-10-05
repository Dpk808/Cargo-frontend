'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import { TaxInvoiceUI } from '@/src/components/bill/TaxInvoiceUI';
import { TaxInvoiceForm } from '@/src/components/bill/TaxInvoiceForm';
import { PrintTemplate } from '@/src/components/bill/PrintTemplate';
import { useTaxInvoice, useUpdateTaxInvoice } from '@/src/hooks/useTaxInvoices';
import type { TaxInvoice } from '@/src/types/entities';

function toWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = Math.floor(num)) === 0) return 'Zero';

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += Number(n[1]) != 0 ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
  str += Number(n[2]) != 0 ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
  str += Number(n[3]) != 0 ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
  str += Number(n[4]) != 0 ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
  str += Number(n[5]) != 0 ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
  return str.trim() + ' Only';
}

export default function TaxInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const { data: invoice, isLoading, isError } = useTaxInvoice(id);
  const updateMutation = useUpdateTaxInvoice();

  const [activeTab, setActiveTab] = useState<'entry' | 'view' | 'print'>('view');
  const [invoiceData, setInvoiceData] = useState<TaxInvoice | null>(null);

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
    }
  }, [invoice]);

  const handleInvoiceChange = (updatedData: TaxInvoice) => {
    setInvoiceData({
      ...updatedData,
      in_words: toWords(updatedData.grandtotal),
    });
  };

  const handleUpdate = async () => {
    if (!invoiceData || !invoiceData.id) return;

    const validItems = invoiceData.items
      .filter((item) => item.particulars.trim() !== '' && Number(item.rate) > 0 && Number(item.amount) > 0)
      .map((item, index) => ({
        ...(item.id && item.id > 0 ? { id: item.id } : {}),
        s_no: index + 1,
        hs_code: item.hs_code ?? null,
        particulars: item.particulars,
        quantity: item.quantity ?? null,
        rate: Number(item.rate || 0),
        amount: Number(item.amount || 0),
      }));

    if (validItems.length === 0) {
      alert('Please add at least one valid invoice item with positive rate and amount.');
      return;
    }

    const subTotal = validItems.reduce((sum, item) => sum + item.amount, 0);
    const discount = Number(invoiceData.discount || 0);
    const taxableAmount = subTotal - discount;
    const vatRate = Number(invoiceData.vat_rate || 0);
    const vatAmount = taxableAmount * (vatRate / 100);
    const grandtotal = taxableAmount + vatAmount;

    const payload = {
      invoice_no: invoiceData.invoice_no,
      date: invoiceData.date,
      mawb_id: invoiceData.mawb_id,
      shipper_id: invoiceData.shipper_id ?? invoiceData.shipper?.id ?? null,
      consignee_id: invoiceData.consignee_id ?? invoiceData.consignee?.id ?? null,
      agent_id: invoiceData.agent_id ?? invoiceData.agent?.id ?? null,
      is_usd: invoiceData.is_usd,
      sub_total: subTotal,
      discount,
      taxable_amount: taxableAmount,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      grandtotal,
      in_words: invoiceData.in_words,
      items: validItems,
    };

    await updateMutation.mutateAsync({ id: invoiceData.id, payload });
    alert('Invoice updated successfully!');
  };

  if (isLoading && !invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-ocean)]"></div>
      </div>
    );
  }

  if (isError && !invoiceData) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Invoice not found</h1>
          <p className="text-gray-500">The requested tax invoice could not be loaded.</p>
          <div className="flex justify-center gap-3">
            <Button variant="ghost" onClick={() => router.back()}>
              ← Back
            </Button>
            <Button onClick={() => router.push('/tax-invoice')}>
              Go to Tax Invoices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!invoiceData) return null;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-5xl mx-auto mb-8 print:hidden">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('entry')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${activeTab === 'entry' ? 'bg-[var(--color-ocean)] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            ✏️ Edit Invoice
          </button>
          <button 
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${activeTab === 'view' ? 'bg-[var(--color-ocean)] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            👁️ View Details
          </button>
          <button 
            onClick={() => setActiveTab('print')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${activeTab === 'print' ? 'bg-[var(--color-ocean)] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            🖨️ Print Template
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {activeTab === 'entry' && (
          <div className="flex flex-col gap-8">
            <div className="sticky top-4 z-10 drop-shadow-2xl">
                <TaxInvoiceUI data={invoiceData} />
            </div>
            <div className="mt-4">
                <TaxInvoiceForm data={invoiceData} onChange={handleInvoiceChange} />
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleUpdate} isLoading={updateMutation.isPending} size="lg">
                        Save Changes
                    </Button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <TaxInvoiceUI data={invoiceData} />
        )}

        {activeTab === 'print' && (
          <div className="flex flex-col items-center">
            <PrintTemplate data={invoiceData} />
            <div className="fixed bottom-10 right-10 print:hidden">
                 <button 
                    onClick={() => window.print()}
                    className="bg-black text-white px-10 py-5 rounded-full shadow-2xl font-black flex items-center gap-3 transform hover:scale-105 transition-all"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Confirm Print
                 </button>
            </div>
          </div>
        )}

      </div>

      <div className="mt-12 text-center text-gray-400 text-xs print:hidden">
        <p>&copy; 2026 Cargo Nexus | Advanced Billing Module</p>
      </div>
    </div>
  );
}
