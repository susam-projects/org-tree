import type { OrgAggregate, OrgTreeNode } from '@/orgDashboard/types/types';

interface Totals {
  headcount: number;
  budget: number;
  weightedPerformance: number;
}

export function aggregateOrgTree(tree: OrgTreeNode[]): Map<string, OrgAggregate> {
  const aggregates = new Map<string, OrgAggregate>();

  function visit(node: OrgTreeNode): Totals {
    const totals: Totals = {
      headcount: node.headcount,
      budget: node.budget,
      weightedPerformance: node.performance * node.headcount,
    };

    for (const child of node.children) {
      const childTotals = visit(child);
      totals.headcount += childTotals.headcount;
      totals.budget += childTotals.budget;
      totals.weightedPerformance += childTotals.weightedPerformance;
    }

    aggregates.set(node.id, {
      totalHeadcount: totals.headcount,
      totalBudget: totals.budget,
      averagePerformance:
        totals.headcount === 0 ? 0 : totals.weightedPerformance / totals.headcount,
    });

    return totals;
  }

  for (const root of tree) visit(root);

  return aggregates;
}
