export interface OrgNode {
  id: string;
  name: string;
  parentId: string | null;
  headcount: number;
  budget: number;
  /** 0-100 */
  performance: number;
  updatedAt: string;
}

export interface OrgTreeNode extends OrgNode {
  children: OrgTreeNode[];
}
