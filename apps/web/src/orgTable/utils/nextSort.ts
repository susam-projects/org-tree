import type { OrgTableColumn, OrgTableSort } from '@/orgTable/types/types';

export function nextSort(
  previous: OrgTableSort | null,
  column: OrgTableColumn,
): OrgTableSort | null {
  if (previous === null || previous.column !== column) return { column, direction: 'asc' };
  if (previous.direction === 'asc') return { column, direction: 'desc' };
  return null;
}
