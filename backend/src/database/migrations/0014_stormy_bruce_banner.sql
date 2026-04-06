ALTER TABLE `products` ADD `media_type` varchar(20) DEFAULT 'image';--> statement-breakpoint
ALTER TABLE `products` ADD `glb_model_ids` json DEFAULT ('[]');