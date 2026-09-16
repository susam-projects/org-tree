import { describe, expect, it } from 'vitest';
import { findAncestorIds } from '@/orgTree/utils/findAncestorIds';
import type { OrgTreeViewNode } from '@/orgTree/types/types';

function node(id: string, children: OrgTreeViewNode[] = []): OrgTreeViewNode {
  return { id, name: id, ownHeadcount: 0, totalHeadcount: 0, averagePerformance: 0, children };
}

const tree = [
  node('division', [node('department', [node('team'), node('otherTeam')])]),
  node('secondDivision', [node('secondDepartment')]),
];

describe('findAncestorIds', () => {
  it('для корня возвращает пустой список предков', () => {
    expect(findAncestorIds(tree, 'division')).toEqual([]);
  });

  it('возвращает предков сверху вниз, не включая сам узел', () => {
    expect(findAncestorIds(tree, 'team')).toEqual(['division', 'department']);
  });

  it('не путает ветви между собой', () => {
    expect(findAncestorIds(tree, 'secondDepartment')).toEqual(['secondDivision']);
  });

  it('различает соседние узлы одного родителя', () => {
    expect(findAncestorIds(tree, 'otherTeam')).toEqual(['division', 'department']);
  });

  it('возвращает null, когда узла нет в дереве', () => {
    expect(findAncestorIds(tree, 'missing')).toBeNull();
  });

  it('возвращает null для пустого дерева', () => {
    expect(findAncestorIds([], 'team')).toBeNull();
  });
});
