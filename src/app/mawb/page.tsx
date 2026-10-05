// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Button from '@/src/components/ui/Button';
// import SearchBar from '@/src/components/ui/SearchBar';
// import ConfirmModal from '@/src/components/ui/ConfirmModal';
// import MawbTable from '@/src/features/mawb/components/MawbTable';
// import { useMawbs, useDeleteMawb } from '@/src/features/mawb/hooks/useMawb';
// import type { Mawb } from '@/src/types/mawb.types';

// export default function MawbPage() {
//   const router = useRouter();
//   const { data = [], isLoading, table } = useMawbs();
//   const deleteMutation = useDeleteMawb();
//   const [deleteTarget, setDeleteTarget] = useState<Mawb | null>(null);

//   // Filter in-memory if backend returns an array, or pass search to table hook
//   const filteredData = (data as Mawb[]).filter((item) => {
//     if (!table.search) return true;
//     const query = table.search.toLowerCase();
//     const mawbNo = `${item.airline_prefix}-${item.serial_no}-${item.check_digit}`.toLowerCase();
//     const shipper = (item.shipper?.name || '').toLowerCase();
//     const consignee = (item.consignee?.name || '').toLowerCase();
//     return mawbNo.includes(query) || shipper.includes(query) || consignee.includes(query);
//   });

//   return (
//     <>
//       <div className="mb-6 flex items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[var(--color-ink)]">Master Air Waybills (MAWB)</h1>
//           <p className="text-sm text-[var(--color-ink)]/70 mt-1">
//             Manage master airway bills, print documents, and organize house bills
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <SearchBar
//             value={table.search}
//             onChange={table.setSearch}
//             placeholder="Search MAWB #, shipper, consignee..."
//             className="w-72"
//           />
//           <Button onClick={() => router.push('/mawb/add')} size="md">
//             + Add MAWB
//           </Button>
//         </div>
//       </div>

//       <MawbTable
//         data={filteredData}
//         isLoading={isLoading}
//         onDelete={setDeleteTarget}
//       />

//       <ConfirmModal
//         isOpen={Boolean(deleteTarget)}
//         title="Delete MAWB"
//         confirmLabel="Delete MAWB"
//         cancelLabel="Cancel"
//         variant="danger"
//         itemName={
//           deleteTarget
//             ? `${deleteTarget.airline_prefix}-${deleteTarget.serial_no}-${deleteTarget.check_digit}`
//             : undefined
//         }
//         isLoading={deleteMutation.isPending}
//         onConfirm={async () => {
//           if (!deleteTarget) return;
//           await deleteMutation.mutateAsync(deleteTarget.id);
//           setDeleteTarget(null);
//         }}
//         onClose={() => setDeleteTarget(null)}
//       />
//     </>
//   );
// }

'use client';

import Button from '@/src/components/ui/Button';
import SearchBar from '@/src/components/ui/SearchBar';
import { Pagination } from '@/src/components/ui/Pagination';
import MawbTable from '@/src/features/mawb/components/MawbTable';
import { useDeleteMawb, useMawbs } from '@/src/features/mawb/hooks/useMawb';
import ConfirmModal from '@/src/components/ui/ConfirmModal';
import type { Mawb } from '@/src/types/mawb.types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';



export default function MawbPage() {

    const router = useRouter();

    const { data, isLoading, table } = useMawbs();
    const deleteMutation = useDeleteMawb();
    const [deleteTarget, setDeleteTarget] = useState<Mawb | null>(null);


    return (
        <>
            <div className="mb-4 flex items-center justify-between gap-3">


                <SearchBar
                    value={table.search}
                    onChange={table.setSearch}
                    placeholder="Search MAWB...."
                    className="w-72"
                />
                <Button onClick={() => router.push('/mawb/add')} size="md">
                    Add MAWB
                </Button>

            </div>
            <MawbTable
                data={data?.items ?? []}
                isLoading={isLoading}
                onDelete={setDeleteTarget}
            />

            {data && data.meta.totalPages > 1 && (
                <Pagination
                    totalPages={data.meta.totalPages}
                    currentPage={table.page}
                    onChange={table.setPage}
                />
            )}

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete MAWB"
                confirmLabel="Delete MAWB"
                cancelLabel="Cancel"
                variant="danger"
                itemName={
                    deleteTarget
                        ? `${deleteTarget.airline_prefix}-${deleteTarget.serial_no}-${deleteTarget.check_digit}`
                        : undefined
                }
                isLoading={deleteMutation.isPending}
                onConfirm={async () => {
                    if (!deleteTarget) return;
                    await deleteMutation.mutateAsync(deleteTarget.id);
                    setDeleteTarget(null);
                }}
                onClose={() => setDeleteTarget(null)}
            />
        </>
    );

}