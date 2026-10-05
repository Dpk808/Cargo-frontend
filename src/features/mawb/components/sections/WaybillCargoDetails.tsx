'use client';

import { useFormContext } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';

const weightUnitOptions = [
  { label: 'KG', value: 'KG' },
  { label: 'LB', value: 'LB' },
];

export function WaybillCargoDetails() {
  const { register } = useFormContext();

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
        Shipment Details &amp; Charges
      </h3>

      {/* Handling information + note textareas */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
            Handling Information
          </label>
          <textarea
            {...register('information')}
            className="w-full h-24 rounded-lg border border-[var(--color-mist)] p-3 text-sm focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)] outline-none resize-none"
            placeholder="Enter handling information..."
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
            Note (Optional)
          </label>
          <textarea
            {...register('note')}
            className="w-full h-24 rounded-lg border border-[var(--color-mist)] p-3 text-sm focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)] outline-none resize-none"
            placeholder="Internal notes..."
          />
        </div>
      </div>

      {/* Shipment charge row */}
      <div className="grid grid-cols-7 gap-2">
        <FormField name="no_of_pieces" label="Pcs" required>
          {(field) => <Input type="number" placeholder="1" {...field} />}
        </FormField>

        <FormField name="unit" label="Unit" required>
          {(field) => (
            <Select
              options={weightUnitOptions}
              value={field.value || 'KG'}
              onChange={field.onChange}
            />
          )}
        </FormField>

        <FormField name="gross_weight" label="Gross Wt." required>
          {(field) => (
            <Input type="number" step="0.01" placeholder="0.00" {...field} />
          )}
        </FormField>

        <FormField name="rate_class" label="Class">
          {(field) => <Input placeholder="Q/N/M" {...field} value={field.value ?? ''} />}
        </FormField>

        <FormField name="commodity_item_no" label="Commodity">
          {(field) => (
            <Input placeholder="Code" {...field} value={field.value ?? ''} />
          )}
        </FormField>

        <FormField name="rate" label="Rate">
          {(field) => (
            <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? ''} />
          )}
        </FormField>

        <FormField name="total" label="Total">
          {(field) => (
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...field}
              value={field.value ?? ''}
              disabled
              className="bg-[var(--color-canvas)]"
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
