// mawb-form.utils.ts

import {
    CreateMawbPayload,
    Mawb,
    WeightUnit,
    RateClass,
    DimensionUnit,
    ChargeType,
} from '@/src/types/entities';

import {
    HawbFormState,
    toHawbPayload,
    fromHawb,
    EMPTY_HAWB_FORM,
} from './hawb-form.utils';

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

export interface MawbFormState {
    id?: number;

    airline_prefix: string;
    serial_no: string;
    check_digit: string;

    city_name: string;

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

    reference_number: string;

    currency: string;
    chgs_code: string;

    wt_val_ppd: boolean;
    wt_val_coll: boolean;

    other_ppd: boolean;
    other_coll: boolean;

    declared_value_carriage: string;
    declared_value_customs: string;
    insurance_amt: string;

    // DIMENSIONS
    dimension_unit: DimensionUnit;
    volumetric_factor: string;

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

    signature: string;
    signature_prefix: boolean;

    // EXTRA
    optional_shipping_info: string;

    // HAWBS
    hawbs: HawbFormState[];
}

// =========================
// EMPTY FORM
// =========================

export const EMPTY_MAWB_FORM: MawbFormState = {
    airline_prefix: '',
    serial_no: '',
    check_digit: '',

    city_name: '',

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

    reference_number: '',

    currency: 'NPR',
    chgs_code: 'PP',

    wt_val_ppd: true,
    wt_val_coll: false,

    other_ppd: true,
    other_coll: false,

    declared_value_carriage: '',
    declared_value_customs: '',
    insurance_amt: '',

    dimension_unit: DimensionUnit.CM,
    volumetric_factor: '6000',

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

    signature: '',
    signature_prefix: false,

    optional_shipping_info: '',

    hawbs: [],
};

// =========================
// TO PAYLOAD
// =========================

export function toMawbPayload(
    form: MawbFormState
): CreateMawbPayload {
    return {
        airline_prefix: form.airline_prefix,
        serial_no: form.serial_no,
        check_digit: form.check_digit,

        city_name: form.city_name || null,

        information: form.information || null,
        note: form.note || null,

        no_of_pieces: toNumber(form.no_of_pieces),

        gross_weight: toNumber(form.gross_weight),
        unit: form.unit,

        rate_class: form.rate_class as RateClass,

        commodity_item_no: form.commodity_item_no || null,

        chargable_weight: toNumber(form.chargable_weight),

        rate: toNullableNumber(form.rate) ?? 0,
        total: toNullableNumber(form.total) ?? 0,

        dimension_unit: form.dimension_unit,

        account_no: form.account_no || null,

        shipper_id: toOptionalNumber(form.shipper_id),
        consignee_id: toOptionalNumber(form.consignee_id),
        agent_id: toOptionalNumber(form.agent_id),

        hawbs: form.hawbs.map(toHawbPayload),

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

            reference_number: form.reference_number || null,

            currency: form.currency,
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
            weight_charge: toNumber(form.weight_charge),

            valuation_charge:
                toNullableNumber(form.valuation_charge),

            tax: toNullableNumber(form.tax),

            total_charge_agent:
                toNullableNumber(form.other_charges_due_agent),

            total_charge_carrier:
                toNullableNumber(form.other_charges_due_carrier),

            total: toNumber(form.total_charges),

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

export function fromMawb(mawb: Mawb): MawbFormState {
    return {
        id: mawb.id,

        airline_prefix: mawb.airline_prefix,
        serial_no: mawb.serial_no,
        check_digit: mawb.check_digit,

        city_name: mawb.city_name ?? '',

        shipper_id: String(mawb.shipper?.id ?? ''),
        consignee_id: String(mawb.consignee?.id ?? ''),
        agent_id: String(mawb.agent?.id ?? ''),

        information: mawb.information ?? '',
        note: mawb.note ?? '',

        no_of_pieces: String(mawb.no_of_pieces ?? ''),

        gross_weight: String(mawb.gross_weight ?? ''),
        unit: mawb.unit,

        rate_class: mawb.rate_class,

        commodity_item_no: mawb.commodity_item_no ?? '',

        chargable_weight: String(mawb.chargable_weight ?? ''),

        rate: String(mawb.rate ?? ''),
        total: String(mawb.total ?? ''),

        account_no: mawb.account_no ?? '',

        departure: mawb.airport?.departure ?? '',
        destination: mawb.airport?.destination ?? '',

        to: mawb.airport?.to ?? '',
        by_first_carrier:
            mawb.airport?.by_first_carrier ?? '',

        second_to: mawb.airport?.second_to ?? '',
        second_by: mawb.airport?.second_by ?? '',

        third_to: mawb.airport?.third_to ?? '',
        third_by: mawb.airport?.third_by ?? '',

        flight_date:
            typeof mawb.airport?.flight_date === 'string'
                ? mawb.airport.flight_date
                : new Date(mawb.airport?.flight_date)
                    .toISOString()
                    .split('T')[0],

        is_prepaid: mawb.accounting?.is_prepaid ?? true,
        is_collect: mawb.accounting?.is_collect ?? false,

        reference_number:
            mawb.accounting?.reference_number ?? '',

        currency: mawb.accounting?.currency ?? 'NPR',
        chgs_code: mawb.accounting?.chgs_code ?? 'PP',

        wt_val_ppd: mawb.accounting?.wt_val_ppd ?? true,
        wt_val_coll: mawb.accounting?.wt_val_coll ?? false,

        other_ppd: mawb.accounting?.other_ppd ?? true,
        other_coll: mawb.accounting?.other_coll ?? false,

        declared_value_carriage: String(
            mawb.accounting?.declared_value_carriage ?? ''
        ),

        declared_value_customs: String(
            mawb.accounting?.declared_value_customs ?? ''
        ),

        insurance_amt: String(
            mawb.accounting?.insurance_amt ?? ''
        ),

        dimension_unit: mawb.dimension_unit ?? DimensionUnit.CM,

        volumetric_factor:
            mawb.dimension_unit === 'IN' ? '166' : '6000',

        dimensions:
            mawb.dimensions?.map((d) => ({
                length: String(d.length),
                width: String(d.width),
                height: String(d.height),
                pieces: '1',
            })) ?? [],

        other_charges:
            mawb.otherCharge?.map((c) => ({
                name: c.name,
                amount: String(c.amount),
                type: c.type,
            })) ?? [],

        nature_of_goods:
            mawb.natureOfGoods?.map((n) => ({
                title: n.title,
                detail: n.detail,
            })) ?? [],

        weight_charge: String(
            mawb.billing?.weight_charge ?? ''
        ),

        valuation_charge: String(
            mawb.billing?.valuation_charge ?? ''
        ),

        tax: String(mawb.billing?.tax ?? ''),

        other_charges_due_agent: String(
            mawb.billing?.total_charge_agent ?? ''
        ),

        other_charges_due_carrier: String(
            mawb.billing?.total_charge_carrier ?? ''
        ),

        total_charges: String(mawb.billing?.total ?? ''),

        executed_date:
            typeof mawb.billing?.executed_date === 'string'
                ? mawb.billing.executed_date
                : new Date(mawb.billing?.executed_date)
                    .toISOString()
                    .split('T')[0],

        place: mawb.billing?.place ?? '',

        signature: '',
        signature_prefix: false,

        optional_shipping_info: '',

        hawbs: mawb.hawbs?.map(fromHawb) ?? [],
    };
}