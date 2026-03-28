import { mysqlTable, varchar, text, timestamp, boolean, int, decimal, index, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { products } from "./products.js";
import { productVariants } from "./product-variants.js";
// Advanced inventory tracking
export const inventoryTransactions = mysqlTable("inventory_transactions", {
    id: varchar("id", { length: 36 }).primaryKey(),
    productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
    variantId: varchar("variant_id", { length: 36 }).references(() => productVariants.id, { onDelete: "cascade" }),
    // Transaction details
    type: varchar("type", { length: 20 }).notNull(), // purchase, sale, adjustment, return, damage, transfer
    quantity: int("quantity").notNull(), // positive for inbound, negative for outbound
    previousStock: int("previous_stock").notNull(),
    newStock: int("new_stock").notNull(),
    // Cost tracking
    unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
    totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
    // Reference information
    referenceType: varchar("reference_type", { length: 50 }), // order, purchase_order, adjustment, etc.
    referenceId: varchar("reference_id", { length: 36 }),
    // Additional details
    reason: varchar("reason", { length: 255 }),
    notes: text("notes"),
    batchNumber: varchar("batch_number", { length: 100 }),
    expiryDate: timestamp("expiry_date"),
    // Audit trail
    performedBy: varchar("performed_by", { length: 36 }), // user ID
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
    productIdx: index("inv_trans_product_idx").on(table.productId),
    variantIdx: index("inv_trans_variant_idx").on(table.variantId),
    typeIdx: index("inv_trans_type_idx").on(table.type),
    dateIdx: index("inv_trans_date_idx").on(table.createdAt),
    referenceIdx: index("inv_trans_reference_idx").on(table.referenceType, table.referenceId),
}));
// Stock alerts and notifications
export const stockAlerts = mysqlTable("stock_alerts", {
    id: varchar("id", { length: 36 }).primaryKey(),
    productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
    variantId: varchar("variant_id", { length: 36 }).references(() => productVariants.id, { onDelete: "cascade" }),
    alertType: varchar("alert_type", { length: 20 }).notNull(), // low_stock, out_of_stock, overstock, expiry
    threshold: int("threshold"),
    currentStock: int("current_stock"),
    message: text("message"),
    isResolved: boolean("is_resolved").default(false),
    resolvedAt: timestamp("resolved_at"),
    resolvedBy: varchar("resolved_by", { length: 36 }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
    productIdx: index("stock_alerts_product_idx").on(table.productId),
    variantIdx: index("stock_alerts_variant_idx").on(table.variantId),
    typeIdx: index("stock_alerts_type_idx").on(table.alertType),
    resolvedIdx: index("stock_alerts_resolved_idx").on(table.isResolved),
}));
export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
    product: one(products, {
        fields: [inventoryTransactions.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [inventoryTransactions.variantId],
        references: [productVariants.id],
    }),
}));
export const stockAlertsRelations = relations(stockAlerts, ({ one }) => ({
    product: one(products, {
        fields: [stockAlerts.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [stockAlerts.variantId],
        references: [productVariants.id],
    }),
}));
//# sourceMappingURL=inventory.js.map