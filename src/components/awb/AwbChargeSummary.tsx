import InputBox from "@/src/components/ui/InputBox";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbChargeSummaryProps {
  form: Pick<MawbFormState, 'weight_charge' | 'valuation_charge' | 'tax' | 'other_charges_due_agent' | 'other_charges_due_carrier' | 'total_charges'>;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbChargeSummary({ form, onChange }: AwbChargeSummaryProps) {
  return (
    <FormSection title="Charge Summary" columns={2}>
      <InputBox
        label="Weight Charge"
        type="number"
        step="0.01"
        value={form.weight_charge}
        onChange={(e) => onChange("weight_charge", e.target.value)}
        placeholder="Weight charge amount"
      />
      <InputBox
        label="Valuation Charge"
        type="number"
        step="0.01"
        value={form.valuation_charge}
        onChange={(e) => onChange("valuation_charge", e.target.value)}
        placeholder="Valuation charge amount"
      />
      <InputBox
        label="Tax"
        type="number"
        step="0.01"
        value={form.tax}
        onChange={(e) => onChange("tax", e.target.value)}
        placeholder="Tax amount"
      />
      <InputBox
        label="Total Due Agent"
        type="number"
        step="0.01"
        value={form.other_charges_due_agent}
        onChange={(e) => onChange("other_charges_due_agent", e.target.value)}
        placeholder="Charges due agent"
      />
      <InputBox
        label="Total Due Carrier"
        type="number"
        step="0.01"
        value={form.other_charges_due_carrier}
        onChange={(e) => onChange("other_charges_due_carrier", e.target.value)}
        placeholder="Charges due carrier"
      />
      <InputBox
        label="Total Charges"
        type="number"
        step="0.01"
        value={form.total_charges}
        onChange={(e) => onChange("total_charges", e.target.value)}
        placeholder="Grand total"
        className="font-bold bg-[var(--color-canvas)]"
        readOnly
      />
    </FormSection>
  );
}
