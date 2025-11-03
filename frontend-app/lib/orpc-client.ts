import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { URL } from '@/config';
import { authClient } from '@/lib/auth-client';
import type { AppRouter } from '../../back/src/routes/_app';

const link = new RPCLink({
  url: URL.ORPC,
  headers: async () => {
    const headers: Record<string, string> = {};
    try {
      const cookies = authClient.getCookie();
      if (cookies) headers['Cookie'] = cookies;
    } catch {}

    try {
      const maybeGetAuthHeader = (authClient as any).getAuthHeader;
      if (typeof maybeGetAuthHeader === 'function') {
        const authz = await maybeGetAuthHeader();
        if (authz) headers['Authorization'] = authz as string;
      } else if (typeof (authClient as any).getSession === 'function') {
        const session = await (authClient as any).getSession();
        const token = session?.data?.session?.token || session?.data?.sessionToken;
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {}

    return headers;
  }
});

export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);