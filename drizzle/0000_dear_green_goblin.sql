CREATE TYPE "public"."account_type" AS ENUM('nrnia', 'nrnoa', 'nrbvn', 'other');--> statement-breakpoint
CREATE TYPE "public"."country_anchor_status" AS ENUM('new', 'reviewing', 'approved', 'declined');--> statement-breakpoint
CREATE TYPE "public"."family_in_nigeria" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."investment_category" AS ENUM('real_estate', 'energy', 'financial_instrument', 'infrastructure', 'agriculture');--> statement-breakpoint
CREATE TYPE "public"."investment_flow_status" AS ENUM('initiated', 'pending_verification', 'verified', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."investment_opportunity_status" AS ENUM('open', 'closing_soon', 'closed', 'draft');--> statement-breakpoint
CREATE TYPE "public"."investment_type" AS ENUM('diaspora_bond', 'real_estate', 'energy', 'stocks', 'other');--> statement-breakpoint
CREATE TYPE "public"."mentorship_role" AS ENUM('mentor', 'mentee');--> statement-breakpoint
CREATE TYPE "public"."mentorship_status" AS ENUM('new', 'matched', 'closed');--> statement-breakpoint
CREATE TYPE "public"."referral_target_type" AS ENUM('nrbvn', 'nrnia', 'bank_account', 'diaspora_bond', 'other');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('new', 'contacted', 'qualified', 'converted');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "account_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"account_type" "account_type" NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"bank_name" varchar(255),
	"verified" integer DEFAULT 0 NOT NULL,
	"verification_proof" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "country_anchor_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"country_of_residence" varchar(100) NOT NULL,
	"years_in_diaspora" varchar(50) NOT NULL,
	"professional_background" text NOT NULL,
	"community_involvement" text,
	"why_ndig" text NOT NULL,
	"status" "country_anchor_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demo_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"entered_at" timestamp DEFAULT now() NOT NULL,
	"exited_at" timestamp,
	"duration_seconds" integer,
	"pages_viewed" integer DEFAULT 0 NOT NULL,
	"converted_to_registration" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interest_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"location" varchar(255) NOT NULL,
	"investment_capacity" varchar(100) NOT NULL,
	"message" text,
	"phone" varchar(50),
	"country" varchar(100),
	"sector_interest" varchar(100),
	"risk_appetite" varchar(50),
	"family_in_nigeria" "family_in_nigeria",
	"referral_code" varchar(50),
	"status" "registration_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interest_registrations_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "investment_flows" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"referral_code" varchar(50),
	"investment_type" "investment_type" NOT NULL,
	"amount_usd" integer NOT NULL,
	"amount_ngn" integer,
	"fee_usd" integer NOT NULL,
	"fee_percentage" varchar(10) NOT NULL,
	"status" "investment_flow_status" DEFAULT 'initiated' NOT NULL,
	"nrnia_account_number" varchar(50),
	"bank_name" varchar(255),
	"transaction_reference" varchar(255),
	"verification_proof" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "investment_opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" "investment_category" NOT NULL,
	"target_yield" varchar(50) NOT NULL,
	"min_entry" integer NOT NULL,
	"term" varchar(50) NOT NULL,
	"status" "investment_opportunity_status" DEFAULT 'draft' NOT NULL,
	"image_url" text,
	"featured" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentorship_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" "mentorship_role" NOT NULL,
	"area_of_expertise" varchar(255) NOT NULL,
	"message" text,
	"status" "mentorship_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "referral_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"referral_code" varchar(50) NOT NULL,
	"target_type" "referral_target_type" NOT NULL,
	"target_url" text NOT NULL,
	"clicked_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"verified" integer DEFAULT 0 NOT NULL,
	"verified_at" timestamp,
	CONSTRAINT "referral_tracking_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
