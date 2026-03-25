CREATE TABLE `delivery_boys` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(255),
	`photo` varchar(500),
	`vehicle_type` varchar(50),
	`vehicle_plate_number` varchar(50),
	`warehouse_id` varchar(36),
	`is_active` boolean DEFAULT true,
	`is_available` boolean DEFAULT true,
	`total_deliveries` int DEFAULT 0,
	`current_assigned_orders` int DEFAULT 0,
	`rating` varchar(10) DEFAULT '0',
	`notes` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `delivery_boys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `delivery_boy_id` varchar(36);--> statement-breakpoint
ALTER TABLE `delivery_boys` ADD CONSTRAINT `delivery_boys_warehouse_id_warehouses_id_fk` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `delivery_boys_name_idx` ON `delivery_boys` (`name`);--> statement-breakpoint
CREATE INDEX `delivery_boys_phone_idx` ON `delivery_boys` (`phone`);--> statement-breakpoint
CREATE INDEX `delivery_boys_warehouse_idx` ON `delivery_boys` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `delivery_boys_active_idx` ON `delivery_boys` (`is_active`);