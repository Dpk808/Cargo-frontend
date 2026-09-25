'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/src/components/ui/Card';
import BankForm from '@/src/components/pages/BankForm';
import { useBanks, useUpdateBank } from '@/src/hooks/useBank';
import type { BankFormState } from '@/src/utils/bank-form';
import { EMPTY_BANK_FORM } from '@/src/utils/bank-form';

export default function EditBankPage() {
  const router = useRouter();
  const params = useParams();
  const bankId = Number(params.id);

  const { data: banks, isLoading } = useBanks();
  const updateMutation = useUpdateBank();
  
  const [form, setForm] = useState<BankFormState>(EMPTY_BANK_FORM);

  useEffect(() => {
    if (banks) {
      const bank = banks.find((b) => b.id === bankId);
      if (bank) {
        setForm(bank as unknown as BankFormState);
      }
    }
  }, [banks, bankId]);

  const handleChange = (key: keyof BankFormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      bankName: form.bankName?.trim() || '',
      bankAddress: form.bankAddress?.trim() || '',
      bankCity: form.bankCity?.trim() || '',
      bankCountry: form.bankCountry?.trim() || '',
      bankZipCode: form.bankZipCode?.trim() || undefined,
      bankPhoneNumber: form.bankPhoneNumber?.trim() || undefined,
      bankEmail: form.bankEmail?.trim() || undefined,
      bankIfscCode: form.bankIfscCode?.trim() || undefined,
      bankAccountNumber: form.bankAccountNumber?.trim() || '',
      faxNo: form.faxNo?.trim() || undefined,
      telex: form.telex?.trim() || undefined,
      swift: form.swift?.trim() || undefined,
      bankAccHolderName: form.bankAccHolderName?.trim() || '',
      bankBranch: form.bankBranch?.trim() || '',
      isUsd: !!form.isUsd,
    };
    await updateMutation.mutateAsync({ id: bankId, payload: payload as any });
    router.push('/bank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-ocean)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">🏦 Edit Bank</h1>
        <p className="mt-2 text-[var(--color-ink)]/70">Update bank details and branch information</p>
      </div>
      
      <Card>
        <BankForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/bank')}
          submitLabel="Update Bank"
          isSubmitting={updateMutation.isPending}
        />
      </Card>
    </div>
  );
}
