import { z } from 'zod';
import { protectedProcedure, adminProcedure } from '../middleware/orpc.js';
import { db } from '../database/db.js';
import { notifications } from '../database/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import cuid from 'cuid';

export const getNotifications = protectedProcedure
  .handler(async ({ context }) => {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, context.user.id))
      .orderBy(desc(notifications.createdAt));
  });

export const markAsRead = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    return await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, input));
  });

export const markAllAsRead = protectedProcedure
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

export const sendNotification = adminProcedure
  .input(z.object({
    userId: z.string(),
    title: z.string(),
    message: z.string(),
    type: z.string().default('info')
  }))
  .handler(async ({ input }) => {
    return await createNotification(input);
  });