CREATE TABLE `demo_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(255) NOT NULL,
	`entered_at` timestamp NOT NULL DEFAULT (now()),
	`exited_at` timestamp,
	`duration_seconds` int,
	`pages_viewed` int NOT NULL DEFAULT 0,
	`converted_to_registration` int NOT NULL DEFAULT 0,
	CONSTRAINT `demo_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interest_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`location` varchar(255) NOT NULL,
	`investment_capacity` varchar(100) NOT NULL,
	`message` text,
	`status` enum('new','contacted','qualified','converted') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interest_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('real_estate','energy','financial_instrument','infrastructure','agriculture') NOT NULL,
	`target_yield` varchar(50) NOT NULL,
	`min_entry` int NOT NULL,
	`term` varchar(50) NOT NULL,
	`status` enum('open','closing_soon','closed','draft') NOT NULL DEFAULT 'draft',
	`image_url` text,
	`featured` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investment_opportunities_id` PRIMARY KEY(`id`)
);
