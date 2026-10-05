import { z } from 'zod';

export const mawbStockSchema = z
  .object({
    airline_id: z.number().int().min(1, 'Required'),
    start_serial: z.number().int().min(0).max(9999999),
    end_serial: z.number().int().min(0).max(9999999),
    check_digit: z.string().length(1, 'Must be exactly one character'),
    remarks: z.string().max(1000).optional(),
  })
  .refine((values) => values.end_serial >= values.start_serial, {
    path: ['end_serial'],
    message: 'Must be greater than or equal to start serial',
  });

export const mawbStockDefaults: MawbStockSchema = {
  airline_id: 0,
  start_serial: 0,
  end_serial: 0,
  check_digit: '',
  remarks: '',
};

export type MawbStockSchema = z.infer<typeof mawbStockSchema>;