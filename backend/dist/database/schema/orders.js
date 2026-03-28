import { mysqlTable, varchar, text, timestamp, boolean, decimal, json, index, uniqueIndex, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";
import { addresses } from "./addresses.js";
import { paymentMethods } from "./payment-methods.js";
export const orders = mysqlTable("orders", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
    orderNumber: varchar("order_number", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    // pending, confirmed, processing, packed, shipped, out_for_delivery, delivered, cancelled, refunded, returned
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
    shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    shippingAddressId: varchar("shipping_address_id", { length: 36 }).references(() => addresses.id),
    billingAddressId: varchar("billing_address_id", { length: 36 }).references(() => addresses.id),
    paymentMethodId: varchar("payment_method_id", { length: 36 }).references(() => paymentMethods.id),
    paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // pending, paid, failed, refunded
    shippingMethod: varchar("shipping_method", { length: 100 }),
    trackingNumber: varchar("tracking_number", { length: 100 }),
    courierService: varchar("courier_service", { length: 100 }),
    deliveryBoy: boolean("delivery_boy").default(false),
    deliveryBoyId: varchar("delivery_boy_id", { length: 36 }),
    estimatedDelivery: timestamp("estimated_delivery", { fsp: 3 }),
    shippedAt: timestamp("shipped_at", { fsp: 3 }),
    deliveredAt: timestamp("delivered_at", { fsp: 3 }),
    cancelledAt: timestamp("cancelled_at", { fsp: 3 }),
    cancellationReason: text("cancellation_reason"),
    notes: text("notes"),
    metadata: json("metadata").$type().default({}),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    userIdx: index("orders_user_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    paymentStatusIdx: index("orders_payment_status_idx").on(table.paymentStatus),
    orderNumberIdx: uniqueIndex("orders_number_idx").on(table.orderNumber),
    trackingIdx: index("orders_tracking_idx").on(table.trackingNumber),
}));
export const ordersRelations = relations(orders, ({ one }) => ({
    user: one(user, {
        fields: [orders.userId],
        references: [user.id],
    }),
    shippingAddress: one(addresses, {
        fields: [orders.shippingAddressId],
        references: [addresses.id],
    }),
    billingAddress: one(addresses, {
        fields: [orders.billingAddressId],
        references: [addresses.id],
    }),
    paymentMethod: one(paymentMethods, {
        fields: [orders.paymentMethodId],
        references: [paymentMethods.id],
    }),
}));
//# sourceMappingURL=orders.js.map