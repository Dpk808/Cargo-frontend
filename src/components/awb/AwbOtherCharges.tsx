import { useState } from "react";
import Button from "@/src/components/ui/Button";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbOtherChargesProps {
  form: Pick<MawbFormState, 'other_charges'>;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbOtherCharges({ form, onChange }: AwbOtherChargesProps) {
  const [newCharge, setNewCharge] = useState({ name: "", amount: "", type: "AGENT" });

  const addOtherCharge = () => {
    if (newCharge.name || newCharge.amount) {
      onChange("other_charges", [...form.other_charges, newCharge]);
      setNewCharge({ name: "", amount: "", type: "AGENT" });
    }
  };

  const removeOtherCharge = (index: number) => {
    const newCharges = [...form.other_charges];
    newCharges.splice(index, 1);
    onChange("other_charges", newCharges);
  };

  return (
    <FormSection title="Other Charges" columns={1}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-mist)] bg-[var(--color-canvas)]">
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Charge Name</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Amount</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-32">Type</th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {form.other_charges.map((charge, index) => (
              <tr key={index} className="border-b border-[var(--color-mist)] hover:bg-[var(--color-canvas)]/60 transition-colors">
                <td className="py-2 px-3 text-sm text-[var(--color-ink)] break-words">
                  {charge.name}
                </td>
                <td className="py-2 px-3 text-sm text-[var(--color-ink)]">
                  {charge.amount}
                </td>
                <td className="py-2 px-3 text-sm text-[var(--color-ink)]">
                  {charge.type === "AGENT" ? "Agent" : "Carrier"}
                </td>
                <td className="py-1.5 px-2 text-center">
                  <button type="button" onClick={() => removeOtherCharge(index)} className="text-red-500 hover:text-red-600 font-bold px-2 py-1">
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--color-canvas)]/30">
              <td className="py-2 px-2">
                <input
                  type="text"
                  value={newCharge.name}
                  onChange={(e) => setNewCharge({ ...newCharge, name: e.target.value })}
                  placeholder="Charge Name"
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                />
              </td>
              <td className="py-2 px-2">
                <input
                  type="number"
                  value={newCharge.amount}
                  onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
                  placeholder="Amount"
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                />
              </td>
              <td className="py-2 px-2">
                <select
                  value={newCharge.type}
                  onChange={(e) => setNewCharge({ ...newCharge, type: e.target.value })}
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                >
                  <option value="AGENT">Agent</option>
                  <option value="CARRIER">Carrier</option>
                </select>
              </td>
              <td className="py-2 px-2 text-center">
                <Button type="button" variant="secondary" onClick={addOtherCharge} className="h-9 px-3 text-xs w-full whitespace-nowrap">
                  + Add
                </Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </FormSection>
  );
}
