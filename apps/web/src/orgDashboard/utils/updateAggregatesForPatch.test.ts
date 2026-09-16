import { describe, expect, it } from 'vitest';
import { aggregateOrgTree, updateAggregatesForPatch } from '@/orgDashboard/utils/aggregate';
import { indexOrgTree } from '@/orgDashboard/utils/indexOrgTree';
import type { OrgNodePatch, OrgTreeNode } from '@/orgDashboard/types/types';

function node(id: string, fields: Partial<OrgTreeNode> = {}): OrgTreeNode {
  return {
    id,
    name: id,
    parentId: null,
    headcount: 0,
    budget: 0,
    performance: 0,
    updatedAt: '2026-01-01T00:00:00.000Z',
    children: [],
    ...fields,
  };
}

function patch(id: string, fields: Partial<Omit<OrgNodePatch, 'id'>> = {}): OrgNodePatch {
  return { id, updatedAt: '2026-01-02T00:00:00.000Z', ...fields };
}

describe('updateAggregatesForPatch', () => {
  it('пересчитывает патченный узел по значениям из патча', () => {
    const b = node('b', { parentId: 'root', headcount: 2, budget: 200, performance: 60 });
    const root = node('root', { headcount: 1, budget: 100, performance: 80, children: [b] });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [
      patch('b', { headcount: 5, budget: 500 }),
    ]);

    expect(next.get('b')).toEqual({ totalHeadcount: 5, totalBudget: 500, averagePerformance: 60 });
  });

  it('поднимает пересчёт до предков, суммируя с непатченными соседями', () => {
    const b = node('b', { parentId: 'root', headcount: 2, budget: 200, performance: 60 });
    const c = node('c', { parentId: 'root', headcount: 3, budget: 300, performance: 90 });
    const root = node('root', { headcount: 1, budget: 100, performance: 80, children: [b, c] });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [patch('b', { headcount: 5 })]);

    expect(next.get('root')).toMatchObject({ totalHeadcount: 1 + 5 + 3, totalBudget: 100 + 200 + 300 });
  });

  it('не трогает агрегаты узлов вне пути патча — сохраняет ссылку', () => {
    const b = node('b', { parentId: 'root', headcount: 2 });
    const c = node('c', { parentId: 'root', headcount: 3 });
    const root = node('root', { headcount: 1, children: [b, c] });
    const otherRoot = node('other', { headcount: 10 });
    const tree = [root, otherRoot];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [patch('b', { headcount: 5 })]);

    expect(next.get('c')).toBe(aggregates.get('c'));
    expect(next.get('other')).toBe(aggregates.get('other'));
  });

  it('патч без указанного поля сохраняет прежнее собственное значение узла', () => {
    const leaf = node('leaf', { parentId: 'root', headcount: 4, budget: 400, performance: 70 });
    const root = node('root', { headcount: 0, children: [leaf] });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [patch('leaf', { performance: 95 })]);

    expect(next.get('leaf')).toEqual({ totalHeadcount: 4, totalBudget: 400, averagePerformance: 95 });
  });

  it('корректно взвешивает эффективность через несколько уровней после патча', () => {
    const grandchild = node('grandchild', { parentId: 'child', headcount: 7, performance: 10 });
    const child = node('child', { parentId: 'root', headcount: 2, performance: 50, children: [grandchild] });
    const root = node('root', { headcount: 1, performance: 100, children: [child] });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [
      patch('grandchild', { performance: 30 }),
    ]);

    // 1*100 + 2*50 + 7*30 = 410, /10 = 41
    expect(next.get('root')?.averagePerformance).toBe(41);
  });

  it('не считает узлы дважды, если в одном патче есть и предок, и потомок', () => {
    const child = node('child', { parentId: 'root', headcount: 2, budget: 200 });
    const root = node('root', { headcount: 1, budget: 100, children: [child] });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [
      patch('child', { headcount: 9, budget: 900 }),
      patch('root', { headcount: 4, budget: 400 }),
    ]);

    expect(next.get('root')).toMatchObject({ totalHeadcount: 4 + 9, totalBudget: 400 + 900 });
  });

  it('при обнулении численности узла средняя эффективность становится нулём', () => {
    const child = node('child', { parentId: 'root', headcount: 4, performance: 60 });
    const root = node('root', { headcount: 0, performance: 90, children: [child] });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const next = updateAggregatesForPatch(nodesById, aggregates, [patch('child', { headcount: 0 })]);

    expect(next.get('root')?.averagePerformance).toBe(0);
  });

  it('совпадает с полным пересчётом agregateOrgTree после применения тех же значений', () => {
    const grandchild = node('grandchild', {
      parentId: 'child',
      headcount: 7,
      budget: 70,
      performance: 10,
    });
    const child = node('child', {
      parentId: 'root',
      headcount: 2,
      budget: 20,
      performance: 50,
      children: [grandchild],
    });
    const sibling = node('sibling', { parentId: 'root', headcount: 5, budget: 50, performance: 40 });
    const root = node('root', {
      headcount: 1,
      budget: 10,
      performance: 100,
      children: [child, sibling],
    });
    const tree = [root];
    const nodesById = indexOrgTree(tree);
    const aggregates = aggregateOrgTree(tree);

    const nodePatch = patch('grandchild', { headcount: 20, budget: 200, performance: 33 });
    const next = updateAggregatesForPatch(nodesById, aggregates, [nodePatch]);

    grandchild.headcount = 20;
    grandchild.budget = 200;
    grandchild.performance = 33;
    const fullRecompute = aggregateOrgTree(tree);

    expect(next.get('root')).toEqual(fullRecompute.get('root'));
    expect(next.get('child')).toEqual(fullRecompute.get('child'));
    expect(next.get('grandchild')).toEqual(fullRecompute.get('grandchild'));
  });
});
