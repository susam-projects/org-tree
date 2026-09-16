import { z } from 'zod';

export const orgNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  parentId: z.string().min(1).nullable(),
  headcount: z.number().int().nonnegative(),
  budget: z.number().int().nonnegative(),
  performance: z.number().min(0).max(100),
  updatedAt: z.iso.datetime(),
});

export const orgNodesSchema = z.array(orgNodeSchema);

export type OrgNode = z.infer<typeof orgNodeSchema>;

export interface OrgTreeNode extends OrgNode {
  children: OrgTreeNode[];
}

export interface OrgAggregate {
  totalHeadcount: number;
  totalBudget: number;
  averagePerformance: number;
}
