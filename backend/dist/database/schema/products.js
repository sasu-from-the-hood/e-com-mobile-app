import { mysqlTable, varchar, text, timestamp, boolean, int, decimal, json, index, } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { warehouses } from "./warehouses";
export const products = mysqlTable("products", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    colorImages: json("color_images").$type().default({}), // Images per color
    categoryId: varchar("category_id", { length: 36 }).references(() => categories.id),
    warehouseId: varchar("warehouse_id", { length: 36 }).references(() => warehouses.id),
    sku: varchar("sku", { length: 100 }).unique(),
    sizes: json("sizes").$type().default([]), // Available sizes
    tags: json("tags").$type().default([]),
    variantStock: json("variant_stock").$type().default({}), // Stock per color-size variant
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    reviewCount: int("review_count").default(0),
    inStock: boolean("in_stock").default(true),
    stockQuantity: int("stock_quantity").default(0), // Total calculated from variants
    lowStockThreshold: int("low_stock_threshold").default(10),
    discount: int("discount").default(0),
    weight: decimal("weight", { precision: 8, scale: 2 }), // For shipping calculations
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    isDigital: boolean("is_digital").default(false),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => ({
    categoryIdx: index("products_category_idx").on(table.categoryId),
    warehouseIdx: index("products_warehouse_idx").on(table.warehouseId),
    priceIdx: index("products_price_idx").on(table.price),
    nameIdx: index("products_name_idx").on(table.name),
    slugIdx: index("products_slug_idx").on(table.slug),
    featuredIdx: index("products_featured_idx").on(table.isFeatured),
}));
export const productsRelations = relations(products, ({ one }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    warehouse: one(warehouses, {
        fields: [products.warehouseId],
        references: [warehouses.id],
    }),
}));
//# sourceMappingURL=products.js.map