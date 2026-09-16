import { z } from 'zod';

export const orgNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  headcount: z.number(),
  budget: z.number(),
  performance: z.number().min(0).max(100),
  updatedAt: z.string(),
});

export const orgNodesSchema = z.array(orgNodeSchema);

export type OrgNode = z.infer<typeof orgNodeSchema>;

export interface OrgTreeNode extends OrgNode {
  children: OrgTreeNode[];
}
