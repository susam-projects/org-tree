import { orgNodes as initialOrgNodes } from './orgTree.js';
import type { OrgNode } from './orgTree.js';

export interface OrgNodePatch {
  id: string;
  headcount?: number;
  budget?: number;
  performance?: number;
  updatedAt: string;
}

export interface OrgPatchMessage {
  type: 'patch';
  revision: number;
  nodes: OrgNodePatch[];
}

const nodes: OrgNode[] = initialOrgNodes.map((node) => ({ ...node }));
let revision = 0;

export function getOrgNodes(): OrgNode[] {
  return nodes;
}

export function getRevision(): number {
  return revision;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mutateNode(node: OrgNode): OrgNodePatch {
  node.headcount = clamp(node.headcount + randomInt(-2, 2), 0, Number.MAX_SAFE_INTEGER);
  node.budget = clamp(
    Math.round(node.budget * (1 + (Math.random() * 0.1 - 0.05))),
    0,
    Number.MAX_SAFE_INTEGER,
  );
  node.performance = Math.round(clamp(node.performance + (Math.random() * 10 - 5), 0, 100) * 10) / 10;
  node.updatedAt = new Date().toISOString();

  return {
    id: node.id,
    headcount: node.headcount,
    budget: node.budget,
    performance: node.performance,
    updatedAt: node.updatedAt,
  };
}

export function applyRandomMutation(): OrgPatchMessage {
  const affectedCount = Math.min(randomInt(1, 3), nodes.length);
  const indices = new Set<number>();
  while (indices.size < affectedCount) {
    indices.add(randomInt(0, nodes.length - 1));
  }

  const patchedNodes = [...indices].map((index) => mutateNode(nodes[index]!));
  revision += 1;

  return { type: 'patch', revision, nodes: patchedNodes };
}
