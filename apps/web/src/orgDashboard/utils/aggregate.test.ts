import { describe, expect, it } from 'vitest';
import { aggregateOrgTree } from '@/orgDashboard/utils/aggregate';
import type { OrgTreeNode } from '@/orgDashboard/types/types';

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

describe('aggregateOrgTree', () => {
  it('для листа возвращает его собственные значения', () => {
    const aggregates = aggregateOrgTree([
      node('a', { headcount: 5, budget: 1000, performance: 80 }),
    ]);

    expect(aggregates.get('a')).toEqual({
      totalHeadcount: 5,
      totalBudget: 1000,
      averagePerformance: 80,
    });
  });

  it('включает в суммы сам узел и всех его потомков', () => {
    const aggregates = aggregateOrgTree([
      node('root', {
        headcount: 1,
        budget: 100,
        children: [
          node('child', {
            headcount: 2,
            budget: 200,
            children: [node('grandchild', { headcount: 4, budget: 400 })],
          }),
        ],
      }),
    ]);

    expect(aggregates.get('root')).toMatchObject({ totalHeadcount: 7, totalBudget: 700 });
    expect(aggregates.get('child')).toMatchObject({ totalHeadcount: 6, totalBudget: 600 });
    expect(aggregates.get('grandchild')).toMatchObject({ totalHeadcount: 4, totalBudget: 400 });
  });

  it('взвешивает эффективность по численности, а не усредняет арифметически', () => {
    const aggregates = aggregateOrgTree([
      node('root', {
        headcount: 10,
        performance: 90,
        children: [node('child', { headcount: 90, performance: 50 })],
      }),
    ]);

    expect(aggregates.get('root')?.averagePerformance).toBe(54);
    expect(aggregates.get('root')?.averagePerformance).not.toBe(70);
  });

  it('взвешивает через все уровни вложенности', () => {
    const aggregates = aggregateOrgTree([
      node('root', {
        headcount: 1,
        performance: 100,
        children: [
          node('child', {
            headcount: 2,
            performance: 50,
            children: [node('grandchild', { headcount: 7, performance: 10 })],
          }),
        ],
      }),
    ]);

    expect(aggregates.get('root')?.averagePerformance).toBe(27);
    expect(aggregates.get('child')?.averagePerformance).toBeCloseTo(170 / 9, 10);
  });

  it('не учитывает узлы с нулевой численностью в средней эффективности', () => {
    const aggregates = aggregateOrgTree([
      node('root', {
        headcount: 0,
        performance: 100,
        children: [node('child', { headcount: 4, performance: 60 })],
      }),
    ]);

    expect(aggregates.get('root')?.averagePerformance).toBe(60);
  });

  it('возвращает ноль вместо NaN, когда численность всего поддерева нулевая', () => {
    const aggregates = aggregateOrgTree([
      node('root', { headcount: 0, performance: 90, children: [node('child', { headcount: 0 })] }),
    ]);

    expect(aggregates.get('root')?.averagePerformance).toBe(0);
    expect(aggregates.get('root')?.averagePerformance).not.toBeNaN();
  });

  it('считает несколько корней независимо друг от друга', () => {
    const aggregates = aggregateOrgTree([
      node('a', { headcount: 3, budget: 30, performance: 60 }),
      node('b', { headcount: 7, budget: 70, performance: 20 }),
    ]);

    expect(aggregates.get('a')).toEqual({
      totalHeadcount: 3,
      totalBudget: 30,
      averagePerformance: 60,
    });
    expect(aggregates.get('b')).toEqual({
      totalHeadcount: 7,
      totalBudget: 70,
      averagePerformance: 20,
    });
  });

  it('обходит каждый узел ровно один раз', () => {
    const visited: string[] = [];
    const tracked = (id: string, children: OrgTreeNode[] = []): OrgTreeNode => {
      const base = node(id, { headcount: 1, children });
      return new Proxy(base, {
        get(target, property, receiver) {
          if (property === 'children') visited.push(id);
          return Reflect.get(target, property, receiver);
        },
      });
    };

    aggregateOrgTree([
      tracked('root', [tracked('child', [tracked('grandchild')]), tracked('second')]),
    ]);

    expect(visited).toEqual(['root', 'child', 'grandchild', 'second']);
  });

  it('на пустом дереве возвращает пустую карту', () => {
    expect(aggregateOrgTree([]).size).toBe(0);
  });
});
