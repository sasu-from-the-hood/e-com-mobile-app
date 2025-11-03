DROP INDEX `products_brand_idx` ON `products`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `short_description`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `image`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `images`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `brand`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `colors`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `specifications`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `dimensions`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `meta_title`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `meta_description`;