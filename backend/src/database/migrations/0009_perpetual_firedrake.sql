CREATE TABLE `warehouses` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`phone` varchar(20),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `warehouses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `warehouse_id` varchar(36);--> statement-breakpoint
ALTER TABLE `orders` ADD `delivery_boy` boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX `warehouses_name_idx` ON `warehouses` (`name`);--> statement-breakpoint
CREATE INDEX `warehouses_active_idx` ON `warehouses` (`is_active`);--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_warehouse_id_warehouses_id_fk` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `products_warehouse_idx` ON `products` (`warehouse_id`);