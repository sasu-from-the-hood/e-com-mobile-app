import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  index,
} from "drizzle-orm/mysql-core";

export const warehouses = mysqlTable("warehouses", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  nameIdx: index("warehouses_name_idx").on(table.name),
  activeIdx: index("warehouses_active_idx").on(table.isActive),
}));
