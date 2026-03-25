import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

export const helpArticles = mysqlTable("help_articles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Account", "Orders", "Payments", "Shipping"
  image: varchar("image", { length: 500 }), // Optional image URL
  order: int("order").default(0), // For sorting articles
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
