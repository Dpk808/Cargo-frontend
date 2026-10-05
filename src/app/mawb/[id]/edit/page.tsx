'use client';

import { useParams } from 'next/navigation';
import MawbForm from '@/src/features/mawb/forms/MawbForm';

export default function EditMawbPage() {
  const params = useParams();
  const mawbId = Number(params.id);

  return <MawbForm mawbId={mawbId} />;
}
