'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Modal from '@/src/components/ui/Modal';
import Table from '@/src/components/ui/Table';
import MawbForm from '@/src/components/pages/MawbForm';
import { EMPTY_MAWB_FORM, fromMawb, type MawbFormState, toMawbPayload } from '@/src/utils/mawb-form.utils';
import { useConsignees } from '@/src/hooks/useConsignees';
import { useAgents } from '@/src/hooks/useAgents';
import { useDeleteMawb, useMawbs, useUpdateMawb } from '@/src/hooks/useMawbs';
import { useShippers } from '@/src/hooks/useShippers';
import type { Mawb } from '@/src/types/entities';
import type { TableColumn } from '@/src/types/api';

export default function MawbPage() {
	const router = useRouter();
	const { data = [], isLoading } = useMawbs();
	const { data: shippers = [] } = useShippers();
	const { data: consignees = [] } = useConsignees();
	const { data: agents = [] } = useAgents();

	const updateMutation = useUpdateMawb();
	const deleteMutation = useDeleteMawb();

	const [showFormModal, setShowFormModal] = useState(false);
	const [editing, setEditing] = useState<Mawb | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Mawb | null>(null);
	const [form, setForm] = useState<MawbFormState>(EMPTY_MAWB_FORM);

	const columns: TableColumn<Mawb>[] = useMemo(
		() => [
			{
				key: 'mawbNo',
				header: 'MAWB #',
				render: (row) => (
					<span className="font-semibold text-[var(--color-ocean)]">
						{row.airline_prefix}-{row.serial_no}-{row.check_digit}
					</span>
				),
			},
			{
				key: 'shipper',
				header: 'Shipper',
				render: (row) => {
					const shipper = shippers.find(s => s.id === row.shipper?.id);
					return shipper?.name ?? '-';
				},
			},
			{
				key: 'consignee',
				header: 'Consignee',
				render: (row) => {
					const consignee = consignees.find(c => c.id === row.consignee?.id);
					return consignee?.name ?? '-';
				},
			},
			{
				key: 'pieces',
				header: 'Pieces',
				render: (row) => row.no_of_pieces,
			},
			{
				key: 'weight',
				header: 'Weight',
				render: (row) => `${row.gross_weight} ${row.unit}`,
			},
			{
				key: 'total',
				header: 'Total',
				render: (row) => `${row.accounting?.currency ?? 'USD'} ${row.total}`,
			},
			{
				key: 'actions',
				header: 'Actions',
				render: (row) => (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								setEditing(row);
								setForm(fromMawb(row));
								setShowFormModal(true);
							}}
						>
							✏️ Edit
						</Button>
						<Button
							size="sm"
							variant="ghost"
							className="text-[var(--color-ocean)]"
							onClick={() => router.push(`/mawb/${row.id}/hawb/add`)}
						>
							🏠 Add Homebill
						</Button>
						<Button
							size="sm"
							variant="ghost"
							className="text-green-600"
							onClick={() => {
								const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
								window.open(`${baseUrl}/mawb/${row.id}/pdf`, '_blank');
							}}
						>
							🖨️ Print PDF
						</Button>
						<Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
							🗑️ Delete
						</Button>
					</div>
				),
			},
		],
		[shippers, consignees],
	);

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

	const resetFormModal = () => {
		setShowFormModal(false);
		setEditing(null);
		setForm(EMPTY_MAWB_FORM);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!editing) {
			return;
		}

		await updateMutation.mutateAsync({ id: editing.id, payload: toMawbPayload(form) });

		resetFormModal();
	};

	const isSubmitting = updateMutation.isPending;

	return (
		<>
			<Card
				title="MAWB Records"
				subtitle="Create and manage master airway bill entries"
				action={
					<Button onClick={() => router.push('/mawb/add')} size="lg">
						✈️ Add MAWB
					</Button>
				}
			>
				<Table data={data} columns={columns} isLoading={isLoading} emptyMessage="No MAWBs available. Create one to get started." />
			</Card>

			<Modal isOpen={showFormModal} title="Edit MAWB" onClose={resetFormModal}>
				<MawbForm
					form={form}
					shipperOptions={shipperOptions}
					consigneeOptions={consigneeOptions}
					agentOptions={agentOptions}
					onChange={handleChange}
					onSubmit={handleSubmit}
					onCancel={resetFormModal}
					submitLabel="Update MAWB"
					isSubmitting={isSubmitting}
					mawbId={editing?.id}
				/>
			</Modal>

			<Modal isOpen={Boolean(deleteTarget)} title="Delete MAWB" onClose={() => setDeleteTarget(null)}>
				<div className="space-y-5">
					<div className="rounded-lg bg-red-50 border border-red-200 p-4">
						<p className="text-sm text-red-900">
							Are you sure you want to delete MAWB <strong>{deleteTarget?.airline_prefix}-{deleteTarget?.serial_no}-{deleteTarget?.check_digit}</strong>? This action cannot be undone.
						</p>
					</div>

					<div className="flex justify-end gap-3">
						<Button variant="ghost" onClick={() => setDeleteTarget(null)}>
							Cancel
						</Button>
						<Button
							variant="danger"
							isLoading={deleteMutation.isPending}
							onClick={async () => {
								if (!deleteTarget) {
									return;
								}
								await deleteMutation.mutateAsync(deleteTarget.id);
								setDeleteTarget(null);
							}}
						>
							Delete MAWB
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
