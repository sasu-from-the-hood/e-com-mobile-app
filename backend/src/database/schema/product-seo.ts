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
import { products } from "./products.js";

// SEO and marketing enhancements
export const productSeo = mysqlTable("product_seo", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull().unique(),
  
  // SEO fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  
  // Open Graph
  ogTitle: varchar("og_title", { length: 255 }),
  ogDescription: text("og_description"),
  ogImage: varchar("og_image", { length: 500 }),
  ogType: varchar("og_type", { length: 50 }).default("product"),
  
  // Twitter Card
  twitterCard: varchar("twitter_card", { length: 50 }).default("summary_large_image"),
  twitterTitle: varchar("twitter_title", { length: 255 }),
  twitterDescription: text("twitter_description"),
  twitterImage: varchar("twitter_image", { length: 500 }),
  
  // Schema.org structured data
  structuredData: json("structured_data").$type<Record<string, any>>(),
  
  // Search and indexing
  robotsMeta: varchar("robots_meta", { length: 100 }).default("index,follow"),
  isIndexable: boolean("is_indexable").default(true),
  
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  productIdx: index("seo_product_idx").on(table.productId),
}));

// Product collections/bundles
export const productCollections = mysqlTable("product_collections", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // manual, automatic, bundle, cross_sell, up_sell
  
  // Automatic collection rules (JSON)
  rules: json("rules").$type<{
    conditions: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    logic: 'AND' | 'OR';
  }>(),
  
  // Display settings
  image: varchar("image", { length: 500 }),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  
  // SEO
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: index("collections_slug_idx").on(table.slug),
  typeIdx: index("collections_type_idx").on(table.type),
}));

export const productCollectionItems = mysqlTable("product_collection_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  collectionId: varchar("collection_id", { length: 36 }).references(() => productCollections.id, { onDelete: "cascade" }).notNull(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  collectionIdx: index("collection_items_collection_idx").on(table.collectionId),
  productIdx: index("collection_items_product_idx").on(table.productId),
  uniqueIdx: index("collection_items_unique_idx").on(table.collectionId, table.productId),
}));

export const productSeoRelations = relations(productSeo, ({ one }) => ({
  product: one(products, {
    fields: [productSeo.productId],
    references: [products.id],
  }),
}));

export const productCollectionsRelations = relations(productCollections, ({ many }) => ({
  items: many(productCollectionItems),
}));

export const productCollectionItemsRelations = relations(productCollectionItems, ({ one }) => ({
  collection: one(productCollections, {
    fields: [productCollectionItems.collectionId],
    references: [productCollections.id],
  }),
  product: one(products, {
    fields: [productCollectionItems.productId],
    references: [products.id],
  }),
}));