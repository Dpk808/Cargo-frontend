import type { FormEvent } from "react";
import Button from "@/src/components/ui/Button";
import AwbIdentification from "./AwbIdentification";
import AwbParties from "./AwbParties";
import AwbRouting from "./AwbRouting";
import AwbPaymentMode from "./AwbPaymentMode";
import AwbAccounting from "./AwbAccounting";
import AwbShipmentDetails from "./AwbShipmentDetails";
import AwbDimensions from "./AwbDimensions";
import AwbNatureOfGoods from "./AwbNatureOfGoods";
import AwbOtherCharges from "./AwbOtherCharges";
import AwbChargeSummary from "./AwbChargeSummary";
import AwbSignature from "./AwbSignature";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface SelectOption {
  label: string;
  value: string;
}

interface AwbFormProps {
  form: MawbFormState;
  shipperOptions: SelectOption[];
  consigneeOptions: SelectOption[];
  agentOptions: SelectOption[];
  currencyOptions: any[];
  shipperData?: any;
  consigneeData?: any;
  agentData?: any;
  airline?: any;
  airlineLoading?: boolean;
  calculatedCheckDigit?: string;
  mawbNumberPrefix?: string;
  onChange: (key: keyof MawbFormState, value: any) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  isHawb?: boolean;
  hideButtons?: boolean;
}

export default function AwbForm({
  form,
  shipperOptions,
  consigneeOptions,
  agentOptions,
  currencyOptions,
  shipperData,
  consigneeData,
  agentData,
  airline,
  airlineLoading,
  calculatedCheckDigit,
  mawbNumberPrefix,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false,
  isHawb = false,
  hideButtons = false,
}: AwbFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <AwbIdentification
        form={form}
        calculatedCheckDigit={calculatedCheckDigit}
        mawbNumberPrefix={mawbNumberPrefix}
        airline={airline}
        airlineLoading={airlineLoading}
        onChange={onChange}
        isHawb={isHawb}
      />

      <AwbParties
        form={form}
        shipperOptions={shipperOptions}
        consigneeOptions={consigneeOptions}
        shipperData={shipperData}
        consigneeData={consigneeData}
        onChange={onChange}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <AwbRouting form={form} onChange={onChange} agentOptions={agentOptions} agentData={agentData} />
        </div>
        <div className="col-span-7 space-y-6">
          <AwbPaymentMode
            form={form}
            currencyOptions={currencyOptions}
            onChange={onChange}
            isHawb={isHawb}
          />
          <AwbAccounting form={form} onChange={onChange} />
        </div>
      </div>

      <AwbShipmentDetails form={form} onChange={onChange} />

      {form.dimensions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <AwbDimensions form={form} onChange={onChange} />
          <AwbNatureOfGoods form={form} onChange={onChange} />
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-7">
          <AwbOtherCharges form={form} onChange={onChange} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <AwbChargeSummary form={form} onChange={onChange} />
        </div>
      </div>

      <AwbSignature form={form} onChange={onChange} />

      {!hideButtons && (
        <div className="flex justify-end gap-3 pt-6 border-t border-[var(--color-mist)] mt-8">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="lg">
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
