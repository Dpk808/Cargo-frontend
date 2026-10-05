'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import HawbForm, { type HawbFormHandle } from '@/src/features/hawb/forms/HawbForm';

export default function AddHawbPage() {
  const params = useParams();
  const router = useRouter();
  const mawbId = Number(params.id);
  const [formKeys, setFormKeys] = useState([0]);
  const formRefs = useRef<Array<HawbFormHandle | null>>([]);

  const addHawbForm = () => {
    setFormKeys((keys) => [...keys, Math.max(...keys) + 1]);
  };

  const submitAllHawbs = async () => {
    const results = await Promise.all(
      formKeys.map((_, index) => formRefs.current[index]?.submit() ?? Promise.resolve(false)),
    );

    if (results.every(Boolean)) {
      router.push(`/mawb/${mawbId}/hawb`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">
            Add House Air Waybill (HAWB)
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/70">
            Add one or more HAWBs under this master waybill.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={() => router.push(`/mawb/${mawbId}/hawb`)}>
          Back to HAWBs
        </Button>
      </div>

      {formKeys.map((formKey, index) => (
        <Card key={formKey}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              HAWB {index + 1}
            </h2>
            {formKeys.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFormKeys((keys) => keys.filter((key) => key !== formKey))}
              >
                Remove
              </Button>
            )}
          </div>
          <HawbForm
            ref={(form) => {
              formRefs.current[index] = form;
            }}
            mawbId={mawbId}
            onSuccess={() => undefined}
            onAddAnother={index === formKeys.length - 1 ? addHawbForm : undefined}
            showActions={false}
          />
        </Card>
      ))}

      <Button type="button" className="w-full" onClick={submitAllHawbs}>
        Create HAWBs
      </Button>
    </div>
  );
}
