'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Button from '@/src/components/ui/Button';

export function WaybillNatureOfGoods() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'natureOfGoods' });
  const [newItem, setNewItem] = useState({ title: '', detail: '' });

  const handleAdd = () => {
    if (newItem.title || newItem.detail) {
      append({ title: newItem.title, detail: newItem.detail || null });
      setNewItem({ title: '', detail: '' });
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
        Nature of Goods
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-mist)] bg-[var(--color-canvas)]">
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                Title
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                Detail
              </th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-[var(--color-mist)] hover:bg-[var(--color-canvas)]/60 transition-colors"
              >
                <td className="py-2 px-3 text-sm text-[var(--color-ink)] break-words min-w-[100px]">
                  {(item as any).title}
                </td>
                <td className="py-2 px-3 text-sm text-[var(--color-ink)] break-words">
                  {(item as any).detail}
                </td>
                <td className="py-1.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600 font-bold px-2 py-1"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--color-canvas)]/30">
              <td className="py-2 px-2">
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="New Title"
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                />
              </td>
              <td className="py-2 px-2">
                <input
                  type="text"
                  value={newItem.detail}
                  onChange={(e) => setNewItem({ ...newItem, detail: e.target.value })}
                  placeholder="New Detail"
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                />
              </td>
              <td className="py-2 px-2 text-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAdd}
                  className="h-9 px-3 text-xs w-full whitespace-nowrap"
                >
                  + Add
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
