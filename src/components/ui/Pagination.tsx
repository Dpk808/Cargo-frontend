import type { ReactNode } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  totalPages,
  currentPage,
  onChange,
  siblingCount = 1,
}: PaginationProps) {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const getPages = (): (number | string)[] => {
    if (totalPages <= 1) return [1];

    const left = Math.max(2, currentPage - siblingCount);
    const right = Math.min(totalPages - 1, currentPage + siblingCount);

    const pages: (number | string)[] = [];

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    pages.push(...range(left, right));

    if (right < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  const btn = (
    content: ReactNode,
    onClick: () => void,
    disabled = false,
    active = false,
    key: string,
  ) => (
    <button
      key={key}
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 30,
        height: 30,
        padding: '0 4px',
        border: 'none',
        borderRadius: 6,
        background: active ? '#3b9eff' : 'transparent',
        color: active ? '#fff' : disabled ? '#bbb' : '#333',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </button>
  );

  return (
    <div
      style={{
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        userSelect: 'none',
      }}
    >
      {btn('«', () => onChange(1), currentPage === 1, false, 'first')}

      {btn(
        '‹',
        () => onChange(currentPage - 1),
        currentPage === 1,
        false,
        'prev',
      )}

      {pages.map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            style={{
              padding: '0 4px',
              color: '#aaa',
              fontSize: 14,
            }}
          >
            …
          </span>
        ) : (
          btn(
            page,
            () => onChange(page),
            false,
            page === currentPage,
            `page-${page}`,
          )
        ),
      )}

      {btn(
        '›',
        () => onChange(currentPage + 1),
        currentPage === totalPages,
        false,
        'next',
      )}

      {btn(
        '»',
        () => onChange(totalPages),
        currentPage === totalPages,
        false,
        'last',
      )}
    </div>
  );
}