'use client';

import React from 'react';
import { BillHeader } from './BillHeader';
import { BillItems } from './BillItems';
import { useCompany } from '@/src/hooks/useCompany';

interface NoteUIProps {
  type: 'credit' | 'debit';
  data: any; // CreditNote | DebitNote
}

export const NoteUI: React.FC<NoteUIProps> = ({ type, data }) => {
  const { data: company } = useCompany();

  // Determine the billed party — shipper, consignee, or agent
  const billedParty = data.shipper || data.consignee || data.agent;
  
  let billedLabel = 'Client';
  if (data.shipper) billedLabel = 'Shipper';
  else if (data.consignee) billedLabel = 'Consignee';
  else if (data.agent) billedLabel = 'Agent';

  const noteNo = type === 'credit' ? data.credit_note_no : data.debit_note_no;

  return (
    <div className="max-w-5xl mx-auto bg-white p-10 shadow-2xl rounded-2xl border border-gray-100 font-sans print:shadow-none print:p-0 print:border-none">
      {/* Header */}
      <BillHeader 
        invoiceNo={noteNo} 
        date={data.date ? new Date(data.date).toLocaleDateString() : ''}
        company={company}
        title={type === 'credit' ? 'CREDIT NOTE' : 'DEBIT NOTE'}
      />

      {/* Party Information */}
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

        {/* Shipment Details (Optional) */}
        <div className="col-span-3 space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Shipment Details</h3>
          {data.mawb ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">MAWB No.</p>
                  <p className="text-sm font-black text-gray-900">
                    {data.mawb.airline_prefix}-{data.mawb.serial_no}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pcs</p>
                  <p className="text-xs font-bold text-gray-700">{data.mawb.no_of_pieces}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Weight</p>
                  <p className="text-xs font-bold text-gray-700">{data.mawb.gross_weight} {data.mawb.unit}</p>
                </div>
              </div>
              
              {/* Optional related HAWBs */}
              {(data.creditNoteHawbs?.length > 0 || data.debitNoteHawbs?.length > 0) && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Selected HAWBs</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(data.creditNoteHawbs || data.debitNoteHawbs).map((nh: any, i: number) => (
                      <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">
                        {nh.hawb?.no_of_pieces} pcs / {nh.hawb?.gross_weight} {nh.hawb?.unit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-400 italic py-4">
              Independent Note (No MAWB Linked)
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <BillItems items={data.items} />

      {/* Simplified Footer */}
      <div className="space-y-8 mt-6">
        <div className="flex justify-between gap-8">
          {/* Left Side: Amount in Words */}
          <div className="flex-1">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Amount in Words</h4>
              <p className="text-sm font-bold text-gray-900 capitalize italic">
                {data.in_words} {data.in_words ? 'Only.' : ''}
              </p>
            </div>
          </div>

          {/* Right Side: Totals */}
          <div className="w-80">
            <div className="flex justify-between text-lg px-3 py-3 bg-blue-600 text-white rounded-xl shadow-lg">
              <span className="font-black uppercase tracking-wider">Grand Total</span>
              <span className="font-black underline decoration-2 underline-offset-4">
                {(data.grandtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="flex justify-between items-end pt-12 pb-4">
          <div className="text-center w-48">
            <div className="border-t-2 border-gray-400 pt-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Receiver's Signature</p>
            </div>
          </div>
          
          <div className="text-center w-48">
            <div className="border-t-2 border-gray-400 pt-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Button Overlay (hidden in print) */}
      <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
        <button 
          onClick={() => window.print()}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-2 font-bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print {type === 'credit' ? 'Credit Note' : 'Debit Note'}
        </button>
      </div>
    </div>
  );
};
