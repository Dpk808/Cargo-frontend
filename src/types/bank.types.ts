import { AppBaseEntity } from './common';

export interface Bank extends AppBaseEntity {
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

export type CreateBankPayload = Omit<Bank, keyof AppBaseEntity>;
export type UpdateBankPayload = Partial<CreateBankPayload> & { id?: number };