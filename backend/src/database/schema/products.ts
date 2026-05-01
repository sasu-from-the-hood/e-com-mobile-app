import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  decimal,
  json,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories.js";
import { warehouses } from "./warehouses.js";
import { user } from "./auth-schema.js";

export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 20 }).default("single"), // 'single' or 'collection'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  colorImages: json("color_images").$type<Record<string, string[]>>().default({}),
  mediaType: varchar("media_type", { length: 20 }).default("image"),
  glbModelIds: json("glb_model_ids").$type<string[]>().default([]),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id),
  warehouseId: varchar("warehouse_id", { length: 36 }).references(() => warehouses.id),
  vendorId: varchar("vendor_id", { length: 36 }).references(() => user.id, { onDelete: "set null" }),
  sku: varchar("sku", { length: 100 }).unique(),
  sizes: json("sizes").$type<string[]>().default([]),
  tags: json("tags").$type<string[]>().default([]),
  variantStock: json("variant_stock").$type<Record<string, number>>().default({}),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("review_count").default(0),
  inStock: boolean("in_stock").default(true),
  stockQuantity: int("stock_quantity").default(0),
  lowStockThreshold: int("low_stock_threshold").default(10),
  discount: int("discount").default(0),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(false), // false until admin approves
  isFeatured: boolean("is_featured").default(false),
  isDigital: boolean("is_digital").default(false),
  rejectionReason: text("rejection_reason"), // Reason if product is rejected by admin
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  categoryIdx: index("products_category_idx").on(table.categoryId),
  warehouseIdx: index("products_warehouse_idx").on(table.warehouseId),
  vendorIdx: index("products_vendor_idx").on(table.vendorId),
  priceIdx: index("products_price_idx").on(table.price),
  nameIdx: index("products_name_idx").on(table.name),
  slugIdx: index("products_slug_idx").on(table.slug),
  featuredIdx: index("products_featured_idx").on(table.isFeatured),
  typeIdx: index("products_type_idx").on(table.type),
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