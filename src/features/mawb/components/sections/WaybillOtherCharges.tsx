'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import Button from '@/src/components/ui/Button';
import { Plus } from 'lucide-react';

const chargeTypeOptions = [
  { label: 'Agent', value: 'AGENT' },
  { label: 'Carrier', value: 'CARRIER' },
];

export function WaybillOtherCharges() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'otherCharge' });

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-3">
        <div>
          <h3 className="font-semibold text-base text-[var(--color-ink)]">Other Charges</h3>
          <p className="text-xs text-[var(--color-ink)]/60">
            Specify terminal, handling, or carrier surcharges
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => append({ name: '', amount: '0.00', type: 'AGENT' })}
        >
          <Plus size={14} className="mr-1" /> Add Charge
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-mist)] bg-[var(--color-canvas)]">
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                Charge Name
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                Amount
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-32">
                Type
              </th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-[var(--color-ink)]/50">
                  No additional charges added. Click &quot;Add Charge&quot; to attach surcharges.
                </td>
              </tr>
            ) : (
              fields.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-mist)] hover:bg-[var(--color-canvas)]/60 transition-colors"
                >
                  <td className="py-1.5 px-2">
                    <input
                      type="text"
                      {...register(`otherCharge.${index}.name`)}
                      placeholder="Charge Name"
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      {...register(`otherCharge.${index}.amount`)}
                      placeholder="Amount"
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <select
                      {...register(`otherCharge.${index}.type`)}
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                    >
                      {chargeTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
