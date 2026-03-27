import { mysqlTable, varchar, text, timestamp, boolean, int, json, index, uniqueIndex, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { products } from "./products";
import { orders } from "./orders";
export const reviews = mysqlTable("reviews", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
    productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
    orderId: varchar("order_id", { length: 36 }).references(() => orders.id),
    rating: int("rating").notNull(), // 1-5
    title: varchar("title", { length: 255 }),
    comment: text("comment"),
    pros: text("pros"), // What user liked
    cons: text("cons"), // What user didn't like
    images: json("images").$type().default([]), // Review images
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    helpful: int("helpful").default(0),
    notHelpful: int("not_helpful").default(0),
    isApproved: boolean("is_approved").default(false),
    moderatorNotes: text("moderator_notes"),
    size: varchar("size", { length: 50 }), // Size purchased
    color: varchar("color", { length: 50 }), // Color purchased
    variant: varchar("variant", { length: 100 }),
    wouldRecommend: boolean("would_recommend"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    userIdx: index("reviews_user_idx").on(table.userId),
    productIdx: index("reviews_product_idx").on(table.productId),
    ratingIdx: index("reviews_rating_idx").on(table.rating),
    approvedIdx: index("reviews_approved_idx").on(table.isApproved),
    verifiedIdx: index("reviews_verified_idx").on(table.isVerifiedPurchase),
    userProductIdx: uniqueIndex("reviews_user_product_idx").on(table.userId, table.productId, table.orderId),
}));
export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(user, {
        fields: [reviews.userId],
        references: [user.id],
    }),
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
    order: one(orders, {
        fields: [reviews.orderId],
        references: [orders.id],
    }),
}));
//# sourceMappingURL=reviews.js.map