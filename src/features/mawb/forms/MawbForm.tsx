'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { Form } from '@/src/components/forms/Form';
import Button from '@/src/components/ui/Button';
import { getDirtyValues } from '@/src/utils/getDirtyValues';

import { mawbSchema, mawbDefaults, type MawbSchema } from '../schemas/mawb.schemas';
import { useMawbById, useCreateMawb, useUpdateMawb } from '../hooks/useMawb';
import { useWaybillCalculations } from '../hooks/useWaybillCalculations';

import { MawbIdentification } from '../components/sections/MawbIdentification';
import { WaybillParties } from '../components/sections/WaybillParties';
import { WaybillRouting } from '../components/sections/WaybillRouting';
import { WaybillAccounting } from '../components/sections/WaybillAccounting';
import { WaybillCargoDetails } from '../components/sections/WaybillCargoDetails';
import { WaybillDimensions } from '../components/sections/WaybillDimensions';
import { WaybillNatureOfGoods } from '../components/sections/WaybillNatureOfGoods';
import { WaybillOtherCharges } from '../components/sections/WaybillOtherCharges';
import { WaybillBilling } from '../components/sections/WaybillBilling';

interface MawbFormProps {
  mawbId?: number;
  initialValues?: Pick<MawbSchema, 'airline_prefix' | 'serial_no'>;
}

/**
 * Renders Dimensions + Nature of Goods conditionally side-by-side,
 * matching the original layout: side-by-side only when dimensions.length > 0.
 */
function DimensionsPanel() {
  const { control } = useFormContext();
  const dimensions = useWatch({ control, name: 'dimensions' });
  const hasDimensions = Array.isArray(dimensions) && dimensions.length > 0;

  if (!hasDimensions) {
    return <WaybillDimensions />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <WaybillDimensions />
      <WaybillNatureOfGoods />
    </div>
  );
}

export default function MawbForm({ mawbId, initialValues }: MawbFormProps) {
  const router = useRouter();
  const createMutation = useCreateMawb();
  const updateMutation = useUpdateMawb();
  const { data: mawb, isLoading: isMawbLoading } = useMawbById(mawbId);

  const form = useForm<MawbSchema>({
    resolver: zodResolver(mawbSchema),
    defaultValues: {
      ...mawbDefaults,
      ...initialValues,
    },
  });

  // Reactive calculations for weight charge, dimensions pieces, other charges, and totals
  useWaybillCalculations(form);

  // Populate form with existing data when editing
  useEffect(() => {
    if (mawb) {
      form.reset({
        airline_prefix: mawb.airline_prefix,
        serial_no: mawb.serial_no,
        check_digit: mawb.check_digit,
        city_name: mawb.city_name ?? null,
        information: mawb.information ?? null,
        note: mawb.note ?? null,
        no_of_pieces: String(mawb.no_of_pieces),
        gross_weight: String(mawb.gross_weight),
        unit: mawb.unit ?? 'KG',
        rate_class: mawb.rate_class ?? null,
        commodity_item_no: mawb.commodity_item_no ?? null,
        chargable_weight: String(mawb.chargable_weight),
        rate: mawb.rate ? String(mawb.rate) : null,
        total: mawb.total ? String(mawb.total) : null,
        dimension_unit: mawb.dimension_unit ?? 'CM',
        account_no: mawb.account_no ?? null,
        shipper_id: mawb.shipper?.id ? String(mawb.shipper.id) : null,
        consignee_id: mawb.consignee?.id ? String(mawb.consignee.id) : null,
        agent_id: mawb.agent?.id ? String(mawb.agent.id) : null,
        airport: {
          departure: mawb.airport?.departure ?? '',
          destination: mawb.airport?.destination ?? '',
          to: mawb.airport?.to ?? null,
          by_first_carrier: mawb.airport?.by_first_carrier ?? null,
          second_to: mawb.airport?.second_to ?? null,
          second_by: mawb.airport?.second_by ?? null,
          third_to: mawb.airport?.third_to ?? null,
          third_by: mawb.airport?.third_by ?? null,
          flight_date: mawb.airport?.flight_date ?? null,
        },
        accounting: {
          is_prepaid: mawb.accounting?.is_prepaid ?? true,
          is_collect: mawb.accounting?.is_collect ?? false,
          reference_number: mawb.accounting?.reference_number ?? null,
          currency: mawb.accounting?.currency ?? 'USD',
          chgs_code: mawb.accounting?.chgs_code ?? 'PP',
          wt_val_ppd: mawb.accounting?.wt_val_ppd ?? true,
          wt_val_coll: mawb.accounting?.wt_val_coll ?? false,
          other_ppd: mawb.accounting?.other_ppd ?? true,
          other_coll: mawb.accounting?.other_coll ?? false,
          declared_value_carriage: mawb.accounting?.declared_value_carriage
            ? String(mawb.accounting.declared_value_carriage)
            : null,
          declared_value_customs: mawb.accounting?.declared_value_customs
            ? String(mawb.accounting.declared_value_customs)
            : null,
          insurance_amt: mawb.accounting?.insurance_amt
            ? String(mawb.accounting.insurance_amt)
            : null,
        },
        billing: {
          weight_charge: mawb.billing?.weight_charge ? String(mawb.billing.weight_charge) : null,
          valuation_charge: mawb.billing?.valuation_charge
            ? String(mawb.billing.valuation_charge)
            : null,
          tax: mawb.billing?.tax ? String(mawb.billing.tax) : null,
          total_charge_agent: mawb.billing?.total_charge_agent
            ? String(mawb.billing.total_charge_agent)
            : null,
          total_charge_carrier: mawb.billing?.total_charge_carrier
            ? String(mawb.billing.total_charge_carrier)
            : null,
          total: mawb.billing?.total ? String(mawb.billing.total) : null,
          executed_date: mawb.billing?.executed_date ?? null,
          place: mawb.billing?.place ?? null,
          is_agent: mawb.billing?.is_agent ?? false,
          signature: mawb.billing?.signature ?? null,
        },
        dimensions:
          mawb.dimensions?.map((d) => ({
            length: String(d.length),
            width: String(d.width),
            height: String(d.height),
            piece: 1,
          })) ?? [],
        otherCharge:
          mawb.otherCharge?.map((c) => ({
            name: c.name,
            amount: String(c.amount),
            type: c.type,
          })) ?? [],
        natureOfGoods:
          mawb.natureOfGoods?.map((g) => ({
            title: g.title,
            detail: g.detail ?? null,
          })) ?? [],
        hawbs: [],
      });
    }
  }, [mawb, form]);

  const onSubmit = async (values: MawbSchema) => {
    try {
      if (mawbId) {
        const dirtyValues = getDirtyValues(values, form.formState.dirtyFields);
        await updateMutation.mutateAsync({ id: mawbId, payload: dirtyValues as any });
      } else {
        await createMutation.mutateAsync(values as any);
      }
      router.push('/mawb');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to save MAWB record';
      form.setError('root', { message });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (mawbId && isMawbLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-mist)] border-t-[var(--color-ocean)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">
            {mawbId ? 'Edit Master Air Waybill (MAWB)' : 'Create Master Air Waybill (MAWB)'}
          </h1>
          <p className="text-sm text-[var(--color-ink)]/70 mt-1">
            Fill in the standard airway bill details to create or update this master consignment
          </p>
        </div>
      </div> */}

      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        {form.formState.errors.root && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* MAWB Identification */}
        <MawbIdentification />

        {/* Parties */}
        <WaybillParties />

        {/* Routing (5 cols) + Accounting sections (7 cols) */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5">
            <WaybillRouting />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <WaybillAccounting />
          </div>
        </div>

        {/* Shipment Details & Charges */}
        <WaybillCargoDetails />

        {/* Dimensions + Nature of Goods (side-by-side only when dims exist) */}
        <DimensionsPanel />

        {/* Other Charges (7 cols) + Billing/Signature (5 cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-7">
            <WaybillOtherCharges />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <WaybillBilling />
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-4 z-20 flex justify-end gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-[var(--color-mist)] shadow-lg">
          <Button type="button" variant="ghost" onClick={() => router.push('/mawb')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="lg">
            {mawbId ? 'Update MAWB' : 'Create MAWB'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
