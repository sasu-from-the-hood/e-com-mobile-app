import { mysqlTable, varchar, text, timestamp, boolean, index, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
export const addresses = mysqlTable("addresses", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    latitude: varchar("latitude", { length: 20 }),
    longitude: varchar("longitude", { length: 20 }),
    instructions: text("instructions"),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    userIdx: index("addresses_user_idx").on(table.userId),
}));
export const addressesRelations = relations(addresses, ({ one }) => ({
    user: one(user, {
        fields: [addresses.userId],
        references: [user.id],
    }),
}));
//# sourceMappingURL=addresses.js.map