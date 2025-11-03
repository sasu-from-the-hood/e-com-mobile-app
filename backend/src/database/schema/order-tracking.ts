import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  decimal,
  json,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders";

export const orderTracking = mysqlTable("order_tracking", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id, { onDelete: "cascade" }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  // confirmed, processing, packed, shipped, out_for_delivery, delivered, exception, returned
  location: varchar("location", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  courierName: varchar("courier_name", { length: 100 }),
  courierPhone: varchar("courier_phone", { length: 20 }),
  courierImage: text("courier_image"),
  estimatedArrival: timestamp("estimated_arrival", { fsp: 3 }),
  notes: text("notes"),
  internalNotes: text("internal_notes"), // For staff only
  images: json("images").$type<string[]>().default([]), // Delivery proof images
  signature: text("signature"), // Digital signature for delivery
  metadata: json("metadata").$type<Record<string, any>>().default({}),
  timestamp: timestamp("timestamp", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  orderIdx: index("order_tracking_order_idx").on(table.orderId),
  statusIdx: index("order_tracking_status_idx").on(table.status),
  timestampIdx: index("order_tracking_timestamp_idx").on(table.timestamp),
}));

export const orderTrackingRelations = relations(orderTracking, ({ one }) => ({
  order: one(orders, {
    fields: [orderTracking.orderId],
    references: [orders.id],
  }),
}));