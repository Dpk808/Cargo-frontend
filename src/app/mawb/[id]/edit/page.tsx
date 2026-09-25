'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/src/components/ui/Card';
import MawbForm from '@/src/components/pages/MawbForm';
import { EMPTY_MAWB_FORM, fromMawb, type MawbFormState, toMawbPayload } from '@/src/utils/mawb-form.utils';
import { useConsignees } from '@/src/hooks/useConsignees';
import { useUpdateMawb, useMawbs } from '@/src/hooks/useMawbs';
import { useShippers } from '@/src/hooks/useShippers';
import { useAgents } from '@/src/hooks/useAgents';

export default function EditMawbPage() {
	const router = useRouter();
	const params = useParams();
	const mawbId = Number(params.id);

	const { data: mawbs = [] } = useMawbs();
	const { data: shippers = [] } = useShippers();
	const { data: consignees = [] } = useConsignees();
	const { data: agents = [] } = useAgents();

	const mawb = mawbs.find(m => m.id === mawbId);
	const updateMutation = useUpdateMawb();

	const [form, setForm] = useState<MawbFormState>(EMPTY_MAWB_FORM);

	// Sync form when mawb data is loaded
	useState(() => {
		if (mawb) setForm(fromMawb(mawb));
	});

	// Handle data loading sync
	const [hasSynced, setHasSynced] = useState(false);
	if (mawb && !hasSynced) {
		setForm(fromMawb(mawb));
		setHasSynced(true);
	}

	const shipperOptions = shippers.map((shipper) => ({
		label: shipper.name,
		value: String(shipper.id),
	}));
	const consigneeOptions = consignees.map((consignee) => ({
		label: consignee.name,
		value: String(consignee.id),
	}));
	const agentOptions = agents.map((agent) => ({
		label: agent.name,
		value: String(agent.id),
	}));

	const handleChange = useCallback((key: keyof MawbFormState, value: any) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!mawb) return;
		await updateMutation.mutateAsync({ id: mawb.id, payload: toMawbPayload(form) });
		router.push('/mawb');
	};

	if (!mawb) {
		return (
			<Card>
				<p className="text-[var(--color-ink)]/70">MAWB not found</p>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-[var(--color-ink)]">Edit MAWB</h1>
				<p className="mt-2 text-[var(--color-ink)]/70">Update master airway bill entry details</p>
			</div>
			
			<Card>
				<MawbForm
					form={form}
					shipperOptions={shipperOptions}
					consigneeOptions={consigneeOptions}
					agentOptions={agentOptions}
					onChange={handleChange}
					onSubmit={handleSubmit}
					onCancel={() => router.push('/mawb')}
					submitLabel="Update MAWB"
					isSubmitting={updateMutation.isPending}
					mawbId={mawbId}
				/>
			</Card>
		</div>
	);
}
