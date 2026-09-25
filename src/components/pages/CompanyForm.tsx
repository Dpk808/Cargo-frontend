import type { FormEvent } from 'react';
import Button from '@/src/components/ui/Button';
import InputBox from '@/src/components/ui/InputBox';
import FormSection from '@/src/components/ui/FormSection';
import SelectField from '@/src/components/ui/SelectField';
import { type CompanyFormState } from '@/src/utils/company-form';


interface CompanyFormProps {
  form: CompanyFormState;
  onChange: (key: keyof CompanyFormState, value: any) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export default function CompanyForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: CompanyFormProps) {
  return (

    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <FormSection title="🏢 Basic Information" columns={2}>
            <InputBox
              label="Company Name"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
            />
            <InputBox
              label="Alias"
              value={form.alias}
              onChange={(e) => onChange('alias', e.target.value)}
              required
            />
             <InputBox
              label="Company Logo URL"
              value={form.logo || ''}
              onChange={(e) => onChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <InputBox
              label="PO Box Number"
              value={form.poBoxNumber}
              onChange={(e) => onChange('poBoxNumber', e.target.value)}
              required
            />
            <InputBox
              label="Email"
              type="email"
              value={form.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
            />
            <SelectField
              label="Is VAT Registered?"
              value={form.isVat ? 'true' : 'false'}
              onChange={(e) => onChange('isVat', e.target.value === 'true')}
              options={[
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
            />
            <InputBox
              label="VAT / PAN Number"
              value={form.vatPanNumber}
              onChange={(e) => onChange('vatPanNumber', e.target.value)}
              required
            />
          </FormSection>
        </div>

        {form.logo && (
          <div className="w-full lg:w-48 flex flex-col items-center gap-4">
            <span className="text-sm font-semibold text-[var(--color-ink)] self-start lg:self-center">Logo Preview</span>
            <div className="w-32 h-32 rounded-xl border border-[var(--color-mist)] bg-white flex items-center justify-center overflow-hidden shadow-sm">
                <img 
                  src={form.logo} 
                  alt="Company Logo" 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=Invalid+URL')}
                />
            </div>
          </div>
        )}
      </div>

      <FormSection title="📍 Location & Address" columns={2}>
        <InputBox
          label="City"
          value={form.city}
          onChange={(e) => onChange('city', e.target.value)}
          required
        />
        <InputBox
          label="Country"
          value={form.country}
          onChange={(e) => onChange('country', e.target.value)}
          required
        />
        <div className="col-span-2">
            <InputBox
            label="Full Address"
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            required
            />
        </div>
      </FormSection>

      <FormSection title="📞 Contact Numbers" columns={2}>
        <InputBox
          label="Phone Number"
          value={form.phoneNumber || ''}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
        />
        <InputBox
          label="Office Number 1"
          value={form.officeNumber1 || ''}
          onChange={(e) => onChange('officeNumber1', e.target.value)}
        />
        <InputBox
          label="Office Number 2"
          value={form.officeNumber2 || ''}
          onChange={(e) => onChange('officeNumber2', e.target.value)}
        />
        <InputBox
          label="Office Number 3"
          value={form.officeNumber3 || ''}
          onChange={(e) => onChange('officeNumber3', e.target.value)}
        />
      </FormSection>



      <div className="flex justify-end gap-3 pt-6 border-t border-[var(--color-mist)]/50">
        <Button type="submit" isLoading={isSubmitting} size="lg" className="px-12">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
