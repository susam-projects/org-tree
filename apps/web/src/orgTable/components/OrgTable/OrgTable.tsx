import { useId } from 'react';
import * as S from '@/orgTable/components/OrgTable/OrgTable.style';
import type { OrgTableRow } from '@/orgTable/types/types';
import {
  formatBudget,
  formatHeadcount,
  formatPerformance,
  getLevelLabel,
} from '@/orgTable/utils/format';

interface OrgTableProps {
  rows: OrgTableRow[];
  filter: string;
  onFilterChange: (filter: string) => void;
}

export function OrgTable({ rows, filter, onFilterChange }: OrgTableProps) {
  const filterId = useId();

  return (
    <>
      <S.FilterRow>
        <S.FilterLabel htmlFor={filterId}>Фильтр по названию</S.FilterLabel>
        <S.FilterInput
          id={filterId}
          type="search"
          value={filter}
          placeholder="Например, Платформа"
          onChange={(event) => onFilterChange(event.target.value)}
        />
      </S.FilterRow>

      <S.TableScroll>
        <S.Table>
          <thead>
            <tr>
              <S.HeadCell scope="col">Подразделение</S.HeadCell>
              <S.HeadCell scope="col">Уровень</S.HeadCell>
              <S.HeadCell scope="col" $numeric>
                Всего сотрудников
              </S.HeadCell>
              <S.HeadCell scope="col" $numeric>
                Бюджет суммарный
              </S.HeadCell>
              <S.HeadCell scope="col" $numeric>
                Средняя эффективность
              </S.HeadCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <S.BodyRow key={row.id}>
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
    </>
  );
}
