import type { FormEvent } from 'react';
import Button from '@/src/components/ui/Button';
import InputBox from '@/src/components/ui/InputBox';
import FormSection from '@/src/components/ui/FormSection';
import type { CreatePartyPayload } from '@/src/types/entities';

interface PartyFormProps {
	form: CreatePartyPayload;
	onChange: (key: keyof CreatePartyPayload, value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
	submitLabel: string;
	isSubmitting?: boolean;
}

export default function PartyForm({
	form,
	onChange,
	onSubmit,
	onCancel,
	submitLabel,
	isSubmitting = false,
}: PartyFormProps) {
	return (
		<form className="space-y-6" onSubmit={onSubmit}>
			<FormSection title="Basic Information" columns={2}>
				<InputBox
					label="Name"
					value={form.name}
					onChange={(e) => onChange('name', e.target.value)}
					required
				/>
				<InputBox
					label="City"
					value={form.city}
					onChange={(e) => onChange('city', e.target.value)}
					required
				/>
				<InputBox
					label="Country"
					value={form.country}
					onChange={(e) => onChange('country', e.target.value)}
					required
				/>
				<InputBox
					label="Email"
					type="email"
					value={form.email ?? ''}
					onChange={(e) => onChange('email', e.target.value)}
				/>
			</FormSection>

			<FormSection title="Contact Information" columns={2}>
				<InputBox
					label="Phone Number"
					value={form.phoneNumber ?? ''}
					onChange={(e) => onChange('phoneNumber', e.target.value)}
				/>
				<InputBox
					label="Office Number"
					value={form.officeNumber ?? ''}
					onChange={(e) => onChange('officeNumber', e.target.value)}
				/>
				<InputBox
					label="PO Box"
					value={form.poBoxNumber ?? ''}
					onChange={(e) => onChange('poBoxNumber', e.target.value)}
				/>
			</FormSection>

			<FormSection title="Address" columns={1}>
				<InputBox
					label="Address"
					value={form.address}
					onChange={(e) => onChange('address', e.target.value)}
					required
				/>
			</FormSection>

			<div className="flex justify-end gap-3 pt-4">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" isLoading={isSubmitting}>
					{submitLabel}
				</Button>
			</div>
		</form>
	);
}
