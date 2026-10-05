'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';

interface WaybillBillingProps {
  showAgentPrefix?: boolean;
}

export function WaybillBilling({ showAgentPrefix = true }: WaybillBillingProps) {
  const { control, register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Charge Summary */}
      <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
          Charge Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormField name="billing.weight_charge" label="Weight Charge">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Weight charge amount"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>

          <FormField name="billing.valuation_charge" label="Valuation Charge">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Valuation charge amount"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>

          <FormField name="billing.tax" label="Tax">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Tax amount"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>

          <FormField name="billing.total_charge_agent" label="Total Due Agent">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Charges due agent"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>

          <FormField name="billing.total_charge_carrier" label="Total Due Carrier">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Charges due carrier"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>

          <FormField name="billing.total" label="Total Charges">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="Grand total"
                {...field}
                value={field.value ?? ''}
                readOnly
                className="font-bold bg-[var(--color-canvas)]"
              />
            )}
          </FormField>
        </div>
      </div>

      {/* Execution & Signature */}
      <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
          Execution &amp; Signature
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--color-ink)]">
                Signature / Authority
              </span>
              <div className="flex gap-2">
                {showAgentPrefix && (
                  <div className="flex items-center gap-2 bg-[var(--color-canvas)] px-3 rounded-lg border border-[var(--color-mist)] h-11">
                    <input
                      id="agt-prefix"
                      type="checkbox"
                      {...register('billing.is_agent')}
                      className="w-4 h-4 rounded border-[var(--color-mist)] text-[var(--color-ocean)] focus:ring-[var(--color-ocean)]/20 cursor-pointer"
                    />
                    <label
                      htmlFor="agt-prefix"
                      className="text-sm font-medium text-[var(--color-ink)] cursor-pointer select-none"
                    >
                      AGT/
                    </label>
                  </div>
                )}
                <input
                  type="text"
                  {...register('billing.signature')}
                  placeholder="Signature or authority name"
                  className="w-full h-11 rounded-lg border border-[var(--color-mist)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 outline-none transition-all duration-200 hover:border-[var(--color-ocean)]/40 focus:border-[var(--color-ocean)] focus:ring-2 focus:ring-[var(--color-ocean)]/15"
                />
              </div>
              <p className="text-[10px] text-[var(--color-ink)]/50 italic">
                Signature of Shipper or his Agent
              </p>
            </div>
          </div>

          <FormField name="billing.executed_date" label="Executed Date" required>
            {(field) => <Input type="date" {...field} value={field.value ?? ''} />}
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <FormField name="billing.place" label="Executed at (Place)">
            {(field) => (
              <Input
                placeholder="e.g. KATHMANDU / NEPAL"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>
        </div>
      </div>
    </div>
  );
}
