import {
  mysqlTable,
  varchar,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";
import { products } from "./products.js";

export const userInteractions = mysqlTable("user_interactions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  productId: varchar("product_id", { length: 36 }).notNull(),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(), // view, favorite, cart, purchase
  score: int("score").default(1), // weight for recommendation algorithm
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
});

export const userInteractionsRelations = relations(userInteractions, ({ one }) => ({
  user: one(user, {
    fields: [userInteractions.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [userInteractions.productId],
    references: [products.id],
  }),
}));