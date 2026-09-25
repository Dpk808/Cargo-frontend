'use client';

import React from 'react';
import { TaxInvoice } from '../../types/entities';
import { BillHeader } from './BillHeader';
import { BillItems } from './BillItems';
import { BillFooter } from './BillFooter';
import { useCompany } from '@/src/hooks/useCompany';

interface TaxInvoiceUIProps {
  data: TaxInvoice;
}

export const TaxInvoiceUI: React.FC<TaxInvoiceUIProps> = ({ data }) => {
  const { data: company } = useCompany();

  // Determine the billed party — shipper (prepaid) or consignee (collect/direct)
  const billedParty = data.shipper || data.consignee;
  const billedLabel = data.shipper ? 'Shipper' : 'Consignee';

  return (
    <div className="max-w-5xl mx-auto bg-white p-10 shadow-2xl rounded-2xl border border-gray-100 font-sans print:shadow-none print:p-0 print:border-none">
      {/* Header */}
      <BillHeader 
        invoiceNo={data.invoice_no} 
        date={new Date(data.date).toLocaleDateString()}
        company={company}
      />

      {/* Party Information — Billed Client (left) + Shipment Details (right, wider) */}
      <div className="grid grid-cols-5 gap-8 mb-8">
        {/* Billed Client */}
        <div className="col-span-2 space-y-2 p-4 rounded-xl transition-all duration-200 relative border bg-blue-50/20 border-blue-500 ring-2 ring-blue-500/10 shadow-sm">
          <span className="absolute -top-2 right-3 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            Billed Client
          </span>
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">{billedLabel}</h3>
          {billedParty ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">{billedParty.name}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{billedParty.address}, {billedParty.city}</p>
              <p className="text-xs text-gray-500 font-medium">{billedParty.country}</p>
              {billedParty.phoneNumber && <p className="text-xs text-gray-500">Tel: {billedParty.phoneNumber}</p>}
            </div>
          ) : (
            <div className="space-y-1 py-2 text-center text-xs text-gray-400 font-medium italic">
              No party assigned
            </div>
          )}
        </div>

        {/* Shipment Details — wider */}
        <div className="col-span-3 space-y-2 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <h3 className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em] mb-1">Shipment Details</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">MAWB No.</p>
                <p className="text-sm font-black text-blue-900">
                  {data.mawb?.airline_prefix}-{data.mawb?.serial_no}
                </p>
              </div>
              {data.agent && (
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Agent</p>
                  <p className="text-xs font-bold text-blue-900">{data.agent.name}</p>
                </div>
              )}
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Pcs</p>
                <p className="text-xs font-bold text-blue-900">{data.mawb?.no_of_pieces}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Weight</p>
                <p className="text-xs font-bold text-blue-900">{data.mawb?.gross_weight} {data.mawb?.unit}</p>
              </div>
              {data.mawb?.airport && (
                <>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Origin</p>
                    <p className="text-xs font-bold text-blue-900">{data.mawb.airport.departure}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Destination</p>
                    <p className="text-xs font-bold text-blue-900">{data.mawb.airport.destination}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <BillItems items={data.items} />

      {/* Footer / Totals */}
      <BillFooter 
        subTotal={data.sub_total}
        discount={data.discount}
        taxableAmount={data.taxable_amount}
        vatRate={data.vat_rate}
        vatAmount={data.vat_amount}
        grandTotal={data.grandtotal}
        inWords={data.in_words}
      />
      
      {/* Print Button Overlay (hidden in print) */}
      <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
        <button 
          onClick={() => window.print()}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-2 font-bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Invoice
        </button>
      </div>
    </div>
  );
};
