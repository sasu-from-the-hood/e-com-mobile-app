import type { RouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { URL } from '../config'
import type { AppRouter } from '../../../backend/src/routes/_app'

const link = new RPCLink({
  url: URL.ORPC,
  headers: { Authorization: 'Bearer token' },
  fetch: (input, init) => fetch(input, { ...init, credentials: 'include' })
})

export const orpc: RouterClient<AppRouter> = createORPCClient(link)