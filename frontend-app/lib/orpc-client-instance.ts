import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { URL } from '@/config';
import type { AppRouter } from '../../backend/src/routes/_app';

// Basic ORPC client without auth middleware
// Used internally by orpc-client.ts to avoid circular dependencies
const link = new RPCLink({
  url: URL.ORPC,
});

export const orpc: RouterClient<AppRouter> = createORPCClient(link);
