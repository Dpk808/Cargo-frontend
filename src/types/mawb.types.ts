import type { AppBaseEntity, ChargeType, WeightUnit, RateClass, DimensionUnit } from './common';
import type { Shipper, Consignee, AgentEntity } from './party.types';
import type { CreateHawbPayload, Hawb } from './hawb.types';

export interface Airport extends AppBaseEntity {
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

export interface Accounting extends AppBaseEntity {
  is_prepaid: boolean;
  is_collect: boolean;
  reference_number?: string | null;
  currency: string;
  chgs_code: string;
  wt_val_ppd: boolean;
  wt_val_coll: boolean;
  other_ppd: boolean;
  other_coll: boolean;
  declared_value_carriage?: number | null;
  declared_value_customs?: number | null;
  insurance_amt?: number | null;
}

export interface Dimension extends AppBaseEntity {
  length: number;
  width: number;
  height: number;
}

export interface Billing extends AppBaseEntity {
  weight_charge: number;
  valuation_charge?: number | null;
  tax?: number | null;
  total_charge_agent?: number | null;
  total_charge_carrier?: number | null;
  total: number;
  executed_date: string;
  place: string;
}

export interface OtherCharge extends AppBaseEntity {
  name: string;
  amount: number;
  type: ChargeType;
}

export interface NatureOfGoods extends AppBaseEntity {
  title: string;
  detail: string;
}

export interface Mawb extends AppBaseEntity {
  airline_prefix: string;
  serial_no: string;
  check_digit: string;
  city_name?: string | null;
  information?: string | null;
  note?: string | null;
  no_of_pieces: number;
  gross_weight: number;
  unit: WeightUnit;
  rate_class: RateClass;
  commodity_item_no?: string | null;
  chargable_weight: number;
  rate: number;
  total: number;
  dimension_unit?: DimensionUnit | null;
  account_no?: string | null;
  shipper?: Shipper;
  consignee?: Consignee;
  agent?: AgentEntity;
  airport: Airport;
  accounting: Accounting;
  billing: Billing;
  dimensions: Dimension[];
  otherCharge: OtherCharge[];
  natureOfGoods: NatureOfGoods[];
  hawbs?: Hawb[];
}

export interface CreateMawbPayload {
  airline_prefix: string;
  serial_no: string;
  check_digit: string;
  city_name?: string | null;
  information?: string | null;
  note?: string | null;
  no_of_pieces: number;
  gross_weight: number;
  unit: WeightUnit;
  rate_class: RateClass;
  commodity_item_no?: string | null;
  chargable_weight: number;
  rate: number;
  total: number;
  dimension_unit?: DimensionUnit | null;
  account_no?: string | null;
  shipper_id?: number;
  consignee_id?: number;
  agent_id?: number;
  hawbs?: CreateHawbPayload[];
  airport: Omit<Airport, keyof AppBaseEntity>;
  accounting: Omit<Accounting, keyof AppBaseEntity>;
  billing: Omit<Billing, keyof AppBaseEntity>;
  dimensions: Omit<Dimension, keyof AppBaseEntity>[];
  otherCharge: Omit<OtherCharge, keyof AppBaseEntity>[];
  natureOfGoods: Omit<NatureOfGoods, keyof AppBaseEntity>[];
}

export type UpdateMawbPayload = Partial<CreateMawbPayload>;