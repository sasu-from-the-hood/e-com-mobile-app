import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  int,
  decimal,
  json,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { products } from "./products.js";

// Product Variants - for size/color combinations with individual pricing and stock
export const productVariants = mysqlTable("product_variants", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
  sku: varchar("sku", { length: 100 }).unique().notNull(),
  
  // Variant attributes
  color: varchar("color", { length: 50 }),
  size: varchar("size", { length: 50 }),
  material: varchar("material", { length: 100 }),
  
  // Pricing (can override product base price)
  price: decimal("price", { precision: 10, scale: 2 }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  
  // Stock management per variant
  stockQuantity: int("stock_quantity").default(0),
  lowStockThreshold: int("low_stock_threshold").default(5),
  
  // Variant-specific properties
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: json("dimensions").$type<{length: number, width: number, height: number}>(),
  
  // Images for this specific variant
  images: json("images").$type<string[]>().default([]),
  
  // Status
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false), // Default variant to show
  
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  productIdx: index("variants_product_idx").on(table.productId),
  skuIdx: index("variants_sku_idx").on(table.sku),
  colorSizeIdx: index("variants_color_size_idx").on(table.color, table.size),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));