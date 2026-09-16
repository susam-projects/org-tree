import Fastify from 'fastify';
import cors from '@fastify/cors';
import { orgNodes } from './orgTree.js';

type Options = {
  logger?: boolean;
  corsOrigins?: string[];
  responseDelayMs?: number;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buildApp(options: Options = {}) {
  const app = Fastify({ logger: options.logger ?? false });
  const responseDelayMs = options.responseDelayMs ?? 800;

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
  });

  app.get('/api/org-tree', async () => {
    await delay(responseDelayMs);
    return orgNodes;
  });

  await app.ready();
  return app;
}
