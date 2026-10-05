'use client';

import MawbForm from '@/src/features/mawb/forms/MawbForm';
import { useSearchParams } from 'next/navigation';

export default function AddMawbPage() {
  const searchParams = useSearchParams();

  const airlinePrefix = searchParams.get('airline_prefix') ?? '';
  const serialNo = searchParams.get('serial_no') ?? '';

  return (
    <MawbForm
      initialValues={{
        airline_prefix: airlinePrefix,
        serial_no: serialNo,
      }}
    />
  );
}