import type { OrgTableColumn, OrgTableRow, OrgTableSort } from '@/orgTable/types/types';

const collator = new Intl.Collator('ru');

function compare(a: OrgTableRow, b: OrgTableRow, column: OrgTableColumn): number {
  if (column === 'name') return collator.compare(a.name, b.name);
  return a[column] - b[column];
}

export function sortRows(rows: OrgTableRow[], sort: OrgTableSort | null): OrgTableRow[] {
  if (sort === null) return rows;

  const direction = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => direction * compare(a, b, sort.column));
}
