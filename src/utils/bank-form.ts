import type { CreateCompanyBankPayload } from '@/src/types/entities';

export type BankFormState = Omit<CreateCompanyBankPayload, 'companyId'>;

export const EMPTY_BANK_FORM: BankFormState = {
  bankName: '',
  bankAddress: '',
  bankCity: '',
  bankCountry: '',
  bankZipCode: '',
  bankPhoneNumber: '',
  bankEmail: '',
  bankIfscCode: '',
  bankAccountNumber: '',
  faxNo: '',
  telex: '',
  swift: '',
  bankAccHolderName: '',
  bankBranch: '',
  isUsd: false,
};
