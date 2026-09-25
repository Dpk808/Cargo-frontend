import InputBox from "@/src/components/ui/InputBox";
import SelectField from "@/src/components/ui/SelectField";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbShipmentDetailsProps {
  form: Pick<MawbFormState, 
    'information' | 'note' | 'no_of_pieces' | 'unit' | 'gross_weight' | 
    'rate_class' | 'commodity_item_no' | 'rate' | 'total'
  >;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbShipmentDetails({ form, onChange }: AwbShipmentDetailsProps) {
  return (
    <FormSection title="Shipment Details & Charges" columns={1}>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="col-span-3">
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">Handling Information</label>
          <textarea
            value={form.information}
            onChange={(e) => onChange('information', e.target.value)}
            className="w-full h-24 rounded-lg border border-[var(--color-mist)] p-3 text-sm focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]"
            placeholder="Enter handling information..."
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">Note (Optional)</label>
          <textarea
            value={form.note}
            onChange={(e) => onChange('note', e.target.value)}
            className="w-full h-24 rounded-lg border border-[var(--color-mist)] p-3 text-sm focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]"
            placeholder="Internal notes..."
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        <InputBox
          label="Pcs"
          type="number"
          value={form.no_of_pieces}
          onChange={(e) => onChange("no_of_pieces", e.target.value)}
          required
        />
        <SelectField
          label="Unit"
          value={form.unit}
          onChange={(e) => onChange("unit", e.target.value)}
          options={[
            { label: "KG", value: "KG" },
            { label: "LB", value: "LB" },
          ]}
          required
        />
        <InputBox
          label="Gross Wt."
          type="number"
          step="0.01"
          value={form.gross_weight}
          onChange={(e) => onChange("gross_weight", e.target.value)}
          required
        />
        <InputBox
          label="Class"
          value={form.rate_class}
          onChange={(e) => onChange("rate_class", e.target.value)}
          required
        />
        <InputBox
          label="Commodity"
          value={form.commodity_item_no}
          onChange={(e) => onChange("commodity_item_no", e.target.value)}
          required
        />
        <InputBox
          label="Rate"
          type="number"
          step="0.01"
          value={form.rate}
          onChange={(e) => onChange("rate", e.target.value)}
          required
        />
        <InputBox
          label="Total"
          type="number"
          step="0.01"
          value={form.total}
          onChange={(e) => onChange("total", e.target.value)}
          disabled
        />
      </div>
    </FormSection>
  );
}
