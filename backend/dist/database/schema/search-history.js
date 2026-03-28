import { mysqlTable, varchar, timestamp, int, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";
export const searchHistory = mysqlTable("search_history", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }),
    query: varchar("query", { length: 255 }).notNull(),
    resultCount: int("result_count").default(0),
    clickedProductId: varchar("clicked_product_id", { length: 36 }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
});
export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
    user: one(user, {
        fields: [searchHistory.userId],
        references: [user.id],
    }),
}));
//# sourceMappingURL=search-history.js.map