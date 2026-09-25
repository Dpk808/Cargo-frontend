// 'use client';

// import { useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Card from '@/src/components/ui/Card';
// import PartyForm from '@/src/components/pages/PartyForm';
// import { useUpdateShipper, useShippers } from '@/src/hooks/useShippers';
// import type { CreatePartyPayload } from '@/src/types/entities';
// import { EMPTY_PARTY_FORM } from '@/src/utils/party-form';

// export default function EditShipperPage() {
// 	const router = useRouter();
// 	const params = useParams();
// 	const shipperId = Number(params.id);
	
// 	const { data: shippers = [] } = useShippers();
// 	const shipper = shippers.find(s => s.id === shipperId);
	
// 	const updateMutation = useUpdateShipper();
// 	const [form, setForm] = useState<CreatePartyPayload>(
// 		shipper ? {
// 			name: shipper.name,
// 			email: shipper.email ?? '',
// 			phoneNumber: shipper.phoneNumber ?? '',
// 			officeNumber: shipper.officeNumber ?? '',
// 			poBoxNumber: shipper.poBoxNumber ?? '',
// 			city: shipper.city,
// 			country: shipper.country,
// 			address: shipper.address,
// 		} : EMPTY_PARTY_FORM
// 	);

// 	const handleChange = (key: keyof CreatePartyPayload, value: string) => {
// 		setForm((prev) => ({ ...prev, [key]: value }));
// 	};

// 	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
// 		event.preventDefault();
// 		await updateMutation.mutateAsync({ id: shipperId, payload: form });
// 		router.push('/shipper');
// 	};

// 	if (!shipper) {
// 		return (
// 			<Card>
// 				<p className="text-[var(--color-ink)]/70">Shipper not found</p>
// 			</Card>
// 		);
// 	}

// 	return (
// 		<div className="space-y-6">
// 			<div>
// 				<h1 className="text-2xl font-bold text-[var(--color-ink)]">📦 Edit Shipper</h1>
// 				<p className="mt-2 text-[var(--color-ink)]/70">Update shipper details and contact information</p>
// 			</div>
			
// 			<Card>
// 				<PartyForm
// 					form={form}
// 					onChange={handleChange}
// 					onSubmit={handleSubmit}
// 					onCancel={() => router.push('/shipper')}
// 					submitLabel="Update Shipper"
// 					isSubmitting={updateMutation.isPending}
// 				/>
// 			</Card>
// 		</div>
// 	);
// }

'use client';

import { useParams } from 'next/navigation';
import { ClientEditCard } from '@/src/features/client/components/ClientCard';

export default function EditClientPage() {
  const params = useParams();

  const clientId = Number(params.id);

  return <ClientEditCard clientId={clientId} />;
}