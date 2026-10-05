
import type { Client } from './client.types';

export interface AppBaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export enum ChargeType {
  AGENT = 'AGENT',
  CARRIER = 'CARRIER',
}

export enum WeightUnit {
  KG = 'KG',
  LB = 'LB',
}

export enum RateClass {
  M = 'M',
  N = 'N',
  Q = 'Q',
  C = 'C',
  K = 'K',
  R = 'R',
  S = 'S',
  U = 'U',
  E = 'E',
}

export enum DimensionUnit {
  CM = 'CM',
  IN = 'IN',
}


export interface PartyBase {
  name: string;
  email?: string | null;
  poBoxNumber?: string | null;
  phoneNumber?: string | null;
  officeNumber?: string | null;
  address: string;
  city: string;
  country: string;
}

// Client is the canonical party type used as shipper/consignee/agent
export type Shipper = Client;
export type Consignee = Client;
export type AgentEntity = Client;

export interface AirlineEntity extends AppBaseEntity {
  iataCode: string;
  prefixCode?: string | null;
  name?: string | null;
  country?: string | null;
}

export enum MawbStockStatus {
  AVAILABLE = 'available',
  HELD = 'held',
  USED = 'used',
}

export interface MawbStock extends AppBaseEntity {
  airline: AirlineEntity;
  airline_prefix: string;
  serial_no: string;
  check_digit: string;
  status: MawbStockStatus;
    heldByAgent?: Client | null;
  held_at?: string | null;
  used_at?: string | null;
  remarks?: string | null;
}

export interface CreateMawbStockRangePayload {
  airline_id: number;
  start_serial: number;
  end_serial: number;
  check_digit: string;
  remarks?: string;
}

export interface LockMawbStockPayload {
  client_id: number;
  remarks?: string;
}

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

    // Relations
  shipper?: Client;
  consignee?: Client;
  agent?: Client;

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

  // airport: Airport;
  // accounting: Accounting;
  // billing: Billing;

  // dimensions: Dimension[];
  // otherCharge: OtherCharge[];
  // natureOfGoods: NatureOfGoods[];

  hawbs?: CreateHawbPayload[];

  airport: Omit<Airport, keyof AppBaseEntity>;
  accounting: Omit<Accounting, keyof AppBaseEntity>;
  billing: Omit<Billing, keyof AppBaseEntity>;

  dimensions: Omit<Dimension, keyof AppBaseEntity>[];
  otherCharge: Omit<OtherCharge, keyof AppBaseEntity>[];
  natureOfGoods: Omit<NatureOfGoods, keyof AppBaseEntity>[];
}

export type UpdateMawbPayload = Partial<CreateMawbPayload>;

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

    // Relations
  mawb?: Mawb;

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

// CREATE HAWB PAYLOAD

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


export type CreatePartyPayload = PartyBase;

export type UpdatePartyPayload = Partial<PartyBase>;

export interface TaxInvoiceItem extends AppBaseEntity {
  s_no: number;
  hs_code?: string | null;
  particulars: string;
  quantity?: number | null;
  rate: number;
  amount: number;
}

export interface TaxInvoice extends AppBaseEntity {
  invoice_no: string;
  date: string;
  shipper_id?: number | null;
  consignee_id?: number | null;
  agent_id?: number | null;
    shipper?: Client;
  consignee?: Client;
  agent?: Client;
  mawb_id: number;
  mawb?: Mawb;
  is_usd: boolean;
  sub_total: number;
  discount?: number | null;
  taxable_amount: number;
  vat_rate?: number | null;
  vat_amount?: number | null;
  grandtotal: number;
  in_words: string;
  items: TaxInvoiceItem[];
}

export interface CompanyBank extends AppBaseEntity {
  bankName: string;
  bankAddress: string;
  bankCity: string;
  bankCountry: string;
  bankZipCode?: string;
  bankPhoneNumber?: string;
  bankEmail?: string;
  bankIfscCode?: string;
  bankAccountNumber: string;
  faxNo?: string;
  telex?: string;
  swift?: string;
  bankAccHolderName: string;
  bankBranch: string;
  isUsd?: boolean;
}

export interface Company extends AppBaseEntity {
  name: string;
  alias: string;
  logo?: string;
  poBoxNumber: string;
  phoneNumber?: string;
  address: string;
  city: string;
  country: string;
  officeNumber1?: string;
  officeNumber2?: string;
  officeNumber3?: string;
  email?: string;
  isVat: boolean;
  vatPanNumber: string;
  banks?: CompanyBank[];
}

export type CreateCompanyBankPayload = Omit<CompanyBank, keyof AppBaseEntity>;
export type UpdateCompanyBankPayload = Partial<CreateCompanyBankPayload> & { id?: number };
export type CreateCompanyPayload = Omit<Company, keyof AppBaseEntity | 'banks'> & {
  banks?: CreateCompanyBankPayload[];
};
export type UpdateCompanyPayload = Partial<Omit<CreateCompanyPayload, 'banks'>> & {
  banks?: UpdateCompanyBankPayload[];
};
export interface NoteItem extends AppBaseEntity {
  s_no: number;
  hs_code?: string | null;
  particulars: string;
  quantity?: number | null;
  rate: number;
  amount: number;
}

export interface NoteHawb extends AppBaseEntity {
  hawb_id: number;
  hawb?: Hawb;
}

export interface NoteBase extends AppBaseEntity {
  date: string;
  shipper_id?: number | null;
  consignee_id?: number | null;
  agent_id?: number | null;
    shipper?: Client;
  consignee?: Client;
  agent?: Client;
  mawb_id?: number | null;
  mawb?: Mawb;
  is_usd: boolean;
  grandtotal: number;
  in_words: string;
}

export interface CreditNote extends NoteBase {
  credit_note_no: string;
  items: NoteItem[];
  creditNoteHawbs?: NoteHawb[];
}

export interface DebitNote extends NoteBase {
  debit_note_no: string;
  items: NoteItem[];
  debitNoteHawbs?: NoteHawb[];
}

export type CreateCreditNotePayload = Omit<CreditNote, keyof AppBaseEntity | 'items' | 'shipper' | 'consignee' | 'agent' | 'mawb' | 'creditNoteHawbs'> & {
  items: Omit<NoteItem, keyof AppBaseEntity>[];
  creditNoteHawbs?: { hawb_id: number }[];
};

export type CreateDebitNotePayload = Omit<DebitNote, keyof AppBaseEntity | 'items' | 'shipper' | 'consignee' | 'agent' | 'mawb' | 'debitNoteHawbs'> & {
  items: Omit<NoteItem, keyof AppBaseEntity>[];
  debitNoteHawbs?: { hawb_id: number }[];
};

