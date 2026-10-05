import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email').max(100),
  password: z.string().min(6, 'Min 6 characters').max(255),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email').max(100),
  password: z.string().min(6, 'Min 6 characters').max(255),
  firstName: z.string().min(1, 'Required').max(50),
  lastName: z.string().min(1, 'Required').max(50),
});

export const loginDefaults: LoginSchema = {
  email: '',
  password: '',
};

export const registerDefaults: RegisterSchema = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};


export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;