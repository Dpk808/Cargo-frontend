// hawb-form.utils.ts

import {
    CreateHawbPayload,
    Hawb,
    WeightUnit,
    RateClass,
    DimensionUnit,
    ChargeType,
} from '@/src/types/entities';

// =========================
// HELPERS
// =========================

const toNumber = (value: string) => Number(value || 0);

const toOptionalNumber = (value: string) =>
    value ? Number(value) : undefined;

const toNullableNumber = (value: string) =>
    value ? Number(value) : null;

// =========================
// FORM STATE
// =========================

export interface HawbFormState {
    id?: number;

    mawb_id?: string;

    shipper_id: string;
    consignee_id: string;
    agent_id: string;

    information: string;
    note: string;

    no_of_pieces: string;

    gross_weight: string;
    unit: WeightUnit;

    rate_class: RateClass | '';

    commodity_item_no: string;

    chargable_weight: string;

    rate: string;
    total: string;

    dimension_unit: DimensionUnit;

    account_no: string;

    // AIRPORT
    departure: string;
    destination: string;

    to: string;
    by_first_carrier: string;

    second_to: string;
    second_by: string;

    third_to: string;
    third_by: string;

    flight_date: string;

    // ACCOUNTING
    is_prepaid: boolean;
    is_collect: boolean;

    chgs_code: string;

    wt_val_ppd: boolean;
    wt_val_coll: boolean;

    other_ppd: boolean;
    other_coll: boolean;

    declared_value_carriage: string;
    declared_value_customs: string;
    insurance_amt: string;

    // DIMENSIONS
    dimensions: Array<{
        length: string;
        width: string;
        height: string;
        pieces: string;
    }>;

    // OTHER CHARGES
    other_charges: Array<{
        name: string;
        amount: string;
        type: ChargeType;
    }>;

    // GOODS
    nature_of_goods: Array<{
        title: string;
        detail: string;
    }>;

    // BILLING
    weight_charge: string;
    valuation_charge: string;
    tax: string;

    other_charges_due_agent: string;
    other_charges_due_carrier: string;

    total_charges: string;

    executed_date: string;
    place: string;
}

// =========================
// EMPTY FORM
// =========================

export const EMPTY_HAWB_FORM: HawbFormState = {
    shipper_id: '',
    consignee_id: '',
    agent_id: '',

    information: '',
    note: '',

    no_of_pieces: '',

    gross_weight: '',
    unit: WeightUnit.KG,

    rate_class: '',

    commodity_item_no: '',

    chargable_weight: '',

    rate: '',
    total: '',

    dimension_unit: DimensionUnit.CM,

    account_no: '',

    departure: '',
    destination: '',

    to: '',
    by_first_carrier: '',

    second_to: '',
    second_by: '',

    third_to: '',
    third_by: '',

    flight_date: '',

    is_prepaid: true,
    is_collect: false,

    chgs_code: 'PP',

    wt_val_ppd: true,
    wt_val_coll: false,

    other_ppd: true,
    other_coll: false,

    declared_value_carriage: '',
    declared_value_customs: '',
    insurance_amt: '',

    dimensions: [],

    other_charges: [],

    nature_of_goods: [],

    weight_charge: '',
    valuation_charge: '',
    tax: '',

    other_charges_due_agent: '',
    other_charges_due_carrier: '',

    total_charges: '',

    executed_date: '',
    place: 'KATHMANDU/NEPAL',
};

// =========================
// TO PAYLOAD
// =========================

export function toHawbPayload(
    form: HawbFormState
): CreateHawbPayload {
    return {
        mawb_id: toOptionalNumber(form.mawb_id || ''),

        shipper_id: toOptionalNumber(form.shipper_id),
        consignee_id: toOptionalNumber(form.consignee_id),
        agent_id: toOptionalNumber(form.agent_id),

        information: form.information || null,
        note: form.note || null,

        no_of_pieces: toNumber(form.no_of_pieces),

        gross_weight: toNumber(form.gross_weight),
        unit: form.unit,

        rate_class: form.rate_class as RateClass,

        commodity_item_no: form.commodity_item_no || null,

        chargable_weight: toNumber(form.chargable_weight),

        rate: toNullableNumber(form.rate),
        total: toNullableNumber(form.total),

        dimension_unit: form.dimension_unit,

        account_no: form.account_no || null,

        airport: {
            departure: form.departure,
            destination: form.destination,

            to: form.to,
            by_first_carrier: form.by_first_carrier,

            second_to: form.second_to || null,
            second_by: form.second_by || null,

            third_to: form.third_to || null,
            third_by: form.third_by || null,

            flight_date: form.flight_date || null as any,
        },

        accounting: {
            is_prepaid: form.is_prepaid,
            is_collect: form.is_collect,

            chgs_code: form.chgs_code,

            wt_val_ppd: form.wt_val_ppd,
            wt_val_coll: form.wt_val_coll,

            other_ppd: form.other_ppd,
            other_coll: form.other_coll,

            declared_value_carriage:
                toNullableNumber(form.declared_value_carriage),

            declared_value_customs:
                toNullableNumber(form.declared_value_customs),

            insurance_amt:
                toNullableNumber(form.insurance_amt),
        },

        billing: {
            weight_charge:
                toNullableNumber(form.weight_charge),

            valuation_charge:
                toNullableNumber(form.valuation_charge),

            tax: toNullableNumber(form.tax),

            total_charge_agent:
                toNullableNumber(form.other_charges_due_agent),

            total_charge_carrier:
                toNullableNumber(form.other_charges_due_carrier),

            total:
                toNullableNumber(form.total_charges),

            executed_date: form.executed_date || null as any,
            place: form.place,
        },

        dimensions: form.dimensions.map((d) => ({
            length: toNumber(d.length),
            width: toNumber(d.width),
            height: toNumber(d.height),
        })),

        otherCharge: form.other_charges.map((c) => ({
            name: c.name,
            amount: toNumber(c.amount),
            type: c.type,
        })),

        natureOfGoods: form.nature_of_goods.map((n) => ({
            title: n.title,
            detail: n.detail,
        })),
    };
}

// =========================
// FROM ENTITY
// =========================

export function fromHawb(hawb: Hawb): HawbFormState {
    return {
        id: hawb.id,

        mawb_id: String(hawb.mawb?.id ?? ''),

        shipper_id: String(hawb.shipper?.id ?? ''),
        consignee_id: String(hawb.consignee?.id ?? ''),
        agent_id: String(hawb.agent?.id ?? ''),

        information: hawb.information ?? '',
        note: hawb.note ?? '',

        no_of_pieces: String(hawb.no_of_pieces ?? ''),

        gross_weight: String(hawb.gross_weight ?? ''),
        unit: hawb.unit,

        rate_class: hawb.rate_class,

        commodity_item_no: hawb.commodity_item_no ?? '',

        chargable_weight: String(hawb.chargable_weight ?? ''),

        rate: String(hawb.rate ?? ''),
        total: String(hawb.total ?? ''),

        dimension_unit: hawb.dimension_unit,

        account_no: hawb.account_no ?? '',

        departure: hawb.airport?.departure ?? '',
        destination: hawb.airport?.destination ?? '',

        to: hawb.airport?.to ?? '',
        by_first_carrier:
            hawb.airport?.by_first_carrier ?? '',

        second_to: hawb.airport?.second_to ?? '',
        second_by: hawb.airport?.second_by ?? '',

        third_to: hawb.airport?.third_to ?? '',
        third_by: hawb.airport?.third_by ?? '',

        flight_date:
            typeof hawb.airport?.flight_date === 'string'
                ? hawb.airport.flight_date
                : new Date(hawb.airport?.flight_date)
                    .toISOString()
                    .split('T')[0],

        is_prepaid: hawb.accounting?.is_prepaid ?? true,
        is_collect: hawb.accounting?.is_collect ?? false,

        chgs_code: hawb.accounting?.chgs_code ?? 'PP',

        wt_val_ppd: hawb.accounting?.wt_val_ppd ?? true,
        wt_val_coll: hawb.accounting?.wt_val_coll ?? false,

        other_ppd: hawb.accounting?.other_ppd ?? true,
        other_coll: hawb.accounting?.other_coll ?? false,

        declared_value_carriage: String(
            hawb.accounting?.declared_value_carriage ?? ''
        ),

        declared_value_customs: String(
            hawb.accounting?.declared_value_customs ?? ''
        ),

        insurance_amt: String(
            hawb.accounting?.insurance_amt ?? ''
        ),

        dimensions:
            hawb.dimensions?.map((d) => ({
                length: String(d.length),
                width: String(d.width),
                height: String(d.height),
                pieces: '1',
            })) ?? [],

        other_charges:
            hawb.otherCharge?.map((c) => ({
                name: c.name,
                amount: String(c.amount),
                type: c.type,
            })) ?? [],

        nature_of_goods:
            hawb.natureOfGoods?.map((n) => ({
                title: n.title,
                detail: n.detail,
            })) ?? [],

        weight_charge: String(
            hawb.billing?.weight_charge ?? ''
        ),

        valuation_charge: String(
            hawb.billing?.valuation_charge ?? ''
        ),

        tax: String(hawb.billing?.tax ?? ''),

        other_charges_due_agent: String(
            hawb.billing?.total_charge_agent ?? ''
        ),

        other_charges_due_carrier: String(
            hawb.billing?.total_charge_carrier ?? ''
        ),

        total_charges: String(
            hawb.billing?.total ?? ''
        ),

        executed_date:
            typeof hawb.billing?.executed_date === 'string'
                ? hawb.billing.executed_date
                : new Date(hawb.billing?.executed_date)
                    .toISOString()
                    .split('T')[0],

        place: hawb.billing?.place ?? '',
    };
}