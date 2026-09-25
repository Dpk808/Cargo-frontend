import InputBox from "@/src/components/ui/InputBox";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbIdentificationProps {
  form: Pick<MawbFormState, 'airline_prefix' | 'serial_no' | 'city_name'>;
  calculatedCheckDigit?: string;
  mawbNumberPrefix?: string;
  airline?: any;
  airlineLoading?: boolean;
  onChange: (key: keyof MawbFormState, value: any) => void;
  isHawb?: boolean;
}

export default function AwbIdentification({
  form,
  calculatedCheckDigit,
  mawbNumberPrefix,
  airline,
  airlineLoading,
  onChange,
  isHawb,
}: AwbIdentificationProps) {
  return (
    <FormSection title={isHawb ? "HAWB Identification" : "MAWB Identification"} columns={2}>
      <div className="col-span-1 space-y-4">
        <InputBox
          label="Airline Prefix"
          value={form.airline_prefix}
          onChange={(e) => onChange("airline_prefix", e.target.value.toUpperCase().slice(0, 3))}
          maxLength={3}
          placeholder="AAA"
          required
        />
        <InputBox
          label="Serial Number"
          type="text"
          value={form.serial_no}
          onChange={(e) => onChange("serial_no", e.target.value.replace(/[^0-9]/g, "").slice(0, 7))}
          maxLength={7}
          placeholder="0000000"
          required
        />
        <InputBox
          label="City Name"
          value={form.city_name}
          onChange={(e) => onChange("city_name", e.target.value)}
          placeholder="Origin City"
        />
      </div>

      <div className="col-span-1 space-y-4">
        <div>
          <label className="text-sm font-semibold text-[var(--color-ink)]">
            MAWB Number
          </label>
          <div className="mt-2 rounded-lg border border-[var(--color-ocean)]/30 bg-[var(--color-ocean)]/5 p-4">
            <p className="text-3xl font-bold font-mono tracking-wider">
              <span className="text-[var(--color-ocean)]">{mawbNumberPrefix} </span>
              <span className="text-red-500">{calculatedCheckDigit}</span>
            </p>
          </div>
        </div>

        {airline && (
          <div className="rounded-lg border border-[var(--color-ocean)]/30 bg-[var(--color-ocean)]/5 p-4">
            <p className="text-xs text-[var(--color-ink)]/70 uppercase tracking-wide">
              Flight Information
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
              {airline.name}
            </p>
            <p className="text-sm text-[var(--color-ink)]/70">
              {form.city_name || "N/A"}, {airline.country || "N/A"}
            </p>
          </div>
        )}

        {airlineLoading && (
          <div className="rounded-lg border border-[var(--color-mist)] bg-[var(--color-canvas)] p-4">
            <p className="text-sm text-[var(--color-ink)]/70">
              Loading airline info...
            </p>
          </div>
        )}
      </div>
    </FormSection>
  );
}
