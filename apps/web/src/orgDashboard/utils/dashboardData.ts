import { aggregateOrgTree, updateAggregatesForPatch } from '@/orgDashboard/utils/aggregate';
import { buildOrgTree } from '@/orgDashboard/utils/buildTree';
import { indexOrgTree } from '@/orgDashboard/utils/indexOrgTree';
import type { OrgAggregate, OrgNode, OrgNodePatch, OrgTreeNode } from '@/orgDashboard/types/types';

export interface DashboardData {
  tree: OrgTreeNode[];
  nodesById: Map<string, OrgTreeNode>;
  aggregates: Map<string, OrgAggregate>;
}

export type DashboardAction =
  | { type: 'loaded'; nodes: OrgNode[] }
  | { type: 'patch'; nodes: OrgNodePatch[] };

export function buildDashboardData(nodes: OrgNode[]): DashboardData {
  const tree = buildOrgTree(nodes);
  return { tree, nodesById: indexOrgTree(tree), aggregates: aggregateOrgTree(tree) };
}

// tree и aggregates всегда обновляются одним dispatch, поэтому toTreeViewNodes/toTableRows
// никогда не увидят их в рассогласованном состоянии — в отличие от двух независимых useState.
export function dashboardReducer(state: DashboardData, action: DashboardAction): DashboardData {
  if (action.type === 'loaded') return buildDashboardData(action.nodes);

  for (const entry of action.nodes) {
    const node = state.nodesById.get(entry.id);
    if (!node) continue;
    if (entry.headcount !== undefined) node.headcount = entry.headcount;
    if (entry.budget !== undefined) node.budget = entry.budget;
    if (entry.performance !== undefined) node.performance = entry.performance;
    node.updatedAt = entry.updatedAt;
  }

  return {
    tree: [...state.tree],
    nodesById: state.nodesById,
    aggregates: updateAggregatesForPatch(state.nodesById, state.aggregates, action.nodes),
  };
}
