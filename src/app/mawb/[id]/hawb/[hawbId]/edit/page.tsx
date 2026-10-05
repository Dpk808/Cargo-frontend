'use client';

import { useParams } from 'next/navigation';
import HawbForm from '@/src/features/hawb/forms/HawbForm';

export default function EditHawbPage() {
  const params = useParams();
  const mawbId = Number(params.id);
  const hawbId = Number(params.hawbId);

  return <HawbForm mawbId={mawbId} hawbId={hawbId} />;
}
