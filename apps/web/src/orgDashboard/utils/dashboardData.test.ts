import { describe, expect, it } from 'vitest';
import { buildDashboardData, dashboardReducer } from '@/orgDashboard/utils/dashboardData';
import type { OrgNode, OrgNodePatch } from '@/orgDashboard/types/types';

function orgNode(id: string, fields: Partial<OrgNode> = {}): OrgNode {
  return {
    id,
    name: id,
    parentId: null,
    headcount: 0,
    budget: 0,
    performance: 0,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...fields,
  };
}

function assertEveryTreeNodeHasAggregate(data: ReturnType<typeof buildDashboardData>) {
  for (const id of data.nodesById.keys()) {
    expect(data.aggregates.has(id)).toBe(true);
  }
}

describe('dashboardReducer', () => {
  it('на loaded строит дерево и агрегаты синхронно, друг с другом согласованно', () => {
    const nodes = [
      orgNode('d1', { headcount: 2, budget: 100, performance: 80 }),
      orgNode('t1', { parentId: 'd1', headcount: 5, budget: 500, performance: 60 }),
    ];

    const data = dashboardReducer(buildDashboardData([]), { type: 'loaded', nodes });

    assertEveryTreeNodeHasAggregate(data);
    expect(data.aggregates.get('d1')).toMatchObject({ totalHeadcount: 7 });
  });

  it('loaded поверх непустого состояния не оставляет агрегатов от прошлых узлов', () => {
    const first = dashboardReducer(buildDashboardData([]), {
      type: 'loaded',
      nodes: [orgNode('a', { headcount: 1 })],
    });

    const second = dashboardReducer(first, {
      type: 'loaded',
      nodes: [orgNode('b', { headcount: 2 })],
    });

    assertEveryTreeNodeHasAggregate(second);
    expect(second.aggregates.has('a')).toBe(false);
    expect(second.nodesById.has('a')).toBe(false);
  });

  it('patch обновляет собственные значения узла и агрегаты, оставаясь согласованным', () => {
    const nodes = [
      orgNode('d1', { headcount: 2, budget: 100, performance: 80 }),
      orgNode('t1', { parentId: 'd1', headcount: 5, budget: 500, performance: 60 }),
    ];
    const loaded = dashboardReducer(buildDashboardData([]), { type: 'loaded', nodes });

    const patch: OrgNodePatch[] = [
      { id: 't1', headcount: 9, updatedAt: '2026-01-02T00:00:00.000Z' },
    ];
    const patched = dashboardReducer(loaded, { type: 'patch', nodes: patch });

    assertEveryTreeNodeHasAggregate(patched);
    expect(patched.nodesById.get('t1')?.headcount).toBe(9);
    expect(patched.aggregates.get('d1')).toMatchObject({ totalHeadcount: 11 });
  });

  it('patch не задевает узлы вне пути патча', () => {
    const nodes = [
      orgNode('root', { headcount: 1 }),
      orgNode('a', { parentId: 'root', headcount: 2 }),
      orgNode('b', { parentId: 'root', headcount: 3 }),
    ];
    const loaded = dashboardReducer(buildDashboardData([]), { type: 'loaded', nodes });
    const bNodeBefore = loaded.nodesById.get('b');
    const bAggregateBefore = loaded.aggregates.get('b');

    const patched = dashboardReducer(loaded, {
      type: 'patch',
      nodes: [{ id: 'a', headcount: 10, updatedAt: '2026-01-02T00:00:00.000Z' }],
    });

    expect(patched.nodesById.get('b')).toBe(bNodeBefore);
    expect(patched.aggregates.get('b')).toBe(bAggregateBefore);
  });

  it('patch по неизвестному id ничего не ломает', () => {
    const loaded = dashboardReducer(buildDashboardData([]), {
      type: 'loaded',
      nodes: [orgNode('a', { headcount: 1 })],
    });

    const patched = dashboardReducer(loaded, {
      type: 'patch',
      nodes: [{ id: 'unknown', headcount: 99, updatedAt: '2026-01-02T00:00:00.000Z' }],
    });

    assertEveryTreeNodeHasAggregate(patched);
    expect(patched.aggregates.get('a')).toEqual(loaded.aggregates.get('a'));
  });
});
