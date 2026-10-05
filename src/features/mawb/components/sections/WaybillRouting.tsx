'use client';

import { useWatch, useFormContext } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import { ClientSelect } from '@/src/features/client/components/ClientDropdown';
import { useClientDropdown } from '@/src/features/client/hooks/useClient';

function AgentInfoCard({ agentId }: { agentId: string | null }) {
  const { data } = useClientDropdown('');
  const agent = data?.items.find((c) => String(c.id) === agentId);
  if (!agent) return null;

  return (
    <div className="flex flex-col gap-1 px-1 mt-1">
      <p className="text-sm font-medium text-[var(--color-ink)]/80">
        {(agent as any).alias || agent.name}
        {(agent as any).city ? ` / ${(agent as any).city}` : ''}
        {(agent as any).country ? `, ${(agent as any).country}` : ''}
      </p>
    </div>
  );
}

export function WaybillRouting() {
  const { control } = useFormContext();
  const agentId = useWatch({ control, name: 'agent_id' });

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
        Routing &amp; Agent
      </h3>

      {/* Agent + Account No box */}
      <div className="space-y-4 p-4 rounded-xl border border-[var(--color-ocean)]/20 bg-[var(--color-ocean)]/5">
        <FormField name="agent_id" label="Agent" required>
          {(field) => (
            <ClientSelect
              value={field.value ? Number(field.value) : undefined}
              onChange={(val) => field.onChange(String(val))}
            />
          )}
        </FormField>
        <AgentInfoCard agentId={agentId} />

        <FormField name="account_no" label="Account No">
          {(field) => (
            <Input
              placeholder="Account number"
              {...field}
              value={field.value ?? ''}
            />
          )}
        </FormField>
      </div>

      {/* Departure */}
      <FormField name="airport.departure" label="Airport of Departure" required>
        {(field) => <Input placeholder="e.g. KTM" {...field} />}
      </FormField>

      {/* First carrier leg */}
      <div className="grid grid-cols-2 gap-4">
        <FormField name="airport.to" label="To (Routing)">
          {(field) => (
            <Input
              placeholder="To city"
              maxLength={3}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 3))}
            />
          )}
        </FormField>
        <FormField name="airport.by_first_carrier" label="By First Carrier">
          {(field) => (
            <Input
              placeholder="Carrier"
              maxLength={2}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 2))}
            />
          )}
        </FormField>
      </div>

      {/* Second leg */}
      <div className="grid grid-cols-2 gap-4">
        <FormField name="airport.second_to" label="To (via)">
          {(field) => (
            <Input
              placeholder="To city"
              maxLength={3}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 3))}
            />
          )}
        </FormField>
        <FormField name="airport.second_by" label="By (carrier)">
          {(field) => (
            <Input
              placeholder="Carrier"
              maxLength={2}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 2))}
            />
          )}
        </FormField>
      </div>

      {/* Third leg */}
      <div className="grid grid-cols-2 gap-4">
        <FormField name="airport.third_to" label="To (Final)">
          {(field) => (
            <Input
              placeholder="To city"
              maxLength={3}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 3))}
            />
          )}
        </FormField>
        <FormField name="airport.third_by" label="By (Final)">
          {(field) => (
            <Input
              placeholder="Carrier"
              maxLength={2}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.toUpperCase().slice(0, 2))}
            />
          )}
        </FormField>
      </div>

      {/* Destination */}
      <FormField name="airport.destination" label="Airport of Destination" required>
        {(field) => <Input placeholder="e.g. DXB" {...field} />}
      </FormField>

      {/* Flight date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField name="airport.flight_date" label="Requested Flight Date">
          {(field) => <Input type="date" {...field} value={field.value ?? ''} />}
        </FormField>
        <FormField name="airport.flight_date" label="Requested Flight Date (copy)">
          {(field) => <Input type="date" {...field} value={field.value ?? ''} disabled />}
        </FormField>
      </div>
    </div>
  );
}
