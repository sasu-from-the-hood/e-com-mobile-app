import { mysqlTable, varchar, text, int, timestamp, boolean, decimal, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema.js';
import { products } from './products.js';
/**
 * Fashion Posts - User-created 3D fashion scenes
 */
export const fashionPosts = mysqlTable('fashion_posts', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    caption: text('caption'),
    // Engagement metrics
    likesCount: int('likes_count').default(0).notNull(),
    sharesCount: int('shares_count').default(0).notNull(),
    savesCount: int('saves_count').default(0).notNull(),
    viewsCount: int('views_count').default(0).notNull(),
    // Post status
    isDraft: boolean('is_draft').default(false).notNull(),
    isPublished: boolean('is_published').default(true).notNull(),
    // Scene settings
    sceneMode: varchar('scene_mode', { length: 10 }).default('3d').notNull(), // '2d' or '3d'
    backgroundColor: varchar('background_color', { length: 10 }).default('light'), // 'light', 'dark', 'gray'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    isDraftIdx: index('is_draft_idx').on(table.isDraft),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
}));
/**
 * Post Items - Products attached to bones in the post
 */
export const postItems = mysqlTable('post_items', {
    id: varchar('id', { length: 255 }).primaryKey(),
    postId: varchar('post_id', { length: 255 }).notNull(),
    productId: varchar('product_id', { length: 255 }).notNull(),
    // 3D model reference
    modelId: varchar('model_id', { length: 255 }).notNull(), // Reference to 3d_models table
    leftLegFile: varchar('left_leg_file', { length: 255 }), // Cached file name for faster loading
    // Bone attachment info
    boneName: varchar('bone_name', { length: 100 }).notNull(), // e.g., 'mixamorigSpine2', 'mixamorigLeftLeg'
    bodyPartType: varchar('body_part_type', { length: 50 }).notNull(), // e.g., 'chest', 'left-leg'
    // Transform data
    scale: decimal('scale', { precision: 10, scale: 2 }).default('1.00').notNull(),
    positionX: decimal('position_x', { precision: 10, scale: 2 }).default('0.00').notNull(),
    positionY: decimal('position_y', { precision: 10, scale: 2 }).default('0.00').notNull(),
    positionZ: decimal('position_z', { precision: 10, scale: 2 }).default('0.00').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    postIdIdx: index('post_id_idx').on(table.postId),
    productIdIdx: index('product_id_idx').on(table.productId),
}));
/**
 * Post Text Elements - Draggable text overlays on posts
 */
export const postTextElements = mysqlTable('post_text_elements', {
    id: varchar('id', { length: 255 }).primaryKey(),
    postId: varchar('post_id', { length: 255 }).notNull(),
    // Text content
    content: text('content').notNull(),
    // Position (2D screen coordinates, percentage-based)
    positionX: decimal('position_x', { precision: 5, scale: 2 }).default('50.00').notNull(), // 0-100%
    positionY: decimal('position_y', { precision: 5, scale: 2 }).default('50.00').notNull(), // 0-100%
    // Styling
    fontSize: int('font_size').default(16).notNull(), // in pixels
    fontFamily: varchar('font_family', { length: 100 }).default('Arial').notNull(),
    color: varchar('color', { length: 20 }).default('#FFFFFF').notNull(), // hex color
    // Transform
    rotation: decimal('rotation', { precision: 6, scale: 2 }).default('0.00').notNull(), // degrees
    // Layer order
    zIndex: int('z_index').default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    postIdIdx: index('post_id_idx').on(table.postId),
}));
/**
 * Post Likes - Track which users liked which posts
 */
export const postLikes = mysqlTable('post_likes', {
    id: varchar('id', { length: 255 }).primaryKey(),
    postId: varchar('post_id', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    postIdIdx: index('post_id_idx').on(table.postId),
    userIdIdx: index('user_id_idx').on(table.userId),
    uniquePostUser: index('unique_post_user').on(table.postId, table.userId),
}));
/**
 * Post Saves - Track which users saved which posts
 */
export const postSaves = mysqlTable('post_saves', {
    id: varchar('id', { length: 255 }).primaryKey(),
    postId: varchar('post_id', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    postIdIdx: index('post_id_idx').on(table.postId),
    userIdIdx: index('user_id_idx').on(table.userId),
    uniquePostUser: index('unique_post_user').on(table.postId, table.userId),
}));
/**
 * User Follows - Track follower/following relationships
 */
export const userFollows = mysqlTable('user_follows', {
    id: varchar('id', { length: 255 }).primaryKey(),
    followerId: varchar('follower_id', { length: 255 }).notNull(), // User who is following
    followingId: varchar('following_id', { length: 255 }).notNull(), // User being followed
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    followerIdIdx: index('follower_id_idx').on(table.followerId),
    followingIdIdx: index('following_id_idx').on(table.followingId),
    uniqueFollowerFollowing: index('unique_follower_following').on(table.followerId, table.followingId),
}));
// Relations
export const fashionPostsRelations = relations(fashionPosts, ({ one, many }) => ({
    user: one(user, {
        fields: [fashionPosts.userId],
        references: [user.id],
    }),
    items: many(postItems),
    textElements: many(postTextElements),
    likes: many(postLikes),
    saves: many(postSaves),
}));
export const postItemsRelations = relations(postItems, ({ one }) => ({
    post: one(fashionPosts, {
        fields: [postItems.postId],
        references: [fashionPosts.id],
    }),
    product: one(products, {
        fields: [postItems.productId],
        references: [products.id],
    }),
}));
export const postTextElementsRelations = relations(postTextElements, ({ one }) => ({
    post: one(fashionPosts, {
        fields: [postTextElements.postId],
        references: [fashionPosts.id],
    }),
}));
export const postLikesRelations = relations(postLikes, ({ one }) => ({
    post: one(fashionPosts, {
        fields: [postLikes.postId],
        references: [fashionPosts.id],
    }),
    user: one(user, {
        fields: [postLikes.userId],
        references: [user.id],
    }),
}));
export const postSavesRelations = relations(postSaves, ({ one }) => ({
    post: one(fashionPosts, {
        fields: [postSaves.postId],
        references: [fashionPosts.id],
    }),
    user: one(user, {
        fields: [postSaves.userId],
        references: [user.id],
    }),
}));
export const userFollowsRelations = relations(userFollows, ({ one }) => ({
    follower: one(user, {
        fields: [userFollows.followerId],
        references: [user.id],
    }),
    following: one(user, {
        fields: [userFollows.followingId],
        references: [user.id],
    }),
}));
//# sourceMappingURL=fashion-posts.js.map