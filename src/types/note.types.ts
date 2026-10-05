import type { AppBaseEntity } from './common';
import type { Client } from './client.types';
import type { Mawb } from './mawb.types';
import type { Hawb } from './hawb.types';

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