import type { OrgTreeNode } from '@/orgDashboard/types/types';

export function indexOrgTree(tree: OrgTreeNode[]): Map<string, OrgTreeNode> {
  const byId = new Map<string, OrgTreeNode>();

  function visit(node: OrgTreeNode) {
    byId.set(node.id, node);
    for (const child of node.children) visit(child);
  }

  for (const root of tree) visit(root);

  return byId;
}
