import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { warehouses } from "./warehouses.js";

export const deliveryBoys = mysqlTable("delivery_boys", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(), // Hashed password
  email: varchar("email", { length: 255 }),
  photo: varchar("photo", { length: 500 }),
  vehicleType: varchar("vehicle_type", { length: 50 }), // bike, motorcycle, car
  vehiclePlateNumber: varchar("vehicle_plate_number", { length: 50 }),
  warehouseId: varchar("warehouse_id", { length: 36 }).references(() => warehouses.id),
  isActive: boolean("is_active").default(true),
  isAvailable: boolean("is_available").default(true),
  totalDeliveries: int("total_deliveries").default(0),
  currentAssignedOrders: int("current_assigned_orders").default(0),
  rating: varchar("rating", { length: 10 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  nameIdx: index("delivery_boys_name_idx").on(table.name),
  phoneIdx: index("delivery_boys_phone_idx").on(table.phone),
  warehouseIdx: index("delivery_boys_warehouse_idx").on(table.warehouseId),
  activeIdx: index("delivery_boys_active_idx").on(table.isActive),
}));

export const deliveryBoysRelations = relations(deliveryBoys, ({ one }) => ({
  warehouse: one(warehouses, {
    fields: [deliveryBoys.warehouseId],
    references: [warehouses.id],
  }),
}));
