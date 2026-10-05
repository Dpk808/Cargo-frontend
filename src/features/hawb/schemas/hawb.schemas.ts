import {
  hawbSchema as baseHawbSchema,
  accountingSchema as baseAccountingSchema,
  billingSchema as baseBillingSchema,
} from '@/src/features/mawb/schemas/mawb.schemas';

export {
  airportSchema,
  billingSchema,
  dimensionSchema,
  otherChargeSchema,
  natureOfGoodsSchema,
} from '@/src/features/mawb/schemas/mawb.schemas';

export const accountingSchema = baseAccountingSchema.omit({
  reference_number: true,
  currency: true,
});

export const hawbSchema = baseHawbSchema.extend({
  accounting: accountingSchema,
  billing: baseBillingSchema.omit({ is_agent: true }),
});

export type HawbSchema = import('zod').infer<typeof hawbSchema>;

/** Default values for a blank HAWB form */
export const hawbDefaults: HawbSchema = {
  mawb_id: null,
  shipper_id: null,
  consignee_id: null,
  agent_id: null,
  information: null,
  note: null,
  no_of_pieces: '',
  gross_weight: '',
  unit: '',
  rate_class: null,
  commodity_item_no: null,
  chargable_weight: '',
  rate: null,
  total: null,
  dimension_unit: '',
  account_no: null,
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
    is_prepaid: false,
    is_collect: false,
    chgs_code: '',
    wt_val_ppd: false,
    wt_val_coll: false,
    other_ppd: false,
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
  },
  otherCharge: [],
  natureOfGoods: [],
  dimensions: [],
};
