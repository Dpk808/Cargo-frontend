import InputBox from "@/src/components/ui/InputBox";
import FormSection from "@/src/components/ui/FormSection";
import SelectField from "@/src/components/ui/SelectField";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbRoutingProps {
  form: Pick<MawbFormState, 
    'agent_id' | 'account_no' | 'departure' | 'destination' | 'to' | 'by_first_carrier' | 
    'second_to' | 'second_by' | 'third_to' | 'third_by' | 'flight_date'
  >;
  agentOptions: { label: string; value: string }[];
  agentData?: any;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbRouting({ form, onChange, agentOptions, agentData }: AwbRoutingProps) {
  return (
    <FormSection title="Routing & Agent" columns={2}>
      <div className="col-span-2 space-y-4">
        <div className="space-y-4 p-4 rounded-xl border border-[var(--color-ocean)]/20 bg-[var(--color-ocean)]/5">
          <SelectField
            label="Agent"
            options={agentOptions}
            value={form.agent_id}
            onChange={(e) => onChange("agent_id", e.target.value)}
            placeholder="Select an agent"
            required
          />
          
          {agentData && (
            <div className="flex flex-col gap-1 px-1">
              <p className="text-sm font-medium text-[var(--color-ink)]/80">
                {agentData.alias || agentData.name} / {agentData.city}, {agentData.country}
              </p>
            </div>
          )}

          <InputBox
            label="Account No"
            value={form.account_no}
            onChange={(e) => onChange("account_no", e.target.value)}
            placeholder="Account number"
            required
          />
        </div>

        <InputBox
          label="Departure"
          value={form.departure}
          onChange={(e) => onChange("departure", e.target.value)}
          placeholder="Departure city"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <InputBox
            label="To (Routing)"
            value={form.to}
            onChange={(e) => onChange("to", e.target.value.toUpperCase().slice(0, 3))}
            placeholder="To city"
            maxLength={3}
            required
          />
          <InputBox
            label="By First Carrier"
            value={form.by_first_carrier}
            onChange={(e) => onChange("by_first_carrier", e.target.value.toUpperCase().slice(0, 2))}
            placeholder="Carrier"
            maxLength={2}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputBox
            label="To (via)"
            value={form.second_to}
            onChange={(e) => onChange("second_to", e.target.value.toUpperCase().slice(0, 3))}
            placeholder="To city"
            maxLength={3}
          />
          <InputBox
            label="By (carrier)"
            value={form.second_by}
            onChange={(e) => onChange("second_by", e.target.value.toUpperCase().slice(0, 2))}
            placeholder="Carrier"
            maxLength={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputBox
            label="To (Final)"
            value={form.third_to}
            onChange={(e) => onChange("third_to", e.target.value.toUpperCase().slice(0, 3))}
            placeholder="To city"
            maxLength={3}
          />
          <InputBox
            label="By (Final)"
            value={form.third_by}
            onChange={(e) => onChange("third_by", e.target.value.toUpperCase().slice(0, 2))}
            placeholder="Carrier"
            maxLength={2}
          />
        </div>

        <InputBox
          label="Destination"
          value={form.destination}
          onChange={(e) => onChange("destination", e.target.value)}
          placeholder="Destination city"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <InputBox
            label="Requested Flight Date"
            type="date"
            value={form.flight_date}
            onChange={(e) => onChange("flight_date", e.target.value)}
            required
          />
          <InputBox
            label="Requested Flight Date"
            type="date"
            value={form.flight_date}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>
    </FormSection>
  );
}
