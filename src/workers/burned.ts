import 'dotenv/config';
import { burnedListener } from '@/listeners/burned';
import bridgeQueue from '@/queues';

export async function burnedListenWorker() {
  const unwatch = await burnedListener();
  process.on('SIGINT', () => { unwatch?.(); bridgeQueue.close?.(); process.exit(0); });
  process.on('SIGTERM', () => { unwatch?.(); bridgeQueue.close?.(); process.exit(0); });
}