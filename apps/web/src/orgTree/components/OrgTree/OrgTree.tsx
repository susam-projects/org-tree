import { useEffect, useState } from 'react';
import { OrgTreeNodeRow } from '@/orgTree/components/OrgTreeNodeRow/OrgTreeNodeRow';
import * as S from '@/orgTree/components/OrgTree/OrgTree.style';
import type { OrgTreeViewNode } from '@/orgTree/types/types';

function getDefaultExpandedIds(tree: OrgTreeViewNode[]): Set<string> {
  const ids = new Set<string>();
  for (const node of tree) {
    if (node.children.length > 0) ids.add(node.id);
  }
  return ids;
}

interface OrgTreeProps {
  tree: OrgTreeViewNode[];
}

export function OrgTree({ tree }: OrgTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (tree.length > 0 && expandedIds === null) {
      setExpandedIds(getDefaultExpandedIds(tree));
    }
  }, [tree, expandedIds]);

  function toggleNode(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <S.TreeList>
      {tree.map((node) => (
        <OrgTreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          expandedIds={expandedIds ?? new Set()}
          onToggle={toggleNode}
        />
      ))}
    </S.TreeList>
  );
}
