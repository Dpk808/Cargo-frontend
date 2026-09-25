import Select from "react-select";
import FormSection from "@/src/components/ui/FormSection";
import InputBox from "@/src/components/ui/InputBox";
import type { MawbFormState } from "@/src/utils/mawb-form.utils";

interface AwbPaymentModeProps {
  form: Pick<MawbFormState,
    'is_prepaid' | 'is_collect' | 'currency' | 'chgs_code' |
    'wt_val_ppd' | 'wt_val_coll' | 'other_ppd' | 'other_coll' |
    'reference_number' | 'optional_shipping_info'
  >;
  currencyOptions: any[];
  onChange: (key: keyof MawbFormState, value: any) => void;
  isHawb?: boolean;
}

export default function AwbPaymentMode({ form, currencyOptions, onChange, isHawb }: AwbPaymentModeProps) {
  const chgsCode = form.is_prepaid ? "PP" : form.is_collect ? "CC" : "-";

  return (
    <div className="space-y-6">
      {/* Payment Mode */}
      <FormSection title="Payment Mode" columns={1}>
        <div className="space-y-3">
          <label
            className="flex items-center gap-3 p-3 border-2 border-transparent rounded-lg cursor-pointer hover:bg-[var(--color-canvas)] transition-colors"
            style={{
              borderColor: form.is_prepaid ? "var(--color-ocean)" : "transparent",
            }}
          >
            <input
              type="radio"
              name="payment_mode"
              value="prepaid"
              checked={form.is_prepaid}
              onChange={() => {
                onChange("is_prepaid", true);
                onChange("is_collect", false);
                onChange("wt_val_ppd", true);
                onChange("other_ppd", true);
                onChange("wt_val_coll", false);
                onChange("other_coll", false);
                onChange("chgs_code", "PP");
              }}
              className="w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">Prepaid</p>
              <p className="text-xs text-[var(--color-ink)]/70">Charges paid by shipper</p>
            </div>
          </label>

          <label
            className="flex items-center gap-3 p-3 border-2 border-transparent rounded-lg cursor-pointer hover:bg-[var(--color-canvas)] transition-colors"
            style={{
              borderColor: form.is_collect ? "var(--color-ocean)" : "transparent",
            }}
          >
            <input
              type="radio"
              name="payment_mode"
              value="collect"
              checked={form.is_collect}
              onChange={() => {
                onChange("is_collect", true);
                onChange("is_prepaid", false);
                onChange("wt_val_coll", true);
                onChange("other_coll", true);
                onChange("wt_val_ppd", false);
                onChange("other_ppd", false);
                onChange("chgs_code", "CC");
              }}
              className="w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-[var(--color-ink)]">Collect</p>
              <p className="text-xs text-[var(--color-ink)]/70">Charges paid by consignee</p>
            </div>
          </label>
        </div>
      </FormSection>

      {/* Charge Codes Section */}
      <div className="space-y-2">
        <FormSection title="Charge Codes" columns={1}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="w-48 min-w-[10rem] flex-shrink">
                <label className="text-sm font-semibold text-[var(--color-ink)] mb-2 block">Currency</label>
                <Select
                  value={currencyOptions.find((c) => c.value === form.currency) || null}
                  onChange={(option) => onChange("currency", option?.value || "NPR")}
                  options={currencyOptions}
                  className="react-select-container text-sm"
                  classNamePrefix="react-select"
                  placeholder="Search..."
                />
              </div>

              <div className="flex-1 min-w-0 rounded-xl border border-[var(--color-mist)] bg-white px-2 py-3 overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-medium text-[var(--color-ink)]/50 uppercase tracking-wide">
                      CHGS Code
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded border tracking-widest"
                      style={{
                        borderColor: chgsCode !== "-" ? "var(--color-ocean)" : "var(--color-mist)",
                        color: chgsCode !== "-" ? "var(--color-ocean)" : "var(--color-ink)",
                        backgroundColor: chgsCode !== "-" ? "var(--color-ocean)/8" : "var(--color-canvas)",
                      }}
                    >
                      {chgsCode}
                    </span>
                  </div>

                  <div className="w-px h-8 bg-[var(--color-mist)]" />

                  {[
                    { field: "wt_val_ppd", label: "WT Val PPD" },
                    { field: "wt_val_coll", label: "WT Val COLL" },
                    { field: "other_ppd", label: "Other PPD" },
                    { field: "other_coll", label: "Other COLL" },
                  ].map(({ field, label }, i, arr) => {
                    const active = Boolean((form as any)[field]);
                    return (
                      <div key={field} className="flex items-center gap-2 min-w-0">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-medium text-[var(--color-ink)]/50 uppercase tracking-wide">
                            {label}
                          </span>
                          <div
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: active ? "var(--color-ocean)" : "var(--color-mist)",
                            }}
                          >
                            {active && (
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: "var(--color-ocean)" }}
                              />
                            )}
                          </div>
                        </div>
                        {i < arr.length - 1 && <div className="w-px h-8 bg-[var(--color-mist)]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputBox
                label="Reference Number"
                value={form.reference_number}
                onChange={(e) => onChange("reference_number", e.target.value)}
                placeholder="Optional Ref No"
                disabled={isHawb}
              />
              <InputBox
                label="Optional Shipping Information"
                value={form.optional_shipping_info}
                onChange={(e) => onChange("optional_shipping_info", e.target.value)}
                placeholder="Optional Info"
                disabled={isHawb}
              />
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );
}
