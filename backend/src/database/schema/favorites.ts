import {
  mysqlTable,
  varchar,
  timestamp,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";
import { products } from "./products.js";

export const favorites = mysqlTable("favorites", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
  listName: varchar("list_name", { length: 100 }).default("default"), // For multiple wishlists
  notes: text("notes"), // Personal notes about the item
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
  priceWhenAdded: varchar("price_when_added", { length: 20 }), // Track price changes
  notifyOnPriceDrop: varchar("notify_on_price_drop", { length: 5 }).default("false"),
  notifyOnBackInStock: varchar("notify_on_back_in_stock", { length: 5 }).default("false"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index("favorites_user_idx").on(table.userId),
  productIdx: index("favorites_product_idx").on(table.productId),
  listIdx: index("favorites_list_idx").on(table.listName),
  priorityIdx: index("favorites_priority_idx").on(table.priority),
  userProductIdx: uniqueIndex("favorites_user_product_idx").on(table.userId, table.productId),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, {
    fields: [favorites.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));