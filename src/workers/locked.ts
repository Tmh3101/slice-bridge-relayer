import 'dotenv/config';
import { lockedListener } from '@/listeners/locked';

export async function lockedListenWorker() {
  const unwatch = await lockedListener();
  process.on('SIGINT', () => { unwatch?.(); process.exit(0); });
  process.on('SIGTERM', () => { unwatch?.(); process.exit(0); });
};