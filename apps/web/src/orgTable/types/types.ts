export interface OrgTableRow {
  id: string;
  name: string;
  depth: number;
  headcount: number;
  budget: number;
  performance: number;
}

export type OrgTableColumn = 'name' | 'depth' | 'headcount' | 'budget' | 'performance';

export type OrgTableSortDirection = 'asc' | 'desc';

export interface OrgTableSort {
  column: OrgTableColumn;
  direction: OrgTableSortDirection;
}
