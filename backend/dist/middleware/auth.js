import { os, ORPCError } from '@orpc/server';
import { createContext } from './context.js';
export const authMiddleware = os
    .$context()
    .middleware(async ({ context, next }) => {
    if (!context.request) {
        throw new ORPCError('UNAUTHORIZED');
    }
    const authContext = await createContext({
        req: context.request,
        res: new Response()
    });
    if (!authContext.user) {
        throw new ORPCError('UNAUTHORIZED');
    }
    return next({
        context: {
            user: authContext.user,
            session: authContext.session,
            role: authContext.user.role
        }
    });
});
//# sourceMappingURL=auth.js.map