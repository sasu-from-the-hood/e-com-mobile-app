CREATE TABLE `product_variants` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`sku` varchar(100) NOT NULL,
	`color` varchar(50),
	`size` varchar(50),
	`material` varchar(100),
	`price` decimal(10,2),
	`original_price` decimal(10,2),
	`stock_quantity` int DEFAULT 0,
	`low_stock_threshold` int DEFAULT 5,
	`weight` decimal(8,2),
	`dimensions` json,
	`images` json DEFAULT ('[]'),
	`is_active` boolean DEFAULT true,
	`is_default` boolean DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_variants_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `attribute_groups` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`is_required` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `attribute_groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `attribute_groups_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `attributes` (
	`id` varchar(36) NOT NULL,
	`group_id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL,
	`options` json,
	`is_required` boolean DEFAULT false,
	`is_filterable` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `attributes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_attributes` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`attribute_id` varchar(36) NOT NULL,
	`value` text NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_attributes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_media` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`variant_id` varchar(36),
	`type` varchar(20) NOT NULL,
	`url` varchar(500) NOT NULL,
	`thumbnail_url` varchar(500),
	`alt_text` varchar(255),
	`title` varchar(255),
	`file_size` int,
	`mime_type` varchar(100),
	`width` int,
	`height` int,
	`duration` int,
	`sort_order` int DEFAULT 0,
	`is_primary` boolean DEFAULT false,
	`is_active` boolean DEFAULT true,
	`seo_title` varchar(255),
	`seo_description` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_transactions` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`variant_id` varchar(36),
	`type` varchar(20) NOT NULL,
	`quantity` int NOT NULL,
	`previous_stock` int NOT NULL,
	`new_stock` int NOT NULL,
	`unit_cost` decimal(10,2),
	`total_cost` decimal(10,2),
	`reference_type` varchar(50),
	`reference_id` varchar(36),
	`reason` varchar(255),
	`notes` text,
	`batch_number` varchar(100),
	`expiry_date` timestamp,
	`performed_by` varchar(36),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stock_alerts` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`variant_id` varchar(36),
	`alert_type` varchar(20) NOT NULL,
	`threshold` int,
	`current_stock` int,
	`message` text,
	`is_resolved` boolean DEFAULT false,
	`resolved_at` timestamp,
	`resolved_by` varchar(36),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_collection_items` (
	`id` varchar(36) NOT NULL,
	`collection_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_collection_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_collections` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`type` varchar(50) NOT NULL,
	`rules` json,
	`image` varchar(500),
	`sort_order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`is_featured` boolean DEFAULT false,
	`meta_title` varchar(255),
	`meta_description` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_collections_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_collections_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product_seo` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`meta_title` varchar(255),
	`meta_description` text,
	`meta_keywords` text,
	`canonical_url` varchar(500),
	`og_title` varchar(255),
	`og_description` text,
	`og_image` varchar(500),
	`og_type` varchar(50) DEFAULT 'product',
	`twitter_card` varchar(50) DEFAULT 'summary_large_image',
	`twitter_title` varchar(255),
	`twitter_description` text,
	`twitter_image` varchar(500),
	`structured_data` json,
	`robots_meta` varchar(100) DEFAULT 'index,follow',
	`is_indexable` boolean DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_seo_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_seo_product_id_unique` UNIQUE(`product_id`)
);
--> statement-breakpoint
ALTER TABLE `cart_items` MODIFY COLUMN `selected` varchar(5) DEFAULT 'false';--> statement-breakpoint
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attributes` ADD CONSTRAINT `attributes_group_id_attribute_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `attribute_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_attributes` ADD CONSTRAINT `product_attributes_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_attributes` ADD CONSTRAINT `product_attributes_attribute_id_attributes_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_media` ADD CONSTRAINT `product_media_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_media` ADD CONSTRAINT `product_media_variant_id_product_variants_id_fk` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_transactions` ADD CONSTRAINT `inventory_transactions_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_transactions` ADD CONSTRAINT `inventory_transactions_variant_id_product_variants_id_fk` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_alerts` ADD CONSTRAINT `stock_alerts_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_alerts` ADD CONSTRAINT `stock_alerts_variant_id_product_variants_id_fk` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_collection_items` ADD CONSTRAINT `product_collection_items_collection_id_product_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `product_collections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_collection_items` ADD CONSTRAINT `product_collection_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_seo` ADD CONSTRAINT `product_seo_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `variants_product_idx` ON `product_variants` (`product_id`);--> statement-breakpoint
CREATE INDEX `variants_sku_idx` ON `product_variants` (`sku`);--> statement-breakpoint
CREATE INDEX `variants_color_size_idx` ON `product_variants` (`color`,`size`);--> statement-breakpoint
CREATE INDEX `attr_groups_slug_idx` ON `attribute_groups` (`slug`);--> statement-breakpoint
CREATE INDEX `attributes_group_idx` ON `attributes` (`group_id`);--> statement-breakpoint
CREATE INDEX `attributes_slug_idx` ON `attributes` (`slug`);--> statement-breakpoint
CREATE INDEX `prod_attrs_product_idx` ON `product_attributes` (`product_id`);--> statement-breakpoint
CREATE INDEX `prod_attrs_attribute_idx` ON `product_attributes` (`attribute_id`);--> statement-breakpoint
CREATE INDEX `prod_attrs_unique_idx` ON `product_attributes` (`product_id`,`attribute_id`);--> statement-breakpoint
CREATE INDEX `media_product_idx` ON `product_media` (`product_id`);--> statement-breakpoint
CREATE INDEX `media_variant_idx` ON `product_media` (`variant_id`);--> statement-breakpoint
CREATE INDEX `media_type_idx` ON `product_media` (`type`);--> statement-breakpoint
CREATE INDEX `media_primary_idx` ON `product_media` (`is_primary`);--> statement-breakpoint
CREATE INDEX `inv_trans_product_idx` ON `inventory_transactions` (`product_id`);--> statement-breakpoint
CREATE INDEX `inv_trans_variant_idx` ON `inventory_transactions` (`variant_id`);--> statement-breakpoint
CREATE INDEX `inv_trans_type_idx` ON `inventory_transactions` (`type`);--> statement-breakpoint
CREATE INDEX `inv_trans_date_idx` ON `inventory_transactions` (`created_at`);--> statement-breakpoint
CREATE INDEX `inv_trans_reference_idx` ON `inventory_transactions` (`reference_type`,`reference_id`);--> statement-breakpoint
CREATE INDEX `stock_alerts_product_idx` ON `stock_alerts` (`product_id`);--> statement-breakpoint
CREATE INDEX `stock_alerts_variant_idx` ON `stock_alerts` (`variant_id`);--> statement-breakpoint
CREATE INDEX `stock_alerts_type_idx` ON `stock_alerts` (`alert_type`);--> statement-breakpoint
CREATE INDEX `stock_alerts_resolved_idx` ON `stock_alerts` (`is_resolved`);--> statement-breakpoint
CREATE INDEX `collection_items_collection_idx` ON `product_collection_items` (`collection_id`);--> statement-breakpoint
CREATE INDEX `collection_items_product_idx` ON `product_collection_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `collection_items_unique_idx` ON `product_collection_items` (`collection_id`,`product_id`);--> statement-breakpoint
CREATE INDEX `collections_slug_idx` ON `product_collections` (`slug`);--> statement-breakpoint
CREATE INDEX `collections_type_idx` ON `product_collections` (`type`);--> statement-breakpoint
CREATE INDEX `seo_product_idx` ON `product_seo` (`product_id`);