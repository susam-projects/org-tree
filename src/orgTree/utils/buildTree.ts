import type { OrgNode, OrgTreeNode } from '@/orgTree/types/types'

export function buildOrgTree(nodes: OrgNode[]): OrgTreeNode[] {
  const byId = new Map<string, OrgTreeNode>()
  for (const node of nodes) {
    byId.set(node.id, { ...node, children: [] })
  }

  const roots: OrgTreeNode[] = []
  for (const node of byId.values()) {
    if (node.parentId === null) {
      roots.push(node)
      continue
    }
    const parent = byId.get(node.parentId)
    parent?.children.push(node)
  }

  return roots
}
