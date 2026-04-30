import { mysqlTable, varchar, timestamp, primaryKey, } from "drizzle-orm/mysql-core";
import { user } from "./auth-schema.js";
import { warehouses } from "./warehouses.js";
export const vendorWarehouses = mysqlTable("vendor_warehouses", {
    vendorId: varchar("vendor_id", { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    warehouseId: varchar("warehouse_id", { length: 36 })
        .notNull()
        .references(() => warehouses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.vendorId, table.warehouseId] }),
}));
//# sourceMappingURL=vendor-warehouses.js.map