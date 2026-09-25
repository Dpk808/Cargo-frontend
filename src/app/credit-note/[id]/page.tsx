'use client';

import { useParams, useRouter } from 'next/navigation';
import { NoteUI } from '@/src/components/bill/NoteUI';
import { useCreditNote } from '@/src/hooks/useNotes';
import Button from '@/src/components/ui/Button';

export default function CreditNoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data, isLoading, isError } = useCreditNote(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-ocean)] mx-auto"></div>
          <p className="text-sm font-bold text-gray-500">Loading Credit Note...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Credit Note not found.</p>
          <Button onClick={() => router.push('/credit-note')}>← Back to List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-black text-gray-800">Credit Note — {data.credit_note_no}</h1>
        <Button variant="ghost" onClick={() => router.push('/credit-note')}>← Back</Button>
      </div>
      <NoteUI type="credit" data={data} />
    </div>
  );
}
