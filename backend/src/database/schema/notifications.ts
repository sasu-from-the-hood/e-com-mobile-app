import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  json,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), 
  // order_update, promotion, price_drop, back_in_stock, delivery_update, payment_reminder, etc.
  category: varchar("category", { length: 50 }).default("general"), // order, promotion, system, security
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"), // Deep link or URL to navigate to
  actionText: varchar("action_text", { length: 100 }), // Button text like "View Order"
  image: text("image"), // Notification image
  icon: varchar("icon", { length: 50 }), // Icon type
  priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
  read: boolean("read").default(false),
  readAt: timestamp("read_at", { fsp: 3 }),
  delivered: boolean("delivered").default(false), // For push notifications
  deliveredAt: timestamp("delivered_at", { fsp: 3 }),
  data: json("data").$type<Record<string, any>>().default({}), // Additional structured data
  expiresAt: timestamp("expires_at", { fsp: 3 }), // Auto-cleanup old notifications
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index("notifications_user_idx").on(table.userId),
  typeIdx: index("notifications_type_idx").on(table.type),
  categoryIdx: index("notifications_category_idx").on(table.category),
  readIdx: index("notifications_read_idx").on(table.read),
  priorityIdx: index("notifications_priority_idx").on(table.priority),
  expiresIdx: index("notifications_expires_idx").on(table.expiresAt),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
}));