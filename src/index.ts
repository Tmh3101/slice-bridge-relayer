import 'dotenv/config'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { serve } from '@hono/node-server'
import { health } from './routes/health'
import bridgeRoutes from './routes/bridge'

const app = new Hono()
app.use(logger())
app.use(prettyJSON())

app.route('/health', health)
app.route('/bridge', bridgeRoutes)

app.notFound((c) => c.json({ message: 'Not Found' }, 404))
app.onError((err, c) => {
  console.error('Unhandled Error:', err)
  return c.json({ message: 'Internal Server Error' }, 500)
})

const port = Number(process.env.PORT ?? 8787)
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Local server listening: http://localhost:${info.port}`)
})

export default app