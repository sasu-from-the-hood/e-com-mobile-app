CREATE TABLE `vendor_warehouses` (
	`vendor_id` varchar(36) NOT NULL,
	`warehouse_id` varchar(36) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `vendor_warehouses_vendor_id_warehouse_id_pk` PRIMARY KEY(`vendor_id`,`warehouse_id`)
);
--> statement-breakpoint
ALTER TABLE `vendor_warehouses` ADD CONSTRAINT `vendor_warehouses_vendor_id_user_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_warehouses` ADD CONSTRAINT `vendor_warehouses_warehouse_id_warehouses_id_fk` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE cascade ON UPDATE no action;