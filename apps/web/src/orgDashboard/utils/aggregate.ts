import type { OrgAggregate, OrgNodePatch, OrgTreeNode } from '@/orgDashboard/types/types';

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

function depthOf(id: string, nodesById: Map<string, OrgTreeNode>): number {
  let depth = 0;
  let current = nodesById.get(id);
  while (current && current.parentId !== null) {
    depth += 1;
    current = nodesById.get(current.parentId);
  }
  return depth;
}

// Пересчитывает агрегаты только для патченных узлов и их предков, не трогая
// остальное дерево: соседние поддеревья берутся из уже готовой карты aggregates.
export function updateAggregatesForPatch(
  nodesById: Map<string, OrgTreeNode>,
  aggregates: Map<string, OrgAggregate>,
  patchedNodes: OrgNodePatch[],
): Map<string, OrgAggregate> {
  const next = new Map(aggregates);
  const patchById = new Map(patchedNodes.map((entry) => [entry.id, entry]));

  const dirtyIds = new Set<string>();
  for (const id of patchById.keys()) {
    let current = nodesById.get(id);
    while (current) {
      dirtyIds.add(current.id);
      current = current.parentId === null ? undefined : nodesById.get(current.parentId);
    }
  }

  const orderedDirtyIds = [...dirtyIds].sort(
    (a, b) => depthOf(b, nodesById) - depthOf(a, nodesById),
  );

  for (const id of orderedDirtyIds) {
    const node = nodesById.get(id);
    if (!node) continue;
    const patch = patchById.get(id);

    const ownHeadcount = patch?.headcount ?? node.headcount;
    const ownBudget = patch?.budget ?? node.budget;
    const ownPerformance = patch?.performance ?? node.performance;

    let totalHeadcount = ownHeadcount;
    let totalBudget = ownBudget;
    let weightedPerformance = ownPerformance * ownHeadcount;

    for (const child of node.children) {
      const childAggregate = next.get(child.id);
      if (!childAggregate) throw new Error(`Нет агрегата для узла ${child.id}`);
      totalHeadcount += childAggregate.totalHeadcount;
      totalBudget += childAggregate.totalBudget;
      weightedPerformance += childAggregate.averagePerformance * childAggregate.totalHeadcount;
    }

    next.set(id, {
      totalHeadcount,
      totalBudget,
      averagePerformance: totalHeadcount === 0 ? 0 : weightedPerformance / totalHeadcount,
    });
  }

  return next;
}
