import InputBox from "@/src/components/ui/InputBox";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbAccountingProps {
  form: Pick<MawbFormState, 'declared_value_carriage' | 'declared_value_customs' | 'insurance_amt'>;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbAccounting({ form, onChange }: AwbAccountingProps) {
  return (
    <FormSection title="Accounting & Declaration" columns={3}>
      <InputBox
        label="Declared Value (Carriage)"
        type="number"
        step="0.01"
        value={form.declared_value_carriage}
        onChange={(e) => onChange("declared_value_carriage", e.target.value)}
        required
      />
      <InputBox
        label="Declared Value (Customs)"
        type="number"
        step="0.01"
        value={form.declared_value_customs}
        onChange={(e) => onChange("declared_value_customs", e.target.value)}
        required
      />
      <InputBox
        label="Insurance Amount"
        type="number"
        step="0.01"
        value={form.insurance_amt}
        onChange={(e) => onChange("insurance_amt", e.target.value)}
        required
      />
    </FormSection>
  );
}
