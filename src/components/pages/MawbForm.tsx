import type { FormEvent } from "react";
import { useMemo, useEffect } from "react";
import AwbForm from "@/src/components/awb/AwbForm";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";
import { useAirlineByPrefix } from "@/src/hooks/useAirlines";
import { useShipperDetails } from "@/src/hooks/useShipperDetails";
import { useConsigneeDetails } from "@/src/hooks/useConsigneeDetails";
import { useCurrencies } from "@/src/hooks/useCurrencies";
import { useAgentDetails } from "@/src/hooks/useAgentDetails";
import Button from "@/src/components/ui/Button";
import Table from "@/src/components/ui/Table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMPTY_MAWB_FORM } from "@/src/utils/mawb-form.utils";
import type { TableColumn } from "@/src/types/api";
import type { Hawb } from "@/src/types/entities";

interface SelectOption {
  label: string;
  value: string;
}

interface MawbFormProps {
  form: MawbFormState;
  shipperOptions: SelectOption[];
  consigneeOptions: SelectOption[];
  agentOptions: SelectOption[];
  onChange: (key: keyof MawbFormState, value: any) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  isHawb?: boolean;
  mawbId?: number;
}

// --- Sub-components for cleaner structure ---

const HawbSectionHeader = () => (
  <div className="space-y-12">
    <div className="relative py-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-2 border-[var(--color-mist)]"></div>
      </div>
      <div className="relative flex justify-center">
        <div className="bg-[var(--color-canvas)] px-6 py-2 rounded-full border-2 border-[var(--color-mist)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            🏠 Home Bills (HAWB)
          </h3>
        </div>
      </div>
    </div>
    <div className="text-center -mt-8 mb-8">
      <p className="text-sm text-[var(--color-ink)]/60">Fill in multiple house airway bills for this master bill</p>
    </div>
  </div>
);

interface HawbFormItemProps {
  index: number;
  hawb: MawbFormState;
  shipperOptions: SelectOption[];
  consigneeOptions: SelectOption[];
  agentOptions: SelectOption[];
  onUpdate: (key: keyof MawbFormState, val: any) => void;
  onDelete: () => void;
}

const HawbFormItem = ({ index, hawb, shipperOptions, consigneeOptions, agentOptions, onUpdate, onDelete }: HawbFormItemProps) => (
  <div className="pt-12 border-t-2 border-dashed border-[var(--color-mist)] first:border-t-0 first:pt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-8 flex items-center justify-between">
      <h4 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
        ✨ Homebill #{index + 1}
      </h4>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-500 hover:bg-red-50"
      >
        ✕ Remove Homebill
      </Button>
    </div>
    <MawbForm
      form={hawb}
      shipperOptions={shipperOptions}
      consigneeOptions={consigneeOptions}
      agentOptions={agentOptions}
      onChange={onUpdate}
      onSubmit={() => { }}
      onCancel={onDelete}
      submitLabel=""
      isHawb={true}
    />
  </div>
);

const AddHawbButton = ({ onClick }: { onClick: () => void }) => (
  <div className="pt-8">
    <Button
      type="button"
      variant="secondary"
      onClick={onClick}
      className="w-full py-8 border-2 border-dashed border-[var(--color-mist)] hover:border-[var(--color-ocean)] hover:bg-[var(--color-ocean)]/5 transition-all group rounded-2xl"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-ocean)]">
          ➕ Add Homebill
        </span>
        <span className="text-xs text-[var(--color-ink)]/40 uppercase tracking-widest">
          Combine another house bill into this master bill
        </span>
      </div>
    </Button>
  </div>
);

const FormActions = ({ onCancel, onSubmit, isSubmitting }: { onCancel: () => void, onSubmit: (e: any) => void, isSubmitting?: boolean }) => (
  <div className="flex justify-end gap-3 pt-12 border-t-2 border-[var(--color-mist)] mt-16">
    <Button type="button" variant="ghost" onClick={onCancel} size="lg">
      Cancel
    </Button>
    <Button
      type="submit"
      onClick={onSubmit}
      isLoading={isSubmitting}
      size="lg"
      className="px-8"
    >
      Create
    </Button>
  </div>
);

// --- Main MawbForm Component ---

export default function MawbForm({
  form,
  shipperOptions,
  consigneeOptions,
  agentOptions,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false,
  isHawb = false,
  mawbId,
}: MawbFormProps) {
  const router = useRouter();

  const handleAddHawb = () => {
    const newHawb = {
      ...EMPTY_MAWB_FORM,
      airline_prefix: form.airline_prefix,
      city_name: form.city_name,
      agent_id: form.agent_id,
      account_no: form.account_no,
      departure: form.departure,
      destination: form.destination,
    };
    onChange("hawbs", [...form.hawbs, newHawb]);
  };

  const handleUpdateHawb = (index: number, key: keyof MawbFormState, value: any) => {
    const newHawbs = [...form.hawbs];
    newHawbs[index] = { ...newHawbs[index], [key]: value };
    onChange("hawbs", newHawbs);
  };

  const handleDeleteHawb = (index: number) => {
    const newHawbs = form.hawbs.filter((_, i) => i !== index);
    onChange("hawbs", newHawbs);
  };

  // Calculate check digit from serial number
  const calculatedCheckDigit = useMemo(() => {
    const serialNum = parseInt(form.serial_no, 10);
    if (isNaN(serialNum)) return "";
    return String(serialNum % 7);
  }, [form.serial_no]);

  // Auto-update check digit when serial number changes
  useEffect(() => {
    if (calculatedCheckDigit && calculatedCheckDigit !== form.check_digit) {
      onChange("check_digit", calculatedCheckDigit);
    }
  }, [calculatedCheckDigit, form.check_digit, onChange]);

  // Fetch airline data
  const { data: airline, isLoading: airlineLoading } = useAirlineByPrefix(
    form.airline_prefix || null
  );



  // Sync dimensions array with no_of_pieces
  useEffect(() => {
    const targetPieces = parseInt(form.no_of_pieces, 10) || 0;
    if (targetPieces <= 0) {
      if (form.dimensions.length !== 0) onChange("dimensions", []);
      return;
    }

    let currentSum = form.dimensions.reduce((sum, d) => sum + (parseInt(d.pieces, 10) || 1), 0);

    if (currentSum === targetPieces) return;

    let newDims = [...form.dimensions];

    if (currentSum < targetPieces) {
      const toAdd = targetPieces - currentSum;
      for (let i = 0; i < toAdd; i++) {
        newDims.push({ length: "", width: "", height: "", pieces: "1" });
      }
    } else if (currentSum > targetPieces) {
      let excess = currentSum - targetPieces;
      while (excess > 0 && newDims.length > 0) {
        const lastIdx = newDims.length - 1;
        const lastPieces = parseInt(newDims[lastIdx].pieces, 10) || 1;
        if (lastPieces > excess) {
          newDims[lastIdx] = { ...newDims[lastIdx], pieces: String(lastPieces - excess) };
          excess = 0;
        } else {
          excess -= lastPieces;
          newDims.pop();
        }
      }
    }
    onChange("dimensions", newDims);
  }, [form.no_of_pieces, form.dimensions, onChange]);

  // Auto-calculate total weight charge and sync with weight_charge
  useEffect(() => {
    const rate = parseFloat(form.rate);
    const chargeable = parseFloat(form.chargable_weight);
    const gross = parseFloat(form.gross_weight);
    if (isNaN(rate)) return;
    const weightToUse = !isNaN(chargeable) && chargeable > 0 ? chargeable : gross;
    if (isNaN(weightToUse)) return;
    const calculated = (weightToUse * rate).toFixed(2);

    if (calculated !== form.total) {
      onChange("total", calculated);
    }

    if (calculated !== form.weight_charge) {
      onChange("weight_charge", calculated);
    }
  }, [form.rate, form.chargable_weight, form.gross_weight, form.total, onChange]);

  // Auto-calculate total other charges due agent and carrier
  useEffect(() => {
    const agentTotal = form.other_charges
      .filter(c => c.type === "AGENT")
      .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
      .toFixed(2);

    const carrierTotal = form.other_charges
      .filter(c => c.type === "CARRIER")
      .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
      .toFixed(2);

    if (agentTotal !== form.other_charges_due_agent) {
      onChange("other_charges_due_agent", agentTotal);
    }
    if (carrierTotal !== form.other_charges_due_carrier) {
      onChange("other_charges_due_carrier", carrierTotal);
    }
  }, [form.other_charges, form.other_charges_due_agent, form.other_charges_due_carrier, onChange]);

  // Auto-calculate grand total charges
  useEffect(() => {
    const weight = parseFloat(form.weight_charge) || 0;
    const valuation = parseFloat(form.valuation_charge) || 0;
    const tax = parseFloat(form.tax) || 0;
    const agent = parseFloat(form.other_charges_due_agent) || 0;
    const carrier = parseFloat(form.other_charges_due_carrier) || 0;

    const grandTotal = (weight + valuation + tax + agent + carrier).toFixed(2);

    if (grandTotal !== form.total_charges) {
      onChange("total_charges", grandTotal);
    }
  }, [form.weight_charge, form.valuation_charge, form.tax, form.other_charges_due_agent, form.other_charges_due_carrier, form.total_charges, onChange]);

  // Fetch currencies
  const { data: currenciesData } = useCurrencies();
  const currencyOptions =
    currenciesData?.map((c) => ({
      label: c.codeNumeric ? `${c.code} - ${c.currency}` : `${c.code} - ${c.currency}`,
      value: c.code,
    })) || [];

  // Fetch shipper and consignee details
  const shipperId = form.shipper_id ? Number(form.shipper_id) : null;
  const consigneeId = form.consignee_id ? Number(form.consignee_id) : null;
  const agentId = form.agent_id ? Number(form.agent_id) : null;
  const { data: shipperData } = useShipperDetails(shipperId);
  const { data: consigneeData } = useConsigneeDetails(consigneeId);
  const { data: agentData } = useAgentDetails(agentId);

  // Format MAWB number
  const mawbNumberPrefix =
    form.airline_prefix && form.serial_no
      ? `${form.airline_prefix}-${form.serial_no.slice(0, 4)} ${form.serial_no.slice(4)}`
      : "--- -";

  return (
    <div className="space-y-12">
      <AwbForm
        form={form}
        shipperOptions={shipperOptions}
        consigneeOptions={consigneeOptions}
        agentOptions={agentOptions}
        currencyOptions={currencyOptions}
        shipperData={shipperData}
        consigneeData={consigneeData}
        agentData={agentData}
        airline={airline}
        airlineLoading={airlineLoading}
        calculatedCheckDigit={calculatedCheckDigit}
        mawbNumberPrefix={mawbNumberPrefix}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
        isHawb={isHawb}
        hideButtons={true}
      />

      {!isHawb && (
        <div className="space-y-12">
          <HawbSectionHeader />

          <div className="space-y-16">
            {form.hawbs.map((hawb, index) => (
              <HawbFormItem
                key={index}
                index={index}
                hawb={hawb as unknown as MawbFormState}
                shipperOptions={shipperOptions}
                consigneeOptions={consigneeOptions}
                agentOptions={agentOptions}
                onUpdate={(key, val) => handleUpdateHawb(index, key, val)}
                onDelete={() => handleDeleteHawb(index)}
              />
            ))}
          </div>

          <AddHawbButton onClick={handleAddHawb} />

          <FormActions
            onCancel={onCancel}
            onSubmit={onSubmit as any}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
