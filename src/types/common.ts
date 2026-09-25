export interface AppBaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PartyBase {
  name: string;
  email?: string | null;
  poBoxNumber?: string | null;
  phoneNumber?: string | null;
  officeNumber?: string | null;
  address: string;
  city: string;
  country: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    meta: PaginationMeta;
  }

export enum ChargeType {
  AGENT = 'AGENT',
  CARRIER = 'CARRIER',
}

export enum WeightUnit {
  KG = 'KG',
  LB = 'LB',
}

export enum RateClass {
  M = 'M',
  N = 'N',
  Q = 'Q',
  C = 'C',
  K = 'K',
  R = 'R',
  S = 'S',
  U = 'U',
  E = 'E',
}

export enum DimensionUnit {
  CM = 'CM',
  IN = 'IN',
}