ALTER TABLE `cart_items` ADD `color` varchar(50);--> statement-breakpoint
ALTER TABLE `cart_items` ADD `size` varchar(50);--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `variants`;