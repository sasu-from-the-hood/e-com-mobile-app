ALTER TABLE `products` ADD `type` varchar(20) DEFAULT 'single';--> statement-breakpoint
CREATE INDEX `products_type_idx` ON `products` (`type`);