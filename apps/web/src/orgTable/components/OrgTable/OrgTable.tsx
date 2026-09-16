import { useId, useMemo, useState } from 'react';
import * as S from '@/orgTable/components/OrgTable/OrgTable.style';
import type { OrgTableColumn, OrgTableRow, OrgTableSort } from '@/orgTable/types/types';
import { useDebouncedValue } from '@/orgTable/hooks/useDebouncedValue';
import { filterRows } from '@/orgTable/utils/filterRows';
import { nextSort } from '@/orgTable/utils/nextSort';
import { sortRows } from '@/orgTable/utils/sortRows';
import {
  formatBudget,
  formatHeadcount,
  formatPerformance,
  getLevelLabel,
} from '@/orgTable/utils/format';

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

  const visibleRows = useMemo(
    () => sortRows(filterRows(rows, debouncedFilter), sort),
    [rows, debouncedFilter, sort],
  );

  function toggleSort(column: OrgTableColumn) {
    setSort((previous) => nextSort(previous, column));
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
          <tbody>
            {visibleRows.map((row) => (
              <S.BodyRow
                key={row.id}
                $selected={row.id === selectedId}
                onClick={() => onSelect(row.id)}
              >
                <S.NameCell $depth={row.depth}>{row.name}</S.NameCell>
                <S.Cell>{getLevelLabel(row.depth)}</S.Cell>
                <S.Cell $numeric>{formatHeadcount(row.headcount)}</S.Cell>
                <S.Cell $numeric>{formatBudget(row.budget)}</S.Cell>
                <S.Cell $numeric>{formatPerformance(row.performance)}</S.Cell>
              </S.BodyRow>
            ))}
          </tbody>
        </S.Table>
      </S.TableScroll>

      {visibleRows.length === 0 && <S.EmptyMessage>Ничего не найдено</S.EmptyMessage>}
    </>
  );
}
