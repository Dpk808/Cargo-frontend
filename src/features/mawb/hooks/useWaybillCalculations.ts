'use client';

import { useEffect, useRef } from 'react';
import { useFormContext, useWatch, type UseFormReturn } from 'react-hook-form';

export function useWaybillCalculations(formMethods?: UseFormReturn<any>) {
  const context = useFormContext();
  const form = (formMethods || context) as UseFormReturn<any> | undefined;
  if (!form) return;

  const control = form.control;
  const setValue = form.setValue as (name: string, value: any, options?: any) => void;
  const getValues = form.getValues as (name?: string) => any;

  // Watch cargo fields for weight charges
  const rate = useWatch({ control, name: 'rate' });
  const chargableWeight = useWatch({ control, name: 'chargable_weight' });
  const grossWeight = useWatch({ control, name: 'gross_weight' });
  const noOfPieces = useWatch({ control, name: 'no_of_pieces' });
  const dimensions = useWatch({ control, name: 'dimensions' });

  // Watch other charges
  const otherCharges = useWatch({ control, name: 'otherCharge' });

  // Watch billing components for grand total
  const weightCharge = useWatch({ control, name: 'billing.weight_charge' });
  const valuationCharge = useWatch({ control, name: 'billing.valuation_charge' });
  const tax = useWatch({ control, name: 'billing.tax' });
  const totalAgent = useWatch({ control, name: 'billing.total_charge_agent' });
  const totalCarrier = useWatch({ control, name: 'billing.total_charge_carrier' });

  // 1. Auto-sync package dimensions count with no_of_pieces
  const isSyncingPieces = useRef(false);
  useEffect(() => {
    if (isSyncingPieces.current) return;
    const targetPieces = parseInt(noOfPieces, 10);
    if (isNaN(targetPieces) || targetPieces <= 0) return;

    const currentDims = (getValues('dimensions') as any[]) || [];
    const currentSum = currentDims.reduce(
      (sum, d) => sum + (parseInt(d?.piece, 10) || 1),
      0,
    );

    if (currentSum === targetPieces) return;

    isSyncingPieces.current = true;
    try {
      const newDims = [...currentDims];
      if (currentSum < targetPieces) {
        const toAdd = targetPieces - currentSum;
        for (let i = 0; i < toAdd; i++) {
          newDims.push({ length: '', width: '', height: '', piece: 1 });
        }
        setValue('dimensions', newDims);
      } else if (currentSum > targetPieces) {
        let excess = currentSum - targetPieces;
        while (excess > 0 && newDims.length > 0) {
          const lastIdx = newDims.length - 1;
          const lastPieces = parseInt(newDims[lastIdx]?.piece, 10) || 1;
          if (lastPieces > excess) {
            newDims[lastIdx] = {
              ...newDims[lastIdx],
              piece: lastPieces - excess,
            };
            excess = 0;
          } else {
            excess -= lastPieces;
            newDims.pop();
          }
        }
        setValue('dimensions', newDims);
      }
    } finally {
      isSyncingPieces.current = false;
    }
  }, [noOfPieces, dimensions, setValue, getValues]);

  // 2. Auto-calculate Weight Charge: weight * rate
  useEffect(() => {
    const r = parseFloat(rate);
    const cw = parseFloat(chargableWeight);
    const gw = parseFloat(grossWeight);

    if (isNaN(r)) return;
    const weightToUse = !isNaN(cw) && cw > 0 ? cw : gw;
    if (isNaN(weightToUse)) return;

    const calculated = (weightToUse * r).toFixed(2);
    if (getValues('total') !== calculated) {
      setValue('total', calculated, { shouldDirty: true });
    }
    if (getValues('billing.weight_charge') !== calculated) {
      setValue('billing.weight_charge', calculated, { shouldDirty: true });
    }
  }, [rate, chargableWeight, grossWeight, setValue, getValues]);

  // 3. Auto-aggregate Other Charges (Agent vs Carrier)
  useEffect(() => {
    if (!Array.isArray(otherCharges)) return;

    const agentSum = otherCharges
      .filter((c: any) => c?.type === 'AGENT')
      .reduce((sum: number, c: any) => sum + (parseFloat(c?.amount) || 0), 0)
      .toFixed(2);

    const carrierSum = otherCharges
      .filter((c: any) => c?.type === 'CARRIER')
      .reduce((sum: number, c: any) => sum + (parseFloat(c?.amount) || 0), 0)
      .toFixed(2);

    if (getValues('billing.total_charge_agent') !== agentSum) {
      setValue('billing.total_charge_agent', agentSum, { shouldDirty: true });
    }
    if (getValues('billing.total_charge_carrier') !== carrierSum) {
      setValue('billing.total_charge_carrier', carrierSum, { shouldDirty: true });
    }
  }, [otherCharges, setValue, getValues]);

  // 4. Auto-calculate Grand Total: weight + valuation + tax + agent + carrier
  useEffect(() => {
    const w = parseFloat(weightCharge) || 0;
    const v = parseFloat(valuationCharge) || 0;
    const t = parseFloat(tax) || 0;
    const a = parseFloat(totalAgent) || 0;
    const c = parseFloat(totalCarrier) || 0;

    const grandTotal = (w + v + t + a + c).toFixed(2);
    if (getValues('billing.total') !== grandTotal) {
      setValue('billing.total', grandTotal, { shouldDirty: true });
    }
  }, [weightCharge, valuationCharge, tax, totalAgent, totalCarrier, setValue, getValues]);
}
