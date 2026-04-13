CREATE TABLE "slot_reservations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"service_type" varchar(50) DEFAULT 'eicr',
	"booking_date" date NOT NULL,
	"session_token" varchar(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "slot_reservations_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "service_type" varchar(50) DEFAULT 'eicr';--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "fuel_type" varchar(50);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "boiler_works" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "submission_type" varchar(20) DEFAULT 'full';--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "partial_submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "service_type" varchar(50) DEFAULT 'eicr';