import SelectField from "@/src/components/ui/SelectField";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface SelectOption {
  label: string;
  value: string;
}

interface AwbPartiesProps {
  form: Pick<MawbFormState, 'shipper_id' | 'consignee_id'>;
  shipperOptions: SelectOption[];
  consigneeOptions: SelectOption[];
  shipperData?: any;
  consigneeData?: any;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

const InfoBox = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between border-b border-[var(--color-mist)] py-2">
    <span className="text-xs text-[var(--color-ink)]/70">{label}</span>
    <span className="text-sm font-medium text-[var(--color-ink)]">
      {value || "-"}
    </span>
  </div>
);

export default function AwbParties({
  form,
  shipperOptions,
  consigneeOptions,
  shipperData,
  consigneeData,
  onChange,
}: AwbPartiesProps) {
  return (
    <FormSection title="Parties" columns={2}>
      <div className="col-span-1">
        <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
          Shipper
        </label>
        <SelectField
          label=""
          value={form.shipper_id}
          onChange={(e) => onChange("shipper_id", e.target.value)}
          options={shipperOptions}
          placeholder="Select shipper"
          required
        />
        {shipperData && (
          <div className="mt-3 rounded-lg border border-[var(--color-mist)] p-4 bg-white">
            <p className="text-xs font-semibold text-[var(--color-ink)] uppercase mb-3">
              Shipper Details
            </p>
            <InfoBox label="Name" value={shipperData.name} />
            <InfoBox label="Email" value={shipperData.email} />
            <InfoBox label="Phone" value={shipperData.phoneNumber} />
            <InfoBox label="City" value={shipperData.city} />
            <div className="border-b border-[var(--color-mist)] py-2">
              <span className="text-xs text-[var(--color-ink)]/70">
                Address
              </span>
              <p className="text-sm text-[var(--color-ink)] mt-1">
                {shipperData.address}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
          Consignee
        </label>
        <SelectField
          label=""
          value={form.consignee_id}
          onChange={(e) => onChange("consignee_id", e.target.value)}
          options={consigneeOptions}
          placeholder="Select consignee"
          required
        />
        {consigneeData && (
          <div className="mt-3 rounded-lg border border-[var(--color-mist)] p-4 bg-white">
            <p className="text-xs font-semibold text-[var(--color-ink)] uppercase mb-3">
              Consignee Details
            </p>
            <InfoBox label="Name" value={consigneeData.name} />
            <InfoBox label="Email" value={consigneeData.email} />
            <InfoBox label="Phone" value={consigneeData.phoneNumber} />
            <InfoBox label="City" value={consigneeData.city} />
            <div className="border-b border-[var(--color-mist)] py-2">
              <span className="text-xs text-[var(--color-ink)]/70">
                Address
              </span>
              <p className="text-sm text-[var(--color-ink)] mt-1">
                {consigneeData.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}
