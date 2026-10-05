'use client';

import { useWatch, useFormContext } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { useCurrencies } from '@/src/hooks/useCurrencies';

const chgsFields = [
  { field: 'accounting.wt_val_ppd', label: 'WT Val PPD' },
  { field: 'accounting.wt_val_coll', label: 'WT Val COLL' },
  { field: 'accounting.other_ppd', label: 'Other PPD' },
  { field: 'accounting.other_coll', label: 'Other COLL' },
] as const;

export function WaybillAccounting() {
  const { control, setValue } = useFormContext();
  const { data: currenciesData } = useCurrencies();

  const isPrepaid = useWatch({ control, name: 'accounting.is_prepaid' });
  const isCollect = useWatch({ control, name: 'accounting.is_collect' });
  const chgsCode = useWatch({ control, name: 'accounting.chgs_code' });
  const wtValPpd = useWatch({ control, name: 'accounting.wt_val_ppd' });
  const wtValColl = useWatch({ control, name: 'accounting.wt_val_coll' });
  const otherPpd = useWatch({ control, name: 'accounting.other_ppd' });
  const otherColl = useWatch({ control, name: 'accounting.other_coll' });

  const fieldValues: Record<string, boolean> = {
    'accounting.wt_val_ppd': wtValPpd,
    'accounting.wt_val_coll': wtValColl,
    'accounting.other_ppd': otherPpd,
    'accounting.other_coll': otherColl,
  };

  const currencyOptions =
    currenciesData?.map((c) => ({
      label: `${c.code} - ${c.currency}`,
      value: c.code,
    })) ?? [
      { label: 'USD - US Dollar', value: 'USD' },
      { label: 'NPR - Nepalese Rupee', value: 'NPR' },
    ];

  const handlePrepaid = () => {
    setValue('accounting.is_prepaid', true);
    setValue('accounting.is_collect', false);
    setValue('accounting.wt_val_ppd', true);
    setValue('accounting.other_ppd', true);
    setValue('accounting.wt_val_coll', false);
    setValue('accounting.other_coll', false);
    setValue('accounting.chgs_code', 'PP');
  };

  const handleCollect = () => {
    setValue('accounting.is_collect', true);
    setValue('accounting.is_prepaid', false);
    setValue('accounting.wt_val_coll', true);
    setValue('accounting.other_coll', true);
    setValue('accounting.wt_val_ppd', false);
    setValue('accounting.other_ppd', false);
    setValue('accounting.chgs_code', 'CC');
  };

  const displayChgsCode = isPrepaid ? 'PP' : isCollect ? 'CC' : chgsCode ?? '—';

  return (
    <div className="space-y-6">
      {/* Payment Mode */}
      <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
          Payment Mode
        </h3>
        <div className="space-y-3">
          <label
            className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-[var(--color-canvas)] transition-colors"
            style={{ borderColor: isPrepaid ? 'var(--color-ocean)' : 'transparent' }}
          >
            <input
              type="radio"
              name="payment_mode"
              value="prepaid"
              checked={!!isPrepaid}
              onChange={handlePrepaid}
              className="w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">Prepaid</p>
              <p className="text-xs text-[var(--color-ink)]/70">Charges paid by shipper</p>
            </div>
          </label>

          <label
            className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-[var(--color-canvas)] transition-colors"
            style={{ borderColor: isCollect ? 'var(--color-ocean)' : 'transparent' }}
          >
            <input
              type="radio"
              name="payment_mode"
              value="collect"
              checked={!!isCollect}
              onChange={handleCollect}
              className="w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">Collect</p>
              <p className="text-xs text-[var(--color-ink)]/70">Charges paid by consignee</p>
            </div>
          </label>
        </div>
      </div>

      {/* Charge Codes */}
      <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
          Charge Codes
        </h3>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start gap-4">
            {/* Currency */}
            <div className="w-48 min-w-[10rem] flex-shrink">
              <FormField name="accounting.currency" label="Currency" required>
                {(field) => (
                  <Select
                    options={currencyOptions}
                    value={field.value || 'USD'}
                    onChange={field.onChange}
                  />
                )}
              </FormField>
            </div>

            {/* CHGS Code + indicators */}
            <div className="flex-1 min-w-0 rounded-xl border border-[var(--color-mist)] bg-white px-2 py-3 overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-medium text-[var(--color-ink)]/50 uppercase tracking-wide">
                    CHGS Code
                  </span>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded border tracking-widest"
                    style={{
                      borderColor:
                        displayChgsCode !== '—' ? 'var(--color-ocean)' : 'var(--color-mist)',
                      color:
                        displayChgsCode !== '—' ? 'var(--color-ocean)' : 'var(--color-ink)',
                      backgroundColor:
                        displayChgsCode !== '—'
                          ? 'color-mix(in srgb, var(--color-ocean) 8%, transparent)'
                          : 'var(--color-canvas)',
                    }}
                  >
                    {displayChgsCode}
                  </span>
                </div>

                <div className="w-px h-8 bg-[var(--color-mist)]" />

                {chgsFields.map(({ field, label }, i) => {
                  const active = Boolean(fieldValues[field]);
                  return (
                    <div key={field} className="flex items-center gap-2 min-w-0">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-medium text-[var(--color-ink)]/50 uppercase tracking-wide">
                          {label}
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: active ? 'var(--color-ocean)' : 'var(--color-mist)',
                          }}
                        >
                          {active && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: 'var(--color-ocean)' }}
                            />
                          )}
                        </div>
                      </div>
                      {i < chgsFields.length - 1 && (
                        <div className="w-px h-8 bg-[var(--color-mist)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reference + optional shipping info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField name="accounting.reference_number" label="Reference Number">
              {(field) => (
                <Input placeholder="Optional Ref No" {...field} value={field.value ?? ''} />
              )}
            </FormField>
            <FormField name="information" label="Optional Shipping Information">
              {(field) => (
                <Input placeholder="Optional Info" {...field} value={field.value ?? ''} />
              )}
            </FormField>
          </div>
        </div>
      </div>

      {/* Accounting & Declaration */}
      <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
          Accounting &amp; Declaration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField name="accounting.declared_value_carriage" label="Declared Value (Carriage)">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="NVD or amount"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>
          <FormField name="accounting.declared_value_customs" label="Declared Value (Customs)">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="NCV or amount"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>
          <FormField name="accounting.insurance_amt" label="Insurance Amount">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                placeholder="XXX or amount"
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
