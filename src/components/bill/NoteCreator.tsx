'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteForm } from '@/src/components/bill/NoteForm';
import { NoteUI } from '@/src/components/bill/NoteUI';
import { useCreateCreditNote, useCreateDebitNote } from '@/src/hooks/useNotes';
import { useMawbs, useMawb } from '@/src/hooks/useMawbs';
import { useShippers } from '@/src/hooks/useShippers';
import { useConsignees } from '@/src/hooks/useConsignees';
import { useAgents } from '@/src/hooks/useAgents';
import type { Hawb } from '@/src/types/entities';
import Button from '@/src/components/ui/Button';

function toWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if ((num = Math.floor(num)) === 0) return 'Zero';
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += Number(n[1]) != 0 ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
  str += Number(n[2]) != 0 ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
  str += Number(n[3]) != 0 ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
  str += Number(n[4]) != 0 ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
  str += Number(n[5]) != 0 ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
  return str.trim() + ' Only';
}

interface NoteCreatorProps {
  type: 'credit' | 'debit';
}

type PartyType = 'shipper' | 'consignee' | 'agent';

interface SelectedParty {
  type: PartyType;
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
}

export function NoteCreator({ type }: NoteCreatorProps) {
  const router = useRouter();
  const createCreditNote = useCreateCreditNote();
  const createDebitNote = useCreateDebitNote();
  const createMutation = type === 'credit' ? createCreditNote : createDebitNote;

  const { data: mawbs = [] } = useMawbs();
  const { data: shippers = [] } = useShippers();
  const { data: consignees = [] } = useConsignees();
  const { data: agents = [] } = useAgents();

  const [selectedMawbId, setSelectedMawbId] = useState<number | ''>('');
  const { data: mawbDetail } = useMawb(selectedMawbId ? Number(selectedMawbId) : 0);

  const [selectedHawbIds, setSelectedHawbIds] = useState<number[]>([]);
  const [selectedParty, setSelectedParty] = useState<SelectedParty | null>(null);
  const [partyType, setPartyType] = useState<PartyType>('consignee');
  const [selectedPartyId, setSelectedPartyId] = useState<number | ''>('');

  const noteNoField = type === 'credit' ? 'credit_note_no' : 'debit_note_no';
  const defaultNoteNo = `${type === 'credit' ? 'CR' : 'DR'}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`;

  const [noteData, setNoteData] = useState<any>({
    [noteNoField]: defaultNoteNo,
    date: new Date().toISOString().split('T')[0],
    is_usd: false,
    grandtotal: 0,
    in_words: '',
    items: [{ id: Date.now(), s_no: 1, hs_code: null, particulars: '', rate: 0, quantity: 1, amount: 0 }],
  });

  // Rebuild selected party info when party id changes
  useEffect(() => {
    if (!selectedPartyId) {
      setSelectedParty(null);
      return;
    }
    const id = Number(selectedPartyId);
    let party: any = null;
    if (partyType === 'shipper') party = shippers.find((s) => s.id === id);
    else if (partyType === 'consignee') party = consignees.find((c) => c.id === id);
    else if (partyType === 'agent') party = agents.find((a) => a.id === id);
    if (party) {
      setSelectedParty({ type: partyType, id, ...party });
    } else {
      setSelectedParty(null);
    }
  }, [selectedPartyId, partyType, shippers, consignees, agents]);

  // Reset hawb selection when mawb changes
  useEffect(() => {
    setSelectedHawbIds([]);
  }, [selectedMawbId]);

  const hawbs: Hawb[] = mawbDetail?.hawbs || [];

  const handleFormChange = (updatedData: any) => {
    const words = toWords(updatedData.grandtotal);
    setNoteData({ ...updatedData, in_words: words });
  };

  const toggleHawb = (hawbId: number) => {
    setSelectedHawbIds((prev) =>
      prev.includes(hawbId) ? prev.filter((id) => id !== hawbId) : [...prev, hawbId],
    );
  };

  const previewData = {
    ...noteData,
    mawb: mawbDetail || null,
    shipper: selectedParty?.type === 'shipper' ? selectedParty : null,
    consignee: selectedParty?.type === 'consignee' ? selectedParty : null,
    agent: selectedParty?.type === 'agent' ? selectedParty : null,
  };

  const handleSave = async () => {
    try {
      const validItems = noteData.items
        .filter((item: any) => item.particulars.trim() !== '' && Number(item.amount) > 0)
        .map((item: any, index: number) => ({
          s_no: index + 1,
          particulars: item.particulars,
          amount: Number(item.amount || 0),
        }));

      if (validItems.length === 0) {
        alert('Please add at least one valid line item with a positive amount.');
        return;
      }

      if (!selectedParty) {
        alert('Please select a billing party (Shipper, Consignee, or Agent).');
        return;
      }

      const hawbKey = type === 'credit' ? 'creditNoteHawbs' : 'debitNoteHawbs';
      const payload: any = {
        [noteNoField]: noteData[noteNoField],
        date: noteData.date,
        is_usd: noteData.is_usd,
        grandtotal: noteData.grandtotal,
        in_words: noteData.in_words,
        items: validItems,
        ...(selectedParty.type === 'shipper' ? { shipper_id: selectedParty.id } : {}),
        ...(selectedParty.type === 'consignee' ? { consignee_id: selectedParty.id } : {}),
        ...(selectedParty.type === 'agent' ? { agent_id: selectedParty.id } : {}),
        ...(selectedMawbId ? { mawb_id: Number(selectedMawbId) } : {}),
        [hawbKey]: selectedHawbIds.map((id) => ({ hawb_id: id })),
      };

      const created = await createMutation.mutateAsync(payload);
      router.push(`/${type}-note/${(created as any).id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const partyOptions =
    partyType === 'shipper' ? shippers : partyType === 'consignee' ? consignees : agents;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            {type === 'credit' ? '📋 Create Credit Note' : '📋 Create Debit Note'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Issue a {type} note independently or link it to a MAWB with specific HAWBs.
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>← Back</Button>
      </div>

      {/* ─── Billing Party Selection ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 border-b pb-3">
          🎯 Billing Party <span className="text-red-500 text-sm font-normal">* Required</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Party type selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Party Type</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={partyType}
              onChange={(e) => {
                setPartyType(e.target.value as PartyType);
                setSelectedPartyId('');
              }}
            >
              <option value="shipper">Shipper</option>
              <option value="consignee">Consignee</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          {/* Party name selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Select {partyType.charAt(0).toUpperCase() + partyType.slice(1)}
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedPartyId}
              onChange={(e) => setSelectedPartyId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">— Select {partyType} —</option>
              {partyOptions.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        {selectedParty && (
          <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-900 font-medium">
            ✅ <strong>{selectedParty.name}</strong> — {selectedParty.address}, {selectedParty.city}, {selectedParty.country}
          </div>
        )}
      </div>

      {/* ─── MAWB + HAWB Selection (Optional) ────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 border-b pb-3">
          ✈️ MAWB & HAWB <span className="text-gray-400 text-sm font-normal">(Optional)</span>
        </h3>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Link to MAWB</label>
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedMawbId}
            onChange={(e) => setSelectedMawbId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">— None (Independent Note) —</option>
            {mawbs.map((m) => (
              <option key={m.id} value={m.id}>
                {m.airline_prefix}-{m.serial_no}-{m.check_digit}
                {m.shipper ? ` | ${m.shipper.name}` : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedMawbId && hawbs.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Select HAWBs (Multi-Select)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {hawbs.map((hawb) => {
                const isSelected = selectedHawbIds.includes(hawb.id);
                return (
                  <button
                    key={hawb.id}
                    type="button"
                    onClick={() => toggleHawb(hawb.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all text-sm ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">HAWB #{hawb.id}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {hawb.no_of_pieces} pcs · {hawb.gross_weight} {hawb.unit}
                      {hawb.shipper && ` · ${hawb.shipper.name}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedMawbId && hawbs.length === 0 && (
          <p className="text-sm text-gray-400 italic">No HAWBs linked to this MAWB.</p>
        )}
      </div>

      {/* ─── Live Preview ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="sticky top-4 z-10 drop-shadow-2xl">
          <NoteUI type={type} data={previewData} />
        </div>
        <div className="mt-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <NoteForm type={type} data={noteData} onChange={handleFormChange} />
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} isLoading={createMutation.isPending} size="lg">
              💾 Save {type === 'credit' ? 'Credit Note' : 'Debit Note'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
