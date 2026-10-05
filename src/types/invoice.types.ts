import type { AppBaseEntity } from './common';
import type { Client } from './client.types';
import type { Mawb } from './mawb.types';

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