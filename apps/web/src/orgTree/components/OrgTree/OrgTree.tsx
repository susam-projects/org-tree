import { useEffect, useMemo, useState } from 'react';
import { OrgTreeNodeRow } from '@/orgTree/components/OrgTreeNodeRow/OrgTreeNodeRow';
import * as S from '@/orgTree/components/OrgTree/OrgTree.style';
import type { OrgTreeNode } from '@/orgTree/types/types';
import { useOrgTreeData } from '@/orgTree/api/useOrgTreeData';
import { buildOrgTree } from '@/orgTree/utils/buildTree';

function getDefaultExpandedIds(tree: OrgTreeNode[]): Set<string> {
  const ids = new Set<string>();
  for (const node of tree) {
    if (node.children.length > 0) ids.add(node.id);
  }
  return ids;
}

export function OrgTree() {
  const state = useOrgTreeData();

  const tree = useMemo(() => (state.status === 'success' ? buildOrgTree(state.data) : []), [state]);

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

  if (state.status === 'loading') {
    return <S.StatusMessage>Загрузка…</S.StatusMessage>;
  }

  if (state.status === 'error') {
    return <S.StatusMessage role="alert">{state.message}</S.StatusMessage>;
  }

  if (state.status === 'empty') {
    return <S.StatusMessage>Нет данных для отображения</S.StatusMessage>;
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
