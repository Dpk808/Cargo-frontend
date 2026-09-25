'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MawbForm from '@/src/components/pages/MawbForm';
import { EMPTY_MAWB_FORM, type MawbFormState, toMawbPayload } from '@/src/utils/mawb-form.utils';
import { useShippers } from '@/src/hooks/useShippers';
import { useConsignees } from '@/src/hooks/useConsignees';
import { useAgents } from '@/src/hooks/useAgents';
import { useMawbs } from '@/src/hooks/useMawbs';
import { useCreateHawb } from '@/src/hooks/useHawbs';
import Card from '@/src/components/ui/Card';

export default function AddHawbPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mawbId = parseInt(id, 10);

  const { data: mawbs = [] } = useMawbs();
  const parentMawb = mawbs.find((m) => m.id === mawbId);

  const { data: shippers = [] } = useShippers();
  const { data: consignees = [] } = useConsignees();
  const { data: agents = [] } = useAgents();
  const createMutation = useCreateHawb();

  const [form, setForm] = useState<MawbFormState>(EMPTY_MAWB_FORM);

  useEffect(() => {
    if (parentMawb) {
      setForm((prev) => ({
        ...prev,
        airline_prefix: parentMawb.airline_prefix,
        // Pre-fill other fields from parent if necessary
      }));
    }
  }, [parentMawb]);

  const shipperOptions = shippers.map((s) => ({ label: s.name, value: String(s.id) }));
  const consigneeOptions = consignees.map((c) => ({ label: c.name, value: String(c.id) }));
  const agentOptions = agents.map((a) => ({ label: a.name, value: String(a.id) }));

  const handleChange = useCallback((key: keyof MawbFormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...toMawbPayload(form),
      mawb_id: mawbId,
    };
    await createMutation.mutateAsync(payload as any);
    router.push('/mawb');
  };

  return (
    <Card
      title="Add Homebill (HAWB)"
      subtitle={`Adding homebill to MAWB: ${parentMawb?.airline_prefix}-${parentMawb?.serial_no}`}
    >
      <MawbForm
        form={form}
        shipperOptions={shipperOptions}
        consigneeOptions={consigneeOptions}
        agentOptions={agentOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel="Create Homebill"
        isSubmitting={createMutation.isPending}
        isHawb={true}
      />
    </Card>
  );
}
