'use client';

import { useEffect, useState } from 'react';
import Card from '@/src/components/ui/Card';
import CompanyForm from '@/src/components/pages/CompanyForm';
import { useCompany, useCreateCompany, useUpdateCompany } from '@/src/hooks/useCompany';
import { EMPTY_COMPANY_FORM, type CompanyFormState } from '@/src/utils/company-form';

export default function CompanyPage() {
  const { data: company, isLoading: isLoadingData } = useCompany();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  
  const [form, setForm] = useState<CompanyFormState>(EMPTY_COMPANY_FORM);

    useEffect(() => {
  if (!company) return;

  setForm((prev) => {
    if (prev.name && prev.alias) return prev;

    return {
      ...company,
    } as CompanyFormState;
  });
}, [company]);


  const handleChange = (key: keyof CompanyFormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clean empty strings for optional fields so class-validator doesn't complain about invalid formats (like empty email)
    const cleanedPayload = {
      ...form,
      email: form.email || undefined,
      phoneNumber: form.phoneNumber || undefined,
      officeNumber1: form.officeNumber1 || undefined,
      officeNumber2: form.officeNumber2 || undefined,
      officeNumber3: form.officeNumber3 || undefined,
      logo: form.logo || undefined,
    };

    if (company?.id) {
      await updateMutation.mutateAsync({ id: company.id, payload: cleanedPayload as any });
      alert('Company details updated successfully!');
    } else {
      await createMutation.mutateAsync(cleanedPayload as any);
      alert('Company details created successfully!');
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-ocean)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">🏢 Company Profile</h1>
        <p className="mt-2 text-[var(--color-ink)]/70">
          Manage your organization's core details and tax information.
        </p>
      </div>
      
      <Card>
        <CompanyForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel={company?.id ? "Update Profile" : "Initialize Profile"}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Card>
    </div>
  );
}
