ALTER TABLE `products` ADD `color_images` json DEFAULT ('{}');

ALTER TABLE `products` ADD `variant_stock` json DEFAULT ('{}');

ALTER TABLE `products` ADD `media_type` varchar(20) DEFAULT 'image';

ALTER TABLE `products` ADD `glb_model_ids` json DEFAULT ('[]');

ALTER TABLE `products` ADD `type` varchar(20) DEFAULT 'single';

CREATE INDEX `products_type_idx` ON `products` (`type`);
