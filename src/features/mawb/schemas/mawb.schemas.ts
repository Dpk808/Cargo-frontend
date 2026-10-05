import { z } from 'zod';

// Basic validators used across MAWB form
const nonEmptyString = (label = 'Required') => z.string().min(1, label).max(1000);

export const airportSchema = z.object({
  departure: nonEmptyString('Departure required'),
  destination: nonEmptyString('Destination required'),
  to: z.string().optional().nullable(),
  by_first_carrier: z.string().optional().nullable(),
  second_to: z.string().optional().nullable(),
  second_by: z.string().optional().nullable(),
  third_to: z.string().optional().nullable(),
  third_by: z.string().optional().nullable(),
  flight_date: z.string().optional().nullable(),
});

export const accountingSchema = z.object({
  is_prepaid: z.boolean(),
  is_collect: z.boolean(),
  reference_number: z.string().optional().nullable(),
  currency: z.string().min(1),
  chgs_code: z.string().min(1),
  wt_val_ppd: z.boolean(),
  wt_val_coll: z.boolean(),
  other_ppd: z.boolean(),
  other_coll: z.boolean(),
  declared_value_carriage: z.string().optional().nullable(),
  declared_value_customs: z.string().optional().nullable(),
  insurance_amt: z.string().optional().nullable(),
});

export const billingSchema = z.object({
  weight_charge: z.string().optional().nullable(),
  valuation_charge: z.string().optional().nullable(),
  tax: z.string().optional().nullable(),
  total_charge_agent: z.string().optional().nullable(),
  total_charge_carrier: z.string().optional().nullable(),
  total: z.string().optional().nullable(),
  executed_date: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  signature: z.string().optional().nullable(),
  is_agent: z.boolean(),
});

export const dimensionSchema = z.object({
  length: z.string().optional().nullable(),
  width: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  piece: z.number().int().min(1),
});

export const otherChargeSchema = z.object({
  name: z.string().min(1).max(255),
  amount: z.string().min(0).optional(),
  type: z.enum(['AGENT', 'CARRIER']),
});

export const natureOfGoodsSchema = z.object({
  title: z.string().min(1).max(255),
  detail: z.string().optional().nullable(),
});

export const hawbSchema = z.object({
  mawb_id: z.string().optional().nullable(),
  shipper_id: z.string().optional().nullable(),
  consignee_id: z.string().optional().nullable(),
  agent_id: z.string().optional().nullable(),
  information: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  no_of_pieces: z.string().min(1),
  gross_weight: z.string().min(1),
  unit: z.string().min(1),
  rate_class: z.string().optional().nullable(),
  commodity_item_no: z.string().optional().nullable(),
  chargable_weight: z.string().min(1),
  rate: z.string().optional().nullable(),
  total: z.string().optional().nullable(),
  dimension_unit: z.string().min(1),
  account_no: z.string().optional().nullable(),
  airport: airportSchema,
  accounting: accountingSchema,
  billing: billingSchema,
  otherCharge: z.array(otherChargeSchema).optional(),
  natureOfGoods: z.array(natureOfGoodsSchema).optional(),
  dimensions: z.array(dimensionSchema).optional(),
});

export const mawbSchema = z.object({
  airline_prefix: z.string().min(1, 'Airline prefix is required'),
  serial_no: z.string().min(1, 'Serial number is required'),
  check_digit: z.string().min(1, 'Check digit is required'),
  city_name: z.string().optional().nullable(),
  information: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  no_of_pieces: z.string().min(1),
  gross_weight: z.string().min(1),
  unit: z.string().min(1),
  rate_class: z.string().optional().nullable(),
  commodity_item_no: z.string().optional().nullable(),
  chargable_weight: z.string().min(1),
  rate: z.string().optional().nullable(),
  total: z.string().optional().nullable(),
  dimension_unit: z.string().min(1),
  // volumetric_factor: z.string().optional().nullable(),
  account_no: z.string().optional().nullable(),
  shipper_id: z.string().optional().nullable(),
  consignee_id: z.string().optional().nullable(),
  agent_id: z.string().optional().nullable(),
  hawbs: z.array(hawbSchema).optional(),
  airport: airportSchema,
  accounting: accountingSchema,
  billing: billingSchema,
  dimensions: z.array(dimensionSchema).optional(),
  otherCharge: z.array(otherChargeSchema).optional(),
  natureOfGoods: z.array(natureOfGoodsSchema).optional(),
});

export type MawbSchema = z.infer<typeof mawbSchema>;
export type HawbSchema = z.infer<typeof hawbSchema>;

export const mawbDefaults: MawbSchema = {
  airline_prefix: '',
  serial_no: '',
  check_digit: '',
  city_name: null,
  information: null,
  note: null,
  no_of_pieces: '',
  gross_weight: '',
  unit: 'KG',
  rate_class: null,
  commodity_item_no: null,
  chargable_weight: '',
  rate: null,
  total: null,
  dimension_unit: 'CM',
  // volumetric_factor: '6000',
  account_no: null,
  shipper_id: null,
  consignee_id: null,
  agent_id: null,
  hawbs: [],
  airport: {
    departure: '',
    destination: '',
    to: null,
    by_first_carrier: null,
    second_to: null,
    second_by: null,
    third_to: null,
    third_by: null,
    flight_date: null,
  },
  accounting: {
    is_prepaid: true,
    is_collect: false,
    reference_number: null,
    currency: 'USD',
    chgs_code: 'PP',
    wt_val_ppd: true,
    wt_val_coll: false,
    other_ppd: true,
    other_coll: false,
    declared_value_carriage: null,
    declared_value_customs: null,
    insurance_amt: null,
  },
  billing: {
    weight_charge: null,
    valuation_charge: null,
    tax: null,
    total_charge_agent: null,
    total_charge_carrier: null,
    total: null,
    executed_date: null,
    place: null,
    signature: null,
    is_agent: false,
  },
  dimensions: [],
  otherCharge: [],
  natureOfGoods: [],
};
