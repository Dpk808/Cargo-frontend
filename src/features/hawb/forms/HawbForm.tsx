'use client';

import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Form } from '@/src/components/forms/Form';
import Button from '@/src/components/ui/Button';
import { getDirtyValues } from '@/src/utils/getDirtyValues';

import { hawbSchema, hawbDefaults, type HawbSchema } from '../schemas/hawb.schemas';
import { useHawbById, useCreateHawb, useUpdateHawb } from '../hooks/useHawb';
import { useMawbById } from '@/src/features/mawb/hooks/useMawb';

import { WaybillParties } from '@/src/features/mawb/components/sections/WaybillParties';
import { WaybillRouting } from '@/src/features/mawb/components/sections/WaybillRouting';
import { WaybillCargoDetails } from '@/src/features/mawb/components/sections/WaybillCargoDetails';
import { WaybillAccounting } from '@/src/features/mawb/components/sections/WaybillAccounting';
import { WaybillDimensions } from '@/src/features/mawb/components/sections/WaybillDimensions';
import { WaybillOtherCharges } from '@/src/features/mawb/components/sections/WaybillOtherCharges';
import { WaybillBilling } from '@/src/features/mawb/components/sections/WaybillBilling';
import { useWaybillCalculations } from '@/src/features/mawb/hooks/useWaybillCalculations';

interface HawbFormProps {
  hawbId?: number;
  mawbId?: number;
  onSuccess?: () => void;
  onAddAnother?: () => void;
  showActions?: boolean;
}

export interface HawbFormHandle {
  submit: () => Promise<boolean>;
}

const HawbForm = forwardRef<HawbFormHandle, HawbFormProps>(function HawbForm(
  { hawbId, mawbId, onSuccess, onAddAnother, showActions = true },
  ref,
) {
  const router = useRouter();
  const createMutation = useCreateHawb();
  const updateMutation = useUpdateHawb();

  const { data: hawb, isLoading: isHawbLoading } = useHawbById(hawbId);
  const { data: parentMawb } = useMawbById(mawbId);

  const form = useForm<z.input<typeof hawbSchema>, any, HawbSchema>({
    resolver: zodResolver(hawbSchema),
    defaultValues: {
      ...hawbDefaults,
      mawb_id: mawbId ? String(mawbId) : null,
    },
  });

  // Reactive calculations for weight charge, dimensions pieces, other charges, and totals
  useWaybillCalculations(form);

  // Pre-fill routing and agent from parent MAWB when adding a new homebill
  useEffect(() => {
    if (parentMawb && !hawbId) {
      form.setValue('mawb_id', String(parentMawb.id));
      if (parentMawb.airport?.departure) {
        form.setValue('airport.departure', parentMawb.airport.departure);
      }
      if (parentMawb.airport?.destination) {
        form.setValue('airport.destination', parentMawb.airport.destination);
      }
      if (parentMawb.agent?.id) {
        form.setValue('agent_id', String(parentMawb.agent.id));
      }
    }
  }, [parentMawb, hawbId, form]);

  // Populate form with existing data when editing
  useEffect(() => {
    if (hawb) {
      form.reset({
        mawb_id: mawbId ? String(mawbId) : null,
        information: hawb.information ?? null,
        note: hawb.note ?? null,
        no_of_pieces: String(hawb.no_of_pieces),
        gross_weight: String(hawb.gross_weight),
        unit: hawb.unit ?? 'KG',
        rate_class: hawb.rate_class ?? null,
        commodity_item_no: hawb.commodity_item_no ?? null,
        chargable_weight: String(hawb.chargable_weight),
        rate: hawb.rate ? String(hawb.rate) : null,
        total: hawb.total ? String(hawb.total) : null,
        dimension_unit: hawb.dimension_unit ?? 'CM',
        account_no: hawb.account_no ?? null,
        shipper_id: hawb.shipper?.id ? String(hawb.shipper.id) : null,
        consignee_id: hawb.consignee?.id ? String(hawb.consignee.id) : null,
        agent_id: hawb.agent?.id ? String(hawb.agent.id) : null,
        airport: {
          departure: hawb.airport?.departure ?? '',
          destination: hawb.airport?.destination ?? '',
          to: hawb.airport?.to ?? null,
          by_first_carrier: hawb.airport?.by_first_carrier ?? null,
          second_to: hawb.airport?.second_to ?? null,
          second_by: hawb.airport?.second_by ?? null,
          third_to: hawb.airport?.third_to ?? null,
          third_by: hawb.airport?.third_by ?? null,
          flight_date: hawb.airport?.flight_date ?? null,
        },
        accounting: {
          is_prepaid: hawb.accounting?.is_prepaid ?? true,
          is_collect: hawb.accounting?.is_collect ?? false,
          chgs_code: hawb.accounting?.chgs_code ?? 'PP',
          wt_val_ppd: hawb.accounting?.wt_val_ppd ?? true,
          wt_val_coll: hawb.accounting?.wt_val_coll ?? false,
          other_ppd: hawb.accounting?.other_ppd ?? true,
          other_coll: hawb.accounting?.other_coll ?? false,
          declared_value_carriage: hawb.accounting?.declared_value_carriage ? String(hawb.accounting.declared_value_carriage) : null,
          declared_value_customs: hawb.accounting?.declared_value_customs ? String(hawb.accounting.declared_value_customs) : null,
          insurance_amt: hawb.accounting?.insurance_amt ? String(hawb.accounting.insurance_amt) : null,
        },
        billing: {
          weight_charge: hawb.billing?.weight_charge ? String(hawb.billing.weight_charge) : null,
          valuation_charge: hawb.billing?.valuation_charge ? String(hawb.billing.valuation_charge) : null,
          tax: hawb.billing?.tax ? String(hawb.billing.tax) : null,
          total_charge_agent: hawb.billing?.total_charge_agent ? String(hawb.billing.total_charge_agent) : null,
          total_charge_carrier: hawb.billing?.total_charge_carrier ? String(hawb.billing.total_charge_carrier) : null,
          total: hawb.billing?.total ? String(hawb.billing.total) : null,
          executed_date: hawb.billing?.executed_date ?? null,
          place: hawb.billing?.place ?? null,
        },
        dimensions: hawb.dimensions?.map((d) => ({
          length: String(d.length),
          width: String(d.width),
          height: String(d.height),
          piece: 1,
        })) ?? [],
        otherCharge: hawb.otherCharge?.map((c) => ({
          name: c.name,
          amount: String(c.amount),
          type: c.type,
        })) ?? [],
        natureOfGoods: hawb.natureOfGoods?.map((g) => ({
          title: g.title,
          detail: g.detail ?? null,
        })) ?? [],
      });
    }
  }, [hawb, mawbId, form]);

  const onSubmit = async (values: HawbSchema): Promise<boolean> => {
    try {
      if (hawbId) {
        const dirtyValues = getDirtyValues(values, form.formState.dirtyFields);
        await updateMutation.mutateAsync({ id: hawbId, payload: dirtyValues as any });
      } else {
        await createMutation.mutateAsync(values as any);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/mawb');
      }
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to save HAWB record';
      form.setError('root', { message });
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let submitted = false;
      await form.handleSubmit(async (values) => {
        submitted = await onSubmit(values);
      })();
      return submitted;
    },
  }));

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (hawbId && isHawbLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-mist)] border-t-[var(--color-ocean)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">
            {hawbId ? 'Edit House Air Waybill (HAWB)' : 'Add House Air Waybill (HAWB)'}
          </h1>
          <p className="text-sm text-[var(--color-ink)]/70 mt-1">
            {parentMawb
              ? `Attached to Master Waybill #${parentMawb.airline_prefix}-${parentMawb.serial_no}-${parentMawb.check_digit}`
              : 'Enter individual house airway bill details'}
          </p>
        </div>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        {form.formState.errors.root && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Shared AWB Sections (DRY reuse from mawb/components/sections) */}
        <WaybillParties />
        <WaybillRouting />
        <WaybillCargoDetails />
        <WaybillAccounting />
        <WaybillDimensions />
        <WaybillOtherCharges />
        <WaybillBilling showAgentPrefix={false} />

        {onAddAnother && !hawbId && (
          <Button type="button" className="w-full" onClick={onAddAnother}>
            + Add Another HAWB
          </Button>
        )}

        {showActions && (
          <div className="sticky bottom-4 z-20 flex justify-end gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-[var(--color-mist)] shadow-lg">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {hawbId ? 'Update Homebill' : 'Create Homebill'}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
});

HawbForm.displayName = 'HawbForm';

export default HawbForm;
