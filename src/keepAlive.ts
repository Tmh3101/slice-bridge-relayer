import { logger } from '@/core/logger'

const PING_URL = process.env.KEEPALIVE_PING_URL
const INTERVAL_MS = Number(process.env.KEEPALIVE_INTERVAL_MS || 600000)

/**
 * Reciprocal keep-alive: ping a peer service on a fixed interval so that
 * BOTH Render Free services keep receiving HTTP traffic and never hit the
 * 15-minute inactivity spin-down. This is the "ping qua lại" mechanism.
 *
 * Safe by design:
 * - If KEEPALIVE_PING_URL is unset, it simply warns and does nothing.
 * - All fetch errors are caught and logged only — never crashes the process.
 * - Pings immediately on startup (bootstrap) then on interval.
 */
export function startKeepAlive() {
  if (!PING_URL) {
    logger.warn('[keepAlive] KEEPALIVE_PING_URL not set, skipping reciprocal ping')
    return
  }

  const target = PING_URL.replace(/\/$/, '') + '/api/health'

  const pingOnce = async () => {
    try {
      const res = await fetch(target, { method: 'GET' })
      logger.info({ status: res.status, target }, '[keepAlive] ping sent')
    } catch (e: any) {
      logger.warn({ error: e?.message }, '[keepAlive] ping failed')
    }
  }

  // bootstrap immediately so the peer wakes up right after deploy
  pingOnce()
  setInterval(pingOnce, INTERVAL_MS)
}
