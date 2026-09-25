import React from 'react';
import type { Company } from '../../types/entities';

interface BillHeaderProps {
  title?: string;
  invoiceNo: string;
  date: string;
  company?: Company | null;
}

export const BillHeader: React.FC<BillHeaderProps> = ({ 
  title = "TAX INVOICE", 
  invoiceNo, 
  date, 
  company,
}) => {
  const companyName = company?.name || '—';
  const companyAddress = company
    ? [company.address, company.city, company.country].filter(Boolean).join(', ')
    : '—';
  const companyPhone = [company?.phoneNumber, company?.officeNumber1, company?.officeNumber2]
    .filter(Boolean)
    .join(', ') || '—';
  const companyEmail = company?.email || '';
  const companyPan = company?.vatPanNumber || '—';
  const companyAlias = company?.alias || companyName.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col border-b-2 border-gray-800 pb-6 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {company?.logo ? (
            <img src={company.logo} alt="Logo" className="w-20 h-20 object-contain" />
          ) : (
            <div className="w-16 h-16 bg-blue-600 flex items-center justify-center rounded-lg shadow-lg">
              <span className="text-white font-bold text-2xl">{companyAlias}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{companyName}</h1>
            <p className="text-sm text-gray-600 font-medium max-w-xs">{companyAddress}</p>
            <div className="mt-1 text-xs text-gray-500 space-x-3">
              <span>Tel: {companyPhone}</span>
              {companyEmail && <span>Email: {companyEmail}</span>}
            </div>
            <div className="mt-1">
              <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-700">
                PAN No: {companyPan}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-bl-2xl inline-block mb-4 shadow-md">
            <h2 className="text-xl font-black uppercase tracking-widest">{title}</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-end gap-3 text-sm">
              <span className="text-gray-500 font-semibold uppercase tracking-wider">Invoice No:</span>
              <span className="text-gray-900 font-bold">{invoiceNo}</span>
            </div>
            <div className="flex justify-end gap-3 text-sm">
              <span className="text-gray-500 font-semibold uppercase tracking-wider">Date:</span>
              <span className="text-gray-900 font-bold">{date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
