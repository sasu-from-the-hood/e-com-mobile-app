import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  json,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { products } from "./products";

// Dynamic product attributes system
export const attributeGroups = mysqlTable("attribute_groups", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  isRequired: boolean("is_required").default(false),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("attr_groups_slug_idx").on(table.slug),
}));

export const attributes = mysqlTable("attributes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  groupId: varchar("group_id", { length: 36 }).references(() => attributeGroups.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // text, number, select, multiselect, boolean, color, image
  options: json("options").$type<string[]>(), // For select/multiselect types
  isRequired: boolean("is_required").default(false),
  isFilterable: boolean("is_filterable").default(true),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  groupIdx: index("attributes_group_idx").on(table.groupId),
  slugIdx: index("attributes_slug_idx").on(table.slug),
}));

export const productAttributes = mysqlTable("product_attributes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id, { onDelete: "cascade" }).notNull(),
  attributeId: varchar("attribute_id", { length: 36 }).references(() => attributes.id, { onDelete: "cascade" }).notNull(),
  value: text("value").notNull(), // JSON string for complex values
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
}, (table) => ({
  productIdx: index("prod_attrs_product_idx").on(table.productId),
  attributeIdx: index("prod_attrs_attribute_idx").on(table.attributeId),
  productAttributeIdx: index("prod_attrs_unique_idx").on(table.productId, table.attributeId),
}));

// Relations
export const attributeGroupsRelations = relations(attributeGroups, ({ many }) => ({
  attributes: many(attributes),
}));

export const attributesRelations = relations(attributes, ({ one, many }) => ({
  group: one(attributeGroups, {
    fields: [attributes.groupId],
    references: [attributeGroups.id],
  }),
  productAttributes: many(productAttributes),
}));

export const productAttributesRelations = relations(productAttributes, ({ one }) => ({
  product: one(products, {
    fields: [productAttributes.productId],
    references: [products.id],
  }),
  attribute: one(attributes, {
    fields: [productAttributes.attributeId],
    references: [attributes.id],
  }),
}));