'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaxInvoiceForm } from '@/src/components/bill/TaxInvoiceForm';
import { useCreateTaxInvoice } from '@/src/hooks/useTaxInvoices';
import { TaxInvoiceUI } from '@/src/components/bill/TaxInvoiceUI';
import { useMawb } from '@/src/hooks/useMawbs';
import type { TaxInvoice, Shipper, Consignee } from '@/src/types/entities';
import Button from '@/src/components/ui/Button';

// Premium helper to convert number to English words
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

export default function NewTaxInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mawbId = searchParams.get('mawb_id');
  
  const createMutation = useCreateTaxInvoice();
  const { data: mawb, isLoading: isLoadingMawb } = useMawb(mawbId ? Number(mawbId) : 0);

  const [invoiceData, setInvoiceData] = useState<TaxInvoice>({
    id: 0,
    invoice_no: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    is_usd: false,
    sub_total: 0,
    discount: 0,
    taxable_amount: 0,
    vat_rate: 13,
    vat_amount: 0,
    grandtotal: 0,
    in_words: '',
    items: [{
      id: Date.now(),
      s_no: 1,
      hs_code: null,
      particulars: '',
      rate: 0,
      quantity: 1,
      amount: 0
    }],
    mawb_id: mawbId ? Number(mawbId) : 0,
    shipper_id: null,
    consignee_id: null,
    agent_id: null,
    mawb: { id: mawbId ? Number(mawbId) : 0 } as any,
  });

  const [selectedCandidateIdx, setSelectedCandidateIdx] = useState<number>(-1);

  // Compute candidates list based on dynamic requirements
  const candidates = useMemo(() => {
    const list: Array<{
      type: 'shipper' | 'consignee';
      party: Shipper | Consignee;
      badge: string;
      details: string;
      isPrepaid?: boolean;
      isCollect?: boolean;
    }> = [];

    if (!mawb) return list;

    const hasHawbs = mawb.hawbs && mawb.hawbs.length > 0;

    if (!hasHawbs) {
      // Rule: if there is only mawb and no hawb then in the tax invoice create show the consignee of the mawb
      if (mawb.consignee) {
        list.push({
          type: 'consignee',
          party: mawb.consignee,
          badge: 'Consignee (MAWB)',
          details: 'Direct MAWB Shipment (No HAWBs)'
        });
      }
    } else {
      // Rule: if there is hawbs then if it is prepaid show the shippers of the hawb (allow to choose)
      // if it is collect then show the consignees of the hawb (allow to choose)
      const seenShipperIds = new Set<number>();
      const seenConsigneeIds = new Set<number>();

      mawb.hawbs?.forEach((hawb) => {
        const isPrepaid = hawb.accounting?.is_prepaid;
        const isCollect = hawb.accounting?.is_collect;

        if (isPrepaid && hawb.shipper) {
          if (!seenShipperIds.has(hawb.shipper.id)) {
            seenShipperIds.add(hawb.shipper.id);
            list.push({
              type: 'shipper',
              party: hawb.shipper,
              badge: 'Shipper (Prepaid HAWB)',
              details: `HAWB: ${hawb.no_of_pieces} pcs / ${hawb.gross_weight} ${hawb.unit}`,
              isPrepaid: true
            });
          }
        }

        if (isCollect && hawb.consignee) {
          if (!seenConsigneeIds.has(hawb.consignee.id)) {
            seenConsigneeIds.add(hawb.consignee.id);
            list.push({
              type: 'consignee',
              party: hawb.consignee,
              badge: 'Consignee (Collect HAWB)',
              details: `HAWB: ${hawb.no_of_pieces} pcs / ${hawb.gross_weight} ${hawb.unit}`,
              isCollect: true
            });
          }
        }
      });
    }

    // Fallback if rules yield no candidates but MAWB has parties
    if (list.length === 0) {
      if (mawb.consignee) {
        list.push({
          type: 'consignee',
          party: mawb.consignee,
          badge: 'Consignee (MAWB Fallback)',
          details: 'Prepaid/Collect rules yielded no HAWB results'
        });
      }
      if (mawb.shipper) {
        list.push({
          type: 'shipper',
          party: mawb.shipper,
          badge: 'Shipper (MAWB Fallback)',
          details: 'Prepaid/Collect rules yielded no HAWB results'
        });
      }
    }

    return list;
  }, [mawb]);

  // Handle active client selection changes
  const handleSelectCandidate = (idx: number) => {
    setSelectedCandidateIdx(idx);
    const candidate = candidates[idx];
    if (!candidate) return;

    setInvoiceData((prev) => ({
      ...prev,
      shipper_id: candidate.type === 'shipper' ? candidate.party.id : null,
      consignee_id: candidate.type === 'consignee' ? candidate.party.id : null,
      agent_id: mawb?.agent?.id ?? null,
      shipper: candidate.type === 'shipper' ? candidate.party : undefined,
      consignee: candidate.type === 'consignee' ? candidate.party : undefined,
      agent: mawb?.agent,
      mawb_id: mawb?.id ?? prev.mawb_id,
      mawb: {
        id: mawb?.id,
        airline_prefix: mawb?.airline_prefix,
        serial_no: mawb?.serial_no,
        check_digit: mawb?.check_digit,
        no_of_pieces: mawb?.no_of_pieces,
        gross_weight: mawb?.gross_weight,
        unit: mawb?.unit
      } as any
    }));
  };

  // Autoselect the first candidate when they are loaded
  useEffect(() => {
    if (candidates.length > 0 && selectedCandidateIdx === -1) {
      handleSelectCandidate(0);
    }
  }, [candidates, selectedCandidateIdx]);

  // Handle line item changes and auto-translate numbers to words
  const handleFormChange = (updatedData: TaxInvoice) => {
    const words = toWords(updatedData.grandtotal);
    setInvoiceData({
      ...updatedData,
      in_words: words
    });
  };

  const handleSave = async () => {
    try {
      const validItems = invoiceData.items
        .filter((item) => item.particulars.trim() !== '' && Number(item.rate) > 0 && Number(item.amount) > 0)
        .map((item, index) => ({
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
        mawb_id: Number(mawbId),
        shipper_id: invoiceData.shipper_id ?? null,
        consignee_id: invoiceData.consignee_id ?? null,
        agent_id: invoiceData.agent_id ?? null,
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

      const createdInvoice = await createMutation.mutateAsync(payload);
      alert('Invoice created successfully!');
      router.push(`/tax-invoice/invoice/${createdInvoice.id}`);
    } catch (e) {
      console.error(e);
      alert('Failed to create invoice.');
    }
  };

  if (!mawbId) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Tax Invoice Creation</h1>
          <p className="text-gray-500">A valid MAWB is required before creating a tax invoice.</p>
          <div className="flex justify-center">
            <Button onClick={() => router.push('/tax-invoice/add')}>Select MAWB</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingMawb) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-ocean)] mx-auto"></div>
          <p className="text-sm font-bold text-gray-500">Loading Airway Bill and Shipment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">🧾 Create Tax Invoice</h1>
            <p className="mt-2 text-sm text-gray-500">Address billing information to shippers or consignees based on shipment rules.</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
            ← Back
        </Button>
      </div>

      {/* Candidate Selection Selector Widget */}
      {mawb && (
        <div className="max-w-5xl mx-auto mb-8 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                🎯 Billing Client Selection
              </h3>
              <p className="text-xs text-gray-500">
                Choose the party responsible for payments. Shippers are shown for prepaid HAWBs, Consignees for collect.
              </p>
            </div>
            <span className="text-xs bg-blue-50 text-[var(--color-ocean)] font-bold px-3 py-1 rounded-full border border-blue-100">
              MAWB {mawb.airline_prefix}-{mawb.serial_no}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((cand, idx) => {
              const isActive = idx === selectedCandidateIdx;
              const isShipper = cand.type === 'shipper';
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectCandidate(idx)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    isActive 
                      ? isShipper 
                        ? 'border-blue-600 bg-blue-50/20 shadow-md' 
                        : 'border-green-600 bg-green-50/20 shadow-md' 
                      : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isShipper 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {cand.badge}
                      </span>
                      {isActive && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isShipper ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                        }`}>
                          ✓ Active Billing Client
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800 text-base">{cand.party.name}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {cand.party.address}, {cand.party.city}, {cand.party.country}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <span>{cand.details}</span>
                    {cand.party.phoneNumber && <span>Tel: {cand.party.phoneNumber}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="sticky top-4 z-10 drop-shadow-2xl">
            <TaxInvoiceUI data={invoiceData as any} />
        </div>
        <div className="mt-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <TaxInvoiceForm data={invoiceData as any} onChange={handleFormChange} />
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} isLoading={createMutation.isPending} size="lg">
                    💾 Save Invoice
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
