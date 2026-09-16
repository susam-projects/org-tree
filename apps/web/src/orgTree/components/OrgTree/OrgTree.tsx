import { useEffect, useMemo, useState } from 'react';
import { OrgTreeNodeRow } from '@/orgTree/components/OrgTreeNodeRow/OrgTreeNodeRow';
import * as S from '@/orgTree/components/OrgTree/OrgTree.style';
import type { OrgTreeViewNode } from '@/orgTree/types/types';
import { findAncestorIds } from '@/orgTree/utils/findAncestorIds';

function getDefaultExpandedIds(tree: OrgTreeViewNode[]): Set<string> {
  const ids = new Set<string>();
  for (const node of tree) {
    if (node.children.length > 0) ids.add(node.id);
  }
  return ids;
}

interface OrgTreeProps {
  tree: OrgTreeViewNode[];
  selectedId: string | null;
}

export function OrgTree({ tree, selectedId }: OrgTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (tree.length > 0 && expandedIds === null) {
      setExpandedIds(getDefaultExpandedIds(tree));
    }
  }, [tree, expandedIds]);

  const visibleExpandedIds = useMemo(() => {
    const base = expandedIds ?? new Set<string>();
    if (selectedId === null) return base;

    const ancestors = findAncestorIds(tree, selectedId);
    if (ancestors === null || ancestors.every((id) => base.has(id))) return base;

    return new Set([...base, ...ancestors]);
  }, [expandedIds, selectedId, tree]);

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
          expandedIds={visibleExpandedIds}
          selectedId={selectedId}
          onToggle={toggleNode}
        />
      ))}
    </S.TreeList>
  );
}
