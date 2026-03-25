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
import { products } from "./products";
import { productVariants } from "./product-variants";

// Enhanced media management
export const productMedia = mysqlTable("product_media", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
  variantId: varchar("variant_id", { length: 36 }).references(() => productVariants.id, { onDelete: "cascade" }),
  
  // Media details
  type: varchar("type", { length: 20 }).notNull(), // image, video, 3d_model, ar_model
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  altText: varchar("alt_text", { length: 255 }),
  title: varchar("title", { length: 255 }),
  
  // Media metadata
  fileSize: int("file_size"), // in bytes
  mimeType: varchar("mime_type", { length: 100 }),
  width: int("width"),
  height: int("height"),
  duration: int("duration"), // for videos in seconds
  
  // Organization
  sortOrder: int("sort_order").default(0),
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
  
  // SEO and accessibility
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  productIdx: index("media_product_idx").on(table.productId),
  variantIdx: index("media_variant_idx").on(table.variantId),
  typeIdx: index("media_type_idx").on(table.type),
  primaryIdx: index("media_primary_idx").on(table.isPrimary),
}));

export const productMediaRelations = relations(productMedia, ({ one }) => ({
  product: one(products, {
    fields: [productMedia.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productMedia.variantId],
    references: [productVariants.id],
  }),
}));