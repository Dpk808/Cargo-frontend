import InputBox from "@/src/components/ui/InputBox";
import SelectField from "@/src/components/ui/SelectField";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbDimensionsProps {
  form: Pick<MawbFormState, 'dimensions' | 'dimension_unit' | 'volumetric_factor' | 'chargable_weight'>;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbDimensions({ form, onChange }: AwbDimensionsProps) {
  const updateDimension = (index: number, field: string, value: string) => {
    const newDims = [...form.dimensions];
    newDims[index] = { ...newDims[index], [field]: value };
    onChange("dimensions", newDims);
  };

  const factor = parseFloat(form.volumetric_factor) || 6000;

  const calculateVolWeight = (dim: (typeof form.dimensions)[0]) => {
    const qty = parseFloat(dim.pieces) || 0;
    const l = parseFloat(dim.length) || 0;
    const w = parseFloat(dim.width) || 0;
    const h = parseFloat(dim.height) || 0;
    if (!qty || !l || !w || !h) return 0;
    return (qty * l * w * h) / factor;
  };

  const totalVolWeight = form.dimensions.reduce((sum, dim) => sum + calculateVolWeight(dim), 0);

  return (
    <FormSection
      title={`Dimensions (${form.dimensions.length} row${form.dimensions.length > 1 ? "s" : ""})`}
      columns={1}
    >
      <div className="mb-4 flex items-end gap-4">
        <div className="w-48">
          <SelectField
            label="Dimension Unit"
            value={form.dimension_unit}
            onChange={(e) => {
              onChange("dimension_unit", e.target.value);
              onChange("volumetric_factor", e.target.value === "IN" ? "166" : "6000");
            }}
            options={[
              { label: "CM", value: "CM" },
              { label: "IN", value: "IN" },
            ]}
            required
          />
        </div>
        <div className="w-32">
          <InputBox
            label="Factor"
            type="number"
            value={form.volumetric_factor}
            onChange={(e) => onChange("volumetric_factor", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-mist)] bg-[var(--color-canvas)]">
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-10">#</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Qty</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Length</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Width</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Height</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Vol. wt</th>
            </tr>
          </thead>
          <tbody>
            {form.dimensions.map((dim, index) => {
              const volWeight = calculateVolWeight(dim);
              return (
                <tr key={index} className="border-b border-[var(--color-mist)] hover:bg-[var(--color-canvas)]/60 transition-colors">
                  <td className="py-2 px-3 text-xs text-[var(--color-ink)]/50 font-medium">{index + 1}</td>
                  <td className="py-1.5 px-2 w-16">
                    <input
                      type="number"
                      value={dim.pieces}
                      onChange={(e) => updateDimension(index, "pieces", e.target.value)}
                      placeholder="1"
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                      required
                      min="1"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      value={dim.length}
                      onChange={(e) => updateDimension(index, "length", e.target.value)}
                      placeholder="—"
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                      required
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      value={dim.width}
                      onChange={(e) => updateDimension(index, "width", e.target.value)}
                      placeholder="—"
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                      required
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      value={dim.height}
                      onChange={(e) => updateDimension(index, "height", e.target.value)}
                      placeholder="—"
                      className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                      required
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-[var(--color-ocean)]">
                    {volWeight > 0 ? volWeight.toFixed(2) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {form.dimensions.length > 0 && (
            <tfoot>
              <tr className="bg-[var(--color-canvas)]/40 border-t border-[var(--color-mist)]">
                <td colSpan={5} className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider">
                      Chargable Weight
                    </span>
                    <input
                      type="number"
                      value={form.chargable_weight}
                      onChange={(e) => onChange("chargable_weight", e.target.value)}
                      className="w-28 h-9 rounded-lg border border-[var(--color-mist)] bg-white px-3 text-base font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-2 focus:ring-[var(--color-ocean)]/10 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-lg font-bold text-[var(--color-ocean)] tabular-nums">
                      {totalVolWeight.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--color-ocean)]/40 uppercase">kg</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </FormSection>
  );
}
