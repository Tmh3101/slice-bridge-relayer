import 'dotenv/config';
import { lockedListener } from '@/listeners/locked';
import bridgeQueue from '@/queues';

export async function lockedListenWorker() {
  const unwatch = await lockedListener();
  process.on('SIGINT', () => { unwatch?.(); bridgeQueue.close?.(); process.exit(0); });
  process.on('SIGTERM', () => { unwatch?.(); bridgeQueue.close?.(); process.exit(0); });
};