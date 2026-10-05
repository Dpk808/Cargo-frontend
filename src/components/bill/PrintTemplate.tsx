'use client';

import React from 'react';
import { TaxInvoice } from '../../types/entities';
import { useCompany } from '@/src/hooks/useCompany';

interface PrintTemplateProps {
  data: TaxInvoice;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ data }) => {
  const { data: company } = useCompany();

  const companyName = company?.name || '—';
  const companyAddress = company
    ? [company.address, company.city, company.country].filter(Boolean).join(', ')
    : '—';
  const companyPhone = [company?.phoneNumber, company?.officeNumber1, company?.officeNumber2]
    .filter(Boolean)
    .join(', ') || '—';
  const companyEmail = company?.email || '';
  const companyPan = company?.vatPanNumber || '—';

  // Determine billed party
  const billedParty = data.shipper || data.consignee;

  return (
    <div className="bg-white p-10 mx-auto border shadow-sm print:shadow-none print:border-none print:p-0" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Company Header */}
      <div className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black uppercase">{companyName}</h1>
        <p className="text-xs">{companyAddress} | Tel: {companyPhone}</p>
        {companyEmail && <p className="text-xs">Email: {companyEmail}</p>}
        <p className="text-xs font-bold mt-1">PAN NO: {companyPan}</p>
        <div className="mt-4 inline-block border-2 border-black px-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-widest">TAX INVOICE</h2>
        </div>
      </div>

      {/* Invoice Meta + Billed Party — billed client left, shipment right */}
      <div className="flex justify-between mb-8 text-sm">
        {/* Left: Billed Client */}
        <div className="space-y-1 max-w-xs">
          <p className="font-bold uppercase">Billed To:</p>
          {billedParty ? (
            <>
              <p className="font-bold">{billedParty.name}</p>
              <p>{billedParty.address}</p>
              <p>{billedParty.city}, {billedParty.country}</p>
              {billedParty.phoneNumber && <p>Tel: {billedParty.phoneNumber}</p>}
            </>
          ) : (
            <p className="italic text-gray-400">No party assigned</p>
          )}
        </div>

        {/* Right: Shipment Details */}
        <div className="text-right space-y-1">
          <p><span className="font-bold">Invoice No:</span> {data.invoice_no}</p>
          <p><span className="font-bold">Date:</span> {new Date(data.date).toLocaleDateString()}</p>
          <p><span className="font-bold">MAWB No:</span> {data.mawb?.airline_prefix}-{data.mawb?.serial_no}</p>
          {data.mawb?.no_of_pieces != null && (
            <p><span className="font-bold">Pcs:</span> {data.mawb.no_of_pieces} &nbsp; <span className="font-bold">Wt:</span> {data.mawb.gross_weight} {data.mawb.unit}</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-black text-sm mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-2 py-1 w-12">S.N.</th>
            <th className="border border-black px-2 py-1 text-left">Particulars</th>
            <th className="border border-black px-2 py-1 w-24 text-right">Qty</th>
            <th className="border border-black px-2 py-1 w-32 text-right">Rate</th>
            <th className="border border-black px-2 py-1 w-36 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx} className="h-8">
              <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
              <td className="border border-black px-2 py-1">{item.particulars}</td>
              <td className="border border-black px-2 py-1 text-right">{item.quantity}</td>
              <td className="border border-black px-2 py-1 text-right">{item.rate.toLocaleString()}</td>
              <td className="border border-black px-2 py-1 text-right">{item.amount.toLocaleString()}</td>
            </tr>
          ))}
          {/* Fill rows to maintain height */}
          {Array.from({ length: Math.max(0, 10 - data.items.length) }).map((_, i) => (
            <tr key={`empty-${i}`} className="h-8">
              <td className="border border-black px-2 py-1">&nbsp;</td>
              <td className="border border-black px-2 py-1">&nbsp;</td>
              <td className="border border-black px-2 py-1">&nbsp;</td>
              <td className="border border-black px-2 py-1">&nbsp;</td>
              <td className="border border-black px-2 py-1">&nbsp;</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border border-black px-2 py-1 text-right font-bold">Sub Total</td>
            <td className="border border-black px-2 py-1 text-right font-bold">{data.sub_total.toLocaleString()}</td>
          </tr>
          {data.discount ? (
            <tr>
              <td colSpan={4} className="border border-black px-2 py-1 text-right font-bold">Discount</td>
              <td className="border border-black px-2 py-1 text-right font-bold">{data.discount.toLocaleString()}</td>
            </tr>
          ) : null}
          <tr>
            <td colSpan={4} className="border border-black px-2 py-1 text-right font-bold">VAT (13%)</td>
            <td className="border border-black px-2 py-1 text-right font-bold">{data.vat_amount?.toLocaleString()}</td>
          </tr>
          <tr className="bg-gray-100">
            <td colSpan={4} className="border border-black px-2 py-1 text-right font-black uppercase">Grand Total</td>
            <td className="border border-black px-2 py-1 text-right font-black">{data.grandtotal.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mb-12">
        <p className="text-sm italic"><span className="font-bold">In Words:</span> {data.in_words} Only.</p>
      </div>

      <div className="flex justify-between items-end pt-20">
        <div className="text-center w-48 border-t border-black pt-2">
          <p className="text-xs font-bold uppercase">Receiver&apos;s Signature</p>
        </div>
        <div className="text-center w-48 border-t border-black pt-2">
          <p className="text-xs font-bold uppercase">Authorized Signature</p>
        </div>
      </div>

      <div className="mt-12 text-[10px] text-center border-t border-dotted pt-4">
        <p>This is a computer generated invoice and does not require a physical signature if stamped.</p>
      </div>
    </div>
  );
};
