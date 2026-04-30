import { z } from 'zod'
import { publicProcedure } from '../../middleware/orpc.js'
import { jwtProtectedProcedure } from '../../middleware/jwt-auth.js'
import { db } from '../../database/db.js'
import {
  fashionPosts,
  postItems,
  postTextElements,
  postLikes,
  postSaves,
  userFollows,
  user,
  products,
} from '../../database/schema/index.js'
import { eq, desc, and, sql, inArray } from 'drizzle-orm'
import crypto from 'crypto'

/**
 * Create or update a fashion post
 */
export const createPost = jwtProtectedProcedure
  .input(z.object({
    id: z.string().optional(), // If provided, update existing post
    caption: z.string().optional().nullable(),
    isDraft: z.boolean().default(false),
    sceneMode: z.enum(['2d', '3d']).default('3d'),
    backgroundColor: z.enum(['floor', 'studio', 'outdoor', 'minimal']).optional().nullable(),
    items: z.array(z.object({
      productId: z.string(),
      modelId: z.string(),
      leftLegFile: z.string().optional().nullable(),
      boneName: z.string(),
      bodyPartType: z.string(),
      scale: z.number(),
      positionX: z.number(),
      positionY: z.number(),
      positionZ: z.number(),
    })).default([]),
    textElements: z.array(z.object({
      content: z.string(),
      positionX: z.number(),
      positionY: z.number(),
      fontSize: z.number(),
      fontFamily: z.string(),
      color: z.string(),
      rotation: z.number(),
      zIndex: z.number(),
    })).default([]),
  }))
  .handler(async ({ input, context }) => {
    const userId = context.user.id
    const postId = input.id || crypto.randomUUID()
    const isUpdate = !!input.id

    if (isUpdate) {
      // Update existing post
      await db
        .update(fashionPosts)
        .set({
          caption: input.caption,
          isDraft: input.isDraft,
          sceneMode: input.sceneMode,
          backgroundColor: input.backgroundColor,
          updatedAt: new Date(),
        })
        .where(and(
          eq(fashionPosts.id, postId),
          eq(fashionPosts.userId, userId)
        ))

      // Delete old items and text elements
      await db.delete(postItems).where(eq(postItems.postId, postId))
      await db.delete(postTextElements).where(eq(postTextElements.postId, postId))
    } else {
      // Create new post
      await db.insert(fashionPosts).values({
        id: postId,
        userId,
        caption: input.caption,
        isDraft: input.isDraft,
        sceneMode: input.sceneMode,
        backgroundColor: input.backgroundColor,
        isPublished: !input.isDraft,
      })
    }

    // Insert items
    if (input.items.length > 0) {
      await db.insert(postItems).values(
        input.items.map(item => ({
          id: crypto.randomUUID(),
          postId,
          productId: item.productId,
          modelId: item.modelId,
          leftLegFile: item.leftLegFile || null,
          boneName: item.boneName,
          bodyPartType: item.bodyPartType,
          scale: item.scale.toString(),
          positionX: item.positionX.toString(),
          positionY: item.positionY.toString(),
          positionZ: item.positionZ.toString(),
        }))
      )
    }

    // Insert text elements
    if (input.textElements.length > 0) {
      await db.insert(postTextElements).values(
        input.textElements.map(text => ({
          id: crypto.randomUUID(),
          postId,
          content: text.content,
          positionX: text.positionX.toString(),
          positionY: text.positionY.toString(),
          fontSize: text.fontSize,
          fontFamily: text.fontFamily,
          color: text.color,
          rotation: text.rotation.toString(),
          zIndex: text.zIndex,
        }))
      )
    }

    return { postId, isUpdate }
  })

/**
 * Get feed posts with smart algorithm
 * - Excludes user's own posts
 * - For new users (low engagement): Shows trending/popular content
 * - For established users (high engagement): Shows personalized content from followed users
 */
export const getFeedPosts = jwtProtectedProcedure
  .input(z.object({
    limit: z.number().default(20),
    offset: z.number().default(0),
  }))
  .handler(async ({ input, context }) => {
    const userId = context.user.id

    // Get user's engagement metrics
    const userEngagement = await db
      .select({
        followingCount: sql<number>`COUNT(DISTINCT ${userFollows.followingId})`.as('followingCount'),
        postsCount: sql<number>`COUNT(DISTINCT ${fashionPosts.id})`.as('postsCount'),
        likesGiven: sql<number>`COUNT(DISTINCT ${postLikes.id})`.as('likesGiven'),
      })
      .from(user)
      .leftJoin(userFollows, eq(userFollows.followerId, userId))
      .leftJoin(fashionPosts, eq(fashionPosts.userId, userId))
      .leftJoin(postLikes, eq(postLikes.userId, userId))
      .where(eq(user.id, userId))
      .groupBy(user.id)

    const engagement = userEngagement[0] || { followingCount: 0, postsCount: 0, likesGiven: 0 }
    const totalEngagement = Number(engagement.followingCount) + Number(engagement.postsCount) + Number(engagement.likesGiven)
    
    // Determine user type
    // High engagement: 10+ following OR 5+ posts OR 20+ likes
    const isHighEngagement = engagement.followingCount >= 10 || engagement.postsCount >= 5 || engagement.likesGiven >= 20
    
    console.log('[Feed Algorithm]', {
      userId,
      followingCount: engagement.followingCount,
      postsCount: engagement.postsCount,
      likesGiven: engagement.likesGiven,
      totalEngagement,
      isHighEngagement,
      feedType: isHighEngagement ? 'PERSONALIZED' : 'TRENDING'
    })

    let posts

    if (isHighEngagement) {
      // PERSONALIZED FEED: Show posts from followed users + some trending
      const followingIds = await db
        .select({ followingId: userFollows.followingId })
        .from(userFollows)
        .where(eq(userFollows.followerId, userId))

      const followingIdsList = followingIds.map(f => f.followingId)

      if (followingIdsList.length > 0) {
        // 70% from followed users, 30% trending (mixed)
        const followedPosts = await db
          .select({
            id: fashionPosts.id,
            userId: fashionPosts.userId,
            caption: fashionPosts.caption,
            likesCount: fashionPosts.likesCount,
            sharesCount: fashionPosts.sharesCount,
            savesCount: fashionPosts.savesCount,
            viewsCount: fashionPosts.viewsCount,
            sceneMode: fashionPosts.sceneMode,
            backgroundColor: fashionPosts.backgroundColor,
            createdAt: fashionPosts.createdAt,
            userName: user.name,
            userImage: user.image,
            // Engagement score for sorting
            engagementScore: sql<number>`(
              ${fashionPosts.likesCount} * 3 + 
              ${fashionPosts.savesCount} * 5 + 
              ${fashionPosts.sharesCount} * 4 + 
              ${fashionPosts.viewsCount} * 0.1
            )`.as('engagementScore'),
          })
          .from(fashionPosts)
          .leftJoin(user, eq(fashionPosts.userId, user.id))
          .where(and(
            eq(fashionPosts.isPublished, true),
            inArray(fashionPosts.userId, followingIdsList),
            sql`${fashionPosts.userId} != ${userId}` // Exclude own posts
          ))
          .orderBy(desc(fashionPosts.createdAt))
          .limit(Math.floor(input.limit * 0.7))
          .offset(input.offset)

        // Get trending posts (not from followed users)
        const trendingPosts = await db
          .select({
            id: fashionPosts.id,
            userId: fashionPosts.userId,
            caption: fashionPosts.caption,
            likesCount: fashionPosts.likesCount,
            sharesCount: fashionPosts.sharesCount,
            savesCount: fashionPosts.savesCount,
            viewsCount: fashionPosts.viewsCount,
            sceneMode: fashionPosts.sceneMode,
            backgroundColor: fashionPosts.backgroundColor,
            createdAt: fashionPosts.createdAt,
            userName: user.name,
            userImage: user.image,
            engagementScore: sql<number>`(
              ${fashionPosts.likesCount} * 3 + 
              ${fashionPosts.savesCount} * 5 + 
              ${fashionPosts.sharesCount} * 4 + 
              ${fashionPosts.viewsCount} * 0.1
            )`.as('engagementScore'),
          })
          .from(fashionPosts)
          .leftJoin(user, eq(fashionPosts.userId, user.id))
          .where(and(
            eq(fashionPosts.isPublished, true),
            sql`${fashionPosts.userId} != ${userId}`, // Exclude own posts
            sql`${fashionPosts.userId} NOT IN (${followingIdsList.join(',')})` // Not from followed users
          ))
          .orderBy(desc(sql`engagementScore`), desc(fashionPosts.createdAt))
          .limit(Math.ceil(input.limit * 0.3))

        // Merge and shuffle
        posts = [...followedPosts, ...trendingPosts]
      } else {
        // No following yet, show trending
        posts = await db
          .select({
            id: fashionPosts.id,
            userId: fashionPosts.userId,
            caption: fashionPosts.caption,
            likesCount: fashionPosts.likesCount,
            sharesCount: fashionPosts.sharesCount,
            savesCount: fashionPosts.savesCount,
            viewsCount: fashionPosts.viewsCount,
            sceneMode: fashionPosts.sceneMode,
            backgroundColor: fashionPosts.backgroundColor,
            createdAt: fashionPosts.createdAt,
            userName: user.name,
            userImage: user.image,
            engagementScore: sql<number>`(
              ${fashionPosts.likesCount} * 3 + 
              ${fashionPosts.savesCount} * 5 + 
              ${fashionPosts.sharesCount} * 4 + 
              ${fashionPosts.viewsCount} * 0.1
            )`.as('engagementScore'),
          })
          .from(fashionPosts)
          .leftJoin(user, eq(fashionPosts.userId, user.id))
          .where(and(
            eq(fashionPosts.isPublished, true),
            sql`${fashionPosts.userId} != ${userId}` // Exclude own posts
          ))
          .orderBy(desc(sql`engagementScore`), desc(fashionPosts.createdAt))
          .limit(input.limit)
          .offset(input.offset)
      }
    } else {
      // TRENDING FEED: Show popular content for new users
      posts = await db
        .select({
          id: fashionPosts.id,
          userId: fashionPosts.userId,
          caption: fashionPosts.caption,
          likesCount: fashionPosts.likesCount,
          sharesCount: fashionPosts.sharesCount,
          savesCount: fashionPosts.savesCount,
          viewsCount: fashionPosts.viewsCount,
          sceneMode: fashionPosts.sceneMode,
          backgroundColor: fashionPosts.backgroundColor,
          createdAt: fashionPosts.createdAt,
          userName: user.name,
          userImage: user.image,
          engagementScore: sql<number>`(
            ${fashionPosts.likesCount} * 3 + 
            ${fashionPosts.savesCount} * 5 + 
            ${fashionPosts.sharesCount} * 4 + 
            ${fashionPosts.viewsCount} * 0.1
          )`.as('engagementScore'),
        })
        .from(fashionPosts)
        .leftJoin(user, eq(fashionPosts.userId, user.id))
        .where(and(
          eq(fashionPosts.isPublished, true),
          sql`${fashionPosts.userId} != ${userId}` // Exclude own posts
        ))
        .orderBy(desc(sql`engagementScore`), desc(fashionPosts.createdAt))
        .limit(input.limit)
        .offset(input.offset)
    }

    // Get items and text elements for each post
    const postIds = posts.map(p => p.id)
    
    const items = postIds.length > 0
      ? await db
          .select({
            id: postItems.id,
            postId: postItems.postId,
            productId: postItems.productId,
            modelId: postItems.modelId,
            leftLegFile: postItems.leftLegFile,
            boneName: postItems.boneName,
            bodyPartType: postItems.bodyPartType,
            scale: postItems.scale,
            positionX: postItems.positionX,
            positionY: postItems.positionY,
            positionZ: postItems.positionZ,
            productName: sql<string>`${products.name}`.as('productName'),
            
          })
          .from(postItems)
          .leftJoin(products, eq(postItems.productId, products.id))
          .where(inArray(postItems.postId, postIds))
      : []
    
    const textElements = postIds.length > 0
      ? await db.select().from(postTextElements).where(inArray(postTextElements.postId, postIds))
      : []

    // Check if current user liked/saved each post
    const userLikes = postIds.length > 0
      ? await db.select().from(postLikes).where(
          and(
            inArray(postLikes.postId, postIds),
            eq(postLikes.userId, userId)
          )
        )
      : []
    
    const userSaves = postIds.length > 0
      ? await db.select().from(postSaves).where(
          and(
            inArray(postSaves.postId, postIds),
            eq(postSaves.userId, userId)
          )
        )
      : []

    // Check if current user follows post authors
    const authorIds = posts.map(p => p.userId).filter(Boolean) as string[]
    const userFollowing = authorIds.length > 0
      ? await db.select().from(userFollows).where(
          and(
            eq(userFollows.followerId, userId),
            inArray(userFollows.followingId, authorIds)
          )
        )
      : []

    const likedPostIds = new Set(userLikes.map(l => l.postId))
    const savedPostIds = new Set(userSaves.map(s => s.postId))
    const followingIds = new Set(userFollowing.map(f => f.followingId))

    return posts.map(post => ({
      ...post,
      items: items.filter(i => i.postId === post.id),
      textElements: textElements.filter(t => t.postId === post.id),
      isLiked: likedPostIds.has(post.id),
      isSaved: savedPostIds.has(post.id),
      isFollowing: followingIds.has(post.userId),
    }))
  })

/**
 * Get user's draft posts
 */
export const getDraftPosts = jwtProtectedProcedure
  .handler(async ({ context }) => {
    const userId = context.user.id

    const posts = await db
      .select()
      .from(fashionPosts)
      .where(and(
        eq(fashionPosts.userId, userId),
        eq(fashionPosts.isDraft, true)
      ))
      .orderBy(desc(fashionPosts.updatedAt))

    const postIds = posts.map(p => p.id)
    
    const items = postIds.length > 0
      ? await db.select().from(postItems).where(inArray(postItems.postId, postIds))
      : []
    
    const textElements = postIds.length > 0
      ? await db.select().from(postTextElements).where(inArray(postTextElements.postId, postIds))
      : []

    return posts.map(post => ({
      ...post,
      items: items.filter(i => i.postId === post.id),
      textElements: textElements.filter(t => t.postId === post.id),
    }))
  })

/**
 * Get user's own posts (published and drafts)
 */
export const getMyPosts = jwtProtectedProcedure
  .input(z.object({
    limit: z.number().default(20),
    offset: z.number().default(0),
  }))
  .handler(async ({ input, context }) => {
    const userId = context.user.id

    const posts = await db
      .select({
        id: fashionPosts.id,
        userId: fashionPosts.userId,
        caption: fashionPosts.caption,
        likesCount: fashionPosts.likesCount,
        sharesCount: fashionPosts.sharesCount,
        savesCount: fashionPosts.savesCount,
        viewsCount: fashionPosts.viewsCount,
        sceneMode: fashionPosts.sceneMode,
        backgroundColor: fashionPosts.backgroundColor,
        isDraft: fashionPosts.isDraft,
        isPublished: fashionPosts.isPublished,
        createdAt: fashionPosts.createdAt,
        updatedAt: fashionPosts.updatedAt,
        // User info
        userName: user.name,
        userImage: user.image,
      })
      .from(fashionPosts)
      .leftJoin(user, eq(fashionPosts.userId, user.id))
      .where(eq(fashionPosts.userId, userId))
      .orderBy(desc(fashionPosts.updatedAt))
      .limit(input.limit)
      .offset(input.offset)

    const postIds = posts.map(p => p.id)
    
    const items = postIds.length > 0
      ? await db
          .select({
            id: postItems.id,
            postId: postItems.postId,
            productId: postItems.productId,
            modelId: postItems.modelId,
            leftLegFile: postItems.leftLegFile,
            boneName: postItems.boneName,
            bodyPartType: postItems.bodyPartType,
            scale: postItems.scale,
            positionX: postItems.positionX,
            positionY: postItems.positionY,
            positionZ: postItems.positionZ,
            productName: sql<string>`${products.name}`.as('productName'),
            
          })
          .from(postItems)
          .leftJoin(products, eq(postItems.productId, products.id))
          .where(inArray(postItems.postId, postIds))
      : []
    
    const textElements = postIds.length > 0
      ? await db.select().from(postTextElements).where(inArray(postTextElements.postId, postIds))
      : []

    return posts.map(post => ({
      ...post,
      items: items.filter(i => i.postId === post.id),
      textElements: textElements.filter(t => t.postId === post.id),
      isLiked: false, // User's own posts
      isSaved: false,
      isFollowing: false,
    }))
  })

/**
 * Like a post
 */
export const likePost = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: postId, context }) => {
    const userId = context.user.id

    // Check if already liked
    const existing = await db
      .select()
      .from(postLikes)
      .where(and(
        eq(postLikes.postId, postId),
        eq(postLikes.userId, userId)
      ))

    if (existing.length > 0) {
      // Unlike
      await db.delete(postLikes).where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      )
      
      await db
        .update(fashionPosts)
        .set({ likesCount: sql`${fashionPosts.likesCount} - 1` })
        .where(eq(fashionPosts.id, postId))

      return { liked: false }
    } else {
      // Like
      await db.insert(postLikes).values({
        id: crypto.randomUUID(),
        postId,
        userId,
      })
      
      await db
        .update(fashionPosts)
        .set({ likesCount: sql`${fashionPosts.likesCount} + 1` })
        .where(eq(fashionPosts.id, postId))

      return { liked: true }
    }
  })

/**
 * Save a post
 */
export const savePost = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: postId, context }) => {
    const userId = context.user.id

    // Check if already saved
    const existing = await db
      .select()
      .from(postSaves)
      .where(and(
        eq(postSaves.postId, postId),
        eq(postSaves.userId, userId)
      ))

    if (existing.length > 0) {
      // Unsave
      await db.delete(postSaves).where(
        and(
          eq(postSaves.postId, postId),
          eq(postSaves.userId, userId)
        )
      )
      
      await db
        .update(fashionPosts)
        .set({ savesCount: sql`${fashionPosts.savesCount} - 1` })
        .where(eq(fashionPosts.id, postId))

      return { saved: false }
    } else {
      // Save
      await db.insert(postSaves).values({
        id: crypto.randomUUID(),
        postId,
        userId,
      })
      
      await db
        .update(fashionPosts)
        .set({ savesCount: sql`${fashionPosts.savesCount} + 1` })
        .where(eq(fashionPosts.id, postId))

      return { saved: true }
    }
  })

/**
 * Increment share count
 */
export const sharePost = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: postId }) => {
    await db
      .update(fashionPosts)
      .set({ sharesCount: sql`${fashionPosts.sharesCount} + 1` })
      .where(eq(fashionPosts.id, postId))

    return { success: true }
  })

/**
 * Increment view count
 */
export const viewPost = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: postId }) => {
    await db
      .update(fashionPosts)
      .set({ viewsCount: sql`${fashionPosts.viewsCount} + 1` })
      .where(eq(fashionPosts.id, postId))

    return { success: true }
  })

/**
 * Follow a user
 */
export const followUser = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: followingId, context }) => {
    const followerId = context.user.id

    if (followerId === followingId) {
      throw new Error('Cannot follow yourself')
    }

    // Check if already following
    const existing = await db
      .select()
      .from(userFollows)
      .where(and(
        eq(userFollows.followerId, followerId),
        eq(userFollows.followingId, followingId)
      ))

    if (existing.length > 0) {
      // Unfollow
      await db.delete(userFollows).where(
        and(
          eq(userFollows.followerId, followerId),
          eq(userFollows.followingId, followingId)
        )
      )

      return { following: false }
    } else {
      // Follow
      await db.insert(userFollows).values({
        id: crypto.randomUUID(),
        followerId,
        followingId,
      })

      return { following: true }
    }
  })

/**
 * Get user's followers and following lists
 */
export const getFollowLists = jwtProtectedProcedure
  .input(z.object({
    userId: z.string().optional(), // If not provided, use current user
  }))
  .handler(async ({ input, context }) => {
    const targetUserId = input.userId || context.user.id

    // Get followers
    const followers = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        followedAt: userFollows.createdAt,
      })
      .from(userFollows)
      .leftJoin(user, eq(userFollows.followerId, user.id))
      .where(eq(userFollows.followingId, targetUserId))
      .orderBy(desc(userFollows.createdAt))

    // Get following
    const following = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        followedAt: userFollows.createdAt,
      })
      .from(userFollows)
      .leftJoin(user, eq(userFollows.followingId, user.id))
      .where(eq(userFollows.followerId, targetUserId))
      .orderBy(desc(userFollows.createdAt))

    return {
      followers,
      following,
      followersCount: followers.length,
      followingCount: following.length,
    }
  })

/**
 * Get a single post by ID
 */
export const getPostById = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: postId, context }) => {
    const userId = context.user.id

    const posts = await db
      .select({
        id: fashionPosts.id,
        userId: fashionPosts.userId,
        caption: fashionPosts.caption,
        likesCount: fashionPosts.likesCount,
        sharesCount: fashionPosts.sharesCount,
        savesCount: fashionPosts.savesCount,
        viewsCount: fashionPosts.viewsCount,
        sceneMode: fashionPosts.sceneMode,
        backgroundColor: fashionPosts.backgroundColor,
        isDraft: fashionPosts.isDraft,
        isPublished: fashionPosts.isPublished,
        createdAt: fashionPosts.createdAt,
        updatedAt: fashionPosts.updatedAt,
        // User info
        userName: user.name,
        userImage: user.image,
      })
      .from(fashionPosts)
      .leftJoin(user, eq(fashionPosts.userId, user.id))
      .where(eq(fashionPosts.id, postId))
      .limit(1)

    if (posts.length === 0) {
      throw new Error('Post not found')
    }

    const post = posts[0]!

    // Check if user owns this post
    if (post.userId !== userId) {
      throw new Error('Unauthorized')
    }

    // Get items and text elements
    const items = await db
      .select({
        id: postItems.id,
        postId: postItems.postId,
        productId: postItems.productId,
        modelId: postItems.modelId,
        leftLegFile: postItems.leftLegFile,
        boneName: postItems.boneName,
        bodyPartType: postItems.bodyPartType,
        scale: postItems.scale,
        positionX: postItems.positionX,
        positionY: postItems.positionY,
        positionZ: postItems.positionZ,
        productName: sql<string>`${products.name}`.as('productName'),
      })
      .from(postItems)
      .leftJoin(products, eq(postItems.productId, products.id))
      .where(eq(postItems.postId, postId))
    
    const textElements = await db.select().from(postTextElements).where(eq(postTextElements.postId, postId))

    return {
      ...post,
      items,
      textElements,
    }
  })

/**
 * Update an existing post
 */
export const updatePost = jwtProtectedProcedure
  .input(z.object({
    postId: z.string(),
    caption: z.string().optional().nullable(),
    isDraft: z.boolean().default(false),
    sceneMode: z.enum(['2d', '3d']).default('3d'),
    backgroundColor: z.enum(['floor', 'studio', 'outdoor', 'minimal']).optional().nullable(),
    items: z.array(z.object({
      productId: z.string(),
      modelId: z.string(),
      leftLegFile: z.string().optional().nullable(),
      boneName: z.string(),
      bodyPartType: z.string(),
      scale: z.number(),
      positionX: z.number(),
      positionY: z.number(),
      positionZ: z.number(),
    })).default([]),
    textElements: z.array(z.object({
      content: z.string(),
      positionX: z.number(),
      positionY: z.number(),
      fontSize: z.number(),
      fontFamily: z.string(),
      color: z.string(),
      rotation: z.number(),
      zIndex: z.number(),
    })).default([]),
  }))
  .handler(async ({ input, context }) => {
    const userId = context.user.id
    const { postId } = input

    console.log('[updatePost] Input received:', JSON.stringify(input, null, 2));

    // Verify ownership
    const existingPost = await db
      .select()
      .from(fashionPosts)
      .where(eq(fashionPosts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      throw new Error('Post not found')
    }

    if (existingPost[0]!.userId !== userId) {
      throw new Error('Unauthorized')
    }

    // Update post
    await db
      .update(fashionPosts)
      .set({
        caption: input.caption,
        isDraft: input.isDraft,
        sceneMode: input.sceneMode,
        backgroundColor: input.backgroundColor,
        isPublished: !input.isDraft,
        updatedAt: new Date(),
      })
      .where(eq(fashionPosts.id, postId))

    // Delete old items and text elements
    await db.delete(postItems).where(eq(postItems.postId, postId))
    await db.delete(postTextElements).where(eq(postTextElements.postId, postId))

    // Insert new items
    if (input.items.length > 0) {
      await db.insert(postItems).values(
        input.items.map(item => ({
          id: crypto.randomUUID(),
          postId,
          productId: item.productId,
          modelId: item.modelId,
          leftLegFile: item.leftLegFile || null,
          boneName: item.boneName,
          bodyPartType: item.bodyPartType,
          scale: item.scale.toString(),
          positionX: item.positionX.toString(),
          positionY: item.positionY.toString(),
          positionZ: item.positionZ.toString(),
        }))
      )
    }

    // Insert new text elements
    if (input.textElements.length > 0) {
      await db.insert(postTextElements).values(
        input.textElements.map(text => ({
          id: crypto.randomUUID(),
          postId,
          content: text.content,
          positionX: text.positionX.toString(),
          positionY: text.positionY.toString(),
          fontSize: text.fontSize,
          fontFamily: text.fontFamily,
          color: text.color,
          rotation: text.rotation.toString(),
          zIndex: text.zIndex,
        }))
      )
    }

    return { success: true, postId }
  })

/**
 * Delete a post
 */
export const deletePost = jwtProtectedProcedure
  .input(z.string())
  .handler(async ({ input: postId, context }) => {
    const userId = context.user.id

    // Delete items and text elements first
    await db.delete(postItems).where(eq(postItems.postId, postId))
    await db.delete(postTextElements).where(eq(postTextElements.postId, postId))
    await db.delete(postLikes).where(eq(postLikes.postId, postId))
    await db.delete(postSaves).where(eq(postSaves.postId, postId))

    // Delete post
    await db.delete(fashionPosts).where(
      and(
        eq(fashionPosts.id, postId),
        eq(fashionPosts.userId, userId)
      )
    )

    return { success: true }
  })
