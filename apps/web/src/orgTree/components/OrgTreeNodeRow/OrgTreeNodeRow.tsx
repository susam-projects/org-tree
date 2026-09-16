import * as S from '@/orgTree/components/OrgTreeNodeRow/OrgTreeNodeRow.style';
import type { OrgTreeViewNode } from '@/orgTree/types/types';
import { useFadeHighlight } from '@/orgTree/hooks/useFadeHighlight';
import { getPerformanceColor } from '@/orgTree/utils/performanceColor';

interface OrgTreeNodeRowProps {
  node: OrgTreeViewNode;
  depth: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void;
}

export function OrgTreeNodeRow({
  node,
  depth,
  expandedIds,
  selectedId,
  onToggle,
}: OrgTreeNodeRowProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const performanceChanged = useFadeHighlight(node.averagePerformance);
  const headcountChanged = useFadeHighlight(`${node.ownHeadcount}/${node.totalHeadcount}`);

  return (
    <S.NodeItem>
      <S.NodeRow
        as={hasChildren ? 'button' : 'div'}
        type={hasChildren ? 'button' : undefined}
        $depth={depth}
        $clickable={hasChildren}
        $selected={node.id === selectedId}
        onClick={hasChildren ? () => onToggle(node.id) : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren ? <S.ToggleIcon $expanded={isExpanded}>▶</S.ToggleIcon> : <S.ToggleSpacer />}
        <S.PerformanceDot
          $color={getPerformanceColor(node.averagePerformance)}
          $highlighted={performanceChanged}
        />
        <S.NodeName>{node.name}</S.NodeName>
        <S.Headcount $highlighted={headcountChanged}>
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
              selectedId={selectedId}
              onToggle={onToggle}
            />
          ))}
        </S.ChildrenList>
      )}
    </S.NodeItem>
  );
}
