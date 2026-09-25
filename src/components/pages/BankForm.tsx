import type { FormEvent } from 'react';
import Button from '@/src/components/ui/Button';
import InputBox from '@/src/components/ui/InputBox';
import FormSection from '@/src/components/ui/FormSection';
import SelectField from '@/src/components/ui/SelectField';
import type { BankFormState } from '@/src/utils/bank-form';

interface BankFormProps {
  form: BankFormState;
  onChange: (key: keyof BankFormState, value: any) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export default function BankForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false,
}: BankFormProps) {
  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <FormSection title="🏦 Bank Details" columns={2}>
        <SelectField
          label="Currency Type"
          value={form.isUsd ? 'usd' : 'npr'}
          onChange={(e) => onChange('isUsd', e.target.value === 'usd')}
          options={[
            { label: 'NPR', value: 'npr' },
            { label: 'USD', value: 'usd' },
          ]}
        />
        <div />

        <InputBox
          label="Bank Name"
          value={form.bankName || ''}
          onChange={(e) => onChange('bankName', e.target.value)}
          required
        />
        <InputBox
          label="Bank Address"
          value={form.bankAddress || ''}
          onChange={(e) => onChange('bankAddress', e.target.value)}
          required
        />
        <InputBox
          label="Account Holder Name"
          value={form.bankAccHolderName || ''}
          onChange={(e) => onChange('bankAccHolderName', e.target.value)}
          required
        />
        <InputBox
          label="Account Number"
          value={form.bankAccountNumber || ''}
          onChange={(e) => onChange('bankAccountNumber', e.target.value)}
          required
        />
        <InputBox
          label="Branch"
          value={form.bankBranch || ''}
          onChange={(e) => onChange('bankBranch', e.target.value)}
          required
        />
        <InputBox
          label="Bank City"
          value={form.bankCity || ''}
          onChange={(e) => onChange('bankCity', e.target.value)}
          required
        />
        <InputBox
          label="Bank Country"
          value={form.bankCountry || ''}
          onChange={(e) => onChange('bankCountry', e.target.value)}
          required
        />
        <InputBox
          label="Bank Zip Code"
          value={form.bankZipCode || ''}
          onChange={(e) => onChange('bankZipCode', e.target.value)}
        />
        <InputBox
          label="Bank Phone Number"
          value={form.bankPhoneNumber || ''}
          onChange={(e) => onChange('bankPhoneNumber', e.target.value)}
        />
        <InputBox
          label="Bank Email"
          type="email"
          value={form.bankEmail || ''}
          onChange={(e) => onChange('bankEmail', e.target.value)}
        />
        <InputBox
          label={form.isUsd ? 'Swift Code' : 'IFSC Code'}
          value={form.isUsd ? form.swift || '' : form.bankIfscCode || ''}
          onChange={(e) => onChange(form.isUsd ? 'swift' : 'bankIfscCode', e.target.value)}
        />
        <InputBox
          label="Fax Number"
          value={form.faxNo || ''}
          onChange={(e) => onChange('faxNo', e.target.value)}
        />
        <InputBox
          label="Telex"
          value={form.telex || ''}
          onChange={(e) => onChange('telex', e.target.value)}
        />
      </FormSection>

      <div className="flex justify-end gap-3 pt-6 border-t border-[var(--color-mist)]/50">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} size="lg" className="px-12">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
