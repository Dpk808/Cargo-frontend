'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Card from '@/src/components/ui/Card';
import MawbForm from '@/src/components/pages/MawbForm';
import { EMPTY_MAWB_FORM, type MawbFormState, toMawbPayload } from '@/src/utils/mawb-form.utils';
import { useConsignees } from '@/src/hooks/useConsignees';
import { useCreateMawb } from '@/src/hooks/useMawbs';
import { useShippers } from '@/src/hooks/useShippers';
import { useAgents } from '@/src/hooks/useAgents';
import { useStartMawbStock } from '@/src/hooks/useMawbStock';
import { useAvailableMawbStock } from '@/src/hooks/useMawbStock';

export default function AddMawbPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: shippers = [] } = useShippers();
	const { data: consignees = [] } = useConsignees();
	const { data: agents = [] } = useAgents();
	const createMutation = useCreateMawb();
	const startMutation = useStartMawbStock();

	const [form, setForm] = useState<MawbFormState>({
		...EMPTY_MAWB_FORM,
		is_prepaid: true,
		is_collect: false,
		wt_val_ppd: true,
		other_ppd: true,
		wt_val_coll: false,
		other_coll: false,
		chgs_code: 'PP',
	});

	const { data: availableStock } = useAvailableMawbStock(form.airline_prefix);

	useEffect(() => {
		const airline_prefix = searchParams.get('airline_prefix');
		const serial_no = searchParams.get('serial_no');
		const agent_id = searchParams.get('agent_id');
		if (airline_prefix || serial_no || agent_id) {
			
			setForm((prev) => ({
				...prev,
				airline_prefix: airline_prefix || prev.airline_prefix,
				serial_no: serial_no || prev.serial_no,
				agent_id: agent_id ?? prev.agent_id,
			}));
		}
	}, [searchParams]);

	useEffect(() => {
		if (availableStock) {
			setForm((prev) => ({
				...prev,
				serial_no: availableStock.serial_no,
				check_digit: availableStock.check_digit,
			}));
		}
	}, [availableStock]);

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

		if (form.id) {
			// If this MAWB is assigned to a stock, mark it as started first
			await startMutation.mutateAsync(form.id);
		}

		const result = await createMutation.mutateAsync(toMawbPayload(form));
		router.push(`/mawb/${result.id}/edit`);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-[var(--color-ink)]">Create New MAWB</h1>
				<p className="mt-2 text-[var(--color-ink)]/70">Fill in the details below to create a new master airway bill entry</p>
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
					submitLabel="Create MAWB"
					isSubmitting={createMutation.isPending}
				/>
			</Card>
		</div>
	);
}
