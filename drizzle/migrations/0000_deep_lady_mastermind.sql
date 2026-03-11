CREATE TABLE "bookings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"booking_reference" varchar(20) NOT NULL,
	"property_type" varchar(50) DEFAULT 'residential' NOT NULL,
	"property_subtype" varchar(100),
	"full_name" varchar(255) NOT NULL,
	"company_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"postcode" varchar(20) NOT NULL,
	"address_line_1" varchar(255),
	"address_line_2" varchar(255),
	"city" varchar(255),
	"county" varchar(255),
	"bedrooms" integer,
	"booking_date" date,
	"deposit_paid" boolean DEFAULT false,
	"deposit_amount" numeric(8, 2) DEFAULT '60.00',
	"stripe_payment_intent_id" varchar(255),
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookings_booking_reference_unique" UNIQUE("booking_reference")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"enquiry_type" varchar(50) DEFAULT 'commercial' NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"company_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"postcode" varchar(20),
	"address" text,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
