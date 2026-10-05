import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Required').max(100),
  alias: z.string().min(1, 'Required').max(100),
  poBoxNumber: z.string().min(1, 'Required').max(50),
  address: z.string().min(1, 'Required').max(255),
  city: z.string().min(1, 'Required').max(100),
  country: z.string().min(1, 'Required').max(100),
  phoneNumber: z.string().max(50).optional().or(z.literal('')),
  officeNumber1: z.string().max(50).optional().or(z.literal('')),
  officeNumber2: z.string().max(50).optional().or(z.literal('')),
  officeNumber3: z.string().max(50).optional().or(z.literal('')),
  email: z
    .string()
    .email('Invalid email')
    .max(100)
    .optional()
    .or(z.literal('')),
  isVat: z.boolean(),
  vatPanNumber: z.string().min(1, 'Required').max(50),
  logo: z.string().max(255).optional().or(z.literal('')),
});

export const companyDefaults: CompanySchema = {
  name: '',
  alias: '',
  poBoxNumber: '',
  address: '',
  city: '',
  country: '',
  phoneNumber: '',
  officeNumber1: '',
  officeNumber2: '',
  officeNumber3: '',
  email: '',
  isVat: false,
  vatPanNumber: '',
  logo: '',
};

export type CompanySchema = z.infer<typeof companySchema>;
