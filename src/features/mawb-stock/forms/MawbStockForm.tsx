'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/src/components/forms/Form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { useAirlines } from '@/src/hooks/useAirlines';
import { useCreateMawbStockRange } from '@/src/features/mawb-stock/hooks/useMawbStock';
import { calculateMawbCheckDigit } from '@/src/utils/check-digit';
import {
  mawbStockDefaults,
  mawbStockSchema,
  type MawbStockSchema,
} from '../schemas/mawb-stock.schemas';

interface MawbStockFormProps {
  onSuccess?: () => void;
}

export default function MawbStockForm({ onSuccess }: MawbStockFormProps) {
  const { data: airlines = [], isLoading: isLoadingAirlines } = useAirlines();
  const createMutation = useCreateMawbStockRange();
  const form = useForm<MawbStockSchema>({
    resolver: zodResolver(mawbStockSchema),
    defaultValues: mawbStockDefaults,
  });
  const { setValue } = form;

  const selectedAirline = airlines.find(
    (airline) => airline.id === form.watch('airline_id'),
  );
  const startSerial = form.watch('start_serial');
  const checkDigit = form.watch('check_digit');

  useEffect(() => {
    const computed = calculateMawbCheckDigit(startSerial);
    if (computed !== null && computed !== checkDigit) {
      setValue('check_digit', computed, { shouldValidate: true });
    }
  }, [checkDigit, setValue, startSerial]);

  const onSubmit = async (values: MawbStockSchema) => {
    try {
      await createMutation.mutateAsync(values);
      form.reset(mawbStockDefaults);
      onSuccess?.();
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong';
      form.setError('root', { message });
    }
  };

  return (
      <Form form={form} onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField name="airline_id" label="Airline" required>
            {(field) => (
              <Select
                options={airlines.map((airline) => ({
                  label: `${airline.name ?? 'Unnamed Airline'} (${airline.prefixCode ?? '-'})`,
                  value: airline.id,
                }))}
                value={field.value || undefined}
                isLoading={isLoadingAirlines}
                onChange={(value) => field.onChange(Number(value))}
                placeholder="Select airline"
              />
            )}
          </FormField>

          <FormField name="airline_prefix" label="Airline Prefix">
            {() => (
              <Input
                value={selectedAirline?.prefixCode ?? ''}
                disabled
                placeholder="Auto-filled from airline"
              />
            )}
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField name="start_serial" label="Start Serial" required>
            {(field) => (
              <Input
                {...field}
                type="number"
                min={0}
                max={9999999}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          </FormField>

          <FormField name="end_serial" label="End Serial" required>
            {(field) => (
              <Input
                {...field}
                type="number"
                min={0}
                max={9999999}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          </FormField>

          <FormField name="check_digit" label="Check Digit" required>
            {(field) => (
              <Input
                {...field}
                maxLength={1}
                onChange={(event) => field.onChange(event.target.value.slice(0, 1))}
              />
            )}
          </FormField>
        </div>

        <FormField name="remarks" label="Remarks">
          {(field) => <Input {...field} placeholder="Optional remarks for this stock batch" />}
        </FormField>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => form.reset(mawbStockDefaults)}>
            Reset
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Create Stock Range
          </Button>
        </div>
      </Form>
  );
}
