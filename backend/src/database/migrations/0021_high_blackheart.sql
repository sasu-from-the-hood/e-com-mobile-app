CREATE TABLE `delivery_boy_warehouses` (
	`delivery_boy_id` varchar(36) NOT NULL,
	`warehouse_id` varchar(36) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `delivery_boy_warehouses_delivery_boy_id_warehouse_id_pk` PRIMARY KEY(`delivery_boy_id`,`warehouse_id`)
);
--> statement-breakpoint
ALTER TABLE `delivery_boy_warehouses` ADD CONSTRAINT `delivery_boy_warehouses_delivery_boy_id_delivery_boys_id_fk` FOREIGN KEY (`delivery_boy_id`) REFERENCES `delivery_boys`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `delivery_boy_warehouses` ADD CONSTRAINT `delivery_boy_warehouses_warehouse_id_warehouses_id_fk` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `delivery_boy_warehouses_delivery_boy_idx` ON `delivery_boy_warehouses` (`delivery_boy_id`);--> statement-breakpoint
CREATE INDEX `delivery_boy_warehouses_warehouse_idx` ON `delivery_boy_warehouses` (`warehouse_id`);