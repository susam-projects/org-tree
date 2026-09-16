import type { OrgTreeViewNode } from '@/orgTree/types/types';

export function findAncestorIds(tree: OrgTreeViewNode[], targetId: string): string[] | null {
  for (const node of tree) {
    if (node.id === targetId) return [];

    const deeper = findAncestorIds(node.children, targetId);
    if (deeper !== null) return [node.id, ...deeper];
  }

  return null;
}
