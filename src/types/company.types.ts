import type { AppBaseEntity } from './common';

export interface CompanyBank extends AppBaseEntity {
  bankName: string;
  bankAddress: string;
  bankCity: string;
  bankCountry: string;
  bankZipCode?: string;
  bankPhoneNumber?: string;
  bankEmail?: string;
  bankIfscCode?: string;
  bankAccountNumber: string;
  faxNo?: string;
  telex?: string;
  swift?: string;
  bankAccHolderName: string;
  bankBranch: string;
  isUsd?: boolean;
}

export interface Company extends AppBaseEntity {
  name: string;
  alias: string;
  logo?: string;
  poBoxNumber: string;
  phoneNumber?: string;
  address: string;
  city: string;
  country: string;
  officeNumber1?: string;
  officeNumber2?: string;
  officeNumber3?: string;
  email?: string;
  isVat: boolean;
  vatPanNumber: string;
  banks?: CompanyBank[];
}

export type CreateCompanyBankPayload = Omit<CompanyBank, keyof AppBaseEntity>;
export type UpdateCompanyBankPayload = Partial<CreateCompanyBankPayload> & { id?: number };
export type CreateCompanyPayload = Omit<Company, keyof AppBaseEntity | 'banks'> & {
  banks?: CreateCompanyBankPayload[];
};
export type UpdateCompanyPayload = Partial<Omit<CreateCompanyPayload, 'banks'>> & {
  banks?: UpdateCompanyBankPayload[];
};