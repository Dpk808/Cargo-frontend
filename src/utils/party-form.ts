import type { CreatePartyPayload, PartyBase } from '@/src/types/entities';

export const EMPTY_PARTY_FORM: CreatePartyPayload = {
	name: '',
	email: '',
	poBoxNumber: '',
	phoneNumber: '',
	officeNumber: '',
	address: '',
	city: '',
	country: '',
};

export function fromParty(party: PartyBase): CreatePartyPayload {
	return {
		name: party.name,
		email: party.email ?? '',
		poBoxNumber: party.poBoxNumber ?? '',
		phoneNumber: party.phoneNumber ?? '',
		officeNumber: party.officeNumber ?? '',
		address: party.address,
		city: party.city,
		country: party.country,
	};
}
