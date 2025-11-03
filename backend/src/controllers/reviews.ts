import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../middleware/orpc.js';
import { db } from '../database/db.js';
import { reviews, user } from '../database/schema/index.js';
import { eq, and, desc } from 'drizzle-orm';
import cuid from 'cuid';

export const getProductReviews = publicProcedure
  .input(z.string())
  .handler(async ({ input }) => {
    const reviewsWithUsers = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        orderId: reviews.orderId,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        pros: reviews.pros,
        cons: reviews.cons,
        images: reviews.images,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        helpful: reviews.helpful,
        notHelpful: reviews.notHelpful,
        isApproved: reviews.isApproved,
        size: reviews.size,
        color: reviews.color,
        variant: reviews.variant,
        wouldRecommend: reviews.wouldRecommend,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: user.name,
        userImage: user.image,
      })
      .from(reviews)
      .leftJoin(user, eq(reviews.userId, user.id))
      .where(eq(reviews.productId, input))
      .orderBy(desc(reviews.createdAt));

    return reviewsWithUsers;
  });

export const addReview = protectedProcedure
  .input(z.object({
    productId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  }))
  .handler(async ({ input, context }) => {
    return await db.insert(reviews).values({
      id: cuid(),
      ...input,
      userId: context.user.id
    });
  });

export const updateReview = protectedProcedure
  .input(z.object({
    id: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  }))
  .handler(async ({ input, context }) => {
    const { id, ...data } = input;
    return await db
      .update(reviews)
      .set(data)
      .where(and(
        eq(reviews.id, id),
        eq(reviews.userId, context.user.id)
      ));
  });

export const deleteReview = protectedProcedure
  .input(z.string())
  .handler(async ({ input, context }) => {
    return await db
      .delete(reviews)
      .where(and(
        eq(reviews.id, input),
        eq(reviews.userId, context.user.id)
      ));
  });