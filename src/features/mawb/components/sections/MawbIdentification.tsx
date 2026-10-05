'use client';

import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import { useAirlineByPrefix } from '@/src/hooks/useAirlines';
import { calculateMawbCheckDigit } from '@/src/utils/check-digit';

export function MawbIdentification() {
  const { control, setValue } = useFormContext();

  const airlinePrefix = useWatch({ control, name: 'airline_prefix' });
  const serialNo = useWatch({ control, name: 'serial_no' });
  const checkDigit = useWatch({ control, name: 'check_digit' });
  const cityName = useWatch({ control, name: 'city_name' });

  const { data: airline, isLoading: airlineLoading } = useAirlineByPrefix(
    airlinePrefix?.length === 3 ? airlinePrefix : null,
  );

  useEffect(() => {
    const computed = calculateMawbCheckDigit(serialNo);
    if (computed !== null && computed !== checkDigit) {
      setValue('check_digit', computed, { shouldValidate: true });
    }
  }, [serialNo, checkDigit, setValue]);

  // Compose the MAWB number preview
  const mawbNumberPrefix =
    airlinePrefix && serialNo
      ? `${airlinePrefix}-${serialNo}`
      : airlinePrefix || serialNo || '';

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--color-mist)] pb-3 mb-4">
        <div>
          <h3 className="font-semibold text-base text-[var(--color-ink)]">MAWB Identification</h3>
          <p className="text-xs text-[var(--color-ink)]/60">
            Airline prefix, serial number, and verification check digit
          </p>
        </div>
        {airlineLoading && (
          <span className="text-xs text-[var(--color-ink)]/50 animate-pulse">
            Verifying airline...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: input fields */}
        <div className="space-y-4">
          <FormField name="airline_prefix" label="Airline Prefix" required>
            {(field) => (
              <Input
                placeholder="AAA"
                maxLength={3}
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 3))}
              />
            )}
          </FormField>

          <FormField name="serial_no" label="Serial Number" required>
            {(field) => (
              <Input
                placeholder="0000000"
                maxLength={7}
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, '').slice(0, 7))
                }
              />
            )}
          </FormField>

          <FormField name="city_name" label="City Name">
            {(field) => (
              <Input
                placeholder="Origin City"
                {...field}
                value={field.value ?? ''}
              />
            )}
          </FormField>
        </div>

        {/* Right: MAWB number display + airline info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[var(--color-ink)]">MAWB Number</label>
            <div className="mt-2 rounded-lg border border-[var(--color-ocean)]/30 bg-[var(--color-ocean)]/5 p-4">
              <p className="text-3xl font-bold font-mono tracking-wider">
                <span className="text-[var(--color-ocean)]">{mawbNumberPrefix} </span>
                <span className="text-red-500">{checkDigit}</span>
              </p>
            </div>
          </div>

          {airline && (
            <div className="rounded-lg border border-[var(--color-ocean)]/30 bg-[var(--color-ocean)]/5 p-4">
              <p className="text-xs text-[var(--color-ink)]/70 uppercase tracking-wide">
                Flight Information
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">{airline.name}</p>
              <p className="text-sm text-[var(--color-ink)]/70">
                {cityName || 'N/A'}, {(airline as any).country || 'N/A'}
              </p>
            </div>
          )}

          {airlineLoading && (
            <div className="rounded-lg border border-[var(--color-mist)] bg-[var(--color-canvas)] p-4">
              <p className="text-sm text-[var(--color-ink)]/70">Loading airline info...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
