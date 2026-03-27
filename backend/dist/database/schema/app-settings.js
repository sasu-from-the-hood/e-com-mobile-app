import { mysqlTable, varchar, text, timestamp, } from "drizzle-orm/mysql-core";
export const appSettings = mysqlTable("app_settings", {
    id: varchar("id", { length: 36 }).primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(), // e.g., "app_name", "contact_email"
    value: text("value").notNull(),
    description: varchar("description", { length: 255 }), // Description of what this setting does
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
//# sourceMappingURL=app-settings.js.map