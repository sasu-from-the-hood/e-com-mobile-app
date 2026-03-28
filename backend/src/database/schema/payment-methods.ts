import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";

export const paymentMethods = mysqlTable("payment_methods", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // card, paypal, apple_pay, google_pay, bank_transfer
  provider: varchar("provider", { length: 50 }), // visa, mastercard, amex, etc.
  cardNumber: varchar("card_number", { length: 20 }), // encrypted/masked (last 4 digits)
  expiryDate: varchar("expiry_date", { length: 7 }), // MM/YYYY
  cardHolderName: varchar("card_holder_name", { length: 255 }),
  billingAddressId: varchar("billing_address_id", { length: 36 }),
  paypalEmail: varchar("paypal_email", { length: 255 }),
  bankAccountNumber: varchar("bank_account_number", { length: 50 }), // encrypted/masked
  routingNumber: varchar("routing_number", { length: 20 }),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: index("payment_methods_user_idx").on(table.userId),
  typeIdx: index("payment_methods_type_idx").on(table.type),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(user, {
    fields: [paymentMethods.userId],
    references: [user.id],
  }),
}));