-- Add backgroundColor field to fashion_posts table
ALTER TABLE `fashion_posts` ADD COLUMN `background_color` varchar(10) DEFAULT 'light';
