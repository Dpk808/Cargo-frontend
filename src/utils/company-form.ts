import type { CreateCompanyPayload } from '@/src/types/entities';

export type CompanyFormState = Omit<CreateCompanyPayload, 'banks'>;

export const EMPTY_COMPANY_FORM: CompanyFormState = {
  name: '',
  alias: '',
  logo: '',
  poBoxNumber: '',
  phoneNumber: '',
  address: '',
  city: '',
  country: '',
  officeNumber1: '',
  officeNumber2: '',
  officeNumber3: '',
  email: '',
  isVat: false,
  vatPanNumber: '',
};

