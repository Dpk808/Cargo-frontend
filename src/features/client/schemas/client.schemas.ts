import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Required').max(255),
  email: z.string().email('Invalid email').max(255).optional(),
  poBoxNumber: z.string().min(1, 'Required').max(20),
  phoneNumber: z.string().optional(),
  officeNumber: z.string().optional(),
  address: z.string().min(1, 'Required').max(1000),
  city: z.string().min(1, 'Required').max(100),
  country: z.string().min(1, 'Required').max(100),
});

export const clientDefaults: ClientSchema = {
  name: '',
  email: '',
  poBoxNumber: '',
  phoneNumber: '',
  officeNumber: '',
  address: '',
  city: '',
  country: '',
};

export type ClientSchema = z.infer<typeof clientSchema>;

