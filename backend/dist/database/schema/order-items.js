import { mysqlTable, varchar, timestamp, int, decimal, text, json, index, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders.js";
import { products } from "./products.js";
export const orderItems = mysqlTable("order_items", {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 }).references(() => orders.id, { onDelete: "cascade" }).notNull(),
    productId: varchar("product_id", { length: 36 }).references(() => products.id).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(), // Snapshot at time of order
    productImage: text("product_image"), // Snapshot at time of order
    quantity: int("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    size: varchar("size", { length: 50 }),
    color: varchar("color", { length: 50 }),
    variant: varchar("variant", { length: 100 }), // For product variants
    sku: varchar("sku", { length: 100 }), // Product SKU at time of order
    weight: decimal("weight", { precision: 8, scale: 2 }),
    customizations: json("customizations").$type().default({}), // For personalized items
    giftMessage: text("gift_message"),
    isGift: varchar("is_gift", { length: 5 }).default("false"),
    returnStatus: varchar("return_status", { length: 50 }), // none, requested, approved, returned, refunded
    returnReason: text("return_reason"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
    orderIdx: index("order_items_order_idx").on(table.orderId),
    productIdx: index("order_items_product_idx").on(table.productId),
    returnStatusIdx: index("order_items_return_status_idx").on(table.returnStatus),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));
//# sourceMappingURL=order-items.js.map