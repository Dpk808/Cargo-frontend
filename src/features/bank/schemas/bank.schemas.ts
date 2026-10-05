import { z } from 'zod';

export const bankSchema = z.object({
  bankName: z.string().min(1, 'Required').max(100),
  bankAddress: z.string().min(1, 'Required').max(255),
  bankCity: z.string().min(1, 'Required').max(100),
  bankCountry: z.string().min(1, 'Required').max(100),
  bankZipCode: z.string().max(20).optional(),
  bankPhoneNumber: z.string().max(50).optional(),
  bankEmail: z.string().email('Invalid email').max(100).optional(),
  bankIfscCode: z.string().max(20).optional(),
  bankAccountNumber: z.string().min(1, 'Required').max(50),
  faxNo: z.string().max(50).optional(),
  telex: z.string().max(50).optional(),
  swift: z.string().max(20).optional(),
  bankAccHolderName: z.string().min(1, 'Required').max(100),
  bankBranch: z.string().min(1, 'Required').max(100),
  isUsd: z.boolean().optional(),
});

export const bankDefaults: BankSchema = {
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

export type BankSchema = z.infer<typeof bankSchema>;
