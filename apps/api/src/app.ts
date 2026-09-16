import Fastify from 'fastify';
import cors from '@fastify/cors';
import etag from '@fastify/etag';
import websocket from '@fastify/websocket';
import { getOrgNodes, getRevision, applyRandomMutation } from './orgStore.js';

type Options = {
  logger?: boolean;
  corsOrigins?: string[];
  responseDelayMs?: number;
  liveUpdateIntervalMs?: number | null;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buildApp(options: Options = {}) {
  const app = Fastify({ logger: options.logger ?? false });
  const responseDelayMs = options.responseDelayMs ?? 800;
  const liveUpdateIntervalMs = options.liveUpdateIntervalMs ?? 4000;

  await app.register(cors, {
    origin(origin, callback) {
      callback(
        null,
        !origin ||
          /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin) ||
          Boolean(options.corsOrigins?.includes(origin)),
      );
    },
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'If-None-Match'],
    exposedHeaders: ['ETag', 'X-Org-Revision'],
  });

  await app.register(etag);
  await app.register(websocket);

  app.get('/api/org-tree', async (_request, reply) => {
    await delay(responseDelayMs);
    reply.header('X-Org-Revision', getRevision());
    return getOrgNodes();
  });

  const sockets = new Set<import('ws').WebSocket>();

  app.get('/api/org-tree/live', { websocket: true }, (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });

  let interval: ReturnType<typeof setInterval> | null = null;
  if (liveUpdateIntervalMs !== null) {
    interval = setInterval(() => {
      const patch = applyRandomMutation();
      const payload = JSON.stringify(patch);
      for (const socket of sockets) socket.send(payload);
    }, liveUpdateIntervalMs);
  }

  app.addHook('onClose', () => {
    if (interval !== null) clearInterval(interval);
    for (const socket of sockets) socket.close();
  });

  await app.ready();
  return app;
}
