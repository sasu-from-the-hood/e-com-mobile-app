CREATE TABLE `addresses` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`address_line1` text NOT NULL,
	`address_line2` text,
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`zip_code` varchar(20) NOT NULL,
	`country` varchar(100) NOT NULL,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`instructions` text,
	`is_default` boolean DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passkey` (
	`id` varchar(36) NOT NULL,
	`name` text,
	`public_key` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`credential_id` text NOT NULL,
	`counter` int NOT NULL,
	`device_type` text NOT NULL,
	`backed_up` boolean NOT NULL,
	`transports` text,
	`created_at` timestamp(3),
	`aaguid` text,
	CONSTRAINT `passkey_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	`impersonated_by` text,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`role` text,
	`banned` boolean DEFAULT false,
	`ban_reason` text,
	`ban_expires` timestamp(3),
	`phone_number` varchar(255),
	`phone_number_verified` boolean,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_phone_number_unique` UNIQUE(`phone_number`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`image` text,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`list_name` varchar(100) DEFAULT 'default',
	`notes` text,
	`priority` varchar(20) DEFAULT 'medium',
	`price_when_added` varchar(20),
	`notify_on_price_drop` varchar(5) DEFAULT 'false',
	`notify_on_back_in_stock` varchar(5) DEFAULT 'false',
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorites_user_product_idx` UNIQUE(`user_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`short_description` text,
	`price` decimal(10,2) NOT NULL,
	`original_price` decimal(10,2),
	`image` text,
	`images` json DEFAULT ('[]'),
	`category_id` varchar(36),
	`brand` varchar(100),
	`sku` varchar(100),
	`colors` json DEFAULT ('[]'),
	`sizes` json DEFAULT ('[]'),
	`tags` json DEFAULT ('[]'),
	`specifications` json DEFAULT ('{}'),
	`rating` decimal(3,2) DEFAULT '0',
	`review_count` int DEFAULT 0,
	`in_stock` boolean DEFAULT true,
	`stock_quantity` int DEFAULT 0,
	`low_stock_threshold` int DEFAULT 10,
	`discount` int DEFAULT 0,
	`weight` decimal(8,2),
	`dimensions` json,
	`is_active` boolean DEFAULT true,
	`is_featured` boolean DEFAULT false,
	`is_digital` boolean DEFAULT false,
	`meta_title` varchar(255),
	`meta_description` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` varchar(50) NOT NULL,
	`provider` varchar(50),
	`card_number` varchar(20),
	`expiry_date` varchar(7),
	`card_holder_name` varchar(255),
	`billing_address_id` varchar(36),
	`paypal_email` varchar(255),
	`bank_account_number` varchar(50),
	`routing_number` varchar(20),
	`is_default` boolean DEFAULT false,
	`is_active` boolean DEFAULT true,
	`is_verified` boolean DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`order_number` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`subtotal` decimal(10,2) NOT NULL,
	`tax` decimal(10,2) DEFAULT '0',
	`shipping` decimal(10,2) DEFAULT '0',
	`discount` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`shipping_address_id` varchar(36),
	`billing_address_id` varchar(36),
	`payment_method_id` varchar(36),
	`payment_status` varchar(50) DEFAULT 'pending',
	`shipping_method` varchar(100),
	`tracking_number` varchar(100),
	`courier_service` varchar(100),
	`estimated_delivery` timestamp(3),
	`shipped_at` timestamp(3),
	`delivered_at` timestamp(3),
	`cancelled_at` timestamp(3),
	`cancellation_reason` text,
	`notes` text,
	`metadata` json DEFAULT ('{}'),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_number_idx` UNIQUE(`order_number`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`product_image` text,
	`quantity` int NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`size` varchar(50),
	`color` varchar(50),
	`variant` varchar(100),
	`sku` varchar(100),
	`weight` decimal(8,2),
	`customizations` json DEFAULT ('{}'),
	`gift_message` text,
	`is_gift` varchar(5) DEFAULT 'false',
	`return_status` varchar(50),
	`return_reason` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`order_id` varchar(36),
	`rating` int NOT NULL,
	`title` varchar(255),
	`comment` text,
	`pros` text,
	`cons` text,
	`images` json DEFAULT ('[]'),
	`is_verified_purchase` boolean DEFAULT false,
	`helpful` int DEFAULT 0,
	`not_helpful` int DEFAULT 0,
	`is_approved` boolean DEFAULT false,
	`moderator_notes` text,
	`size` varchar(50),
	`color` varchar(50),
	`variant` varchar(100),
	`would_recommend` boolean,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_user_product_idx` UNIQUE(`user_id`,`product_id`,`order_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` varchar(50) NOT NULL,
	`category` varchar(50) DEFAULT 'general',
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`action_url` text,
	`action_text` varchar(100),
	`image` text,
	`icon` varchar(50),
	`priority` varchar(20) DEFAULT 'normal',
	`read` boolean DEFAULT false,
	`read_at` timestamp(3),
	`delivered` boolean DEFAULT false,
	`delivered_at` timestamp(3),
	`data` json DEFAULT ('{}'),
	`expires_at` timestamp(3),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`face_id_enabled` boolean DEFAULT false,
	`touch_id_enabled` boolean DEFAULT false,
	`fingerprint_enabled` boolean DEFAULT false,
	`order_updates` boolean DEFAULT true,
	`promotional_emails` boolean DEFAULT true,
	`sms_notifications` boolean DEFAULT true,
	`push_notifications` boolean DEFAULT true,
	`email_newsletter` boolean DEFAULT false,
	`price_drop_alerts` boolean DEFAULT false,
	`back_in_stock_alerts` boolean DEFAULT false,
	`language` varchar(10) DEFAULT 'en',
	`currency` varchar(10) DEFAULT 'USD',
	`timezone` varchar(50) DEFAULT 'UTC',
	`dark_mode` boolean DEFAULT false,
	`auto_play_videos` boolean DEFAULT true,
	`profile_visibility` varchar(20) DEFAULT 'public',
	`show_online_status` boolean DEFAULT true,
	`allow_data_collection` boolean DEFAULT true,
	`default_shipping_speed` varchar(20) DEFAULT 'standard',
	`save_payment_methods` boolean DEFAULT true,
	`one_click_purchase` boolean DEFAULT false,
	`two_factor_enabled` boolean DEFAULT false,
	`session_timeout` varchar(10) DEFAULT '30',
	`custom_preferences` json DEFAULT ('{}'),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_settings_user_idx` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `order_tracking` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`status` varchar(50) NOT NULL,
	`location` varchar(255),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`courier_name` varchar(100),
	`courier_phone` varchar(20),
	`courier_image` text,
	`estimated_arrival` timestamp(3),
	`notes` text,
	`internal_notes` text,
	`images` json DEFAULT ('[]'),
	`signature` text,
	`metadata` json DEFAULT ('{}'),
	`timestamp` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `order_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_history` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`query` varchar(255) NOT NULL,
	`result_count` int DEFAULT 0,
	`clicked_product_id` varchar(36),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `search_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_interactions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`interaction_type` varchar(50) NOT NULL,
	`score` int DEFAULT 1,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passkey` ADD CONSTRAINT `passkey_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_address_id_addresses_id_fk` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_billing_address_id_addresses_id_fk` FOREIGN KEY (`billing_address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_id_payment_methods_id_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_tracking` ADD CONSTRAINT `order_tracking_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `addresses_user_idx` ON `addresses` (`user_id`);--> statement-breakpoint
CREATE INDEX `favorites_user_idx` ON `favorites` (`user_id`);--> statement-breakpoint
CREATE INDEX `favorites_product_idx` ON `favorites` (`product_id`);--> statement-breakpoint
CREATE INDEX `favorites_list_idx` ON `favorites` (`list_name`);--> statement-breakpoint
CREATE INDEX `favorites_priority_idx` ON `favorites` (`priority`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `products_price_idx` ON `products` (`price`);--> statement-breakpoint
CREATE INDEX `products_name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `products_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_brand_idx` ON `products` (`brand`);--> statement-breakpoint
CREATE INDEX `products_featured_idx` ON `products` (`is_featured`);--> statement-breakpoint
CREATE INDEX `payment_methods_user_idx` ON `payment_methods` (`user_id`);--> statement-breakpoint
CREATE INDEX `payment_methods_type_idx` ON `payment_methods` (`type`);--> statement-breakpoint
CREATE INDEX `orders_user_idx` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_payment_status_idx` ON `orders` (`payment_status`);--> statement-breakpoint
CREATE INDEX `orders_tracking_idx` ON `orders` (`tracking_number`);--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_items_product_idx` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `order_items_return_status_idx` ON `order_items` (`return_status`);--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `reviews_product_idx` ON `reviews` (`product_id`);--> statement-breakpoint
CREATE INDEX `reviews_rating_idx` ON `reviews` (`rating`);--> statement-breakpoint
CREATE INDEX `reviews_approved_idx` ON `reviews` (`is_approved`);--> statement-breakpoint
CREATE INDEX `reviews_verified_idx` ON `reviews` (`is_verified_purchase`);--> statement-breakpoint
CREATE INDEX `notifications_user_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `notifications_type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `notifications_category_idx` ON `notifications` (`category`);--> statement-breakpoint
CREATE INDEX `notifications_read_idx` ON `notifications` (`read`);--> statement-breakpoint
CREATE INDEX `notifications_priority_idx` ON `notifications` (`priority`);--> statement-breakpoint
CREATE INDEX `notifications_expires_idx` ON `notifications` (`expires_at`);--> statement-breakpoint
CREATE INDEX `order_tracking_order_idx` ON `order_tracking` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_tracking_status_idx` ON `order_tracking` (`status`);--> statement-breakpoint
CREATE INDEX `order_tracking_timestamp_idx` ON `order_tracking` (`timestamp`);