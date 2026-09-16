import type { OrgTableRow } from '@/orgTable/types/types';

export function filterRows(rows: OrgTableRow[], query: string): OrgTableRow[] {
  const normalized = query.trim().toLocaleLowerCase('ru');
  if (normalized === '') return rows;

  return rows.filter((row) => row.name.toLocaleLowerCase('ru').includes(normalized));
}
