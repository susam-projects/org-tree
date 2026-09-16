import { useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import * as S from '@/orgTable/components/OrgTable/OrgTable.style';
import { OrgTableBodyRow } from '@/orgTable/components/OrgTableBodyRow/OrgTableBodyRow';
import type { OrgTableColumn, OrgTableRow, OrgTableSort } from '@/orgTable/types/types';
import { useDebouncedValue } from '@/orgTable/hooks/useDebouncedValue';
import { filterRows } from '@/orgTable/utils/filterRows';
import { nextSort } from '@/orgTable/utils/nextSort';
import { sortRows } from '@/orgTable/utils/sortRows';

const FILTER_DEBOUNCE_MS = 250;

const columns: { key: OrgTableColumn; title: string; numeric: boolean }[] = [
  { key: 'name', title: 'Подразделение', numeric: false },
  { key: 'depth', title: 'Уровень', numeric: false },
  { key: 'headcount', title: 'Всего сотрудников', numeric: true },
  { key: 'budget', title: 'Бюджет суммарный', numeric: true },
  { key: 'performance', title: 'Средняя эффективность', numeric: true },
];

const ariaSort = {
  asc: 'ascending',
  desc: 'descending',
} as const;

interface OrgTableProps {
  rows: OrgTableRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OrgTable({ rows, selectedId, onSelect }: OrgTableProps) {
  const filterId = useId();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<OrgTableSort | null>(null);
  const debouncedFilter = useDebouncedValue(filter, FILTER_DEBOUNCE_MS);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);

  const visibleRows = useMemo(
    () => sortRows(filterRows(rows, debouncedFilter), sort),
    [rows, debouncedFilter, sort],
  );

  const clampedFocusedIndex =
    visibleRows.length === 0 ? -1 : Math.min(focusedIndex, visibleRows.length - 1);

  function toggleSort(column: OrgTableColumn) {
    setSort((previous) => nextSort(previous, column));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableSectionElement>) {
    if (visibleRows.length === 0) return;

    let nextIndex: number;
    switch (event.key) {
      case 'ArrowDown':
        nextIndex = Math.min(clampedFocusedIndex + 1, visibleRows.length - 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(clampedFocusedIndex - 1, 0);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = visibleRows.length - 1;
        break;
      case 'Enter': {
        const row = visibleRows[clampedFocusedIndex];
        if (row) onSelect(row.id);
        return;
      }
      default:
        return;
    }

    event.preventDefault();
    setFocusedIndex(nextIndex);
    rowRefs.current[nextIndex]?.focus();
  }

  return (
    <>
      <S.FilterRow>
        <S.FilterLabel htmlFor={filterId}>Фильтр по названию</S.FilterLabel>
        <S.FilterInput
          id={filterId}
          type="search"
          value={filter}
          placeholder="Например, Платформа"
          onChange={(event) => setFilter(event.target.value)}
        />
      </S.FilterRow>

      <S.TableScroll>
        <S.Table>
          <thead>
            <tr>
              {columns.map((column) => (
                <S.HeadCell
                  key={column.key}
                  scope="col"
                  $numeric={column.numeric}
                  aria-sort={sort?.column === column.key ? ariaSort[sort.direction] : 'none'}
                >
                  <S.SortButton
                    type="button"
                    $numeric={column.numeric}
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.title}
                    <S.SortMarker aria-hidden="true">
                      {sort?.column === column.key ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
                    </S.SortMarker>
                  </S.SortButton>
                </S.HeadCell>
              ))}
            </tr>
          </thead>
          <tbody onKeyDown={handleKeyDown}>
            {visibleRows.map((row, index) => (
              <OrgTableBodyRow
                key={row.id}
                row={row}
                selected={row.id === selectedId}
                tabIndex={index === clampedFocusedIndex ? 0 : -1}
                rowRef={(element) => {
                  rowRefs.current[index] = element;
                }}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </S.Table>
      </S.TableScroll>

      {visibleRows.length === 0 && <S.EmptyMessage>Ничего не найдено</S.EmptyMessage>}
    </>
  );
}
