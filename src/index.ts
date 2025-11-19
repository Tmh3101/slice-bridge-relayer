import 'dotenv/config'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { logger as custormLogger } from "@/core/logger";
import { lockedListenWorker, burnedListenWorker } from './workers'
import apiRoutes from './api/server'
import { client, checkConnection } from '@/db'

const startServer = async () => {
  // check database connection on startup
  checkConnection(client).then(() => {
    custormLogger.info('Database connected successfully!');
  }).catch((e) => {
    custormLogger.fatal({ detail: e }, 'Database connection failed');
    process.exit(1);
  });

  lockedListenWorker().then(() => {
    custormLogger.info('LockedWorker started successfully!');
  }).catch((e) => {
    custormLogger.fatal({ detail: e }, 'LockedWorker crashed');
    process.exit(1);
  });

  burnedListenWorker().then(() => {
    custormLogger.info('BurnedWorker started successfully!');
  }).catch((e) => {
    custormLogger.fatal({ detail: e }, 'BurnedWorker crashed');
    process.exit(1);
  });

  const app = new Hono()
  app.use(cors())
  app.use(logger())
  app.use(prettyJSON())

  app.get('/', (c) => c.json({ message: 'Slice Bridge Relayer is running' }))
  app.route('/api', apiRoutes)

  const port = Number(process.env.PORT ?? 8787)
  serve({ fetch: app.fetch, port }, (info) => {
    custormLogger.info(`Local server listening: http://localhost:${info.port}`)
  })
}

startServer();