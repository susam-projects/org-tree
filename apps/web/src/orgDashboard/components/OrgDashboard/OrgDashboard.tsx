import { useMemo, useState } from 'react';
import * as S from '@/orgDashboard/components/OrgDashboard/OrgDashboard.style';
import { OrgTable } from '@/orgTable';
import { OrgTree } from '@/orgTree';
import { useOrgTreeData } from '@/orgDashboard/api/useOrgTreeData';
import { aggregateOrgTree } from '@/orgDashboard/utils/aggregate';
import { buildOrgTree } from '@/orgDashboard/utils/buildTree';
import { toTableRows } from '@/orgDashboard/utils/toTableRows';
import { toTreeViewNodes } from '@/orgDashboard/utils/toTreeViewNodes';

type ViewMode = 'tree' | 'table';

export function OrgDashboard() {
  const state = useOrgTreeData();
  const [view, setView] = useState<ViewMode>('tree');

  const tree = useMemo(() => (state.status === 'success' ? buildOrgTree(state.data) : []), [state]);
  const aggregates = useMemo(() => aggregateOrgTree(tree), [tree]);
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
          <OrgTree tree={treeViewNodes} />
        </S.TreePanel>

        <S.TablePanel $visible={view === 'table'} aria-labelledby="org-table-title">
          <S.PanelTitle id="org-table-title">Таблица</S.PanelTitle>
          <OrgTable rows={rows} />
        </S.TablePanel>
      </S.Layout>
    </>
  );
}
