import { z } from 'zod';
import { jwtProtectedProcedure } from '../../middleware/jwt-auth.js';
import { db } from '../../database/db.js';
import { notifications } from '../../database/schema/index.js';
import { eq, desc, and } from 'drizzle-orm';
import cuid from 'cuid';

export const getNotifications = jwtProtectedProcedure
  .handler(async ({ context }) => {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, context.user.id))
      .orderBy(desc(notifications.createdAt));
  });

export const getUnreadCount = jwtProtectedProcedure
  .handler(async ({ context }) => {
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, context.user.id),
          eq(notifications.read, false)
        )
      );
    
    return { count: unreadNotifications.length };
  });

export const markAsRead = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    return await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.id, input),
          eq(notifications.userId, context.user.id)
        )
      );
  });

export const markAllAsRead = jwtProtectedProcedure
  .handler(async ({ context }) => {
    return await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, context.user.id));
  });

export async function createNotification({
  userId,
  title,
  message,
  type = 'info',
  category = 'general'
}: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  category?: string;
}) {
  return await db.insert(notifications).values({
    id: cuid(),
    userId,
    title,
    message,
    type,
    category
  });
}
