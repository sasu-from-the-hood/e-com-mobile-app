import { os } from '@orpc/server';
import { auth } from '../utils/auth.js';
export const publicProcedure = os;
export const protectedProcedure = os.use(async ({ context, next }) => {
    const request = context.request;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return next({ context: { ...context, user: session.user } });
});
export const adminProcedure = protectedProcedure.use(async ({ context, next }) => {
    const user = context.user;
    if (user.role !== 'admin') {
        throw new Error('Admin access required');
    }
    return next({ context });
});
export const vendorProcedure = protectedProcedure.use(async ({ context, next }) => {
    const user = context.user;
    if (user.role !== 'vendor' && user.role !== 'admin') {
        throw new Error('Vendor access required');
    }
    return next({ context });
});
// Delivery boy procedure — uses JWT from Authorization header (own auth system)
export const deliveryBoyProcedure = os.use(async ({ context, next }) => {
    const request = context.request;
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer '))
        throw new Error('Unauthorized');
    const { verifyToken } = await import('../utils/jwt.js');
    const token = authHeader.slice(7);
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'delivery_boy')
        throw new Error('Unauthorized');
    return next({ context: { ...context, deliveryBoy: { id: payload.userId, name: payload.name, phone: payload.phoneNumber } } });
});
//# sourceMappingURL=orpc.js.map