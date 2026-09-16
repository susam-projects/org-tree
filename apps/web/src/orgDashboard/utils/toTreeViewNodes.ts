import type { OrgTreeViewNode } from '@/orgTree';
import type { OrgTreeNode } from '@/orgDashboard/types/types';

export function toTreeViewNodes(tree: OrgTreeNode[]): OrgTreeViewNode[] {
  return tree.map((node) => ({
    id: node.id,
    name: node.name,
    headcount: node.headcount,
    performance: node.performance,
    children: toTreeViewNodes(node.children),
  }));
}
