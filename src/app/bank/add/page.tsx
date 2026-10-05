// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Card from '@/src/components/ui/Card';
// import BankForm from '@/src/components/pages/BankForm';
// import { useCreateBank } from '@/src/hooks/useBank';
// import type { BankFormState } from '@/src/utils/bank-form';
// import { EMPTY_BANK_FORM } from '@/src/utils/bank-form';

// export default function AddBankPage() {
//   const router = useRouter();
//   const createMutation = useCreateBank();
//   const [form, setForm] = useState<BankFormState>(EMPTY_BANK_FORM);

//   const handleChange = (key: keyof BankFormState, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const payload = {
//       bankName: form.bankName?.trim() || '',
//       bankAddress: form.bankAddress?.trim() || '',
//       bankCity: form.bankCity?.trim() || '',
//       bankCountry: form.bankCountry?.trim() || '',
//       bankZipCode: form.bankZipCode?.trim() || undefined,
//       bankPhoneNumber: form.bankPhoneNumber?.trim() || undefined,
//       bankEmail: form.bankEmail?.trim() || undefined,
//       bankIfscCode: form.bankIfscCode?.trim() || undefined,
//       bankAccountNumber: form.bankAccountNumber?.trim() || '',
//       faxNo: form.faxNo?.trim() || undefined,
//       telex: form.telex?.trim() || undefined,
//       swift: form.swift?.trim() || undefined,
//       bankAccHolderName: form.bankAccHolderName?.trim() || '',
//       bankBranch: form.bankBranch?.trim() || '',
//       isUsd: !!form.isUsd,
//     };
//     await createMutation.mutateAsync(payload as any);
//     router.push('/bank');
//   };

//   return (
//     <div className="space-y-6 max-w-5xl mx-auto pb-12">
//       <div>
//         <h1 className="text-2xl font-bold text-[var(--color-ink)]">🏦 Add New Bank</h1>
//         <p className="mt-2 text-[var(--color-ink)]/70">Create a new bank account with its details and branch information</p>
//       </div>
      
//       <Card>
//         <BankForm
//           form={form}
//           onChange={handleChange}
//           onSubmit={handleSubmit}
//           onCancel={() => router.push('/bank')}
//           submitLabel="Create Bank"
//           isSubmitting={createMutation.isPending}
//         />
//       </Card>
//     </div>
//   );
// }


import BankForm from '@/src/features/bank/forms/BankForm';



export default function AddBankPage() {
  return (
        <BankForm />

  );
}