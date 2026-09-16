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

export const orgNodePatchSchema = z.object({
  id: z.string().min(1),
  headcount: z.number().int().nonnegative().optional(),
  budget: z.number().int().nonnegative().optional(),
  performance: z.number().min(0).max(100).optional(),
  updatedAt: z.iso.datetime(),
});

export const orgPatchMessageSchema = z.object({
  type: z.literal('patch'),
  revision: z.number().int().nonnegative(),
  nodes: z.array(orgNodePatchSchema),
});

export type OrgNodePatch = z.infer<typeof orgNodePatchSchema>;
export type OrgPatchMessage = z.infer<typeof orgPatchMessageSchema>;
