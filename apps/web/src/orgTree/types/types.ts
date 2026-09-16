export interface OrgTreeViewNode {
  id: string;
  name: string;
  ownHeadcount: number;
  totalHeadcount: number;
  averagePerformance: number;
  children: OrgTreeViewNode[];
}
