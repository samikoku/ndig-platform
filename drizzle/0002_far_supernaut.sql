CREATE TABLE `account_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`account_type` enum('nrnia','nrnoa','nrbvn','other') NOT NULL,
	`account_number` varchar(50) NOT NULL,
	`bank_name` varchar(255),
	`verified` int NOT NULL DEFAULT 0,
	`verification_proof` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`verified_at` timestamp,
	CONSTRAINT `account_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_flows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`referral_code` varchar(50),
	`investment_type` enum('diaspora_bond','real_estate','energy','stocks','other') NOT NULL,
	`amount_usd` int NOT NULL,
	`amount_ngn` int,
	`fee_usd` int NOT NULL,
	`fee_percentage` varchar(10) NOT NULL,
	`status` enum('initiated','pending_verification','verified','completed','failed') NOT NULL DEFAULT 'initiated',
	`nrnia_account_number` varchar(50),
	`bank_name` varchar(255),
	`transaction_reference` varchar(255),
	`verification_proof` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `investment_flows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`referral_code` varchar(50) NOT NULL,
	`target_type` enum('nrbvn','nrnia','bank_account','diaspora_bond','other') NOT NULL,
	`target_url` text NOT NULL,
	`clicked_at` timestamp NOT NULL DEFAULT (now()),
	`ip_address` varchar(45),
	`user_agent` text,
	`verified` int NOT NULL DEFAULT 0,
	`verified_at` timestamp,
	CONSTRAINT `referral_tracking_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_tracking_referral_code_unique` UNIQUE(`referral_code`)
);
