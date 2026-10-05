import type { AppBaseEntity, ChargeType, WeightUnit, RateClass, DimensionUnit } from './common';
import type { Client } from './client.types';

export interface HawbAirport extends AppBaseEntity {
  departure: string;
  destination: string;
  to: string;
  by_first_carrier: string;
  second_to?: string | null;
  second_by?: string | null;
  third_to?: string | null;
  third_by?: string | null;
  flight_date: string;
}

export interface HawbAccounting extends AppBaseEntity {
  is_prepaid: boolean;
  is_collect: boolean;
  chgs_code: string;
  wt_val_ppd: boolean;
  wt_val_coll: boolean;
  other_ppd: boolean;
  other_coll: boolean;
  declared_value_carriage?: number | null;
  declared_value_customs?: number | null;
  insurance_amt?: number | null;
}

export interface HawbDimension extends AppBaseEntity {
  length: number;
  width: number;
  height: number;
}

export interface HawbBilling extends AppBaseEntity {
  weight_charge?: number | null;
  valuation_charge?: number | null;
  tax?: number | null;
  total_charge_agent?: number | null;
  total_charge_carrier?: number | null;
  total?: number | null;
  signature?: string | null;
  executed_date: string;
  place: string;
}

export interface HawbOtherCharge extends AppBaseEntity {
  name: string;
  amount: number;
  type: ChargeType;
}

export interface HawbNatureOfGoods extends AppBaseEntity {
  title: string;
  detail: string;
}

export interface Hawb extends AppBaseEntity {
  mawb?: { id: number };
  information?: string | null;
  note?: string | null;
  no_of_pieces: number;
  gross_weight: number;
  unit: WeightUnit;
  rate_class: RateClass;
  commodity_item_no?: string | null;
  chargable_weight: number;
  rate?: number | null;
  total?: number | null;
  dimension_unit: DimensionUnit;
    account_no?: string | null;
  shipper?: Client;
  consignee?: Client;
  agent?: Client;
  airport: HawbAirport;
  accounting: HawbAccounting;
  billing: HawbBilling;
  otherCharge: HawbOtherCharge[];
  natureOfGoods: HawbNatureOfGoods[];
  dimensions: HawbDimension[];
}

export interface CreateHawbPayload {
  mawb_id?: number;
  shipper_id?: number;
  consignee_id?: number;
  agent_id?: number;
  information?: string | null;
  note?: string | null;
  no_of_pieces: number;
  gross_weight: number;
  unit: WeightUnit;
  rate_class: RateClass;
  commodity_item_no?: string | null;
  chargable_weight: number;
  rate?: number | null;
  total?: number | null;
  dimension_unit: DimensionUnit;
  account_no?: string | null;
  airport: Omit<HawbAirport, keyof AppBaseEntity>;
  accounting: Omit<HawbAccounting, keyof AppBaseEntity>;
  billing: Omit<HawbBilling, keyof AppBaseEntity>;
  otherCharge: Omit<HawbOtherCharge, keyof AppBaseEntity>[];
  natureOfGoods: Omit<HawbNatureOfGoods, keyof AppBaseEntity>[];
  dimensions: Omit<HawbDimension, keyof AppBaseEntity>[];
}

export type UpdateHawbPayload = Partial<CreateHawbPayload>;
