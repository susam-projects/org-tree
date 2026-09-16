import * as S from '@/orgTable/components/OrgTable/OrgTable.style';
import type { OrgTableRow } from '@/orgTable/types/types';
import { useFadeHighlight } from '@/orgTable/hooks/useFadeHighlight';
import {
  formatBudget,
  formatHeadcount,
  formatPerformance,
  getLevelLabel,
} from '@/orgTable/utils/format';

interface OrgTableBodyRowProps {
  row: OrgTableRow;
  selected: boolean;
  tabIndex: number;
  rowRef: (element: HTMLTableRowElement | null) => void;
  onSelect: (id: string) => void;
}

export function OrgTableBodyRow({ row, selected, tabIndex, rowRef, onSelect }: OrgTableBodyRowProps) {
  const headcountChanged = useFadeHighlight(row.headcount);
  const budgetChanged = useFadeHighlight(row.budget);
  const performanceChanged = useFadeHighlight(row.performance);

  return (
    <S.BodyRow
      ref={rowRef}
      tabIndex={tabIndex}
      aria-selected={selected}
      $selected={selected}
      onClick={() => onSelect(row.id)}
    >
      <S.NameCell $depth={row.depth}>{row.name}</S.NameCell>
      <S.Cell>{getLevelLabel(row.depth)}</S.Cell>
      <S.Cell $numeric $highlighted={headcountChanged}>
        {formatHeadcount(row.headcount)}
      </S.Cell>
      <S.Cell $numeric $highlighted={budgetChanged}>
        {formatBudget(row.budget)}
      </S.Cell>
      <S.Cell $numeric $highlighted={performanceChanged}>
        {formatPerformance(row.performance)}
      </S.Cell>
    </S.BodyRow>
  );
}
