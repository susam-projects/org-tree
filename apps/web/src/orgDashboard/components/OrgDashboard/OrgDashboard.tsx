import { useEffect, useMemo, useRef, useState } from 'react';
import * as S from '@/orgDashboard/components/OrgDashboard/OrgDashboard.style';
import { OrgTable } from '@/orgTable';
import { OrgTree } from '@/orgTree';
import { useLiveOrgUpdates } from '@/orgDashboard/api/useLiveOrgUpdates';
import { useOrgTreeData } from '@/orgDashboard/api/useOrgTreeData';
import { aggregateOrgTree, updateAggregatesForPatch } from '@/orgDashboard/utils/aggregate';
import { buildOrgTree } from '@/orgDashboard/utils/buildTree';
import { indexOrgTree } from '@/orgDashboard/utils/indexOrgTree';
import { toTableRows } from '@/orgDashboard/utils/toTableRows';
import { toTreeViewNodes } from '@/orgDashboard/utils/toTreeViewNodes';
import type { OrgAggregate } from '@/orgDashboard/types/types';

type ViewMode = 'tree' | 'table';

export function OrgDashboard() {
  const state = useOrgTreeData();
  const [view, setView] = useState<ViewMode>('tree');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tree = useMemo(() => (state.status === 'success' ? buildOrgTree(state.data) : []), [state]);
  const nodesById = useMemo(() => indexOrgTree(tree), [tree]);

  const [aggregates, setAggregates] = useState<Map<string, OrgAggregate>>(() => new Map());
  const skipNextFullRecomputeRef = useRef(false);

  useEffect(() => {
    if (skipNextFullRecomputeRef.current) {
      skipNextFullRecomputeRef.current = false;
      return;
    }
    setAggregates(aggregateOrgTree(tree));
  }, [tree]);

  useLiveOrgUpdates((patch) => {
    skipNextFullRecomputeRef.current = true;
    setAggregates((previous) => updateAggregatesForPatch(nodesById, previous, patch.nodes));
  });

  const treeViewNodes = useMemo(() => toTreeViewNodes(tree, aggregates), [tree, aggregates]);
  const rows = useMemo(() => toTableRows(tree, aggregates), [tree, aggregates]);

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
    <>
      <S.ViewSwitch role="group" aria-label="Представление данных">
        <S.ViewButton
          type="button"
          $active={view === 'tree'}
          aria-pressed={view === 'tree'}
          onClick={() => setView('tree')}
        >
          Дерево
        </S.ViewButton>
        <S.ViewButton
          type="button"
          $active={view === 'table'}
          aria-pressed={view === 'table'}
          onClick={() => setView('table')}
        >
          Таблица
        </S.ViewButton>
      </S.ViewSwitch>

      <S.Layout>
        <S.TreePanel $visible={view === 'tree'} aria-labelledby="org-tree-title">
          <S.PanelTitle id="org-tree-title">Дерево</S.PanelTitle>
          <OrgTree tree={treeViewNodes} selectedId={selectedId} />
        </S.TreePanel>

        <S.TablePanel $visible={view === 'table'} aria-labelledby="org-table-title">
          <S.PanelTitle id="org-table-title">Таблица</S.PanelTitle>
          <OrgTable rows={rows} selectedId={selectedId} onSelect={setSelectedId} />
        </S.TablePanel>
      </S.Layout>
    </>
  );
}
