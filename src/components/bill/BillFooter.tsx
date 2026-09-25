import React from 'react';

interface BillFooterProps {
  subTotal: number;
  discount?: number | null;
  taxableAmount: number;
  vatRate?: number | null;
  vatAmount?: number | null;
  grandTotal: number;
  inWords: string;
}

export const BillFooter: React.FC<BillFooterProps> = ({
  subTotal,
  discount,
  taxableAmount,
  vatRate,
  vatAmount,
  grandTotal,
  inWords,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between gap-8">
        {/* Left Side: Amount in Words */}
        <div className="flex-1">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Amount in Words</h4>
            <p className="text-sm font-bold text-gray-900 capitalize italic">
              {inWords} Only.
            </p>
          </div>
          
          <div className="mt-6 text-[10px] text-gray-400 leading-tight">
            <p className="font-bold mb-1 uppercase">Terms & Conditions:</p>
            <ul className="list-disc pl-3 space-y-0.5">
              <li>Goods once sold are not returnable.</li>
              <li>Interest at 18% p.a. will be charged if not paid within 7 days.</li>
              <li>Subject to Kathmandu Jurisdiction.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Totals */}
        <div className="w-80 space-y-2">
          <div className="flex justify-between text-sm px-2">
            <span className="text-gray-500 font-semibold">Sub Total</span>
            <span className="text-gray-900 font-bold">{subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          {discount !== undefined && discount !== null && discount > 0 && (
            <div className="flex justify-between text-sm px-2">
              <span className="text-gray-500 font-semibold">Discount</span>
              <span className="text-red-500 font-bold">-{discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm px-2 py-1 bg-gray-50 rounded">
            <span className="text-gray-700 font-bold">Taxable Amount</span>
            <span className="text-gray-900 font-bold">{taxableAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between text-sm px-2">
            <span className="text-gray-500 font-semibold">VAT ({vatRate || 13}%)</span>
            <span className="text-gray-900 font-bold">{vatAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between text-lg px-3 py-3 bg-blue-600 text-white rounded-xl shadow-lg mt-4">
            <span className="font-black uppercase tracking-wider">Grand Total</span>
            <span className="font-black underline decoration-2 underline-offset-4">
              {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
  );
};
