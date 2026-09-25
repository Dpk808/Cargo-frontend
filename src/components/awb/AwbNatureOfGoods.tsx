import { useState } from "react";
import Button from "@/src/components/ui/Button";
import FormSection from "@/src/components/ui/FormSection";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbNatureOfGoodsProps {
  form: Pick<MawbFormState, 'nature_of_goods'>;
  onChange: (key: keyof MawbFormState, value: any) => void;
}

export default function AwbNatureOfGoods({ form, onChange }: AwbNatureOfGoodsProps) {
  const [newNature, setNewNature] = useState({ title: "", detail: "" });

  const addNatureOfGoods = () => {
    if (newNature.title || newNature.detail) {
      onChange("nature_of_goods", [...(form.nature_of_goods || []), newNature]);
      setNewNature({ title: "", detail: "" });
    }
  };

  const removeNatureOfGoods = (index: number) => {
    const newGoods = [...(form.nature_of_goods || [])];
    newGoods.splice(index, 1);
    onChange("nature_of_goods", newGoods);
  };

  return (
    <FormSection title="Nature of Goods" columns={1}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-mist)] bg-[var(--color-canvas)]">
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Title</th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide">Detail</th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-[var(--color-ink)]/60 uppercase tracking-wide w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {(form.nature_of_goods || []).map((item, index) => (
              <tr key={index} className="border-b border-[var(--color-mist)] hover:bg-[var(--color-canvas)]/60 transition-colors">
                <td className="py-2 px-3 text-sm text-[var(--color-ink)] break-words min-w-[100px]">
                  {item.title}
                </td>
                <td className="py-2 px-3 text-sm text-[var(--color-ink)] break-words">
                  {item.detail}
                </td>
                <td className="py-1.5 px-2 text-center">
                  <button type="button" onClick={() => removeNatureOfGoods(index)} className="text-red-500 hover:text-red-600 font-bold px-2 py-1">
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
                  value={newNature.title}
                  onChange={(e) => setNewNature({ ...newNature, title: e.target.value })}
                  placeholder="New Title"
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                />
              </td>
              <td className="py-2 px-2">
                <input
                  type="text"
                  value={newNature.detail}
                  onChange={(e) => setNewNature({ ...newNature, detail: e.target.value })}
                  placeholder="New Detail"
                  className="w-full h-9 rounded border border-[var(--color-mist)] bg-white px-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ocean)] focus:ring-1 focus:ring-[var(--color-ocean)]/20"
                />
              </td>
              <td className="py-2 px-2 text-center">
                <Button type="button" variant="secondary" onClick={addNatureOfGoods} className="h-9 px-3 text-xs w-full whitespace-nowrap">
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
