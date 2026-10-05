'use client';

import { useWatch, useFormContext } from 'react-hook-form';
import { FormField } from '@/src/components/forms/FormField';
import { ClientSelect } from '@/src/features/client/components/ClientDropdown';
import { useClientDropdown } from '@/src/features/client/hooks/useClient';

const InfoBox = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between border-b border-[var(--color-mist)] py-2">
    <span className="text-xs text-[var(--color-ink)]/70">{label}</span>
    <span className="text-sm font-medium text-[var(--color-ink)]">{value || '—'}</span>
  </div>
);

function ClientInfoCard({ clientId, label }: { clientId: string | null; label: string }) {
  const { data } = useClientDropdown('');
  const client = data?.items.find((c) => String(c.id) === clientId);

  if (!client) return null;

  return (
    <div className="mt-3 rounded-lg border border-[var(--color-mist)] p-4 bg-white">
      <p className="text-xs font-semibold text-[var(--color-ink)] uppercase mb-3">
        {label} Details
      </p>
      <InfoBox label="Name" value={client.name} />
      <InfoBox label="Email" value={(client as any).email} />
      <InfoBox label="Phone" value={(client as any).phoneNumber} />
      <InfoBox label="City" value={(client as any).city} />
      {(client as any).address && (
        <div className="border-b border-[var(--color-mist)] py-2">
          <span className="text-xs text-[var(--color-ink)]/70">Address</span>
          <p className="text-sm text-[var(--color-ink)] mt-1">{(client as any).address}</p>
        </div>
      )}
    </div>
  );
}

export function WaybillParties() {
  const { control } = useFormContext();
  const shipperId = useWatch({ control, name: 'shipper_id' });
  const consigneeId = useWatch({ control, name: 'consignee_id' });

  return (
    <div className="rounded-xl border border-[var(--color-mist)] bg-white p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-base text-[var(--color-ink)] border-b border-[var(--color-mist)] pb-3">
        Parties &amp; Participants
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipper */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
            Shipper
          </label>
          <FormField name="shipper_id" label="">
            {(field) => (
              <ClientSelect
                value={field.value ? Number(field.value) : undefined}
                onChange={(val) => field.onChange(String(val))}
              />
            )}
          </FormField>
          <ClientInfoCard clientId={shipperId} label="Shipper" />
        </div>

        {/* Consignee */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-2">
            Consignee
          </label>
          <FormField name="consignee_id" label="">
            {(field) => (
              <ClientSelect
                value={field.value ? Number(field.value) : undefined}
                onChange={(val) => field.onChange(String(val))}
              />
            )}
          </FormField>
          <ClientInfoCard clientId={consigneeId} label="Consignee" />
        </div>
      </div>
    </div>
  );
}
