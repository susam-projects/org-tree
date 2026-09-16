import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildApp } from './app.js';

const env = fileURLToPath(new URL('../../../.env', import.meta.url));
if (existsSync(env)) process.loadEnvFile(env);

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT.');
const responseDelayMs = Number(process.env.RESPONSE_DELAY_MS ?? 800);
if (!Number.isInteger(responseDelayMs) || responseDelayMs < 0 || responseDelayMs > 30000)
  throw new Error('Invalid RESPONSE_DELAY_MS.');

const app = await buildApp({
  logger: true,
  corsOrigins: process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  responseDelayMs,
});

for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    void app.close().then(() => process.exit(0));
  });

await app.listen({ host, port });
