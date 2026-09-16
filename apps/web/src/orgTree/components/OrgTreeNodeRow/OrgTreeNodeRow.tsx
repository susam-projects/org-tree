import * as S from '@/orgTree/components/OrgTreeNodeRow/OrgTreeNodeRow.style';
import type { OrgTreeViewNode } from '@/orgTree/types/types';
import { getPerformanceColor } from '@/orgTree/utils/performanceColor';

interface OrgTreeNodeRowProps {
  node: OrgTreeViewNode;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function OrgTreeNodeRow({ node, depth, expandedIds, onToggle }: OrgTreeNodeRowProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);

  return (
    <S.NodeItem>
      <S.NodeRow
        as={hasChildren ? 'button' : 'div'}
        type={hasChildren ? 'button' : undefined}
        $depth={depth}
        $clickable={hasChildren}
        onClick={hasChildren ? () => onToggle(node.id) : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren ? <S.ToggleIcon $expanded={isExpanded}>▶</S.ToggleIcon> : <S.ToggleSpacer />}
        <S.PerformanceDot $color={getPerformanceColor(node.averagePerformance)} />
        <S.NodeName>{node.name}</S.NodeName>
        <S.Headcount>
          {node.ownHeadcount === node.totalHeadcount
            ? `${node.totalHeadcount} чел.`
            : `${node.ownHeadcount} / ${node.totalHeadcount} чел.`}
        </S.Headcount>
      </S.NodeRow>

      {hasChildren && isExpanded && (
        <S.ChildrenList>
          {node.children.map((child) => (
            <OrgTreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </S.ChildrenList>
      )}
    </S.NodeItem>
  );
}
