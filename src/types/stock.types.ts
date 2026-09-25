import type { AppBaseEntity } from './common';
import type { AgentEntity, AirlineEntity } from './party.types';

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
  heldByAgent?: AgentEntity | null;
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
  agent_id: number;
  remarks?: string;
}