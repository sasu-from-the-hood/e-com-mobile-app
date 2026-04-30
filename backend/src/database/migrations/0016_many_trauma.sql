ALTER TABLE `products` MODIFY COLUMN `is_active` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `products` ADD `vendor_id` varchar(36);--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_vendor_id_user_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `products_vendor_idx` ON `products` (`vendor_id`);