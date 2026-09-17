CREATE TABLE `country_anchor_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`country_of_residence` varchar(100) NOT NULL,
	`years_in_diaspora` varchar(50) NOT NULL,
	`professional_background` text NOT NULL,
	`community_involvement` text,
	`why_ndig` text NOT NULL,
	`status` enum('new','reviewing','approved','declined') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `country_anchor_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mentorship_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('mentor','mentee') NOT NULL,
	`area_of_expertise` varchar(255) NOT NULL,
	`message` text,
	`status` enum('new','matched','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mentorship_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_signups_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD `sector_interest` varchar(100);--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD `risk_appetite` varchar(50);--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD `family_in_nigeria` enum('yes','no');--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD `referral_code` varchar(50);--> statement-breakpoint
ALTER TABLE `interest_registrations` ADD CONSTRAINT `interest_registrations_referral_code_unique` UNIQUE(`referral_code`);