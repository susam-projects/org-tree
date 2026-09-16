import type { OrgTableRow } from '@/orgTable';
import type { OrgTreeNode } from '@/orgDashboard/types/types';

export function toTableRows(tree: OrgTreeNode[]): OrgTableRow[] {
  const rows: OrgTableRow[] = [];

  function visit(node: OrgTreeNode, depth: number) {
    rows.push({
      id: node.id,
      name: node.name,
      depth,
      headcount: node.headcount,
      budget: node.budget,
      performance: node.performance,
    });
    for (const child of node.children) visit(child, depth + 1);
  }

  for (const root of tree) visit(root, 0);

  return rows;
}
