'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/src/components/forms/Form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { Select } from '@/src/components/ui/Select';
import {
  companySchema,
  companyDefaults,
  type CompanySchema,
} from '../schemas/company.schemas';
import { useCompany, useUpdateCompany } from '../hooks/useCompany';
import { getDirtyValues } from '@/src/utils/getDirtyValues';

export default function CompanyForm() {
  const { data: company } = useCompany();
  const updateMutation = useUpdateCompany();

  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: companyDefaults,
  });

  // Populate form once company data is loaded
  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        alias: company.alias,
        poBoxNumber: company.poBoxNumber,
        address: company.address,
        city: company.city,
        country: company.country,
        phoneNumber: company.phoneNumber ?? '',
        officeNumber1: company.officeNumber1 ?? '',
        officeNumber2: company.officeNumber2 ?? '',
        officeNumber3: company.officeNumber3 ?? '',
        email: company.email ?? '',
        isVat: company.isVat ?? false,
        vatPanNumber: company.vatPanNumber,
        logo: company.logo ?? '',
      });
    }
  }, [company]);

  const onSubmit = async (values: CompanySchema) => {
    try {
      if (!company?.id) return;
      const dirtyValues = getDirtyValues(values, form.formState.dirtyFields);
      await updateMutation.mutateAsync({ id: company.id, payload: dirtyValues });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong';
      form.setError('root', { message });
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="min-w-0 space-y-4">
      {/* Identity */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="name" label="Company Name" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="alias" label="Alias" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      {/* Address block */}
      <FormField name="address" label="Address" required>
        {(field) => <Input {...field} />}
      </FormField>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormField name="city" label="City" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="country" label="Country" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="poBoxNumber" label="PO Box Number" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      {/* Contact */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="phoneNumber" label="Phone Number">
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="email" label="Email">
          {(field) => <Input type="email" {...field} />}
        </FormField>
      </div>

      {/* Office numbers */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormField name="officeNumber1" label="Office Number 1">
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="officeNumber2" label="Office Number 2">
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="officeNumber3" label="Office Number 3">
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      {/* VAT / PAN */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="isVat" label="VAT Registered">
          {(field) => (
            <Select
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
              value={field.value ? 'yes' : 'no'}
              onChange={(val) => field.onChange(val === 'yes')}
            />
          )}
        </FormField>

        <FormField name="vatPanNumber" label="VAT / PAN Number" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          isLoading={updateMutation.isPending}
        >
          Save Changes
        </Button>
      </div>
    </Form>
  );
}
