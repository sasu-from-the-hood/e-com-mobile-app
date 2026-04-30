CREATE TABLE `fashion_posts` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`caption` text,
	`likes_count` int NOT NULL DEFAULT 0,
	`shares_count` int NOT NULL DEFAULT 0,
	`saves_count` int NOT NULL DEFAULT 0,
	`views_count` int NOT NULL DEFAULT 0,
	`is_draft` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT true,
	`scene_mode` varchar(10) NOT NULL DEFAULT '3d',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fashion_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_items` (
	`id` varchar(255) NOT NULL,
	`post_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	`model_id` varchar(255) NOT NULL,
	`bone_name` varchar(100) NOT NULL,
	`body_part_type` varchar(50) NOT NULL,
	`scale` decimal(10,2) NOT NULL DEFAULT '1.00',
	`position_x` decimal(10,2) NOT NULL DEFAULT '0.00',
	`position_y` decimal(10,2) NOT NULL DEFAULT '0.00',
	`position_z` decimal(10,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_likes` (
	`id` varchar(255) NOT NULL,
	`post_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_saves` (
	`id` varchar(255) NOT NULL,
	`post_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_saves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_text_elements` (
	`id` varchar(255) NOT NULL,
	`post_id` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`position_x` decimal(5,2) NOT NULL DEFAULT '50.00',
	`position_y` decimal(5,2) NOT NULL DEFAULT '50.00',
	`font_size` int NOT NULL DEFAULT 16,
	`font_family` varchar(100) NOT NULL DEFAULT 'Arial',
	`color` varchar(20) NOT NULL DEFAULT '#FFFFFF',
	`rotation` decimal(6,2) NOT NULL DEFAULT '0.00',
	`z_index` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_text_elements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_follows` (
	`id` varchar(255) NOT NULL,
	`follower_id` varchar(255) NOT NULL,
	`following_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_follows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `fashion_posts` (`user_id`);--> statement-breakpoint
CREATE INDEX `is_draft_idx` ON `fashion_posts` (`is_draft`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `fashion_posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `post_items` (`post_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `post_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `post_likes` (`post_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `post_likes` (`user_id`);--> statement-breakpoint
CREATE INDEX `unique_post_user` ON `post_likes` (`post_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `post_saves` (`post_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `post_saves` (`user_id`);--> statement-breakpoint
CREATE INDEX `unique_post_user` ON `post_saves` (`post_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `post_text_elements` (`post_id`);--> statement-breakpoint
CREATE INDEX `follower_id_idx` ON `user_follows` (`follower_id`);--> statement-breakpoint
CREATE INDEX `following_id_idx` ON `user_follows` (`following_id`);--> statement-breakpoint
CREATE INDEX `unique_follower_following` ON `user_follows` (`follower_id`,`following_id`);