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

export const vendorProcedure = protectedProcedure.use(async ({ context, next }) => {
  const user = (context as any).user;
  if (user.role !== 'vendor' && user.role !== 'admin') {
    throw new Error('Vendor access required');
  }
  
  return next({ context });
});

// Delivery boy procedure — uses JWT from Authorization header (own auth system)
export const deliveryBoyProcedure = os.use(async ({ context, next }) => {
  try {
    const request = (context as any).request as Request;
    const authHeader = request.headers.get('authorization');
    
    console.log('[deliveryBoyProcedure] Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[deliveryBoyProcedure] Invalid auth header format');
      throw new Error('Unauthorized');
    }
    
    const { verifyToken } = await import('../utils/jwt.js');
    const token = authHeader.slice(7);
    const payload = await verifyToken(token);
    
    console.log('[deliveryBoyProcedure] Token payload:', payload);
    
    if (!payload || payload.role !== 'delivery_boy') {
      console.log('[deliveryBoyProcedure] Invalid payload or role');
      throw new Error('Unauthorized');
    }

    const deliveryBoyContext = {
      id: payload.id || payload.userId,
      name: payload.name,
      phone: payload.phoneNumber
    };
    
    console.log('[deliveryBoyProcedure] Delivery boy context:', deliveryBoyContext);

    return next({ context: { ...context, deliveryBoy: deliveryBoyContext } });
  } catch (error) {
    console.error('[deliveryBoyProcedure] Error:', error);
    throw error;
  }
});