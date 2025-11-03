import { os } from '@orpc/server';
import { auth } from '../utils/auth.js';

export const publicProcedure = os;

export const protectedProcedure = os.use(async ({ context, next }) => {
  const request = (context as any).request as Request;
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  return next({ context: { ...context, user: session.user } });
});

export const adminProcedure = protectedProcedure.use(async ({ context, next }) => {
  const user = (context as any).user;
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return next({ context });
});