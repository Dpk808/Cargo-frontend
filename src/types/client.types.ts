
import { AppBaseEntity } from '@/src/types/common';

export interface Client {
  id: number;
  name: string;
  alias?: string | null;
  IATA_code?: string | null;
  email?: string | null;
  poBoxNumber?: string | null;
  phoneNumber?: string | null;
  officeNumber?: string | null;
  address: string;
  city: string;
  country: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateClientPayload = Omit<Client, keyof AppBaseEntity>;
export type UpdateClientPayload = Partial<CreateClientPayload> & { id?: number };