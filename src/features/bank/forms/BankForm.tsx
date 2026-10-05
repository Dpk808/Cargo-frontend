"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/src/components/forms/Form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { getDirtyValues } from '@/src/utils/getDirtyValues';
import { bankSchema, bankDefaults, type BankSchema } from '../schemas/bank.schemas';
import { useCreateBank, useBankById, useUpdateBank } from '../hooks/useBank';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BankForm({ bankId }: { bankId?: number }) {
  const router = useRouter();
  const createMutation = useCreateBank();
  const updateMutation = useUpdateBank();
  const { data: bank } = useBankById(bankId);

  const form = useForm<BankSchema>({
    resolver: zodResolver(bankSchema),
    defaultValues: bankDefaults,
  });

  useEffect(() => {
    if (bank) {
      form.reset({
        bankName: bank.bankName,
        bankAddress: bank.bankAddress,
        bankCity: bank.bankCity,
        bankCountry: bank.bankCountry,
        bankZipCode: bank.bankZipCode ?? '',
        bankPhoneNumber: bank.bankPhoneNumber ?? '',
        bankEmail: bank.bankEmail ?? '',
        bankIfscCode: bank.bankIfscCode ?? '',
        bankAccountNumber: bank.bankAccountNumber,
        faxNo: bank.faxNo ?? '',
        telex: bank.telex ?? '',
        swift: bank.swift ?? '',
        bankAccHolderName: bank.bankAccHolderName,
        bankBranch: bank.bankBranch,
        isUsd: bank.isUsd ?? false,
      });
    }
  }, [bank]);

  const onSubmit = async (values: BankSchema) => {
    try {
      if (bankId) {
        const dirtyValues = getDirtyValues(values, form.formState.dirtyFields);
        await updateMutation.mutateAsync({ id: bankId, payload: dirtyValues });
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push('/bank');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong';
      form.setError('root', { message });
    }
  };

  return (
    <Card>
    <Form form={form} onSubmit={onSubmit} className="min-w-0 space-y-4">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="bankName" label="Bank Name" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="bankAccountNumber" label="Account Number" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="bankAccHolderName" label="Account Holder" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="bankBranch" label="Branch" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      <FormField name="bankAddress" label="Address" required>
        {(field) => <Input {...field} />}
      </FormField>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="bankCity" label="City" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="bankCountry" label="Country" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="bankPhoneNumber" label="Phone Number">
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="bankEmail" label="Email">
          {(field) => <Input type="email" {...field} />}
        </FormField>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField name="swift" label="SWIFT">
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="bankIfscCode" label="IFSC">
          {(field) => <Input {...field} />}
        </FormField>
      </div>

            <div className="flex items-center gap-4">
        <FormField name="isUsd" label="Currency Type">
          {(field) => (
            <Select
              options={[{ label: 'NPR', value: 'NPR' }, { label: 'USD', value: 'USD' }]}
              value={field.value ? 'USD' : 'NPR'}
              onChange={(val) => field.onChange(val === 'USD')}
            />
          )}
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.push('/bank')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
          {bankId ? 'Update Bank' : 'Create Bank'}
        </Button>
      </div>
    </Form>
    </Card>
  );
}
