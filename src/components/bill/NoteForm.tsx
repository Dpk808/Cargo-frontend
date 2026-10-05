import React from 'react';
import { NoteItem } from '../../types/entities';
import InputBox from '../ui/InputBox';

interface NoteFormProps {
  type: 'credit' | 'debit';
  data: any; // CreditNote | DebitNote
  onChange: (data: any) => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ type, data, onChange }) => {
  const noteNoField = type === 'credit' ? 'credit_note_no' : 'debit_note_no';

  const calculateTotals = (items: NoteItem[]) => {
    const grandTotal = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    return {
      grandtotal: grandTotal,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleItemChange = (index: number, field: keyof NoteItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const quantity = newItems[index].quantity;
      const normalizedQuantity = quantity === null || quantity === undefined ? 1 : Number(quantity);
      const rate = Number(newItems[index].rate || 0);
      newItems[index].amount = normalizedQuantity * rate;
    }

    const totals = calculateTotals(newItems);

    onChange({
      ...data,
      items: newItems.map((item, itemIndex) => ({
        ...item,
        s_no: itemIndex + 1,
      })),
      ...totals,
    });
  };

  const addItem = () => {
    const newItem: NoteItem = {
      id: Date.now(),
      s_no: data.items.length + 1,
      hs_code: null,
      particulars: '',
      rate: 0,
      quantity: 1,
      amount: 0,
    } as any;
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    let newItems;
    if (data.items.length === 1) {
      newItems = [{ ...data.items[0], hs_code: null, particulars: '', quantity: 1, rate: 0, amount: 0, s_no: 1 }];
    } else {
      newItems = data.items.filter((_: any, i: number) => i !== index).map((item: any, itemIndex: number) => ({
        ...item,
        s_no: itemIndex + 1,
      }));
    }

    const totals = calculateTotals(newItems);

    onChange({
      ...data,
      items: newItems,
      ...totals,
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6 mt-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        {type === 'credit' ? 'Credit Note' : 'Debit Note'} Entry Form
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputBox 
          label={`${type === 'credit' ? 'Credit' : 'Debit'} Note No`} 
          name={noteNoField} 
          value={data[noteNoField]} 
          onChange={handleChange} 
        />
        <InputBox 
          label="Date" 
          name="date" 
          type="date" 
          value={data.date.split('T')[0]} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700">Line Items</h3>
        
        {data.items.length > 0 && (
          <div className="grid grid-cols-12 gap-2 text-sm font-bold text-gray-500 pb-2 border-b">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-2">HS Code</div>
            <div className="col-span-3">Particulars</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-1 text-right">Amount</div>
            <div className="col-span-1 text-center">Action</div>
          </div>
        )}
        
        {data.items.map((item: any, index: number) => (
          <div key={item.id || index} className="grid grid-cols-12 gap-2 items-center border-b pb-2">
            <div className="col-span-1 text-center font-bold text-gray-400">{index + 1}</div>
            <div className="col-span-2">
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={item.hs_code || ''}
                placeholder="HS Code"
                onChange={(e) => handleItemChange(index, 'hs_code', e.target.value || null)}
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={item.particulars}
                placeholder="Particulars"
                onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={item.quantity ?? ''}
                placeholder="Qty"
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? null : parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={item.rate || ''}
                placeholder="Rate"
                onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                onFocus={() => {
                  if (index === data.items.length - 1) {
                    addItem();
                  }
                }}
              />
            </div>
            <div className="col-span-1 text-right font-bold text-gray-800">
              {(item.amount || 0).toLocaleString()}
            </div>
            <div className="col-span-1 flex justify-center">
                <button 
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove Item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="is_usd" 
                checked={data.is_usd} 
                onChange={(e) => onChange({...data, is_usd: e.target.checked})}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="is_usd" className="font-bold text-gray-700 cursor-pointer">Billing in USD?</label>
          </div>
      </div>
    </div>
  );
};
