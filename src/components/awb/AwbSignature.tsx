import InputBox from "@/src/components/ui/InputBox";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbSignatureProps {
  form: Pick<MawbFormState, 'signature' | 'signature_prefix' | 'executed_date'>;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbSignature({ form, onChange }: AwbSignatureProps) {
  return (
    <FormSection title="Execution & Signature" columns={1}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              Signature / Authority
            </span>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-[var(--color-canvas)] px-3 rounded-lg border border-[var(--color-mist)] h-11">
                <input
                  id="agt-prefix"
                  type="checkbox"
                  checked={form.signature_prefix}
                  onChange={(e) => onChange("signature_prefix", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-mist)] text-[var(--color-ocean)] focus:ring-[var(--color-ocean)]/20 cursor-pointer"
                />
                <label htmlFor="agt-prefix" className="text-sm font-medium text-[var(--color-ink)] cursor-pointer select-none">
                  AGT/
                </label>
              </div>
              <input
                type="text"
                value={form.signature}
                onChange={(e) => onChange("signature", e.target.value)}
                placeholder="Signature or authority name"
                className="w-full h-11 rounded-lg border border-[var(--color-mist)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 outline-none transition-all duration-200 hover:border-[var(--color-ocean)]/40 focus:border-[var(--color-ocean)] focus:ring-2 focus:ring-[var(--color-ocean)]/15"
              />
            </div>
            <p className="text-[10px] text-[var(--color-ink)]/50 italic">
              Signature of Shipper or his Agent
            </p>
          </div>
        </div>

        <InputBox
          label="Executed Date"
          type="date"
          value={form.executed_date}
          onChange={(e) => onChange("executed_date", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
}
