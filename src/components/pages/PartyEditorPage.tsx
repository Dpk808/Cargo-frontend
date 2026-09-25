import type { FormEvent } from 'react';
import Card from '@/src/components/ui/Card';
import PartyForm from '@/src/components/pages/PartyForm';
import type { CreatePartyPayload } from '@/src/types/entities';

interface PartyEditorPageProps {
	title: string;
	subtitle: string;
	form: CreatePartyPayload;
	onChange: (key: keyof CreatePartyPayload, value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
	submitLabel: string;
	isSubmitting?: boolean;
}

export default function PartyEditorPage({
	title,
	subtitle,
	form,
	onChange,
	onSubmit,
	onCancel,
	submitLabel,
	isSubmitting = false,
}: PartyEditorPageProps) {
	return (
		<Card title={title} subtitle={subtitle}>
			<PartyForm
				form={form}
				onChange={onChange}
				onSubmit={onSubmit}
				onCancel={onCancel}
				submitLabel={submitLabel}
				isSubmitting={isSubmitting}
			/>
		</Card>
	);
}
