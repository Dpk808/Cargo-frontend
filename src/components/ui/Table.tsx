import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { TableColumn } from '@/src/types/api';

interface TableProps<T extends { id: number }> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggleActive?: (row: T) => void;
}

export default function Table<T extends { id: number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No records found.',
  onEdit,
  onDelete,
  onToggleActive,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--color-mist)] bg-[var(--color-canvas)] p-6 text-sm text-[var(--color-ink)]/70">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-mist)] border-t-[var(--color-ocean)]"></div>
          Loading data...
        </div>
      </div>
    );
  }

  const showActions = onEdit || onDelete || onToggleActive;

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-mist)] bg-white shadow-sm">
      <div className="max-h-[62vh] overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-[var(--color-canvas)] text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-3 ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
              {showActions && (
                <th className="px-4 py-3">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-mist)]/50">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-[var(--color-ink)]/60"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {data.map((row, rowIndex) => {
              const isActive = (row as T & { isActive?: boolean }).isActive ?? true;

              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isActive
                      ? 'hover:bg-[var(--color-canvas)]/50'
                      : 'bg-gray-50 opacity-50 grayscale'
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${column.key}-${rowIndex}`}
                      className={`px-4 py-3 align-top text-[var(--color-ink)] ${column.className ?? ''}`}
                    >
                      {column.render(row, rowIndex)}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-3 align-top">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="rounded p-1 text-[var(--color-ink)]/60 hover:bg-[var(--color-mist)] hover:text-[var(--color-ink)]"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        {onToggleActive && (
                          <button
                            onClick={() => onToggleActive(row)}
                            className="rounded p-1 transition-colors"
                          >
                            {isActive ? (
                              <ToggleRight size={16} className="text-green-500 hover:text-green-600" />
                            ) : (
                              <ToggleLeft size={16} className="text-red-400 hover:text-red-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}