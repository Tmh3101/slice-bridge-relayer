CREATE TABLE "bridge_db"."bridge_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"direction" varchar(12) NOT NULL,
	"src_chain_id" bigint NOT NULL,
	"dst_chain_id" bigint NOT NULL,
	"token_address" text NOT NULL,
	"from_address" text,
	"to_address" text NOT NULL,
	"amount" numeric(78, 0) NOT NULL,
	"src_tx_hash" text,
	"src_nonce" bigint,
	"dst_tx_hash" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_bridge_jobs_src_chain_id_src_tx_hash" UNIQUE("src_chain_id","src_tx_hash")
);
--> statement-breakpoint
CREATE TABLE "bridge_db"."checkpoints" (
	"key" varchar(64) PRIMARY KEY NOT NULL,
	"last_block" bigint NOT NULL
);
--> statement-breakpoint
DROP TABLE "bridge_db_dev"."bridge_jobs" CASCADE;--> statement-breakpoint
DROP TABLE "bridge_db_dev"."checkpoints" CASCADE;