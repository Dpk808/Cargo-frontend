'use client';

import HawbTable from '@/src/features/hawb/components/HawbTable';
import { useHawbs, useDeleteHawb } from '@/src/features/hawb/hooks/useHawb';
import { useParams } from 'next/navigation';

export default function HawbListPage() {
  const params = useParams();
  const mawbId = Number(params.id);
  const { data, isLoading } = useHawbs();
  const deleteMutation = useDeleteHawb();

  return (
    <div className="p-4">
      <HawbTable
        data={data?.items.filter((hawb) => hawb.mawb?.id === mawbId) ?? []}
        isLoading={isLoading}
        onDelete={(hawb) => deleteMutation.mutate(hawb.id)}
      />
    </div>
  );
}