import { mysqlTable, varchar, timestamp, primaryKey, index, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { deliveryBoys } from "./delivery-boys.js";
import { warehouses } from "./warehouses.js";
// Junction table for many-to-many relationship between delivery boys and warehouses
export const deliveryBoyWarehouses = mysqlTable("delivery_boy_warehouses", {
    deliveryBoyId: varchar("delivery_boy_id", { length: 36 })
        .notNull()
        .references(() => deliveryBoys.id, { onDelete: 'cascade' }),
    warehouseId: varchar("warehouse_id", { length: 36 })
        .notNull()
        .references(() => warehouses.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.deliveryBoyId, table.warehouseId] }),
    deliveryBoyIdx: index("delivery_boy_warehouses_delivery_boy_idx").on(table.deliveryBoyId),
    warehouseIdx: index("delivery_boy_warehouses_warehouse_idx").on(table.warehouseId),
}));
export const deliveryBoyWarehousesRelations = relations(deliveryBoyWarehouses, ({ one }) => ({
    deliveryBoy: one(deliveryBoys, {
        fields: [deliveryBoyWarehouses.deliveryBoyId],
        references: [deliveryBoys.id],
    }),
    warehouse: one(warehouses, {
        fields: [deliveryBoyWarehouses.warehouseId],
        references: [warehouses.id],
    }),
}));
//# sourceMappingURL=delivery-boy-warehouses.js.map