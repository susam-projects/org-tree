import type { OrgTableRow } from '@/orgTable';
import type { OrgAggregate, OrgTreeNode } from '@/orgDashboard/types/types';

export function toTableRows(
  tree: OrgTreeNode[],
  aggregates: Map<string, OrgAggregate>,
): OrgTableRow[] {
  const rows: OrgTableRow[] = [];

  function visit(node: OrgTreeNode, depth: number) {
    const aggregate = aggregates.get(node.id);
    if (!aggregate) throw new Error(`Нет агрегата для узла ${node.id}`);

    rows.push({
      id: node.id,
      name: node.name,
      depth,
      headcount: aggregate.totalHeadcount,
      budget: aggregate.totalBudget,
      performance: aggregate.averagePerformance,
    });
    for (const child of node.children) visit(child, depth + 1);
  }

  for (const root of tree) visit(root, 0);

  return rows;
}
