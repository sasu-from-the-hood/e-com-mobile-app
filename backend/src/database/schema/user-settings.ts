import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  json,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const userSettings = mysqlTable("user_settings", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => user.id, { onDelete: "cascade" }).notNull(),
  
  // Biometric settings
  faceIdEnabled: boolean("face_id_enabled").default(false),
  touchIdEnabled: boolean("touch_id_enabled").default(false),
  fingerprintEnabled: boolean("fingerprint_enabled").default(false),
  
  // Notification preferences
  orderUpdates: boolean("order_updates").default(true),
  promotionalEmails: boolean("promotional_emails").default(true),
  smsNotifications: boolean("sms_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  emailNewsletter: boolean("email_newsletter").default(false),
  priceDropAlerts: boolean("price_drop_alerts").default(false),
  backInStockAlerts: boolean("back_in_stock_alerts").default(false),
  
  // App preferences
  language: varchar("language", { length: 10 }).default("en"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  timezone: varchar("timezone", { length: 50 }).default("UTC"),
  darkMode: boolean("dark_mode").default(false),
  autoPlayVideos: boolean("auto_play_videos").default(true),
  
  // Privacy settings
  profileVisibility: varchar("profile_visibility", { length: 20 }).default("public"), // public, friends, private
  showOnlineStatus: boolean("show_online_status").default(true),
  allowDataCollection: boolean("allow_data_collection").default(true),
  
  // Shopping preferences
  defaultShippingSpeed: varchar("default_shipping_speed", { length: 20 }).default("standard"),
  savePaymentMethods: boolean("save_payment_methods").default(true),
  oneClickPurchase: boolean("one_click_purchase").default(false),
  
  // Advanced settings
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  sessionTimeout: varchar("session_timeout", { length: 10 }).default("30"), // minutes
  customPreferences: json("custom_preferences").$type<Record<string, any>>().default({}),
  
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  userIdx: uniqueIndex("user_settings_user_idx").on(table.userId),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}));