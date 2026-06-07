CREATE TABLE `activityFeed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`actorName` varchar(120),
	`type` enum('xp','sighting','score','order','post','system') NOT NULL DEFAULT 'system',
	`message` varchar(280) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityFeed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`size` varchar(16),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(240) NOT NULL,
	`excerpt` text,
	`body` text,
	`category` enum('declassified','editorial','festival','uap_alert','culture') NOT NULL DEFAULT 'editorial',
	`imageUrl` text,
	`authorName` varchar(120),
	`published` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`items` json,
	`subtotalMxn` decimal(10,2) NOT NULL,
	`discountMxn` decimal(10,2) NOT NULL DEFAULT '0',
	`totalMxn` decimal(10,2) NOT NULL,
	`paymentMethod` enum('card','crypto') NOT NULL DEFAULT 'card',
	`status` enum('pending','paid','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
	`shippingName` varchar(160),
	`shippingAddress` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` enum('apparel','accessories','cosmic_gear','cbd','paraphernalia') NOT NULL,
	`description` text,
	`priceMxn` decimal(10,2) NOT NULL,
	`imageUrl` text,
	`badge` varchar(60),
	`inStock` boolean NOT NULL DEFAULT true,
	`sizes` json,
	`amazonAsin` varchar(32),
	`mercadolibreId` varchar(48),
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`game` varchar(48) NOT NULL DEFAULT 'crypto_crash',
	`score` int NOT NULL,
	`multiplier` decimal(8,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sightingVotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sightingId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sightingVotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sightings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`title` varchar(200) NOT NULL,
	`description` text,
	`lat` decimal(10,6) NOT NULL,
	`lng` decimal(10,6) NOT NULL,
	`locationName` varchar(160),
	`level` int NOT NULL DEFAULT 1,
	`votes` int NOT NULL DEFAULT 0,
	`status` enum('pending','verified','debunked') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sightings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `membershipTier` enum('initiate','abductee','contactee') DEFAULT 'initiate' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `xp` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `tokenBalance` decimal(18,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `walletAddress` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;