import React from 'react';
import { TaxInvoiceItem } from '../../types/entities';

interface BillItemsProps {
  items: TaxInvoiceItem[];
}

const formatNumber = (value?: number | null) =>
  typeof value === 'number'
    ? value.toLocaleString('en-US', { minimumFractionDigits: 2 })
    : '-';

export const BillItems: React.FC<BillItemsProps> = ({ items }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-16">S.N.</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Particulars</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">HS Code</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-24">Qty</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32">Rate</th>
            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-36">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.s_no}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.particulars}</td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono">{item.hs_code || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity ?? '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatNumber(item.rate)}</td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatNumber(item.amount)}</td>
            </tr>
          ))}
          {/* Fill empty rows to maintain height if needed */}
          {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
            <tr key={`empty-${i}`} className="h-10">
              <td className="px-4 py-3">&nbsp;</td>
              <td className="px-4 py-3">&nbsp;</td>
              <td className="px-4 py-3">&nbsp;</td>
              <td className="px-4 py-3">&nbsp;</td>
              <td className="px-4 py-3">&nbsp;</td>
              <td className="px-4 py-3">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
