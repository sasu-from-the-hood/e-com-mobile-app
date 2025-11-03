import { z } from 'zod';
import { protectedProcedure, adminProcedure } from '../../middleware/orpc.js';
import { db } from '../../database/db.js';
import { orderTracking, orders } from '../../database/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import cuid from 'cuid';

export const getOrderTracking = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, input));

    if (!order || order.userId !== context.user.id) {
      throw new Error('Order not found');
    }

    return await db
      .select()
      .from(orderTracking)
      .where(eq(orderTracking.orderId, input))
      .orderBy(desc(orderTracking.timestamp));
  });

export const updateTracking = adminProcedure
  .input(z.object({
    orderId: z.string(),
    status: z.string(),
    location: z.string().optional(),
    notes: z.string().optional()
  }))
  .handler(async ({ input }) => {
    return await db.insert(orderTracking).values({
      id: cuid(),
      ...input
    });
  });

export const getTrackingTimeline = protectedProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    return [
      {
        id: '1',
        title: 'Order Placed',
        status: 'completed',
        time: '02:30 PM',
        location: 'Online Store'
      },
      {
        id: '2', 
        title: 'Processing',
        status: 'completed',
        time: '02:45 PM',
        location: 'Warehouse'
      },
      {
        id: '3',
        title: 'Shipped',
        status: 'active',
        time: '03:20 PM',
        location: 'Distribution Center'
      },
      {
        id: '4',
        title: 'Out for Delivery',
        status: 'pending',
        time: 'Estimated 04:00 PM',
        location: 'Local Hub'
      },
      {
        id: '5',
        title: 'Delivered',
        status: 'pending',
        time: 'Estimated 05:00 PM',
        location: 'Your Address'
      }
    ];
  });