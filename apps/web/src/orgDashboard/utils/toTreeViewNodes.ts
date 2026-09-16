import type { OrgTreeViewNode } from '@/orgTree';
import type { OrgAggregate, OrgTreeNode } from '@/orgDashboard/types/types';

export function toTreeViewNodes(
  tree: OrgTreeNode[],
  aggregates: Map<string, OrgAggregate>,
): OrgTreeViewNode[] {
  return tree.map((node) => {
    const aggregate = aggregates.get(node.id);
    if (!aggregate) throw new Error(`Нет агрегата для узла ${node.id}`);

    return {
      id: node.id,
      name: node.name,
      ownHeadcount: node.headcount,
      totalHeadcount: aggregate.totalHeadcount,
      averagePerformance: aggregate.averagePerformance,
      children: toTreeViewNodes(node.children, aggregates),
    };
  });
}
