'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { Select } from '@/src/components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';

const dimensionUnitOptions = [
  { label: 'CM', value: 'CM' },
  { label: 'IN', value: 'IN' },
];

const factorMap: Record<string, string> = {
  CM: '6000',
  IN: '166',
};

export function WaybillDimensions() {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'dimensions' });

  const dimensionUnit = useWatch({ control, name: 'dimension_unit' });
  const chargableWeight = useWatch({ control, name: 'chargable_weight' });
  const dimensions = useWatch({ control, name: 'dimensions' });

  const factor = dimensionUnit === 'IN' ? 166 : 6000;

  const calculateVolWeight = (dim: {
    piece?: number | null;
    length?: string | null;
    width?: string | null;
    height?: string | null;
  }) => {
    const qty = dim.piece ?? 1;
    const l = parseFloat(dim.length ?? '') || 0;
    const w = parseFloat(dim.width ?? '') || 0;
    const h = parseFloat(dim.height ?? '') || 0;
    if (!qty || !l || !w || !h) return 0;
    return (qty * l * w * h) / factor;
  };

  const totalVolWeight = (dimensions ?? []).reduce(
    (sum: number, dim: any) => sum + calculateVolWeight(dim),
    0,
  );

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-3">
        <div>
          <h3 className="font-semibold text-base text-[var(--color-ink)]">
            Dimensions ({fields.length} row{fields.length !== 1 ? 's' : ''})
          </h3>
          <p className="text-xs text-[var(--color-ink)]/60">
            Specify individual carton or piece measurements
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => append({ piece: 1  , length: '', width: '', height: '' })}
        >
          <Plus size={14} className="mr-1" /> Add Package
        </Button>
      </div>

      {/* Unit + Factor controls */}
      <div className="flex items-end gap-4 mb-2">
        <div className="w-48">
          <FormField name="dimension_unit" label="Dimension Unit" required>
            {(field) => (
              <Select
                options={dimensionUnitOptions}
                value={field.value || 'CM'}
                onChange={(val) => {
                  field.onChange(val);
                  setValue('volumetric_factor', factorMap[val as string] ?? '6000');
                }}
              />
            )}
          </FormField>
        </div>
        <div className="w-32">
          <FormField name="volumetric_factor" label="Factor">
            {(field) => (
              <Input
                type="number"
                placeholder="6000"
                {...field}
                value={field.value ?? '6000'}
              />
            )}
          </FormField>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-[var(--color-mist)] rounded-lg">
          <p className="text-sm text-[var(--color-ink)]/50">
            No package dimensions added yet. Click &quot;Add Package&quot; to specify dimensions.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-mist)] bg-[var(--color-canvas)]">
                <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-10">
                  #
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Qty
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Length
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Width
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Height
                </th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Vol. wt
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                const dim = dimensions?.[index] ?? {};
                const volWeight = calculateVolWeight(dim);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--color-mist)] hover:bg-[var(--color-canvas)]/60 transition-colors"
                  >
                    <td className="py-2 px-3 text-xs text-[var(--color-ink)]/50 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-1.5 px-2 w-16">
                      <FormField name={`dimensions.${index}.piece`} label="">
                        {(field) => (
                          <input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value === '' ? undefined : Number(event.target.value),
                              )
                            }
                            value={field.value ?? ''}
                            placeholder="1"
                            min="1"
                            className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                          />
                        )}
                      </FormField>
                    </td>
                    <td className="py-1.5 px-2">
                      <FormField name={`dimensions.${index}.length`} label="">
                        {(field) => (
                          <input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            placeholder="—"
                            className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                          />
                        )}
                      </FormField>
                    </td>
                    <td className="py-1.5 px-2">
                      <FormField name={`dimensions.${index}.width`} label="">
                        {(field) => (
                          <input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            placeholder="—"
                            className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                          />
                        )}
                      </FormField>
                    </td>
                    <td className="py-1.5 px-2">
                      <FormField name={`dimensions.${index}.height`} label="">
                        {(field) => (
                          <input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            placeholder="—"
                            className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                          />
                        )}
                      </FormField>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-[var(--color-ocean)]">
                      {volWeight > 0 ? volWeight.toFixed(2) : '—'}
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove dimension"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {fields.length > 0 && (
              <tfoot>
                <tr className="bg-[var(--color-canvas)]/40 border-t border-[var(--color-mist)]">
                  <td colSpan={5} className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider">
                        Chargable Weight
                      </span>
                      <FormField name="chargable_weight" label="">
                        {(field) => (
                          <input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            placeholder="0.00"
                            className="w-28 h-9 rounded-lg border border-[var(--color-mist)] bg-white px-3 text-base font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-2 focus:ring-[var(--color-ocean)]/10 transition-all"
                          />
                        )}
                      </FormField>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-lg font-bold text-[var(--color-ocean)] tabular-nums">
                        {totalVolWeight.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--color-ocean)]/40 uppercase">
                        kg
                      </span>
                    </div>
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
