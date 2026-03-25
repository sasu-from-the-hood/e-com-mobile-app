CREATE TABLE `app_settings` (
	`id` varchar(36) NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` varchar(255),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `app_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `help_articles` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`image` varchar(500),
	`order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `help_articles_id` PRIMARY KEY(`id`)
);
