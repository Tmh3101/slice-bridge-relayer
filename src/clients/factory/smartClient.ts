import {
  Chain,
  createPublicClient,
  type PublicClient,
} from "viem";
import getRpc from "@/lib/helpers/getRpc";
import getWs from "@/lib/helpers/getWs";

const DEFAULT_POLLING_INTERVAL_MS = 5_000;

/** Public client: tự fallback WS→HTTP */
export function createSmartPublicClient(chain: Chain): PublicClient {
    try {
      return createPublicClient({
        chain,
        transport: getWs(chain.id),
      });
    } catch {}

  return createPublicClient({
    chain,
    transport: getRpc(chain.id),
    pollingInterval: DEFAULT_POLLING_INTERVAL_MS,
  });
}
